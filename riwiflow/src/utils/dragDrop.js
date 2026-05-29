
// Aquí manejamos el drag & drop (arrastrar y soltar) de las tarjetas del tablero.
// Cuando arrastras una tarjeta a otra columna, su status se actualiza automáticamente.

import { getSession } from './session.js';
import { updateTask } from '../services/taskService.js';

// Variable global para recordar qué tarjeta se está arrastrando
let draggedTaskId = null;

// Función principal que activa el drag & drop en el tablero
// onDropCallback: función que se llama después de soltar una tarjeta (para recargar el tablero)
export function initDragDrop(onDropCallback) {

    // Seleccionamos todas las tarjetas que tienen draggable="true"
    const allDraggableCards = document.querySelectorAll('.task-card[draggable="true"]');

    // Seleccionamos todas las columnas donde se pueden soltar tarjetas
    const allDropZones = document.querySelectorAll('.drop-zone');

    // Eventos en las TARJETAS
    allDraggableCards.forEach(function(card) {

        // Cuando empieza a arrastrarse una tarjeta
        card.addEventListener('dragstart', function(event) {
            draggedTaskId = card.dataset.taskId;  // Guardamos el id de la tarjeta arrastrada
            card.classList.add('dragging');        // Le ponemos estilo de "siendo arrastrada"
            event.dataTransfer.effectAllowed = 'move';
        });

        // Cuando se suelta la tarjeta (sin importar dónde)
        card.addEventListener('dragend', function() {
            card.classList.remove('dragging'); // Quitamos el estilo de arrastre
            draggedTaskId = null;              // Limpiamos la variable
        });
    });

    // Eventos en las COLUMNAS (zonas de soltar)
    allDropZones.forEach(function(column) {

        // Cuando una tarjeta pasa por encima de la columna
        column.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            column.classList.add('drag-over'); // Resaltamos la columna
        });

        // Cuando la tarjeta sale de la columna sin soltarse
        column.addEventListener('dragleave', function() {
            column.classList.remove('drag-over'); // Quitamos el resaltado
        });

        // Cuando se suelta la tarjeta dentro de la columna
        column.addEventListener('drop', async function(event) {
            event.preventDefault();
            column.classList.remove('drag-over'); // Quitamos el resaltado

            // Si no había ninguna tarjeta siendo arrastrada, no hacemos nada
            if (!draggedTaskId) return;

            // Leemos el nuevo status desde el atributo data-status de la columna
            const newStatus = column.dataset.status;
            const taskId = parseInt(draggedTaskId);

            // Actualizamos el status de la tarea en el servidor
            await updateTask(taskId, { status: newStatus });

            // Recargamos el tablero para mostrar los cambios
            if (onDropCallback) {
                onDropCallback();
            }
        });
    });
}

// Función que verifica si un usuario puede arrastrar cierta tarea
// Solo los admins y el dueño de la tarea pueden arrastrarla
export function canDragTask(task) {
    const currentUser = getSession();

    // Si no hay usuario logueado, no puede arrastrar nada
    if (!currentUser) return false;

    // Los admins pueden arrastrar cualquier tarea
    if (currentUser.role === 'admin') return true;

    // Los demás solo pueden arrastrar sus propias tareas
    return task.userId === currentUser.id;
}
