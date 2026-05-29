
// Esta es la página de Login.
// Tiene dos partes:
//   render() devuelve el HTML de la página
//   mounted() activa los eventos (el formulario de login)

import { router } from '../router.js';

// La URL de la API (json-server)
const API_URL = import.meta.env.VITE_API_URL;

const Login = {

    // render() construye y devuelve el HTML de la página de login
    render() {
        return `
            <div class="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col">
              <main class="flex-grow flex items-center justify-center px-gutter py-xxl">
                <div class="w-full max-w-[440px] space-y-xl">

                  <!-- Título de la app -->
                  <div class="text-center space-y-md">
                    <h1 class="font-headline-md text-headline-md font-bold text-primary tracking-tight">Riwiflow</h1>
                    <p class="font-body-md text-body-md text-on-surface-variant">Sign in to your professional workspace</p>
                  </div>

                  <!-- Caja del formulario -->
                  <div class="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl space-y-lg transition-all">
                    <form class="space-y-lg" id="loginForm" onsubmit="return false;">

                      <!-- Campo: Email -->
                      <div class="space-y-sm">
                        <label class="font-label-md text-label-md text-on-surface" for="email">Email address</label>
                        <div class="relative">
                          <input
                            class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
                            id="email" name="email" placeholder="name@company.com" required type="email"
                          />
                        </div>
                      </div>

                      <!-- Campo: Contraseña -->
                      <div class="space-y-sm">
                        <div class="flex justify-between items-center">
                          <label class="font-label-md text-label-md text-on-surface" for="password">Password</label>
                          <a class="font-label-md text-label-md text-primary hover:underline transition-all" href="#">Forgot password?</a>
                        </div>
                        <div class="relative">
                          <input
                            class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline"
                            id="password" name="password" placeholder="••••••••" required type="password"
                          />
                        </div>
                      </div>

                      <!-- Mensaje de error (oculto por defecto) -->
                      <div id="loginError" class="text-error font-body-sm text-body-sm hidden">
                        Invalid email or password.
                      </div>

                      <!-- Botón de Login -->
                      <div class="pt-sm">
                        <button
                          class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-md px-lg rounded-lg transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-sm"
                          type="submit"
                        >
                          Login
                          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                      </div>
                    </form>

                    <!-- Separador -->
                    <div class="relative py-sm">
                      <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-outline-variant"></div>
                      </div>
                      <div class="relative flex justify-center text-label-sm">
                        <span class="bg-surface-container-lowest px-md text-outline font-label-sm uppercase tracking-widest">or continue with</span>
                      </div>
                    </div>

                    <!-- Botón Google (solo visual, no funciona) -->
                    <div class="grid grid-cols-1 gap-md">
                      <button class="w-full flex items-center justify-center gap-md py-md border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors duration-200">
                        <img
                          alt="Google"
                          class="w-4 h-4 opacity-80"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4MKWoYfBIsxFaqncSN9YxR9mdXQGZNMC1EJDT5yAh5A5R7NXO24MRfA2bF0BxpLFdOJLIlAof80HOr4HokeP6RalmMOUP2rfQdl3XiQ4NoHX37q7XV75Y8mHyjT-0PziGdPkI9qXCMmNzMVVN-ZQUdWwMo6nYIE9qAI22sos0F8nFKx2zlwN1HYzEky_3nI6UP8FAT6bwNH0p2-0Yi3teyjDUPvFHOJwCiAgh-b14qx97Qfr8mlseGFe9mamhHBn8i9WZVkS0Zdjc"
                        />
                        Sign in with Google
                      </button>
                    </div>
                  </div>

                  <!-- Link de registro (solo visual) -->
                  <div class="text-center">
                    <p class="font-body-sm text-body-sm text-on-surface-variant">
                      Don't have an account?
                      <a class="text-primary font-label-md hover:underline" href="#">Create an account</a>
                    </p>
                  </div>
                </div>
              </main>

              <!-- Fondo decorativo con difuminado -->
              <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-fixed/20 blur-[120px] rounded-full"></div>
                <div class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary-fixed/10 blur-[100px] rounded-full"></div>
              </div>
            </div>
        `;
    },

    // mounted() se llama después de que el HTML ya está en la página.
    // Aquí activamos el evento del formulario.
    mounted() {
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evitamos que la página se recargue

            // Leemos lo que escribió el usuario en el formulario
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Buscamos en la API si existe un usuario con ese email y contraseña
            const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
            const matchingUsers = await response.json();

            // Si no encontramos ningún usuario, mostramos el error
            if (matchingUsers.length === 0) {
                document.getElementById('loginError').classList.remove('hidden');
                // Ocultamos el error después de 3 segundos
                setTimeout(function() {
                    document.getElementById('loginError').classList.add('hidden');
                }, 3000);
                return; // Salimos de la función, no seguimos
            }

            // Guardamos el usuario en localStorage (sin la contraseña por seguridad)
            const user = matchingUsers[0];
            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));

            // Cambiamos la URL a /dashboard y llamamos al router para mostrar esa página
            history.pushState(null, null, '/dashboard');
            router();
        });
    }
};

export default Login;
