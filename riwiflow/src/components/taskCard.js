
// Este componente construye el HTML de una tarjeta de tarea individual.
// Se usa dentro del dashboard para mostrar cada tarea en el tablero Kanban.

import { getSession } from '../utils/session.js';
import { canDragTask } from '../utils/dragDrop.js';

// Convierte el valor del status (guardado en la base de datos)
// en un texto legible para mostrar en la interfaz
function getStatusLabel(status) {
    if (status === 'todo')        return 'To Do';
    if (status === 'in progress') return 'In Progress';
    if (status === 'in review')   return 'In Review';
    if (status === 'done')        return 'Done';
    return status; // Si no coincide con ninguno, lo mostramos tal cual
}

// Devuelve las clases CSS del color del badge según el status
function getStatusBadgeClasses(status) {
    if (status === 'todo')        return 'bg-surface-container-high text-on-surface-variant';
    if (status === 'in progress') return 'bg-primary-container text-on-primary';
    if (status === 'in review')   return 'bg-primary-fixed text-on-primary-fixed-variant';
    if (status === 'done')        return 'bg-secondary-container text-secondary';
    return 'bg-surface-container-high text-on-surface-variant'; // color por defecto
}

// Verifica si el usuario actual puede editar esta tarea
// Solo pueden editarla los admins y el dueño de la tarea
function canEditTask(task) {
    const currentUser = getSession();
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return task.userId === currentUser.id;
}

// Función principal: construye y devuelve el HTML de una tarjeta
// task: objeto con los datos de la tarea
// assignedUser: objeto con los datos del usuario asignado a la tarea
export function renderTaskCard(task, assignedUser) {
    const currentUser = getSession();
    const userIsAdmin = currentUser && currentUser.role === 'admin';
    const userCanEdit = canEditTask(task);
    const userCanDrag = canDragTask(task);
    const taskIsDone = task.status === 'done';

    // Calculamos las iniciales del usuario asignado para el avatar
    let userInitials = '?';
    if (assignedUser) {
        const nameParts = assignedUser.name.split(' ');
        userInitials = '';
        for (let i = 0; i < nameParts.length; i++) {
            userInitials += nameParts[i][0];
        }
        userInitials = userInitials.toUpperCase().slice(0, 2);
    }

    // Color del avatar según el rol del usuario asignado
    const avatarColor = assignedUser && assignedUser.role === 'admin' ? 'bg-primary' : 'bg-secondary';

    // Estilos condicionales según el estado de la tarea
    const cardBorderLeft  = task.status === 'in progress' ? 'border-l-4 border-l-primary' : '';
    const cardBackground  = taskIsDone ? 'opacity-80 bg-surface/60' : 'bg-surface';
    const titleDecoration = taskIsDone ? 'line-through' : '';

    // Primera palabra del título para el tag de categoría
    const firstWord = task.title.split(' ')[0];

    // Nombre corto del usuario asignado
    const shortUserName = assignedUser ? assignedUser.name.split(' ')[0] : '';

    // Botón de editar (solo aparece si el usuario puede editar)
    const editButton = userCanEdit ? `
        <button class="btn-edit-task text-outline hover:text-primary transition-colors p-0.5" data-task-id="${task.id}" title="Edit task">
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
    ` : '';

    // Botón de eliminar (solo aparece para admins)
    const deleteButton = userIsAdmin ? `
        <button class="btn-delete-task text-outline hover:text-error transition-colors p-0.5" data-task-id="${task.id}" title="Delete task">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
    ` : '';

    // Ícono de check (solo aparece en tareas terminadas)
    const checkIcon = taskIsDone ? `
        <span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings: 'FILL' 1">check_circle</span>
    ` : '';

    return `
      <div
        class="task-card ${cardBackground} ${cardBorderLeft} border border-outline-variant rounded-xl p-md shadow-sm"
        data-task-id="${task.id}"
        draggable="${userCanDrag}"
      >
        <!-- Fila superior: tag de categoría + botones de acción -->
        <div class="flex items-start justify-between mb-xs">
          <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm">
            ${firstWord}
          </span>
          <div class="flex items-center gap-1">
            ${checkIcon}
            ${editButton}
            ${deleteButton}
          </div>
        </div>

        <!-- Título de la tarea -->
        <h4 class="font-label-md text-label-md text-on-surface mb-xs ${titleDecoration}">
          ${task.title}
        </h4>

        <!-- Descripción de la tarea -->
        <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
          ${task.description}
        </p>

        <!-- Fila inferior: avatar del usuario + status -->
        <div class="mt-md flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full ${avatarColor} text-white flex items-center justify-center font-label-sm text-[10px]">
              ${userInitials}
            </div>
            ${assignedUser ? `<span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">${shortUserName}</span>` : ''}
          </div>
          <span class="font-label-sm text-label-sm text-outline flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">schedule</span>
            ${getStatusLabel(task.status)}
          </span>
        </div>
      </div>
    `;
}
