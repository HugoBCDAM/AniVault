/**
 * AniVault - Unified Reactive Store
 * Combines LocalStorage persistence with Supabase Cloud Sync and Event Bus.
 */
import { SEED_ANIMES, DEFAULT_USER } from './seedData.js';
import { supabaseService } from './supabase.js';

const STORAGE_KEY_ANIMES = 'anivault_library_data_v2';
const STORAGE_KEY_USER = 'anivault_user_data_v2';

class Store {
  constructor() {
    this.animes = [];
    this.user = DEFAULT_USER;
    this.listeners = new Set();
    this.init();
  }

  init() {
    // 1. Cargar animes locales
    const localAnimes = localStorage.getItem(STORAGE_KEY_ANIMES);
    if (localAnimes) {
      try {
        this.animes = JSON.parse(localAnimes);
      } catch (e) {
        this.animes = [...SEED_ANIMES];
      }
    } else {
      this.animes = [...SEED_ANIMES];
      this.saveLocal();
    }

    // 2. Cargar usuario local
    const localUser = localStorage.getItem(STORAGE_KEY_USER);
    if (localUser) {
      try {
        this.user = { ...DEFAULT_USER, ...JSON.parse(localUser) };
      } catch (e) {
        this.user = { ...DEFAULT_USER };
      }
    }

    // 3. Si Supabase está disponible, sincronizar en segundo plano
    if (supabaseService.isConfigured()) {
      this.syncWithSupabaseBackground();
    }
  }

  saveLocal() {
    localStorage.setItem(STORAGE_KEY_ANIMES, JSON.stringify(this.animes));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
    this.notify();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  async syncWithSupabaseBackground() {
    try {
      const cloudAnimes = await supabaseService.fetchAllAnimes();
      if (cloudAnimes && cloudAnimes.length > 0) {
        // Combinar datos en base a updatedAt
        const map = new Map();
        this.animes.forEach(a => map.set(a.id, a));
        cloudAnimes.forEach(ca => map.set(ca.id, ca));
        this.animes = Array.from(map.values());
        this.saveLocal();
      } else if (this.animes.length > 0) {
        // Si la nube está vacía, subir el catálogo local a Supabase
        await supabaseService.syncAll(this.animes);
      }
    } catch (err) {
      console.warn('Sync background falló:', err);
    }
  }

  // --- CRUD ANIMES ---

  getAnimes({ filter = 'all', search = '', sort = 'rating' } = {}) {
    let result = [...this.animes];

    // 1. Filtro de estado
    if (filter === 'airing') {
      result = result.filter(a => a.status === 'airing');
    } else if (filter === 'completed') {
      result = result.filter(a => a.status === 'completed');
    } else if (filter === 'planning') {
      result = result.filter(a => a.status === 'planning');
    } else if (filter === 'favorites') {
      result = result.filter(a => Boolean(a.favorite));
    }

    // 2. Buscador
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.altTitle && a.altTitle.toLowerCase().includes(q)) ||
        (a.studio && a.studio.toLowerCase().includes(q)) ||
        (a.genres && a.genres.toLowerCase().includes(q))
      );
    }

    // 3. Ordenación
    if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'updated') {
      result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    }

    return result;
  }

  getAnimeById(id) {
    return this.animes.find(a => a.id === id);
  }

  async addAnime(animeData) {
    const id = animeData.id || animeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `anime-${Date.now()}`;
    const newAnime = {
      id,
      title: animeData.title,
      altTitle: animeData.altTitle || '',
      studio: animeData.studio || '',
      genres: animeData.genres || '',
      status: animeData.status || 'airing',
      coverUrl: animeData.coverUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80',
      bannerUrl: animeData.bannerUrl || animeData.coverUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80',
      rating: Number(animeData.rating) || 8.0,
      favorite: Boolean(animeData.favorite),
      notes: animeData.notes || '',
      seasons: animeData.seasons && animeData.seasons.length > 0 ? animeData.seasons : [
        { name: 'Temporada 1', currentEp: 1, totalEps: Number(animeData.totalEps) || 12, status: animeData.status || 'airing' }
      ],
      movies: animeData.movies || [],
      ovasCount: Number(animeData.ovasCount) || 0,
      updatedAt: new Date().toISOString()
    };

    this.animes.unshift(newAnime);
    this.saveLocal();

    // Sync cloud
    if (supabaseService.isConfigured()) {
      supabaseService.upsertAnime(newAnime);
    }

    return newAnime;
  }

  async updateAnime(id, patch) {
    const index = this.animes.findIndex(a => a.id === id);
    if (index === -1) return null;

    this.animes[index] = {
      ...this.animes[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    const updated = this.animes[index];
    this.saveLocal();

    if (supabaseService.isConfigured()) {
      supabaseService.upsertAnime(updated);
    }

    return updated;
  }

  async deleteAnime(id) {
    this.animes = this.animes.filter(a => a.id !== id);
    this.saveLocal();

    if (supabaseService.isConfigured()) {
      supabaseService.deleteAnime(id);
    }
  }

  async toggleFavorite(id) {
    const anime = this.getAnimeById(id);
    if (!anime) return false;
    const newStatus = !anime.favorite;
    await this.updateAnime(id, { favorite: newStatus });
    return newStatus;
  }

  async updateEpisode(id, seasonIndex = 0, delta = 1) {
    const anime = this.getAnimeById(id);
    if (!anime || !anime.seasons || !anime.seasons[seasonIndex]) return null;

    const seasons = JSON.parse(JSON.stringify(anime.seasons));
    const targetSeason = seasons[seasonIndex];
    let nextEp = (targetSeason.currentEp || 0) + delta;

    if (nextEp < 0) nextEp = 0;
    if (targetSeason.totalEps && nextEp > targetSeason.totalEps) {
      nextEp = targetSeason.totalEps;
    }

    targetSeason.currentEp = nextEp;
    if (targetSeason.totalEps && nextEp >= targetSeason.totalEps) {
      targetSeason.status = 'completed';
    }

    return await this.updateAnime(id, { seasons });
  }

  async setEpisode(id, seasonIndex = 0, epNumber) {
    const anime = this.getAnimeById(id);
    if (!anime || !anime.seasons || !anime.seasons[seasonIndex]) return null;

    const seasons = JSON.parse(JSON.stringify(anime.seasons));
    const targetSeason = seasons[seasonIndex];
    targetSeason.currentEp = Math.max(0, Number(epNumber));
    if (targetSeason.totalEps && targetSeason.currentEp >= targetSeason.totalEps) {
      targetSeason.status = 'completed';
    }

    return await this.updateAnime(id, { seasons });
  }

  async toggleMovieStatus(id, movieIndex = 0) {
    const anime = this.getAnimeById(id);
    if (!anime || !anime.movies || !anime.movies[movieIndex]) return null;

    const movies = JSON.parse(JSON.stringify(anime.movies));
    movies[movieIndex].completed = !movies[movieIndex].completed;
    return await this.updateAnime(id, { movies });
  }

  // --- METRICS BENTO ---

  getMetrics() {
    let totalWatchedMinutes = 0;
    let totalEpisodesWatched = 0;
    let ratingsSum = 0;
    let ratedCount = 0;

    this.animes.forEach(a => {
      // Temporadas
      if (Array.isArray(a.seasons)) {
        a.seasons.forEach(s => {
          const ep = Number(s.currentEp) || 0;
          totalEpisodesWatched += ep;
          totalWatchedMinutes += ep * 24; // 24 min por cap estándar
        });
      }
      // Películas completadas
      if (Array.isArray(a.movies)) {
        a.movies.forEach(m => {
          if (m.completed) totalWatchedMinutes += 105; // 1h 45m promedio
        });
      }
      // Puntuación
      if (a.rating && a.rating > 0) {
        ratingsSum += Number(a.rating);
        ratedCount++;
      }
    });

    const totalHours = Math.round(totalWatchedMinutes / 60);
    const avgRating = ratedCount > 0 ? (ratingsSum / ratedCount).toFixed(1) : '0.0';

    return {
      totalHours,
      totalEpisodesWatched,
      avgRating,
      totalAnimes: this.animes.length,
      favoritesCount: this.animes.filter(a => a.favorite).length
    };
  }

  // --- USER PROFILE ---

  getUser() {
    return this.user;
  }

  updateUser(patch) {
    this.user = { ...this.user, ...patch };
    this.saveLocal();
    return this.user;
  }

  // --- BACKUP & RESTORE ---

  exportBackup() {
    const backupData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      user: this.user,
      animes: this.animes
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anivault_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.animes)) {
        this.animes = data.animes;
        if (data.user) {
          this.user = { ...DEFAULT_USER, ...data.user };
        }
        this.saveLocal();
        if (supabaseService.isConfigured()) {
          supabaseService.syncAll(this.animes);
        }
        return { success: true, count: this.animes.length };
      }
      return { success: false, message: 'El archivo JSON no tiene un formato válido de AniVault.' };
    } catch (err) {
      return { success: false, message: `Error al leer el archivo: ${err.message}` };
    }
  }

  resetSeedData() {
    this.animes = JSON.parse(JSON.stringify(SEED_ANIMES));
    this.user = { ...DEFAULT_USER };
    this.saveLocal();
    if (supabaseService.isConfigured()) {
      supabaseService.syncAll(this.animes);
    }
  }

  async triggerSync() {
    if (supabaseService.isConfigured()) {
      const res = await supabaseService.syncAll(this.animes);
      this.notify();
      return res;
    } else {
      // Simulación visual si no hay Supabase aún configurado
      await new Promise(r => setTimeout(r, 800));
      this.user.lastSync = new Date().toISOString();
      this.saveLocal();
      return { success: true, simulated: true, timestamp: this.user.lastSync };
    }
  }
}

export const store = new Store();
