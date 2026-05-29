
// Esta es la página principal del tablero Kanban.
// Muestra las tareas organizadas en columnas según su estado.

import { router, navigate } from '../router.js';

// URL de la API (definida en el archivo .env)
const API_URL = import.meta.env.VITE_API_URL;

// Las columnas del tablero Kanban (en orden de izquierda a derecha)
const KANBAN_COLUMNS = [
    { id: 'todo',        label: 'To Do'       },
    { id: 'in progress', label: 'In Progress' },
    { id: 'in review',   label: 'In Review'   },
    { id: 'done',        label: 'Done'        }
];

const Dashboard = {

    // render() construye y devuelve el HTML completo del dashboard
    render() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const userIsAdmin = currentUser && currentUser.role === 'admin';

        return `
            <div class="bg-background text-on-background overflow-hidden h-screen flex">

              <!--  SIDEBAR  -->
              <aside class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0">

                <!-- Logo -->
                <div class="px-gutter mb-xl">
                  <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
                </div>

                <!-- Menú de navegación -->
                <nav class="flex-1 space-y-1">
                  <a class="flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3 font-body-sm text-body-sm transition-all scale-[0.98]" href="#">
                    <span class="material-symbols-outlined mr-3">dashboard</span>
                    <span>Dashboard</span>
                  </a>
                  <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                    <span class="material-symbols-outlined mr-3">assignment</span>
                    <span>Projects</span>
                  </a>
                  ${userIsAdmin ? `
                    <a id="teamLink" class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer" href="/team">
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

                <!-- Parte inferior del sidebar -->
                <div class="px-4 mt-auto space-y-3">
                  <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl font-label-md text-label-md text-secondary hover:text-error hover:border-error/30 hover:bg-error/5 transition-all">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>

                  <!-- Botón New Task solo para admins -->
                  ${userIsAdmin ? `
                    <button id="newTaskBtn" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
                      <span class="material-symbols-outlined text-[18px]">add</span>
                      New Task
                    </button>
                  ` : ''}
                </div>
              </aside>

              <!--  CONTENIDO PRINCIPAL  -->
              <main class="flex-1 flex flex-col min-w-0">

                <!-- Barra superior (header) -->
                <header class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant z-40 shrink-0">
                  <div class="flex items-center gap-4 flex-1">
                    <div class="relative max-w-md w-full">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                      <input
                        class="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Search tasks or files..." type="text"
                      />
                    </div>
                  </div>
                  <div class="flex items-center gap-4 ml-4">
                    <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">notifications</button>
                    <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">help_outline</button>
                    <img
                      alt="User profile"
                      class="w-8 h-8 rounded-full border border-outline-variant object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-sF_Qd9jEF33fUrS3vMvdoA8rbw2_a6jzv7r_6oDikCkrertidHwLgqAtWuKvLnRx7Lcsi79ZYj4FBaL_pETFxeyeF27_PhXy-KnuioiYgCwYTKcWDEuZoRksSf8Jb0_ZmsxJkpTFGZ2bW8aTl5fhcA4DOHQQal_vu1KVBcizoM56dHRc7Ce_vkUul2aL96DSeDmqR4YdfGUuoIQkUF_F8AX45U05tmCFg7YyPH6xtgAx7e31u5_5e2rQxm_tgBEgnhV-LsqsEDH"
                    />
                  </div>
                </header>

                <!-- Tablero Kanban -->
                <div class="flex-1 overflow-x-auto p-gutter custom-scrollbar">
                  <div id="kanbanBoard" class="flex gap-gutter h-full">
                    <!-- Las columnas se renderizan aquí con JavaScript -->
                    <div class="flex items-center justify-center w-full text-on-surface-variant font-body-md text-body-md">
                      Loading tasks...
                    </div>
                  </div>
                </div>
              </main>

              <!--  MODAL: CREAR / EDITAR TAREA (solo admin)  -->
              ${userIsAdmin ? `
                <div id="taskModal" class="modal-overlay hidden">
                  <div class="modal-box">
                    <div class="flex items-center justify-between mb-lg">
                      <h2 id="modalTitle" class="font-headline-md text-headline-md text-on-surface">Create Task</h2>
                      <button id="closeModal" class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
                    </div>
                    <form id="taskForm" class="space-y-lg">
                      <!-- Campo oculto para guardar el id cuando editamos -->
                      <input type="hidden" id="taskId" />

                      <div class="space-y-sm">
                        <label class="font-label-md text-label-md text-on-surface" for="taskTitle">Title</label>
                        <input id="taskTitle" type="text" placeholder="Enter task title..." class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline" required />
                      </div>

                      <div class="space-y-sm">
                        <label class="font-label-md text-label-md text-on-surface" for="taskDescription">Description</label>
                        <textarea id="taskDescription" placeholder="Describe the task..." rows="3" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline resize-none"></textarea>
                      </div>

                      <div class="space-y-sm">
                        <label class="font-label-md text-label-md text-on-surface" for="taskStatus">Status</label>
                        <select id="taskStatus" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                          <option value="todo">To Do</option>
                          <option value="in progress">In Progress</option>
                          <option value="in review">In Review</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      <div class="space-y-sm">
                        <label class="font-label-md text-label-md text-on-surface" for="taskUserId">Assign to</label>
                        <select id="taskUserId" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                          <option value="">-- Select a user --</option>
                        </select>
                      </div>

                      <div id="taskError" class="text-error font-body-sm text-body-sm hidden">Please fill in all required fields.</div>

                      <button type="submit" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
                        <span class="material-symbols-outlined text-[18px]">save</span>
                        Save Task
                      </button>
                    </form>
                  </div>
                </div>
              ` : ''}

              <!--  MODAL: EDITAR (para coders)  -->
              <div id="editModal" class="modal-overlay hidden">
                <div class="modal-box">
                  <div class="flex items-center justify-between mb-lg">
                    <h2 class="font-headline-md text-headline-md text-on-surface">Edit Task</h2>
                    <button id="closeEditModal" class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
                  </div>
                  <form id="editForm" class="space-y-lg">
                    <input type="hidden" id="editTaskId" />

                    <div class="space-y-sm">
                      <label class="font-label-md text-label-md text-on-surface" for="editDescription">Description</label>
                      <textarea id="editDescription" rows="3" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all resize-none"></textarea>
                    </div>

                    <div class="space-y-sm">
                      <label class="font-label-md text-label-md text-on-surface" for="editStatus">Status</label>
                      <select id="editStatus" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                        <option value="todo">To Do</option>
                        <option value="in progress">In Progress</option>
                        <option value="in review">In Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <button type="submit" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
                      <span class="material-symbols-outlined text-[18px]">save</span>
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>

            </div>
        `;
    },

    // mounted() se llama después de inyectar el HTML en la página.
    // Aquí activamos todos los botones y formularios.
    mounted() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const userIsAdmin = currentUser && currentUser.role === 'admin';

        // Botón de logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('user');
            router();
        });

        // Link de Team (solo para admins)
        if (userIsAdmin) {
            const teamLink = document.getElementById('teamLink');
            if (teamLink) {
                teamLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    navigate('/team');
                });
            }
        }

        // Cargamos el tablero con las tareas
        loadBoard();

        // Eventos del modal de admin (crear/editar tarea)
        if (userIsAdmin) {

            // Abrir modal para crear tarea nueva
            document.getElementById('newTaskBtn').addEventListener('click', function() {
                openCreateModal();
            });

            // Cerrar modal con el botón X
            document.getElementById('closeModal').addEventListener('click', function() {
                document.getElementById('taskModal').classList.add('hidden');
            });

            // Cerrar modal al hacer clic fuera del cuadro
            document.getElementById('taskModal').addEventListener('click', function(event) {
                if (event.target === this) {
                    this.classList.add('hidden');
                }
            });

            // Formulario de crear/editar tarea (submit)
            document.getElementById('taskForm').addEventListener('submit', async function(event) {
                event.preventDefault();

                // Leemos los valores del formulario
                const taskId      = document.getElementById('taskId').value;
                const title       = document.getElementById('taskTitle').value.trim();
                const description = document.getElementById('taskDescription').value.trim();
                const status      = document.getElementById('taskStatus').value;
                const userId      = parseInt(document.getElementById('taskUserId').value);

                // Validación básica
                if (!title || !userId) {
                    document.getElementById('taskError').classList.remove('hidden');
                    return;
                }
                document.getElementById('taskError').classList.add('hidden');

                if (taskId) {
                    // Si hay un id es porque estamos editando
                    await fetch(`${API_URL}/tasks/${taskId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, description, status, userId })
                    });
                } else {
                    // Si no hay id es porque estamos creando una tarea nueva
                    await fetch(`${API_URL}/tasks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, description, status, userId })
                    });
                }

                // Cerramos el modal y recargamos el tablero
                document.getElementById('taskModal').classList.add('hidden');
                loadBoard();
            });
        }

        // Eventos del modal de edición (para coders)

        // Cerrar modal con el botón X
        document.getElementById('closeEditModal').addEventListener('click', function() {
            document.getElementById('editModal').classList.add('hidden');
        });

        // Cerrar modal al hacer clic fuera del cuadro
        document.getElementById('editModal').addEventListener('click', function(event) {
            if (event.target === this) {
                this.classList.add('hidden');
            }
        });

        // Formulario de edición simple (submit)
        document.getElementById('editForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const taskId      = document.getElementById('editTaskId').value;
            const description = document.getElementById('editDescription').value.trim();
            const status      = document.getElementById('editStatus').value;

            await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, status })
            });

            document.getElementById('editModal').classList.add('hidden');
            loadBoard();
        });
    }
};


// Convierte el valor de status en texto legible
function getStatusLabel(status) {
    if (status === 'todo')        return 'To Do';
    if (status === 'in progress') return 'In Progress';
    if (status === 'in review')   return 'In Review';
    if (status === 'done')        return 'Done';
    return status;
}

// Carga todas las tareas y usuarios desde la API y construye el tablero
async function loadBoard() {
    const boardContainer = document.getElementById('kanbanBoard');
    if (!boardContainer) return;

    // Pedimos tareas y usuarios al mismo tiempo (más eficiente)
    const tasksResponse = await fetch(`${API_URL}/tasks`);
    const usersResponse = await fetch(`${API_URL}/users`);

    const allTasks = await tasksResponse.json();
    const allUsers = await usersResponse.json();

    // Creamos un "mapa" de usuarios para buscar rápido por id
    const usersMap = {};
    for (let i = 0; i < allUsers.length; i++) {
        usersMap[allUsers[i].id] = allUsers[i];
    }

    // Construimos el HTML de las 4 columnas
    let boardHTML = '';
    for (let i = 0; i < KANBAN_COLUMNS.length; i++) {
        const column = KANBAN_COLUMNS[i];

        // Filtramos las tareas que pertenecen a esta columna
        const tasksInColumn = allTasks.filter(function(task) {
            return task.status === column.id;
        });

        boardHTML += buildColumnHTML(column, tasksInColumn, usersMap);
    }

    boardContainer.innerHTML = boardHTML;

    // Activamos los botones de editar/eliminar de las tarjetas
    attachCardButtonEvents(allTasks);

    // Activamos el drag & drop
    initDragDrop(allTasks);
}

// Construye el HTML de una columna del tablero Kanban
function buildColumnHTML(column, tasksInColumn, usersMap) {

    // Si no hay tareas, mostramos un mensaje vacío
    let cardsHTML = '';
    if (tasksInColumn.length === 0) {
        cardsHTML = `<div class="flex items-center justify-center h-16 text-on-surface-variant font-body-sm text-body-sm opacity-40 italic">No tasks here</div>`;
    } else {
        for (let i = 0; i < tasksInColumn.length; i++) {
            const task = tasksInColumn[i];
            const assignedUser = usersMap[task.userId]; // Buscamos el usuario asignado
            cardsHTML += buildCardHTML(task, assignedUser);
        }
    }

    return `
        <div class="kanban-column flex flex-col w-1/4 h-full">
          <!-- Encabezado de la columna -->
          <div class="flex items-center justify-between mb-md">
            <div class="flex items-center gap-2">
              <h3 class="font-title-sm text-title-sm text-on-surface">${column.label}</h3>
              <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm">${tasksInColumn.length}</span>
            </div>
            <button class="material-symbols-outlined text-outline">more_horiz</button>
          </div>
          <!-- Zona de drop (donde se sueltan las tarjetas) -->
          <div class="drop-zone flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar" data-status="${column.id}">
            ${cardsHTML}
          </div>
        </div>
    `;
}

// Construye el HTML de una tarjeta de tarea individual
function buildCardHTML(task, assignedUser) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userIsAdmin = currentUser && currentUser.role === 'admin';
    const isMyTask    = currentUser && task.userId === currentUser.id;
    const taskIsDone  = task.status === 'done';

    // Estilos condicionales según el estado
    const borderLeft      = task.status === 'in progress' ? 'border-l-4 border-l-primary' : '';
    const cardBackground  = taskIsDone ? 'opacity-80 bg-surface/60' : 'bg-surface';
    const titleDecoration = taskIsDone ? 'line-through' : '';

    // Primera palabra del título (tag de categoría)
    const firstWord = task.title.split(' ')[0];

    // Nombre corto del usuario asignado
    const userName = assignedUser ? assignedUser.name.split(' ')[0] : 'Unknown';

    // Botón editar: visible para admins y para el dueño de la tarea
    const editButton = (userIsAdmin || isMyTask) ? `
        <button class="btn-edit text-outline hover:text-primary transition-colors p-0.5" data-id="${task.id}" title="Edit task">
          <span class="material-symbols-outlined text-sm">edit</span>
        </button>
    ` : '';

    // Botón eliminar: solo visible para admins
    const deleteButton = userIsAdmin ? `
        <button class="btn-delete text-outline hover:text-error transition-colors p-0.5" data-id="${task.id}" title="Delete task">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
    ` : '';

    // Ícono de check para tareas terminadas
    const checkIcon = taskIsDone ? `
        <span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings: 'FILL' 1">check_circle</span>
    ` : '';

    // Los admins y el dueño pueden arrastrar la tarjeta
    const isDraggable = userIsAdmin || isMyTask;

    return `
        <div class="task-card ${cardBackground} ${borderLeft} border border-outline-variant rounded-xl p-md shadow-sm" data-task-id="${task.id}" draggable="${isDraggable}">

          <!-- Fila superior: categoría + botones -->
          <div class="flex items-start justify-between mb-xs">
            <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm">${firstWord}</span>
            <div class="flex items-center gap-1">
              ${checkIcon}
              ${editButton}
              ${deleteButton}
            </div>
          </div>

          <!-- Título -->
          <h4 class="font-label-md text-label-md text-on-surface mb-xs ${titleDecoration}">${task.title}</h4>

          <!-- Descripción -->
          <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${task.description}</p>

          <!-- Fila inferior: avatar + status -->
          <div class="mt-md flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img
                alt="${userName}"
                class="w-6 h-6 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBuiKEYj12lJcVG4nXyKu-Ai-H1-QlxIX2zT1jzk7AAD9j-20g91vBWIy1_5PsuU1H-g9vErAWuJJg3lohFPbVJhWG1ZwwSI2BxdTBpANzBluRwLzmBbnpSae8GQTTdZ1GoRzw9ZDPsxzDwyvkzduAyTDl3TN4KqDP45-VjqA0fxNIy5VVE5a8OP1OTlymungwOO-QcyUBGbbs24dxy1hwAoNbSe-uapYTlmCQYk70fcbq2y5m0xQhtlAZFbH8AX739jEY5b-ZtW8N"
              />
              <span class="font-label-sm text-label-sm text-on-surface-variant text-[11px]">${userName}</span>
            </div>
            <span class="font-label-sm text-label-sm text-outline flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">schedule</span>
              ${getStatusLabel(task.status)}
            </span>
          </div>
        </div>
    `;
}

// Activa los botones de editar y eliminar en las tarjetas
function attachCardButtonEvents(allTasks) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userIsAdmin = currentUser && currentUser.role === 'admin';

    // Botones de editar
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Evitamos que el click se propague a la tarjeta

            // Buscamos la tarea correspondiente al botón
            const taskId = parseInt(button.dataset.id);
            const task = allTasks.find(function(t) { return t.id === taskId; });
            if (!task) return;

            // Admins ven el modal completo, coders ven el modal simplificado
            if (userIsAdmin) {
                openEditModalAdmin(task, allTasks);
            } else {
                openEditModalCoder(task);
            }
        });
    });

    // Botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', async function(event) {
            event.stopPropagation();

            const confirmed = confirm('Delete this task? This cannot be undone.');
            if (confirmed) {
                await fetch(`${API_URL}/tasks/${button.dataset.id}`, { method: 'DELETE' });
                loadBoard(); // Recargamos el tablero
            }
        });
    });
}

// Abre el modal en modo CREAR (campos vacíos)
async function openCreateModal() {
    // Limpiamos el formulario
    document.getElementById('taskId').value          = '';
    document.getElementById('taskTitle').value       = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskStatus').value      = 'todo';
    document.getElementById('modalTitle').textContent = 'Create Task';
    document.getElementById('taskError').classList.add('hidden');

    // Cargamos la lista de usuarios en el select
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const userSelect = document.getElementById('taskUserId');
    userSelect.innerHTML = '<option value="">-- Select a user --</option>';
    for (let i = 0; i < users.length; i++) {
        userSelect.innerHTML += `<option value="${users[i].id}">${users[i].name} (${users[i].role})</option>`;
    }

    // Mostramos el modal
    document.getElementById('taskModal').classList.remove('hidden');
}

// Abre el modal en modo EDITAR con los datos de la tarea (para admins)
async function openEditModalAdmin(task, allTasks) {
    // Rellenamos el formulario con los datos de la tarea
    document.getElementById('taskId').value          = task.id;
    document.getElementById('taskTitle').value       = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskStatus').value      = task.status;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskError').classList.add('hidden');

    // Cargamos la lista de usuarios y marcamos el actual
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const userSelect = document.getElementById('taskUserId');
    userSelect.innerHTML = '<option value="">-- Select a user --</option>';
    for (let i = 0; i < users.length; i++) {
        const isSelected = users[i].id === task.userId ? 'selected' : '';
        userSelect.innerHTML += `<option value="${users[i].id}" ${isSelected}>${users[i].name} (${users[i].role})</option>`;
    }

    // Mostramos el modal
    document.getElementById('taskModal').classList.remove('hidden');
}

// Abre el modal simplificado (solo descripción y status) para coders
function openEditModalCoder(task) {
    document.getElementById('editTaskId').value       = task.id;
    document.getElementById('editDescription').value  = task.description;
    document.getElementById('editStatus').value       = task.status;
    document.getElementById('editModal').classList.remove('hidden');
}

// Activa el drag & drop en el tablero
function initDragDrop(allTasks) {
    let draggedTaskId = null; // Guardamos el id de la tarjeta que se está arrastrando

    // Eventos en las TARJETAS arrastrables
    const draggableCards = document.querySelectorAll('.task-card[draggable="true"]');
    draggableCards.forEach(function(card) {

        card.addEventListener('dragstart', function(event) {
            draggedTaskId = card.dataset.taskId;
            card.classList.add('dragging');
            event.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', function() {
            card.classList.remove('dragging');
            draggedTaskId = null;
        });
    });

    // Eventos en las COLUMNAS (zonas donde se sueltan)
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(function(zone) {

        zone.addEventListener('dragover', function(event) {
            event.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', function() {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', async function(event) {
            event.preventDefault();
            zone.classList.remove('drag-over');

            if (!draggedTaskId) return;

            const newStatus = zone.dataset.status; // El nuevo status es el de la columna

            // Actualizamos el status de la tarea en el servidor
            await fetch(`${API_URL}/tasks/${draggedTaskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            loadBoard(); // Recargamos el tablero para ver los cambios
        });
    });
}

export default Dashboard;
