
// El router decide qué página mostrar según la URL del navegador.

import Login from './pages/login.js';
import Dashboard from './pages/dashboard.js';
import { teamPage } from './pages/team.js';

// Este objeto relaciona cada URL con su página correspondiente
const routes = {
    '/': Login,
    '/dashboard': Dashboard,
    '/team': teamPage
};

export function router() {
    // Leemos la URL actual del navegador
    let currentPath = window.location.pathname;

    // Revisamos si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');

    // Si el usuario ya está logueado y trata de ir a "/", lo mandamos al dashboard
    if (currentPath === '/' && savedUser) {
        currentPath = '/dashboard';
        history.pushState(null, null, currentPath);
    }

    // Si el usuario NO está logueado y trata de ir al dashboard o team, lo mandamos al login
    if ((currentPath === '/dashboard' || currentPath === '/team') && !savedUser) {
        currentPath = '/';
        history.pushState(null, null, currentPath);
    }

    // Si no es admin y trata de ir a /team, lo mandamos al dashboard
    if (currentPath === '/team' && savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role !== 'admin') {
            currentPath = '/dashboard';
            history.pushState(null, null, currentPath);
        }
    }

    // Buscamos la página que corresponde a la URL actual
    // Si no existe, mostramos Login por defecto
    const pageToShow = routes[currentPath] || Login;

    // Metemos el HTML de la página dentro del div#app del index.html
    document.getElementById('app').innerHTML = pageToShow.render();

    // Activamos los eventos (botones, formularios, etc.) de esa página
    pageToShow.mounted();
}

// Función para navegar a otra página sin recargar el navegador
// Se usa en el sidebar y otros componentes
export function navigate(path) {
    history.pushState(null, null, path);
    router();
}
