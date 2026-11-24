/**
 * AniVault - Global Application Orchestrator
 * Bootstraps router, global toast notification manager, interactive modal manager,
 * and reactive listeners.
 */
import { router } from './router.js';
import { store } from './store.js';
import { supabaseService } from './supabase.js';

// --- TOAST NOTIFICATION HELPER ---
window.showToast = function (message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-enter flex items-center gap-2 bg-surface-container-high/95 backdrop-blur-md px-4 py-3 rounded-2xl text-xs font-semibold text-on-surface shadow-2xl border border-white/10 pointer-events-auto';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-primary text-[18px]">info</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.className = toast.className.replace('toast-enter', 'toast-exit');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 250);
  }, duration);
};

// --- MODAL DIALOG HELPER ---
window.showModal = function ({
  title = '',
  message = '',
  inputs = [],
  confirmText = 'Confirmar',
  confirmClass = 'bg-primary text-on-primary',
  cancelText = 'Cancelar',
  onConfirm = () => {}
}) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  let inputsHtml = '';
  if (inputs.length > 0) {
    inputsHtml = inputs.map(input => `
      <div class="flex flex-col gap-1 text-left">
        <label class="text-[11px] font-bold text-outline uppercase" for="${input.id}">${input.label}</label>
        <input 
          id="${input.id}" 
          type="${input.type || 'text'}" 
          step="${input.step || ''}" 
          min="${input.min || ''}" 
          max="${input.max || ''}" 
          value="${input.value !== undefined ? input.value : ''}" 
          placeholder="${input.placeholder || ''}" 
          class="w-full bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
        />
      </div>
    `).join('');
  }

  modalContainer.innerHTML = `
    <div class="bg-surface-container-low rounded-2xl p-5 border border-white/10 shadow-2xl w-full max-w-sm flex flex-col gap-3 scale-95 transition-transform" onclick="event.stopPropagation()">
      <h3 class="font-display font-extrabold text-base text-on-surface">${title}</h3>
      ${message ? `<p class="text-xs text-on-surface-variant leading-relaxed">${message}</p>` : ''}
      ${inputsHtml ? `<div class="flex flex-col gap-2.5 my-1">${inputsHtml}</div>` : ''}
      <div class="flex items-center justify-end gap-2 mt-2">
        <button id="modal-cancel-btn" class="px-3 py-2 rounded-xl text-xs font-semibold text-outline hover:text-on-surface">${cancelText}</button>
        <button id="modal-confirm-btn" class="px-4 py-2 rounded-xl text-xs font-bold ${confirmClass} active:scale-95 transition-transform shadow-md">${confirmText}</button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  const closeModal = () => {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  };

  modalContainer.onclick = closeModal;
  modalContainer.querySelector('#modal-cancel-btn').onclick = closeModal;

  modalContainer.querySelector('#modal-confirm-btn').onclick = () => {
    const formData = {};
    inputs.forEach(input => {
      const el = modalContainer.querySelector(`#${input.id}`);
      if (el) formData[input.id] = el.value;
    });
    closeModal();
    onConfirm(formData);
  };
};

// --- HEADER SYNCHRONIZATION TELEMETRY ---
function updateHeaderTelemetry() {
  const syncBtn = document.getElementById('header-sync-btn');
  const syncIcon = document.getElementById('header-sync-icon');
  const syncText = document.getElementById('header-sync-text');
  const syncTextMobile = document.getElementById('header-sync-text-mobile');
  const avatarImg = document.getElementById('header-avatar-img');
  const avatarIcon = document.getElementById('header-avatar-icon');

  const isConfigured = supabaseService.isConfigured();
  const user = store.getUser();

  if (avatarImg && avatarIcon && user.avatarUrl) {
    avatarImg.src = user.avatarUrl;
    avatarImg.classList.remove('hidden');
    avatarIcon.classList.add('hidden');
  }

  if (syncIcon && syncText && syncTextMobile) {
    if (isConfigured) {
      syncIcon.textContent = 'cloud_done';
      syncIcon.className = 'material-symbols-outlined text-[15px] text-tertiary';
      syncText.textContent = 'Supabase Conectado';
      syncText.className = 'font-sans text-[11px] font-semibold text-tertiary hidden sm:inline';
      syncTextMobile.textContent = 'Cloud';
      syncTextMobile.className = 'font-sans text-[11px] font-semibold text-tertiary sm:hidden';
    } else {
      syncIcon.textContent = 'cloud_off';
      syncIcon.className = 'material-symbols-outlined text-[15px] text-secondary';
      syncText.textContent = 'Modo Local (Offline)';
      syncText.className = 'font-sans text-[11px] font-semibold text-secondary hidden sm:inline';
      syncTextMobile.textContent = 'Local';
      syncTextMobile.className = 'font-sans text-[11px] font-semibold text-secondary sm:hidden';
    }
  }

  if (syncBtn) {
    syncBtn.onclick = () => {
      window.location.hash = '#/perfil';
    };
  }
}

// --- INITIALIZE APPLICATION ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  router.init(container);
  updateHeaderTelemetry();

  // Suscribirse a cambios en el store
  store.subscribe(() => {
    updateHeaderTelemetry();
  });
});
