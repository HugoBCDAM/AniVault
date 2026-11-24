/**
 * AniVault - Profile & Cloud Sync View
 * Perfil de usuario, configuración de Supabase (PostgreSQL),
 * configuración del Bot de Telegram y gestión de copias de seguridad JSON.
 */
import { store } from '../store.js';
import { supabaseService } from '../supabase.js';

export const profileView = {
  render(container) {
    const user = store.getUser();
    const creds = supabaseService.getCredentials();
    const isSupabaseConfigured = supabaseService.isConfigured();
    const lastSync = supabaseService.getLastSync() || user.lastSync;
    const formattedDate = lastSync ? new Date(lastSync).toLocaleString() : 'Pendiente';

    container.innerHTML = `
      <div class="flex flex-col w-full pb-16 max-w-2xl mx-auto gap-4">
        
        <!-- User Profile Card -->
        <div class="relative w-full rounded-2xl bg-surface-container-low p-5 border border-white/5 shadow-xl overflow-hidden mt-1">
          <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>

          <div class="relative flex flex-col items-center text-center">
            
            <!-- Avatar Frame with Edit Button -->
            <div class="relative mb-3">
              <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-container to-secondary shadow-[0_0_24px_rgba(160,120,255,0.45)]">
                <div class="w-full h-full rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
                  <img id="profile-avatar-img" class="w-full h-full object-cover" src="${user.avatarUrl}" alt="${user.username}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'"/>
                </div>
              </div>
              <button id="btn-edit-avatar" aria-label="Cambiar foto de perfil" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                <span class="material-symbols-outlined text-[17px]">photo_camera</span>
              </button>
            </div>

            <!-- Username & Collector Rank -->
            <div class="flex items-center justify-center gap-1.5 mb-1">
              <h2 class="font-display font-extrabold text-xl text-on-surface tracking-tight" id="profile-username-display">${user.username}</h2>
              <button id="btn-edit-username" title="Editar nombre" class="text-on-surface-variant hover:text-primary p-0.5">
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest/80 text-primary text-xs font-semibold mb-3 border border-white/5">
              <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
              <span>${user.levelTitle}</span>
            </div>

            <!-- Cloud Account Chip -->
            <div class="w-full rounded-xl bg-surface-container/70 p-3 flex items-center justify-between border border-white/5 shadow-inner">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px] ${isSupabaseConfigured ? 'text-tertiary' : 'text-outline'}">database</span>
                </div>
                <div class="flex flex-col text-left min-w-0">
                  <span class="text-xs font-bold text-on-surface truncate">${isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Almacenamiento Local (Offline)'}</span>
                  <span class="text-[11px] text-on-surface-variant truncate">Último sync: ${formattedDate}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-full ${isSupabaseConfigured ? 'bg-tertiary-container/30 text-tertiary' : 'bg-surface-container-high text-outline'} text-xs font-bold shrink-0">
                <span class="material-symbols-outlined text-[13px] ${isSupabaseConfigured ? 'animate-pulse' : ''}">check_circle</span>
                <span>${isSupabaseConfigured ? 'Activo' : 'Local'}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Supabase Configuration Section (Zero-Cost Database) -->
        <div class="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">cloud_sync</span>
              </div>
              <h3 class="font-display font-bold text-sm text-on-surface">Base de Datos Supabase (Gratis)</h3>
            </div>
            <span class="text-[10px] font-mono font-bold text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded-full">Cloud PostgreSQL</span>
          </div>

          <p class="text-xs text-on-surface-variant leading-relaxed">
            Conecta tu proyecto gratuito de Supabase para tener tu biblioteca 100% online y sincronizada entre tu ordenador, tu móvil y tu bot de Telegram.
          </p>

          <div class="flex flex-col gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-outline uppercase mb-1" for="supabase-url-input">SUPABASE URL</label>
              <input id="supabase-url-input" value="${creds.url}" placeholder="https://tu-proyecto.supabase.co" class="w-full bg-surface-container px-3 py-2 rounded-xl text-xs font-mono text-on-surface placeholder:text-outline border border-white/5 focus:outline-none focus:bg-surface-container-high"/>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-outline uppercase mb-1" for="supabase-key-input">SUPABASE ANON KEY</label>
              <input id="supabase-key-input" type="password" value="${creds.key}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..." class="w-full bg-surface-container px-3 py-2 rounded-xl text-xs font-mono text-on-surface placeholder:text-outline border border-white/5 focus:outline-none focus:bg-surface-container-high"/>
            </div>

            <div class="flex items-center gap-2 mt-1">
              <button id="btn-save-supabase" class="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md">
                <span class="material-symbols-outlined text-[16px]">save</span> Guardar Credenciales
              </button>
              <button id="btn-test-supabase" class="py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1 border border-white/5">
                <span class="material-symbols-outlined text-[16px]">bolt</span> Probar
              </button>
            </div>

            <button id="btn-sync-all-now" class="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-secondary/20 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>Subir y Sincronizar Todo el Catálogo Ahora</span>
            </button>
          </div>
        </div>

        <!-- Telegram Bot Section -->
        <div class="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">send</span>
              </div>
              <h3 class="font-display font-bold text-sm text-on-surface">Bot de Telegram (@AniVaultBot)</h3>
            </div>
            <span class="text-[10px] font-mono font-bold text-secondary bg-secondary-container/20 px-2 py-0.5 rounded-full">Telegram API</span>
          </div>

          <p class="text-xs text-on-surface-variant leading-relaxed">
            Puedes consultar tus series y sumar capítulos directamente chateando con tu bot de Telegram desde el móvil.
          </p>

          <!-- Commands guide -->
          <div class="bg-surface-container p-3 rounded-xl border border-white/5 flex flex-col gap-1.5 font-mono text-[11px]">
            <span class="text-secondary font-bold">Comandos disponibles en Telegram:</span>
            <div class="text-on-surface-variant flex flex-col gap-0.5">
              <div><strong class="text-primary">/viendo</strong> - Lista tus animes en curso con su capítulo actual.</div>
              <div><strong class="text-primary">/animes</strong> - Lista completa de tu biblioteca.</div>
              <div><strong class="text-primary">/ep [anime] [cap]</strong> - Actualiza el capítulo visto al instante.</div>
              <div><strong class="text-primary">/fav [anime]</strong> - Conmuta si una serie es favorita.</div>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-outline uppercase mb-1" for="telegram-token-input">TELEGRAM BOT TOKEN (Opcional)</label>
            <input id="telegram-token-input" type="password" value="${localStorage.getItem('anivault_telegram_token') || ''}" placeholder="123456789:ABCdefGhIJKlmNoPQRstuVWXyz..." class="w-full bg-surface-container px-3 py-2 rounded-xl text-xs font-mono text-on-surface placeholder:text-outline border border-white/5 focus:outline-none"/>
            <span class="text-[10px] text-outline mt-1 block">Consíguelo gratis hablando con @BotFather en Telegram.</span>
          </div>

          <button id="btn-save-telegram" class="py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-xs font-bold text-secondary transition-all flex items-center justify-center gap-1 border border-white/5">
            <span class="material-symbols-outlined text-[16px]">save</span> Guardar Configuración de Telegram
          </button>
        </div>

        <!-- Backup, Restore & Reset Section -->
        <div class="bg-surface-container-low rounded-2xl p-4 border border-white/5 shadow-md flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">folder_zip</span>
            </div>
            <h3 class="font-display font-bold text-sm text-on-surface">Copias de Seguridad y Datos (JSON)</h3>
          </div>

          <p class="text-xs text-on-surface-variant">
            Exporta tu biblioteca completa en un archivo JSON o restáurala en cualquier navegador sin depender de ningún servicio externo.
          </p>

          <div class="grid grid-cols-2 gap-2 mt-1">
            <button id="btn-export-backup" class="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-1.5 border border-white/5">
              <span class="material-symbols-outlined text-[16px] text-primary">download</span> Exportar Backup
            </button>
            
            <button id="btn-import-backup-prompt" class="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-all flex items-center justify-center gap-1.5 border border-white/5">
              <span class="material-symbols-outlined text-[16px] text-secondary">upload</span> Importar Backup
            </button>
            <input type="file" id="import-file-input" accept=".json" class="hidden"/>
          </div>

          <button id="btn-reset-demo" class="w-full py-2 rounded-xl text-outline hover:text-error hover:bg-error-container/20 text-xs font-semibold transition-all mt-1 flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[15px]">restart_alt</span>
            <span>Restablecer catálogo a datos iniciales de muestra</span>
          </button>
        </div>

      </div>
    `;

    this.bindEvents(container);
  },

  bindEvents(container) {
    // 1. Editar Avatar
    const editAvatarBtn = container.querySelector('#btn-edit-avatar');
    if (editAvatarBtn) {
      editAvatarBtn.addEventListener('click', () => {
        window.showModal?.({
          title: 'Cambiar Foto de Perfil',
          inputs: [
            { id: 'avatar-url-input', label: 'URL de tu nueva foto de avatar', placeholder: 'https://...', value: store.getUser().avatarUrl }
          ],
          confirmText: 'Actualizar Foto',
          onConfirm: (data) => {
            const url = data['avatar-url-input'];
            if (url) {
              store.updateUser({ avatarUrl: url.trim() });
              this.render(container);
              window.showToast?.('Foto de perfil actualizada');
            }
          }
        });
      });
    }

    // 2. Editar Nombre de Usuario
    const editUsernameBtn = container.querySelector('#btn-edit-username');
    if (editUsernameBtn) {
      editUsernameBtn.addEventListener('click', () => {
        window.showModal?.({
          title: 'Editar Nombre de Coleccionista',
          inputs: [
            { id: 'username-input', label: 'Nombre de usuario', value: store.getUser().username },
            { id: 'level-title-input', label: 'Título / Rango de coleccionista', value: store.getUser().levelTitle }
          ],
          confirmText: 'Guardar Cambios',
          onConfirm: (data) => {
            const username = data['username-input']?.trim();
            const levelTitle = data['level-title-input']?.trim();
            if (username) {
              store.updateUser({ username, levelTitle: levelTitle || 'Otaku Curator' });
              this.render(container);
              window.showToast?.('Perfil actualizado correctamente');
            }
          }
        });
      });
    }

    // 3. Guardar credenciales Supabase
    const saveSupabaseBtn = container.querySelector('#btn-save-supabase');
    if (saveSupabaseBtn) {
      saveSupabaseBtn.addEventListener('click', () => {
        const url = container.querySelector('#supabase-url-input')?.value?.trim();
        const key = container.querySelector('#supabase-key-input')?.value?.trim();
        supabaseService.saveCredentials(url, key);
        window.showToast?.('Credenciales de Supabase guardadas');
        this.render(container);
      });
    }

    // 4. Probar conexión Supabase
    const testSupabaseBtn = container.querySelector('#btn-test-supabase');
    if (testSupabaseBtn) {
      testSupabaseBtn.addEventListener('click', async () => {
        testSupabaseBtn.disabled = true;
        testSupabaseBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Probando...';
        const res = await supabaseService.testConnection();
        testSupabaseBtn.disabled = false;
        testSupabaseBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">bolt</span> Probar';
        window.showModal?.({
          title: res.success ? '¡Conexión Exitosa!' : 'Fallo de Conexión',
          message: res.message,
          confirmText: 'Aceptar'
        });
      });
    }

    // 5. Sincronizar catálogo con Supabase
    const syncAllBtn = container.querySelector('#btn-sync-all-now');
    if (syncAllBtn) {
      syncAllBtn.addEventListener('click', async () => {
        syncAllBtn.disabled = true;
        syncAllBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Sincronizando...';
        const res = await supabaseService.syncAll(store.animes);
        syncAllBtn.disabled = false;
        syncAllBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">cloud_upload</span> <span>Subir y Sincronizar Todo el Catálogo Ahora</span>';
        if (res.success) {
          window.showToast?.('¡Catálogo sincronizado con Supabase Cloud! ☁️');
          this.render(container);
        } else {
          window.showToast?.('Error al sincronizar: ' + res.message);
        }
      });
    }

    // 6. Guardar token Telegram
    const saveTelegramBtn = container.querySelector('#btn-save-telegram');
    if (saveTelegramBtn) {
      saveTelegramBtn.addEventListener('click', () => {
        const token = container.querySelector('#telegram-token-input')?.value?.trim();
        if (token) {
          localStorage.setItem('anivault_telegram_token', token);
        } else {
          localStorage.removeItem('anivault_telegram_token');
        }
        window.showToast?.('Configuración de Telegram guardada');
      });
    }

    // 7. Exportar backup
    const exportBtn = container.querySelector('#btn-export-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        store.exportBackup();
        window.showToast?.('Archivo de copia de seguridad descargado');
      });
    }

    // 8. Importar backup
    const importPromptBtn = container.querySelector('#btn-import-backup-prompt');
    const importFileInput = container.querySelector('#import-file-input');
    if (importPromptBtn && importFileInput) {
      importPromptBtn.addEventListener('click', () => importFileInput.click());

      importFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = store.importBackup(event.target.result);
            if (res.success) {
              window.showToast?.(`¡Restaurados ${res.count} animes con éxito!`);
              this.render(container);
            } else {
              window.showToast?.(res.message);
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // 9. Restablecer datos demo
    const resetBtn = container.querySelector('#btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        window.showModal?.({
          title: '¿Restablecer datos de muestra?',
          message: 'Se recuperará el catálogo de demostración inicial con Attack on Titan, Solo Leveling, Chainsaw Man y Frieren.',
          confirmText: 'Restablecer',
          confirmClass: 'bg-red-500 text-white',
          onConfirm: () => {
            store.resetSeedData();
            this.render(container);
            window.showToast?.('Catálogo inicial restablecido');
          }
        });
      });
    }
  }
};
