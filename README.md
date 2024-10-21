# app-bakend

Resumen del Backend
Tecnologías Utilizadas:

Node.js con Express para la creación del servidor.
MongoDB como base de datos para almacenar la información de los administradores.
Mongoose para manejar las operaciones con MongoDB.
JWT (JSON Web Tokens) para la autenticación de administradores.
Estructura:

Modelos:
Admin: Esquema que define los administradores, incluyendo un método para encriptar contraseñas y otro para compararlas.
Rutas:
/api/admin:
POST /login: Autenticación de administradores.
POST /register: Registro de nuevos administradores (opcional).
GET /admins: Obtiene la lista de todos los administradores.
DELETE /admin/
: Elimina un administrador específico.
Configuración de CORS: Permite solicitudes de diferentes orígenes.
Conexión a MongoDB: Usa una URI de conexión configurada en las variables de entorno.
Puntos de Entrada:

/api/admin: Principal punto de acceso para las operaciones relacionadas con administradores.
/api/user: (Ruta adicional no especificada en detalle, pero reservada para operaciones de usuario).
