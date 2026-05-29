
// Este componente construye el HTML del modal para crear o editar una tarea.
// Se usa tanto para crear tareas nuevas como para editar las existentes.

import { getSession } from '../utils/session.js';

// Construye y devuelve el HTML del formulario modal
// task: si es null se usa modo CREAR, si tiene datos el modo EDITAR
// users: lista de usuarios para el select de asignación
export function renderTaskForm(task, users) {
    // Determinamos si estamos editando o creando
    const isEditing = task !== null;

    const currentUser = getSession();
    const userIsAdmin = currentUser && currentUser.role === 'admin';

    // Construimos las opciones del select de usuarios
    let userOptions = '';
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        // Si estamos editando, marcamos como seleccionado al usuario actual de la tarea
        const isSelected = isEditing && task.userId === user.id ? 'selected' : '';
        userOptions += `<option value="${user.id}" ${isSelected}>${user.name} (${user.role})</option>`;
    }

    return `
      <div class="modal-overlay" id="taskFormModal">
        <div class="modal-box">

          <!-- Encabezado del modal -->
          <div class="flex items-center justify-between mb-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              ${isEditing ? 'Edit Task' : 'Create Task'}
            </h2>
            <button id="closeTaskModal" class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
          </div>

          <div class="space-y-lg">

            <!-- Campo: Título -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="taskTitle">Title</label>
              <input
                id="taskTitle"
                type="text"
                value="${isEditing ? task.title : ''}"
                placeholder="Enter task title..."
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            <!-- Campo: Descripción -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="taskDescription">Description</label>
              <textarea
                id="taskDescription"
                placeholder="Describe the task..."
                rows="3"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline resize-none"
              >${isEditing ? task.description : ''}</textarea>
            </div>

            <!-- Campo: Status -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="taskStatus">Status</label>
              <select id="taskStatus" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                <option value="todo"        ${isEditing && task.status === 'todo'        ? 'selected' : ''}>To Do</option>
                <option value="in progress" ${isEditing && task.status === 'in progress' ? 'selected' : ''}>In Progress</option>
                <option value="in review"   ${isEditing && task.status === 'in review'   ? 'selected' : ''}>In Review</option>
                <option value="done"        ${isEditing && task.status === 'done'        ? 'selected' : ''}>Done</option>
              </select>
            </div>

            <!-- Campo: Asignar usuario (solo para admins) -->
            ${userIsAdmin ? `
              <div class="space-y-sm">
                <label class="font-label-md text-label-md text-on-surface" for="taskUserId">Assign to</label>
                <select id="taskUserId" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                  <option value="">-- Select a user --</option>
                  ${userOptions}
                </select>
              </div>
            ` : ''}

            <!-- Mensaje de error (oculto por defecto) -->
            <p id="taskFormError" class="text-error font-body-sm text-body-sm hidden"></p>

            <!-- Botón de guardar -->
            <button id="submitTaskForm" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
              <span class="material-symbols-outlined text-[18px]">${isEditing ? 'save' : 'add'}</span>
              ${isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    `;
}
