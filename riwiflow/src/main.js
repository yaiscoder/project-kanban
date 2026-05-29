
// Este es el punto de entrada de la app.
// Lo único que hace es llamar al router cuando la página carga,
// y también cuando el usuario presiona el botón "atrás" del navegador.

import { router } from './router.js';

// Cuando el usuario navega con el botón atrás/adelante del navegador,
// volvemos a llamar al router para mostrar la página correcta
window.addEventListener('popstate', router);

// Llamamos al router por primera vez para mostrar la página inicial
router();
