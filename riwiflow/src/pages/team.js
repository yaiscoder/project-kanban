
// Esta es la página de gestión del equipo.
// Solo los admins pueden verla.
// Permite ver, crear, editar y eliminar usuarios.

import { navigate } from '../router.js';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService.js';
import { getSession, clearSession, isAdmin } from '../utils/session.js';

export const teamPage = {

    // render() construye y devuelve el HTML completo de la página (con sidebar incluido)
    render() {
        const currentUser = getSession();
        const userName = currentUser ? currentUser.name : 'User';
        const userRole = currentUser ? currentUser.role : '';

        // Calculamos las iniciales del nombre para el avatar (ej: "Admin User" seria "AU")
        const nameParts = userName.split(' ');
        let initials = '';
        for (let i = 0; i < nameParts.length; i++) {
            initials += nameParts[i][0];
        }
        initials = initials.toUpperCase().slice(0, 2);

        return `
          <div class="bg-background text-on-background overflow-hidden h-screen flex">

            <!-- SIDEBAR -->
            <aside class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0">

              <!-- Logo -->
              <div class="px-gutter mb-xl">
                <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
                <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
              </div>

              <!-- Menú de navegación -->
              <nav class="flex-1 space-y-1">
                <a class="sidebar-link flex items-center px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer text-secondary hover:text-primary hover:bg-primary-container/10" data-path="/dashboard" href="/dashboard">
                  <span class="material-symbols-outlined mr-3">dashboard</span>
                  <span>Dashboard</span>
                </a>
                <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                  <span class="material-symbols-outlined mr-3">assignment</span>
                  <span>Projects</span>
                </a>
                <!-- Team: resaltado porque estamos en esta página -->
                <a class="sidebar-link flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3 font-body-sm text-body-sm transition-all scale-[0.98] cursor-pointer" data-path="/team" href="/team">
                  <span class="material-symbols-outlined mr-3">group</span>
                  <span>Team</span>
                </a>
                <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                  <span class="material-symbols-outlined mr-3">bar_chart</span>
                  <span>Reports</span>
                </a>
                <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all" href="#">
                  <span class="material-symbols-outlined mr-3">settings</span>
                  <span>Settings</span>
                </a>
              </nav>

              <!-- Parte inferior: info del usuario, logout, new task -->
              <div class="px-4 mt-auto space-y-3">

                <!-- Info del usuario logueado -->
                <div class="flex items-center gap-3 px-3 py-2 bg-surface-container rounded-xl">
                  <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-[11px] shrink-0">
                    ${initials}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-label-md text-label-md text-on-surface truncate">${userName}</p>
                    <p class="font-label-sm text-label-sm text-on-surface-variant capitalize">${userRole}</p>
                  </div>
                </div>

                <!-- Botón Logout -->
                <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant rounded-xl font-label-md text-label-md text-secondary hover:text-error hover:border-error/30 hover:bg-error/5 transition-all">
                  <span class="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>

                <!-- Botón New Task (solo para admins) -->
                <button id="newTaskBtn" class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
                  <span class="material-symbols-outlined text-[18px]">add</span>
                  New Task
                </button>
              </div>
            </aside>

            <!-- CONTENIDO PRINCIPAL -->
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
                  <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-[11px] border border-outline-variant">
                    ${initials}
                  </div>
                </div>
              </header>

              <!-- Contenido de la página -->
              <div class="flex-1 overflow-y-auto p-gutter custom-scrollbar">
                <div class="max-w-4xl mx-auto space-y-lg">

                  <!-- Título y botón Add Member -->
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="font-headline-md text-headline-md text-on-surface">Team Management</h2>
                      <p class="font-body-sm text-body-sm text-on-surface-variant mt-xs">Manage your team members and their access roles.</p>
                    </div>
                    <button id="addMemberBtn" class="bg-primary text-on-primary py-md px-lg rounded-xl font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm active:scale-[0.98]">
                      <span class="material-symbols-outlined text-[18px]">person_add</span>
                      Add Member
                    </button>
                  </div>

                  <!-- Tabla de miembros -->
                  <div class="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">

                    <!-- Encabezados de la tabla -->
                    <div class="px-lg py-md border-b border-outline-variant bg-surface-container-low">
                      <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Member</div>
                        <div class="col-span-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Email</div>
                        <div class="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Role</div>
                        <div class="col-span-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</div>
                      </div>
                    </div>

                    <!-- Filas de usuarios (se renderizan con JavaScript) -->
                    <div id="usersTableBody">
                      <div class="flex items-center justify-center py-xl gap-3 text-on-surface-variant">
                        <span class="material-symbols-outlined">refresh</span>
                        <span class="font-body-md text-body-md">Loading team...</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </main>

          </div>
        `;
    },

    // mounted() activa todos los eventos después de inyectar el HTML
    async mounted() {

        // Links de navegación del sidebar
        const navLinks = document.querySelectorAll('.sidebar-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                navigate(link.dataset.path);
            });
        });

        // Links decorativos (no hacen nada)
        const decorativeLinks = document.querySelectorAll('aside nav a[href="#"]');
        decorativeLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
            });
        });

        // Botón logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            clearSession();
            navigate('/');
        });

        // Botón "New Task" lleva al dashboard (las tareas se crean allí)
        document.getElementById('newTaskBtn').addEventListener('click', function() {
            navigate('/dashboard');
        });

        // Botón "Add Member" abre el modal para crear usuario
        document.getElementById('addMemberBtn').addEventListener('click', function() {
            openUserModal(null); // null = modo crear
        });

        // Cargamos y mostramos la lista de usuarios
        await showUsers();
    }
};


// Carga los usuarios desde la API y los muestra en la tabla
async function showUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    try {
        const allUsers = await getUsers();
        const currentUser = getSession();

        if (allUsers.length === 0) {
            tableBody.innerHTML = `
              <div class="flex items-center justify-center py-xl text-on-surface-variant">
                <p class="font-body-md text-body-md">No team members found.</p>
              </div>
            `;
            return;
        }

        // Construimos todas las filas de la tabla
        let rowsHTML = '';
        for (let i = 0; i < allUsers.length; i++) {
            rowsHTML += buildUserRow(allUsers[i], currentUser);
        }
        tableBody.innerHTML = rowsHTML;

        // Activamos los botones de editar y eliminar
        attachUserButtonEvents(allUsers);

    } catch (error) {
        tableBody.innerHTML = `
          <div class="flex items-center justify-center py-xl">
            <p class="text-error font-body-md text-body-md">Failed to load users. Make sure json-server is running.</p>
          </div>
        `;
    }
}

// Construye el HTML de una fila de usuario en la tabla
function buildUserRow(user, currentUser) {
    const isMe = currentUser && currentUser.id === user.id;
    const userIsAdmin = user.role === 'admin';

    // Iniciales para el avatar
    const nameParts = user.name.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i][0];
    }
    initials = initials.toUpperCase().slice(0, 2);

    // Colores según el rol
    const avatarColor = userIsAdmin ? 'bg-primary text-on-primary' : 'bg-secondary-container text-secondary';
    const roleBadge   = userIsAdmin ? 'bg-primary text-on-primary' : 'bg-secondary-container text-secondary';

    return `
      <div class="px-lg py-md border-b border-outline-variant last:border-0 hover:bg-surface-container-low/50 transition-colors">
        <div class="grid grid-cols-12 gap-4 items-center">

          <!-- Nombre y avatar -->
          <div class="col-span-4 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center font-label-sm text-[11px] shrink-0">
              ${initials}
            </div>
            <div>
              <p class="font-label-md text-label-md text-on-surface">
                ${user.name}
                ${isMe ? '<span class="text-primary font-label-sm text-[11px] ml-1">(you)</span>' : ''}
              </p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">ID: ${user.id}</p>
            </div>
          </div>

          <!-- Email -->
          <div class="col-span-4">
            <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${user.email}</p>
          </div>

          <!-- Rol -->
          <div class="col-span-2">
            <span class="${roleBadge} px-3 py-1 rounded-full font-label-sm text-label-sm capitalize">
              ${user.role}
            </span>
          </div>

          <!-- Botones: editar y eliminar -->
          <div class="col-span-2 flex items-center justify-end gap-2">
            <button
              class="btn-edit-user p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all"
              data-user-id="${user.id}"
              title="Edit user"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <!-- El botón de eliminar está deshabilitado si es el usuario actual -->
            <button
              class="btn-delete-user p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/40 transition-all ${isMe ? 'opacity-30 cursor-not-allowed' : ''}"
              data-user-id="${user.id}"
              title="${isMe ? 'Cannot delete yourself' : 'Delete user'}"
              ${isMe ? 'disabled' : ''}
            >
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>

        </div>
      </div>
    `;
}

// Activa los botones de editar y eliminar de la tabla
function attachUserButtonEvents(allUsers) {

    // Botones de editar
    const editButtons = document.querySelectorAll('.btn-edit-user');
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = parseInt(button.dataset.userId);
            const user = allUsers.find(function(u) { return u.id === userId; });
            if (user) openUserModal(user); // Abrimos el modal en modo editar
        });
    });

    // Botones de eliminar (solo los habilitados)
    const deleteButtons = document.querySelectorAll('.btn-delete-user:not([disabled])');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', async function() {
            const userId = parseInt(button.dataset.userId);
            const confirmed = confirm('Delete this user? This cannot be undone.');
            if (confirmed) {
                await deleteUser(userId);
                await showUsers(); // Recargamos la tabla
            }
        });
    });
}

// Abre el modal del formulario de usuario
// user: null el modo CREAR, objeto con datos el modo EDITAR
function openUserModal(user) {
    const isEditing = user !== null;

    // Si ya hay un modal abierto, lo eliminamos
    const existingModal = document.getElementById('userFormModal');
    if (existingModal) existingModal.remove();

    // Construimos el HTML del modal
    const modalHTML = `
      <div class="modal-overlay" id="userFormModal">
        <div class="modal-box">

          <!-- Encabezado -->
          <div class="flex items-center justify-between mb-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              ${isEditing ? 'Edit Member' : 'Add Member'}
            </h2>
            <button id="closeUserModal" class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
          </div>

          <div class="space-y-lg">

            <!-- Campo: Nombre completo -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="userName">Full Name</label>
              <input
                id="userName"
                type="text"
                value="${isEditing ? user.name : ''}"
                placeholder="e.g. Jane Doe"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            <!-- Campo: Email -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="userEmail">Email</label>
              <input
                id="userEmail"
                type="email"
                value="${isEditing ? user.email : ''}"
                placeholder="name@company.com"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            <!-- Campo: Contraseña -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="userPassword">
                Password ${isEditing ? '<span class="text-outline text-[12px]">(leave blank to keep current)</span>' : ''}
              </label>
              <input
                id="userPassword"
                type="password"
                value=""
                placeholder="••••••••"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            <!-- Campo: Rol -->
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface" for="userRole">Role</label>
              <select id="userRole" class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                <option value="coder" ${isEditing && user.role === 'coder' ? 'selected' : ''}>Coder</option>
                <option value="admin" ${isEditing && user.role === 'admin' ? 'selected' : ''}>Admin</option>
              </select>
            </div>

            <!-- Mensaje de error (oculto por defecto) -->
            <p id="userFormError" class="text-error font-body-sm text-body-sm hidden"></p>

            <!-- Botón guardar -->
            <button id="submitUserForm" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
              <span class="material-symbols-outlined text-[18px]">${isEditing ? 'save' : 'person_add'}</span>
              ${isEditing ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Insertamos el modal al final del body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('userFormModal');

    // Cerrar con el botón X
    document.getElementById('closeUserModal').addEventListener('click', function() {
        modal.remove();
    });

    // Cerrar al hacer clic fuera del cuadro
    modal.addEventListener('click', function(event) {
        if (event.target === modal) modal.remove();
    });

    // Guardar al hacer clic en el botón
    document.getElementById('submitUserForm').addEventListener('click', async function() {
        const name     = document.getElementById('userName').value.trim();
        const email    = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value.trim();
        const role     = document.getElementById('userRole').value;
        const errorMsg = document.getElementById('userFormError');

        // Validaciones básicas
        if (!name || !email) {
            errorMsg.textContent = 'Name and email are required.';
            errorMsg.classList.remove('hidden');
            return;
        }
        if (!isEditing && !password) {
            errorMsg.textContent = 'Password is required for new members.';
            errorMsg.classList.remove('hidden');
            return;
        }

        errorMsg.classList.add('hidden');

        if (isEditing) {
            // Modo editar: actualizamos los datos del usuario
            const updatedData = { name, email, role };
            if (password) updatedData.password = password; // Solo si escribió nueva contraseña
            await updateUser(user.id, updatedData);
        } else {
            // Modo crear: creamos un miembro nuevo
            await createUser({ name, email, password, role });
        }

        modal.remove();
        await showUsers(); // Recargamos la tabla para ver el nuevo miembro
    });
}
