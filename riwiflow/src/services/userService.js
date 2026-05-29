
// Aquí están todas las funciones para hablar con la API de usuarios.

const API_URL = 'http://localhost:3000';

// Obtiene TODOS los usuarios del servidor
export async function getUsers() {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    return users;
}

// Crea un usuario nuevo en el servidor
// userData es un objeto con: { name, email, password, role }
export async function createUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const newUser = await response.json();
    return newUser;
}

// Actualiza un usuario existente (solo los campos que le pasemos)
// id: el id del usuario a actualizar
// userData: objeto con los campos a cambiar
export async function updateUser(id, userData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const updatedUser = await response.json();
    return updatedUser;
}

// Elimina un usuario del servidor
// id: el id del usuario a eliminar
export async function deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
    });
    return response.ok; // retorna true si se eliminó bien
}
