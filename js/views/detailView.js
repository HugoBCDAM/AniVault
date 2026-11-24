/**
 * AniVault - Detail & Customization View
 * Ficha cinematográfica completa con Hero banner, Stepper interactivo de capítulos,
 * selector de temporadas, películas vinculadas, notas personales y editor de puntuación.
 */
import { store } from '../store.js';

export const detailView = {
  currentAnime: null,
  activeSeasonIndex: 0,

  render(container, params) {
    const id = params.get('id');
    const anime = store.getAnimeById(id);

    if (!anime) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">error</span>
          <h2 class="text-xl font-bold font-display">Anime no encontrado</h2>
          <p class="text-xs text-on-surface-variant mt-1">El anime solicitado no existe en tu bóveda.</p>
          <a href="#/biblioteca" class="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold">Volver a la biblioteca</a>
        </div>
      `;
      return;
    }

    this.currentAnime = anime;
    this.activeSeasonIndex = Math.max(0, anime.seasons ? anime.seasons.length - 1 : 0);

    const activeSeason = (anime.seasons && anime.seasons[this.activeSeasonIndex]) || { name: 'Temporada 1', currentEp: 1, totalEps: 12 };
    const progressPercent = activeSeason.totalEps > 0 ? Math.min(100, Math.round((activeSeason.currentEp / activeSeason.totalEps) * 100)) : 0;

    container.innerHTML = `
      <div class="flex flex-col w-full pb-16">
        
        <!-- Hero Banner with atmospheric depth & scrim overlay -->
        <div class="relative w-full -mx-4 md:mx-0 md:rounded-3xl overflow-hidden shadow-2xl">
          <div class="w-full h-72 md:h-96 bg-cover bg-center transition-transform duration-700 ease-out scale-105" style="background-image: url('${anime.bannerUrl || anime.coverUrl}');"></div>
          
          <!-- Scrim Gradients -->
          <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 via-transparent to-surface-container-lowest/40"></div>

          <!-- Top Action Bar -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <button onclick="window.history.back()" title="Volver" class="w-10 h-10 rounded-full bg-surface-container-lowest/70 hover:bg-surface-container backdrop-blur-md flex items-center justify-center text-on-surface shadow-lg transition-all active:scale-90 border border-white/10">
              <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            <div class="flex items-center gap-2">
              <button id="detail-btn-fav" title="Favorito" class="w-10 h-10 rounded-full bg-surface-container-lowest/70 hover:bg-surface-container backdrop-blur-md flex items-center justify-center shadow-lg transition-all active:scale-90 border border-white/10">
                <span class="material-symbols-outlined text-[20px] ${anime.favorite ? 'text-amber-400' : 'text-outline'}" style="font-variation-settings: 'FILL' ${anime.favorite ? 1 : 0};">star</span>
              </button>
              <button id="detail-btn-share" title="Compartir ficha" class="w-10 h-10 rounded-full bg-surface-container-lowest/70 hover:bg-surface-container backdrop-blur-md flex items-center justify-center text-on-surface shadow-lg transition-all active:scale-90 border border-white/10">
                <span class="material-symbols-outlined text-[20px]">share</span>
              </button>
              <button id="detail-btn-delete" title="Eliminar anime" class="w-10 h-10 rounded-full bg-surface-container-lowest/70 hover:bg-red-500/20 backdrop-blur-md flex items-center justify-center text-error shadow-lg transition-all active:scale-90 border border-white/10">
                <span class="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>

          <!-- Hero Content Overlay Box -->
          <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-semibold text-secondary bg-surface-container-high/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">${anime.studio || 'Estudio Oficial'}</span>
              <span class="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                <span class="material-symbols-outlined text-[14px] text-tertiary">verified</span> Canon Oficial
              </span>
            </div>
            
            <h1 class="font-display font-extrabold text-2xl md:text-4xl text-on-surface drop-shadow-md tracking-tight leading-tight">${anime.title}</h1>
            <p class="text-xs md:text-sm text-on-surface-variant flex items-center gap-2">
              <span class="text-primary font-medium">${anime.altTitle || ''}</span>
              ${anime.genres ? `<span class="text-outline-variant">•</span><span class="truncate">${anime.genres}</span>` : ''}
            </p>

            <!-- Rating & Status Strip -->
            <div class="flex items-center justify-between mt-3 bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-lg">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
                  <span class="material-symbols-outlined text-[20px]">hotel_class</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[10px] text-on-surface-variant font-medium">Mi Puntuación</span>
                  <div class="flex items-center gap-1">
                    <span class="font-display font-bold text-lg text-on-surface leading-none" id="score-display">${anime.rating || '8.0'}</span>
                    <span class="text-xs text-outline">/10</span>
                    <button id="btn-edit-score" class="ml-1 text-primary hover:text-primary-fixed p-0.5">
                      <span class="material-symbols-outlined text-[15px]">edit</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="h-8 w-[1px] bg-white/10"></div>

              <!-- Status Selector Dropdown -->
              <div class="relative">
                <button id="btn-status-dropdown" class="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1.5 rounded-xl text-on-surface shadow-inner active:scale-95 transition-all border border-white/5 text-xs font-bold">
                  <span class="w-2 h-2 rounded-full ${anime.status === 'completed' ? 'bg-tertiary' : anime.status === 'planning' ? 'bg-amber-400' : 'bg-secondary'}"></span>
                  <span id="status-label-text">${anime.status === 'completed' ? 'Finalizada' : anime.status === 'planning' ? 'Pendiente' : 'En Emisión'}</span>
                  <span class="material-symbols-outlined text-[16px] text-outline">expand_more</span>
                </button>
                <div id="status-menu" class="hidden absolute right-0 mt-2 w-36 bg-surface-container-highest rounded-xl shadow-2xl p-1 z-30 border border-white/10 flex-col gap-1">
                  <button data-status="airing" class="status-option flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-bright text-secondary font-medium">
                    <span class="w-2 h-2 rounded-full bg-secondary"></span> En Emisión
                  </button>
                  <button data-status="completed" class="status-option flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-bright text-tertiary font-medium">
                    <span class="w-2 h-2 rounded-full bg-tertiary"></span> Finalizada
                  </button>
                  <button data-status="planning" class="status-option flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-bright text-amber-400 font-medium">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span> Pendiente
                  </button>
                  <button data-status="dropped" class="status-option flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-surface-bright text-error font-medium">
                    <span class="w-2 h-2 rounded-full bg-error"></span> Dropeada
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Seasons Tabs & Episode Tracker Section -->
        <div class="flex flex-col gap-3 mt-4">
          <!-- Season Navigation Tabs -->
          <div class="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            ${(anime.seasons || [{ name: 'Temporada 1', currentEp: 1, totalEps: 12 }]).map((s, idx) => `
              <button data-season-idx="${idx}" class="season-tab flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shrink-0 ${idx === this.activeSeasonIndex ? 'bg-surface-container-high text-on-surface shadow-md' : 'text-on-surface-variant hover:text-on-surface'}">
                <span class="w-1.5 h-1.5 rounded-full ${s.status === 'completed' ? 'bg-tertiary' : 'bg-secondary'}"></span>
                <span>${s.name}</span>
                <span class="text-[10px] text-outline font-normal">(${s.currentEp}/${s.totalEps || '?'})</span>
              </button>
            `).join('')}
            <button id="btn-add-season" title="Añadir nueva temporada" class="p-2 rounded-xl text-primary hover:bg-surface-container-high shrink-0">
              <span class="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>

          <!-- Active Season Card Controller -->
          <div class="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-4">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col">
                <span class="text-[10px] text-primary font-bold uppercase tracking-wider">Temporada en Curso</span>
                <h3 class="font-display font-bold text-base text-on-surface">${activeSeason.name}</h3>
              </div>
              <div class="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-secondary text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-secondary ${activeSeason.status === 'completed' ? '' : 'animate-ping'}"></span>
                <span>${activeSeason.status === 'completed' ? 'Completada' : 'En Curso'}</span>
              </div>
            </div>

            <!-- Stepper Controller: Capítulos Vistos -->
            <div class="bg-surface-container rounded-xl p-3 flex items-center justify-between gap-3 border border-white/5 shadow-inner">
              <div class="flex flex-col pl-2">
                <span class="text-xs text-on-surface-variant">Progreso de visualización</span>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-xs text-outline">Capítulo</span>
                  <span class="font-display font-extrabold text-2xl text-primary" id="stepper-current-ep">${activeSeason.currentEp}</span>
                  <span class="text-xs text-outline">de ${activeSeason.totalEps || '?'}</span>
                </div>
              </div>

              <!-- Large Stepper Buttons -->
              <div class="flex items-center gap-2">
                <button id="btn-step-dec" aria-label="Decrementar episodio" class="w-12 h-12 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-95 transition-all border border-white/5">
                  <span class="material-symbols-outlined text-[24px]">remove</span>
                </button>
                <button id="btn-step-inc" aria-label="Incrementar episodio" class="w-12 h-12 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary-container flex items-center justify-center active:scale-95 transition-all shadow-[0_0_12px_rgba(160,120,255,0.4)]">
                  <span class="material-symbols-outlined text-[24px]">add</span>
                </button>
              </div>
            </div>

            <!-- Progress Meter Bar -->
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-on-surface-variant">Capítulo ${activeSeason.currentEp} de ${activeSeason.totalEps || '?'} emitidos</span>
                <span class="text-secondary font-bold font-mono" id="season-percent-label">${progressPercent}% completado</span>
              </div>
              <div class="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div id="season-progress-bar" class="h-full bg-secondary transition-all duration-300 rounded-full" style="width: ${progressPercent}%"></div>
              </div>
            </div>

            <!-- Episode Quick Matrix Chips -->
            <div class="flex flex-col gap-2 pt-1">
              <div class="flex items-center justify-between">
                <span class="text-xs text-outline uppercase font-bold tracking-wider">Acceso Rápido a Capítulos</span>
                <span class="text-[11px] font-mono text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px]">bolt</span> Autoguardado
                </span>
              </div>
              <div class="grid grid-cols-6 sm:grid-cols-12 gap-1.5" id="episode-chips-container">
                ${this.renderEpisodeChips(activeSeason)}
              </div>
            </div>

          </div>
        </div>

        <!-- Movies & OVAs Linked Section -->
        <div class="flex flex-col gap-3 mt-4">
          <div class="flex items-center justify-between">
            <h2 class="font-display font-bold text-lg text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[22px]">movie</span>
              Películas y Especiales
            </h2>
            <span class="text-xs text-outline font-mono">${(anime.movies || []).length} vinculadas</span>
          </div>

          ${(anime.movies && anime.movies.length > 0) ? anime.movies.map((m, mIdx) => `
            <div class="bg-surface-container-low rounded-2xl p-3 border border-white/5 shadow-md flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-14 rounded-xl bg-surface-container-high flex flex-col items-center justify-center text-secondary shrink-0 border border-white/5">
                  <span class="material-symbols-outlined text-[20px]">theaters</span>
                  <span class="text-[9px] font-bold font-mono uppercase mt-0.5">${m.duration || 'FILM'}</span>
                </div>
                <div class="flex flex-col min-w-0">
                  <h4 class="font-display font-bold text-sm text-on-surface truncate">${m.title}</h4>
                  <p class="text-xs text-on-surface-variant truncate">${m.synopsis || 'Película oficial vinculada'}</p>
                </div>
              </div>
              <button data-movie-idx="${mIdx}" class="btn-toggle-movie px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${m.completed ? 'bg-tertiary-container/30 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}">
                <span class="material-symbols-outlined text-[14px]">${m.completed ? 'check_circle' : 'schedule'}</span>
                <span>${m.completed ? 'Visto' : 'Pendiente'}</span>
              </button>
            </div>
          `).join('') : `
            <div class="p-4 rounded-xl bg-surface-container-low/60 border border-dashed border-white/10 text-center text-xs text-outline">
              No hay películas u OVAs vinculadas a este anime todavía.
            </div>
          `}

          <button id="btn-add-movie-prompt" class="w-full py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/5">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Vincular Película u OVA</span>
          </button>
        </div>

        <!-- Personal Notes Section with Auto-Save -->
        <div class="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-2.5 mt-4">
          <div class="flex items-center justify-between">
            <span class="font-display font-bold text-sm text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[18px]">sticky_note_2</span>
              Notas Personales y Teorías
            </span>
            <span id="notes-status" class="text-[11px] font-mono text-outline">Guardado</span>
          </div>
          <textarea id="notes-textarea" rows="3" class="w-full bg-surface-container rounded-xl p-3 text-xs md:text-sm text-on-surface placeholder:text-outline border border-white/5 focus:outline-none focus:border-primary/40 resize-none transition-all" placeholder="Escribe observaciones, fechas de estreno o enlaces...">${anime.notes || ''}</textarea>
        </div>

      </div>
    `;

    this.bindEvents(container);
  },

  renderEpisodeChips(season) {
    const total = season.totalEps || 12;
    const current = season.currentEp || 1;
    let chips = '';
    for (let i = 1; i <= total; i++) {
      let isDone = i <= current;
      let isCurrent = i === current;
      chips += `
        <button data-ep="${i}" class="chip-ep flex flex-col items-center justify-center py-2 rounded-xl text-xs font-mono font-bold transition-all active:scale-95 border ${
          isCurrent 
            ? 'bg-secondary-container text-on-secondary-container border-secondary/40 shadow-[0_0_10px_rgba(76,215,246,0.3)]' 
            : isDone 
              ? 'bg-tertiary-container/30 text-tertiary border-tertiary/20' 
              : 'bg-surface-container-high text-on-surface-variant/70 border-transparent hover:text-on-surface'
        }">
          <span class="text-[11px]">E${i < 10 ? '0' + i : i}</span>
        </button>
      `;
    }
    return chips;
  },

  bindEvents(container) {
    const anime = this.currentAnime;
    if (!anime) return;

    // 1. Favorito
    const favBtn = container.querySelector('#detail-btn-fav');
    if (favBtn) {
      favBtn.addEventListener('click', async () => {
        const isFav = await store.toggleFavorite(anime.id);
        anime.favorite = isFav;
        const icon = favBtn.querySelector('.material-symbols-outlined');
        icon.style.fontVariationSettings = isFav ? "'FILL' 1" : "'FILL' 0";
        icon.className = `material-symbols-outlined text-[20px] ${isFav ? 'text-amber-400' : 'text-outline'}`;
        window.showToast?.(isFav ? 'Añadido a favoritos ⭐' : 'Retirado de favoritos');
      });
    }

    // 2. Compartir
    const shareBtn = container.querySelector('#detail-btn-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText?.(`${anime.title} - ${anime.altTitle || ''} (Viendo en AniVault)`);
        window.showToast?.('¡Ficha copiada al portapapeles!');
      });
    }

    // 3. Eliminar anime
    const deleteBtn = container.querySelector('#detail-btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        window.showModal?.({
          title: '¿Eliminar de tu Bóveda?',
          message: `¿Estás seguro de que quieres eliminar "${anime.title}"? Esta acción no se puede deshacer.`,
          confirmText: 'Sí, eliminar',
          confirmClass: 'bg-red-500 text-white',
          onConfirm: async () => {
            await store.deleteAnime(anime.id);
            window.showToast?.('Anime eliminado de la biblioteca');
            window.location.hash = '#/biblioteca';
          }
        });
      });
    }

    // 4. Stepper Episodio (+)
    const incBtn = container.querySelector('#btn-step-inc');
    if (incBtn) {
      incBtn.addEventListener('click', async () => {
        await store.updateEpisode(anime.id, this.activeSeasonIndex, 1);
        this.render(container, new URLSearchParams(`id=${anime.id}`));
        window.showToast?.('Capítulo incrementado (+1)');
      });
    }

    // 5. Stepper Episodio (-)
    const decBtn = container.querySelector('#btn-step-dec');
    if (decBtn) {
      decBtn.addEventListener('click', async () => {
        await store.updateEpisode(anime.id, this.activeSeasonIndex, -1);
        this.render(container, new URLSearchParams(`id=${anime.id}`));
      });
    }

    // 6. Clic directo en un chip de capítulo
    container.querySelectorAll('.chip-ep').forEach(chip => {
      chip.addEventListener('click', async () => {
        const ep = Number(chip.getAttribute('data-ep'));
        await store.setEpisode(anime.id, this.activeSeasonIndex, ep);
        this.render(container, new URLSearchParams(`id=${anime.id}`));
        window.showToast?.(`Fijado en capítulo ${ep}`);
      });
    });

    // 7. Pestañas de temporadas
    container.querySelectorAll('.season-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeSeasonIndex = Number(tab.getAttribute('data-season-idx'));
        this.render(container, new URLSearchParams(`id=${anime.id}`));
      });
    });

    // 8. Añadir nueva temporada
    const addSeasonBtn = container.querySelector('#btn-add-season');
    if (addSeasonBtn) {
      addSeasonBtn.addEventListener('click', () => {
        const nextNum = (anime.seasons ? anime.seasons.length : 1) + 1;
        window.showModal?.({
          title: `Añadir Temporada ${nextNum}`,
          inputs: [
            { id: 'new-season-name', label: 'Nombre de la temporada', value: `Temporada ${nextNum}` },
            { id: 'new-season-total', label: 'Número total de capítulos', type: 'number', value: 12 }
          ],
          confirmText: 'Añadir Temporada',
          onConfirm: async (data) => {
            const seasons = [...(anime.seasons || [])];
            seasons.push({
              name: data['new-season-name'] || `Temporada ${nextNum}`,
              currentEp: 0,
              totalEps: Number(data['new-season-total']) || 12,
              status: 'planning'
            });
            await store.updateAnime(anime.id, { seasons });
            this.activeSeasonIndex = seasons.length - 1;
            this.render(container, new URLSearchParams(`id=${anime.id}`));
            window.showToast?.('Nueva temporada añadida');
          }
        });
      });
    }

    // 9. Conmutar estado de película
    container.querySelectorAll('.btn-toggle-movie').forEach(btn => {
      btn.addEventListener('click', async () => {
        const mIdx = Number(btn.getAttribute('data-movie-idx'));
        await store.toggleMovieStatus(anime.id, mIdx);
        this.render(container, new URLSearchParams(`id=${anime.id}`));
      });
    });

    // 10. Vincular nueva película
    const addMovieBtn = container.querySelector('#btn-add-movie-prompt');
    if (addMovieBtn) {
      addMovieBtn.addEventListener('click', () => {
        window.showModal?.({
          title: 'Vincular Película u OVA',
          inputs: [
            { id: 'new-movie-title', label: 'Título de la película o especial', placeholder: 'Ej. Película 1: Mugen Train' },
            { id: 'new-movie-dur', label: 'Duración (opcional)', placeholder: 'Ej. 1h 55m' },
            { id: 'new-movie-syn', label: 'Sinopsis o arco', placeholder: 'Ej. Arco de la fortaleza dimensional' }
          ],
          confirmText: 'Vincular',
          onConfirm: async (data) => {
            if (!data['new-movie-title']) return;
            const movies = [...(anime.movies || [])];
            movies.push({
              title: data['new-movie-title'],
              duration: data['new-movie-dur'] || '1h 30m',
              synopsis: data['new-movie-syn'] || '',
              completed: false
            });
            await store.updateAnime(anime.id, { movies });
            this.render(container, new URLSearchParams(`id=${anime.id}`));
            window.showToast?.('Película vinculada correctamente');
          }
        });
      });
    }

    // 11. Autoguardado de notas personales con debounce
    const notesTextarea = container.querySelector('#notes-textarea');
    const notesStatus = container.querySelector('#notes-status');
    let debounceTimer;
    if (notesTextarea) {
      notesTextarea.addEventListener('input', () => {
        if (notesStatus) notesStatus.textContent = 'Guardando...';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          await store.updateAnime(anime.id, { notes: notesTextarea.value });
          if (notesStatus) notesStatus.textContent = 'Guardado';
        }, 600);
      });
    }

    // 12. Editor de Puntuación
    const editScoreBtn = container.querySelector('#btn-edit-score');
    if (editScoreBtn) {
      editScoreBtn.addEventListener('click', () => {
        window.showModal?.({
          title: 'Editar Mi Puntuación',
          inputs: [
            { id: 'edit-score-val', label: 'Puntuación personal (de 1.0 a 10.0)', type: 'number', step: '0.1', min: '1', max: '10', value: anime.rating || 9.0 }
          ],
          confirmText: 'Guardar Nota',
          onConfirm: async (data) => {
            const newScore = parseFloat(data['edit-score-val']);
            if (!isNaN(newScore)) {
              await store.updateAnime(anime.id, { rating: newScore });
              this.render(container, new URLSearchParams(`id=${anime.id}`));
              window.showToast?.('Puntuación actualizada ⭐');
            }
          }
        });
      });
    }

    // 13. Selector de Estado General
    const statusDropdownBtn = container.querySelector('#btn-status-dropdown');
    const statusMenu = container.querySelector('#status-menu');
    if (statusDropdownBtn && statusMenu) {
      statusDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        statusMenu.classList.toggle('hidden');
        statusMenu.classList.toggle('flex');
      });

      container.querySelectorAll('.status-option').forEach(opt => {
        opt.addEventListener('click', async () => {
          const newStatus = opt.getAttribute('data-status');
          await store.updateAnime(anime.id, { status: newStatus });
          statusMenu.classList.add('hidden');
          this.render(container, new URLSearchParams(`id=${anime.id}`));
          window.showToast?.('Estado actualizado');
        });
      });
    }
  }
};
