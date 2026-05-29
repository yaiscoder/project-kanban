
// Este componente construye el HTML del modal para crear o editar un usuario.
// Se usa en la página de Team Management.

// Construye y devuelve el HTML del formulario modal de usuarios
// user: si es null el modo CREAR, si tiene datos el modo EDITAR
export function renderUserForm(user) {
    // Determinamos si estamos editando o creando
    const isEditing = user !== null;

    return `
      <div class="modal-overlay" id="userFormModal">
        <div class="modal-box">

          <!-- Encabezado del modal -->
          <div class="flex items-center justify-between mb-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface">
              ${isEditing ? 'Edit User' : 'Create User'}
            </h2>
            <button id="closeUserModal" class="material-symbols-outlined text-outline hover:text-on-surface transition-colors">close</button>
          </div>

          <div class="space-y-lg">

            <!-- Campo: Nombre -->
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
                Password ${isEditing ? '(leave blank to keep current)' : ''}
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

            <!-- Botón de guardar -->
            <button id="submitUserForm" class="w-full bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
              <span class="material-symbols-outlined text-[18px]">${isEditing ? 'save' : 'person_add'}</span>
              ${isEditing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    `;
}
