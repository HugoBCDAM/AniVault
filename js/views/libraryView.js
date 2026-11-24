/**
 * AniVault - Library View
 * Catálogo principal, buscador en tiempo real, filtros de estado y tarjetas interactivas.
 */
import { store } from '../store.js';
import { supabaseService } from '../supabase.js';

export const libraryView = {
  currentFilter: 'all',
  currentSearch: '',
  currentSort: 'rating',

  render(container) {
    const animes = store.getAnimes({
      filter: this.currentFilter,
      search: this.currentSearch,
      sort: this.currentSort
    });

    const isCloudConnected = supabaseService.isConfigured();
    const lastSyncTime = supabaseService.getLastSync() || store.getUser().lastSync;
    const formattedSync = lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'reciente';

    // Contadores para las píldoras
    const allCount = store.animes.length;
    const airingCount = store.animes.filter(a => a.status === 'airing').length;
    const completedCount = store.animes.filter(a => a.status === 'completed').length;
    const planningCount = store.animes.filter(a => a.status === 'planning').length;

    container.innerHTML = `
      <div class="flex flex-col w-full gap-4 pb-12">
        
        <!-- Cloud / Supabase Status Banner -->
        <div class="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-white/5 shadow-sm">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.8)]' : 'bg-secondary shadow-[0_0_8px_rgba(76,215,246,0.8)]'} animate-pulse shrink-0"></span>
            <span class="text-xs text-on-surface-variant truncate">
              ${isCloudConnected ? `Sincronizado con Supabase Cloud (${formattedSync})` : `Modo Local Activo · Cambios guardados en navegador`}
            </span>
          </div>
          <button id="btn-force-sync" title="Forzar sincronización ahora" class="flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container-high" type="button">
            <span class="material-symbols-outlined text-[18px]">sync</span>
          </button>
        </div>

        <!-- Search Bar & Filters -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="relative flex-1 flex items-center">
              <span class="material-symbols-outlined absolute left-3 text-[20px] text-on-surface-variant pointer-events-none">search</span>
              <input id="search-input" value="${this.currentSearch}" class="w-full bg-surface-container pl-10 pr-10 py-2.5 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-high transition-all border border-white/5 shadow-inner" placeholder="Buscar anime por título, estudio o género..." type="text"/>
              ${this.currentSearch ? `
                <button id="btn-clear-search" class="absolute right-3 text-outline hover:text-on-surface" type="button">
                  <span class="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              ` : ''}
            </div>

            <!-- Sort Dropdown Trigger -->
            <div class="relative">
              <button id="btn-toggle-sort" title="Ordenar catálogo" class="flex items-center justify-center w-11 h-11 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary rounded-xl transition-all border border-white/5 shrink-0 shadow-sm" type="button">
                <span class="material-symbols-outlined text-[20px]">swap_vert</span>
              </button>
              <div id="sort-menu" class="hidden absolute right-0 mt-2 w-44 bg-surface-container-highest rounded-xl shadow-2xl p-1 z-30 border border-white/10 flex-col gap-1">
                <button data-sort="rating" class="sort-opt flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg text-left ${this.currentSort === 'rating' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface hover:bg-surface-bright'}">
                  <span>Por Puntuación</span>
                  <span class="material-symbols-outlined text-[14px]">star</span>
                </button>
                <button data-sort="title" class="sort-opt flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg text-left ${this.currentSort === 'title' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface hover:bg-surface-bright'}">
                  <span>Alfabético (A-Z)</span>
                  <span class="material-symbols-outlined text-[14px]">sort_by_alpha</span>
                </button>
                <button data-sort="updated" class="sort-opt flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg text-left ${this.currentSort === 'updated' ? 'bg-primary/20 text-primary font-bold' : 'text-on-surface hover:bg-surface-bright'}">
                  <span>Última Actualización</span>
                  <span class="material-symbols-outlined text-[14px]">history</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Status Quick Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button data-filter="all" class="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${this.currentFilter === 'all' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
              <span>Todos</span>
              <span class="px-1.5 py-0.2 rounded-full font-mono text-[10px] ${this.currentFilter === 'all' ? 'bg-on-primary/20 text-on-primary' : 'bg-white/10 text-outline'}">${allCount}</span>
            </button>
            <button data-filter="airing" class="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${this.currentFilter === 'airing' ? 'bg-secondary text-on-secondary shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
              <span>En emisión</span>
              <span class="px-1.5 py-0.2 rounded-full font-mono text-[10px] ${this.currentFilter === 'airing' ? 'bg-on-secondary/20 text-on-secondary' : 'bg-secondary-container/20 text-secondary'}">${airingCount}</span>
            </button>
            <button data-filter="completed" class="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${this.currentFilter === 'completed' ? 'bg-tertiary text-on-tertiary shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
              <span>Finalizadas</span>
              <span class="px-1.5 py-0.2 rounded-full font-mono text-[10px] ${this.currentFilter === 'completed' ? 'bg-on-tertiary/20 text-on-tertiary' : 'bg-tertiary-container/30 text-tertiary'}">${completedCount}</span>
            </button>
            <button data-filter="planning" class="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${this.currentFilter === 'planning' ? 'bg-primary-fixed-dim text-on-primary-fixed shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}">
              <span>Pendientes</span>
              <span class="px-1.5 py-0.2 rounded-full font-mono text-[10px] ${this.currentFilter === 'planning' ? 'bg-on-primary-fixed/20 text-on-primary-fixed' : 'bg-surface-container-highest text-outline'}">${planningCount}</span>
            </button>
          </div>
        </div>

        <!-- Anime Catalog Cards Stack -->
        <div class="flex flex-col gap-3 mt-1">
          ${animes.length === 0 ? `
            <div class="flex flex-col items-center justify-center p-12 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/40 mt-4">
              <span class="material-symbols-outlined text-4xl text-outline mb-2">sentiment_dissatisfied</span>
              <h3 class="font-display font-semibold text-lg text-on-surface">No se encontraron animes</h3>
              <p class="text-xs text-on-surface-variant max-w-xs mt-1">No hay entradas que coincidan con los filtros actuales o la búsqueda.</p>
              <button onclick="window.location.hash='#/anadir'" class="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-md flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">add</span> Añadir nuevo anime
              </button>
            </div>
          ` : animes.map(anime => this.renderAnimeCard(anime)).join('')}
        </div>

        <!-- Floating Action Button (+ Añadir nuevo anime) -->
        <div class="fixed bottom-20 right-4 z-40 md:right-8">
          <button onclick="window.location.hash='#/anadir'" aria-label="Añadir nuevo anime" class="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-4 py-3 rounded-full shadow-[0_8px_24px_rgba(160,120,255,0.45)] hover:shadow-[0_12px_28px_rgba(160,120,255,0.65)] active:scale-95 transition-all group" type="button">
            <span class="material-symbols-outlined text-[22px] group-hover:rotate-90 transition-transform">add</span>
            <span class="text-xs font-bold tracking-wide">Añadir Anime</span>
          </button>
        </div>

      </div>
    `;

    this.bindEvents(container);
  },

  renderAnimeCard(anime) {
    const activeSeason = (anime.seasons && anime.seasons[anime.seasons.length - 1]) || { name: 'T1', currentEp: 1, totalEps: 12 };
    const seasonIndex = anime.seasons ? anime.seasons.length : 1;
    const progressPercent = activeSeason.totalEps > 0 ? Math.min(100, Math.round((activeSeason.currentEp / activeSeason.totalEps) * 100)) : 0;
    
    // Configuración de estado
    const statusBadges = {
      'airing': { label: 'En emisión', bg: 'bg-secondary-container/20', text: 'text-secondary' },
      'completed': { label: 'Finalizada', bg: 'bg-tertiary-container/30', text: 'text-tertiary' },
      'planning': { label: 'Pendiente', bg: 'bg-surface-container-highest', text: 'text-outline' },
      'dropped': { label: 'Dropeada', bg: 'bg-error-container/30', text: 'text-error' }
    };
    const statusMeta = statusBadges[anime.status] || statusBadges.airing;

    return `
      <div class="anime-card relative bg-surface-container-low hover:bg-surface-container rounded-2xl p-3 border border-white/5 shadow-md hover:border-primary/20 transition-all group cursor-pointer overflow-hidden" data-id="${anime.id}">
        <div class="flex gap-3">
          
          <!-- Thumbnail Cover -->
          <div class="relative w-24 h-36 rounded-xl overflow-hidden shrink-0 shadow-md bg-surface-container-highest">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="${anime.coverUrl}" alt="${anime.title}" onerror="this.src='https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80'"/>
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent"></div>
            <div class="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono text-amber-300 flex items-center gap-0.5">
              <span>${anime.rating || '8.0'}</span>
              <span class="material-symbols-outlined text-[10px]">star</span>
            </div>
          </div>

          <!-- Content & Metadata -->
          <div class="flex flex-col flex-1 min-w-0 justify-between py-0.5">
            <div>
              <!-- Title & Favorite Button -->
              <div class="flex items-start justify-between gap-1">
                <h3 class="font-display font-bold text-base text-on-surface truncate leading-tight group-hover:text-primary transition-colors">${anime.title}</h3>
                <button class="btn-fav p-1 text-on-surface-variant hover:text-amber-400 active:scale-125 transition-transform shrink-0" data-id="${anime.id}" type="button" title="Marcar como favorito">
                  <span class="material-symbols-outlined text-[20px] ${anime.favorite ? 'text-amber-400' : 'text-outline'}" style="font-variation-settings: 'FILL' ${anime.favorite ? 1 : 0};">star</span>
                </button>
              </div>
              <p class="text-xs text-on-surface-variant truncate">${anime.altTitle || anime.studio || 'Anime'}</p>

              <!-- Specs Badges -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span class="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-mono">${anime.seasons ? anime.seasons.length : 1} Temp.</span>
                <span class="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-mono">${anime.movies ? anime.movies.length : 0} Pelis</span>
                <span class="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded text-[10px] font-mono">${anime.ovasCount || 0} OVAs</span>
              </div>
            </div>

            <!-- Bottom: Progress & Status -->
            <div class="mt-2.5">
              <div class="flex items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-[14px] text-primary">play_circle</span>
                  <span class="font-mono text-xs text-on-surface font-semibold truncate">T${seasonIndex}: Cap. ${activeSeason.currentEp} / ${activeSeason.totalEps || '?'}</span>
                </div>
                <span class="${statusMeta.bg} ${statusMeta.text} px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">${statusMeta.label}</span>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-300 ${anime.status === 'completed' ? 'bg-tertiary' : 'bg-primary'}" style="width: ${progressPercent}%"></div>
              </div>
            </div>

          </div>

          <!-- Arrow navigation icon -->
          <div class="flex items-center justify-center pl-1 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </div>

        </div>
      </div>
    `;
  },

  bindEvents(container) {
    // 1. Clic en tarjeta -> Ir al detalle
    container.querySelectorAll('.anime-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Si se pulsó la estrella de favoritos, no navegar
        if (e.target.closest('.btn-fav')) return;
        const id = card.getAttribute('data-id');
        window.location.hash = `#/detalle?id=${id}`;
      });
    });

    // 2. Clic en botón de favorito
    container.querySelectorAll('.btn-fav').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const isFav = await store.toggleFavorite(id);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (isFav) {
          icon.style.fontVariationSettings = "'FILL' 1";
          icon.className = 'material-symbols-outlined text-[20px] text-amber-400';
          window.showToast?.('Añadido a favoritos ⭐');
        } else {
          icon.style.fontVariationSettings = "'FILL' 0";
          icon.className = 'material-symbols-outlined text-[20px] text-outline';
          window.showToast?.('Retirado de favoritos');
        }
      });
    });

    // 3. Píldoras de filtro
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.currentFilter = pill.getAttribute('data-filter');
        this.render(container);
      });
    });

    // 4. Búsqueda en vivo
    const searchInput = container.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value;
        const animes = store.getAnimes({ filter: this.currentFilter, search: this.currentSearch, sort: this.currentSort });
        const stack = container.querySelector('.anime-card')?.parentElement;
        if (stack) {
          stack.innerHTML = animes.length === 0 ? `
            <div class="p-8 text-center text-outline text-xs">Sin coincidencias para "${this.currentSearch}"</div>
          ` : animes.map(a => this.renderAnimeCard(a)).join('');
          this.bindEvents(container);
        }
      });
    }

    // 5. Botón limpiar búsqueda
    const clearBtn = container.querySelector('#btn-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.currentSearch = '';
        this.render(container);
      });
    }

    // 6. Menú de ordenación
    const toggleSortBtn = container.querySelector('#btn-toggle-sort');
    const sortMenu = container.querySelector('#sort-menu');
    if (toggleSortBtn && sortMenu) {
      toggleSortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('hidden');
        sortMenu.classList.toggle('flex');
      });

      container.querySelectorAll('.sort-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          this.currentSort = opt.getAttribute('data-sort');
          sortMenu.classList.add('hidden');
          this.render(container);
        });
      });
    }

    // 7. Forzar sincronización
    const forceSyncBtn = container.querySelector('#btn-force-sync');
    if (forceSyncBtn) {
      forceSyncBtn.addEventListener('click', async () => {
        const icon = forceSyncBtn.querySelector('.material-symbols-outlined');
        icon.classList.add('animate-spin');
        const res = await store.triggerSync();
        icon.classList.remove('animate-spin');
        if (res.success) {
          window.showToast?.(res.simulated ? 'Sincronización local actualizada' : 'Sincronizado con Supabase Cloud');
          this.render(container);
        } else {
          window.showToast?.('Error al sincronizar: ' + res.message);
        }
      });
    }
  }
};
