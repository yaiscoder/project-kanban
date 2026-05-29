
// Los "guards" son reglas de acceso a las páginas.
// Aquí decidimos si un usuario puede entrar a cierta URL o lo redirigimos.

import { isAuthenticated, isAdmin } from './session.js';

// Recibe la ruta a la que el usuario quiere ir
// y retorna la ruta a la que REALMENTE puede ir
export function applyGuards(path) {

    // Si el usuario NO está logueado y quiere ir al dashboard o al equipo,
    // lo mandamos al login
    if (!isAuthenticated() && (path === '/dashboard' || path === '/team')) {
        return '/';
    }

    // Si el usuario YA está logueado y quiere ir al login,
    // lo mandamos al dashboard (ya no necesita loguearse)
    if (isAuthenticated() && path === '/') {
        return '/dashboard';
    }

    // Si el usuario está logueado pero NO es admin y quiere ir a /team,
    // lo mandamos al dashboard (esa página es solo para admins)
    if (isAuthenticated() && !isAdmin() && path === '/team') {
        return '/dashboard';
    }

    // Si ninguna regla aplica, dejamos pasar al usuario a la ruta solicitada
    return path;
}
