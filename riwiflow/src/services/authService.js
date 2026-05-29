
// Aquí manejamos el inicio de sesión.
// Como no tenemos un backend real con autenticación, buscamos el usuario
// manualmente en la lista de usuarios del json-server.

const API_URL = 'http://localhost:3000';

// Intenta hacer login con el email y contraseña dados
export async function login(email, password) {
    try {
        // Pedimos todos los usuarios al servidor
        const response = await fetch(`${API_URL}/users`);

        // Si el servidor no responde bien, avisamos
        if (!response.ok) {
            return {
                success: false,
                message: 'No se pudo conectar al servidor. Asegúrate de que json-server esté corriendo en el puerto 3000.'
            };
        }

        const allUsers = await response.json();

        // Buscamos si existe algún usuario con ese email y contraseña
        const foundUser = allUsers.find(function(user) {
            return user.email.toLowerCase() === email.toLowerCase() && user.password === password;
        });

        // Si no encontramos ningún usuario, el login falló
        if (!foundUser) {
            return {
                success: false,
                message: 'Email o contraseña incorrectos.'
            };
        }

        // Si encontramos el usuario, el login fue exitoso
        return {
            success: true,
            user: foundUser
        };

    } catch (error) {
        // Si hubo un error de red (servidor apagado, etc.)
        return {
            success: false,
            message: 'No se pudo conectar al servidor. Asegúrate de que json-server esté corriendo en el puerto 3000.'
        };
    }
}
