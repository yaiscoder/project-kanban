
// Aquí manejamos todo lo relacionado con el usuario logueado.
// Guardamos y leemos la sesión desde el localStorage del navegador.

// Guarda el usuario en localStorage (para que no se pierda al recargar)
export function setSession(user) {
    localStorage.setItem('riwiflow_user', JSON.stringify(user));
}

// Lee el usuario guardado en localStorage
// Retorna el objeto del usuario, o null si no hay nadie logueado
export function getSession() {
    const savedData = localStorage.getItem('riwiflow_user');

    // Si no hay nada guardado, retornamos null
    if (!savedData) return null;

    // Convertimos el texto guardado de vuelta a un objeto JavaScript
    try {
        return JSON.parse(savedData);
    } catch (error) {
        // Si el dato guardado está dañado, retornamos null
        return null;
    }
}

// Borra la sesión (cuando el usuario hace logout)
export function clearSession() {
    localStorage.removeItem('riwiflow_user');
}

// Verifica si hay alguien logueado
// Retorna true o false
export function isAuthenticated() {
    const user = getSession();
    return user !== null;
}

// Verifica si el usuario logueado es administrador
// Retorna true o false
export function isAdmin() {
    const user = getSession();
    return user !== null && user.role === 'admin';
}
