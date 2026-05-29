
// Aquí están todas las funciones para hablar con la API de tareas.
// Usamos fetch() para hacer peticiones HTTP al servidor json-server.

const API_URL = 'http://localhost:3000';

// Obtiene TODAS las tareas del servidor
export async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    return tasks;
}

// Crea una tarea nueva en el servidor
// taskData es un objeto con: { title, description, status, userId }
export async function createTask(taskData) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    const newTask = await response.json();
    return newTask;
}

// Actualiza una tarea existente (solo los campos que le pasemos)
// id: el id de la tarea a actualizar
// taskData: objeto con los campos a cambiar, ej: { status: 'done' }
export async function updateTask(id, taskData) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    const updatedTask = await response.json();
    return updatedTask;
}

// Elimina una tarea del servidor
// id: el id de la tarea a eliminar
export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
    });
    return response.ok; // retorna true si se eliminó bien
}
