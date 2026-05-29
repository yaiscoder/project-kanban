
// Este componente construye la barra lateral (sidebar) de navegación.
// Se reutiliza en todas las páginas que la necesiten.

import { navigate } from '../router.js';
import { clearSession, getSession, isAdmin } from '../utils/session.js';

export const sidebar = {

    // render() construye y devuelve el HTML del sidebar
    render() {
        const currentUser = getSession();
        const userName = currentUser ? currentUser.name : 'User';
        const userRole = currentUser ? currentUser.role : '';

        // Calculamos las iniciales del nombre para el avatar (ej: Juan Perez seria JP)
        const nameParts = userName.split(' ');
        let initials = '';
        for (let i = 0; i < nameParts.length; i++) {
            initials += nameParts[i][0];
        }
        initials = initials.toUpperCase().slice(0, 2);

        return `
          <aside class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0">

            <!-- Logo y nombre de la app -->
            <div class="px-gutter mb-xl">
              <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
              <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
            </div>

            <!-- Menú de navegación -->
            <nav class="flex-1 space-y-1">
              <a class="sidebar-link flex items-center px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer" data-path="/dashboard" href="/dashboard">
                <span class="material-symbols-outlined mr-3">dashboard</span>
                <span>Dashboard</span>
              </a>

              <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                <span class="material-symbols-outlined mr-3">assignment</span>
                <span>Projects</span>
              </a>

              <!-- El link de Team solo aparece si el usuario es admin -->
              ${isAdmin() ? `
                <a class="sidebar-link flex items-center px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer" data-path="/team" href="/team">
                  <span class="material-symbols-outlined mr-3">group</span>
                  <span>Team</span>
                </a>
              ` : ''}

              <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                <span class="material-symbols-outlined mr-3">bar_chart</span>
                <span>Reports</span>
              </a>

              <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                <span class="material-symbols-outlined mr-3">settings</span>
                <span>Settings</span>
              </a>
            </nav>

            <!-- Parte inferior: avatar, logout y botón New Task -->
            <div class="px-4 mt-auto space-y-3">

              <!-- Info del usuario logueado -->
              <div class="flex items-center gap-3 px-3 py-2 bg-surface-container rounded-xl">
                <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-[11px] shrink-0">
                  ${initials}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-label-md text-label-md text-on-surface truncate">${userName}</p>
                  <p class="font-label-sm text-label-sm text-on-surface-variant capitalize">${userRole}</p>
                </div>
              </div>

              <!-- Botón de Logout -->
              <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl font-label-md text-label-md text-secondary hover:text-error hover:border-error/30 hover:bg-error/5 transition-all">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>

              <!-- Botón "New Task" solo visible para admins -->
              ${isAdmin() ? `
                <button id="newTaskBtn" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
                  <span class="material-symbols-outlined text-[18px]">add</span>
                  New Task
                </button>
              ` : ''}
            </div>
          </aside>
        `;
    },

    // mounted() activa los eventos del sidebar
    mounted() {

        // Activamos los links de navegación del sidebar
        const navLinks = document.querySelectorAll('.sidebar-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Evitamos que el navegador recargue la página
                navigate(link.dataset.path); // Navegamos a la ruta del link
            });
        });

        // Evitamos que los links decorativos (href="#") hagan algo
        const decorativeLinks = document.querySelectorAll('aside nav a[href="#"]');
        decorativeLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
            });
        });

        // Resaltamos el link de la página actual
        updateActiveLink();

        // Botón de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                clearSession();  // Borramos la sesión
                navigate('/');   // Mandamos al login
            });
        }
    }
};

// Función que resalta en el sidebar el link de la página donde estamos
export function updateActiveLink() {
    const currentPath = window.location.pathname;

    const allNavLinks = document.querySelectorAll('.sidebar-link');
    allNavLinks.forEach(function(link) {
        if (link.dataset.path === currentPath) {
            // Este link es el de la página actual y se resalta
            link.classList.add('bg-primary-fixed', 'text-on-primary-fixed-variant', 'scale-[0.98]');
            link.classList.remove('text-secondary', 'hover:text-primary', 'hover:bg-primary-container/10');
        } else {
            // Este link no es el activo aqui tiene apariencia normal
            link.classList.remove('bg-primary-fixed', 'text-on-primary-fixed-variant', 'scale-[0.98]');
            link.classList.add('text-secondary', 'hover:text-primary', 'hover:bg-primary-container/10');
        }
    });
}
