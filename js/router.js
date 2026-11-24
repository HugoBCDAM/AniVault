/**
 * AniVault - SPA Router
 * Hash-based routing without page reloads.
 */
import { libraryView } from './views/libraryView.js';
import { detailView } from './views/detailView.js';
import { favoritesView } from './views/favoritesView.js';
import { addView } from './views/addView.js';
import { profileView } from './views/profileView.js';
import { loginView } from './views/loginView.js';

class Router {
  constructor() {
    this.container = null;
    this.routes = {
      'biblioteca': libraryView,
      'favoritos': favoritesView,
      'anadir': addView,
      'detalle': detailView,
      'perfil': profileView,
      'login': loginView
    };
  }

  init(containerElement) {
    this.container = containerElement;
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Ruta por defecto si está vacío
    if (!window.location.hash || window.location.hash === '#/') {
      window.location.hash = '#/biblioteca';
    } else {
      this.handleRoute();
    }
  }

  parseHash() {
    const hash = window.location.hash.slice(2) || 'biblioteca'; // Quita '#/'
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');
    return { path, params };
  }

  handleRoute() {
    const { path, params } = this.parseHash();
    const view = this.routes[path] || libraryView;

    // Actualizar título de la sección en la cabecera
    const sectionLabel = document.getElementById('header-section-label');
    if (sectionLabel) {
      const titles = {
        'biblioteca': 'Biblioteca',
        'favoritos': 'Mis Favoritos',
        'anadir': 'Nueva Entrada',
        'detalle': 'Ficha de Detalle',
        'perfil': 'Perfil & Sincronización',
        'login': 'Bienvenida'
      };
      sectionLabel.textContent = titles[path] || 'AniVault';
    }

    // Actualizar estilo activo en barra de navegación inferior
    document.querySelectorAll('.nav-tab').forEach(tab => {
      const navTarget = tab.getAttribute('data-nav');
      if (navTarget === path) {
        tab.className = 'nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-all text-primary font-bold';
      } else {
        tab.className = 'nav-tab flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 transition-all text-on-surface-variant hover:text-on-surface';
      }
    });

    // Renderizar la vista dentro del contenedor
    if (this.container) {
      window.scrollTo(0, 0);
      view.render(this.container, params);
    }
  }

  navigate(path, params = {}) {
    let query = '';
    const entries = Object.entries(params);
    if (entries.length > 0) {
      query = '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    }
    window.location.hash = `#/${path}${query}`;
  }
}

export const router = new Router();
