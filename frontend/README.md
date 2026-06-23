# Burrito Lector — Frontend

Aplicación Angular 21 para el backend NestJS de Burrito Lector.

## Plantilla visual

La interfaz usa la plantilla **Sneat** proporcionada por el profesor. Sus assets públicos quedaron integrados en `frontend/public/assets`, y los componentes Angular fueron adaptados para usar su estilo de sidebar, navbar, cards, tablas, formularios y login/register.

## Ejecutar localmente

1. Desde esta carpeta ejecuta `npm install` y después `npm start`.
2. Espera el mensaje `Application bundle generation complete`.
3. Abre `http://localhost:4200`.

También puedes ejecutar desde la raíz del proyecto:

```bash
npm run frontend:start
```

Tanto desarrollo como producción consumen `https://backend-burrito.onrender.com`. Las credenciales de PostgreSQL permanecen exclusivamente en el `.env` del backend y nunca deben copiarse al frontend.

## Despliegue en Vercel

Importa el repositorio y configura **Root Directory** como `frontend`. Vercel detectará Angular; el archivo `vercel.json` permite recargar directamente cualquier ruta de la SPA.

En Render, configura `FRONTEND_URL` con el dominio final de Vercel, por ejemplo `https://tu-proyecto.vercel.app`, para habilitar CORS.

## Funciones incluidas

- Registro e inicio de sesión con JWT.
- Signals, formularios reactivos, interceptor HTTP y guards por rol.
- Galería, búsqueda y detalle dinámico de libros.
- Dashboard y CRUD administrativo con carga de portadas.
- Puntuaciones persistentes y afinidad entre lectores.
- Diseño adaptable a escritorio y móvil con base visual Sneat.
