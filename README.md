
# Peru Scooter Parts - Tienda en Línea

Bienvenido al repositorio de Peru Scooter Parts, una tienda en línea especializada en la venta de repuestos y accesorios para scooters. Este proyecto es una aplicación web completa que incluye un frontend desarrollado con React y TypeScript, y un backend construido con Node.js, Express y MongoDB.

## Tabla de Contenidos
- [Peru Scooter Parts - Tienda en Línea](#peru-scooter-parts---tienda-en-línea)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
    - [Clonar el Repositorio](#clonar-el-repositorio)
    - [Instalar Dependencias](#instalar-dependencias)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
  - [Configuración](#configuración)
    - [Backend](#backend-2)
    - [Frontend](#frontend-2)
  - [Ejecución del Proyecto](#ejecución-del-proyecto)
    - [Backend](#backend-3)
    - [Frontend](#frontend-3)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Guía de Uso](#guía-de-uso)
    - [Registro e Inicio de Sesión](#registro-e-inicio-de-sesión)
    - [Navegación de Productos](#navegación-de-productos)
    - [Carrito de Compras](#carrito-de-compras)
    - [Procesamiento de Pagos](#procesamiento-de-pagos)
    - [Chat de Soporte](#chat-de-soporte)
    - [Perfil de Usuario](#perfil-de-usuario)
  - [Autenticación OAuth con Google y GitHub](#autenticación-oauth-con-google-y-github)
  - [Integración de Pagos con Stripe](#integración-de-pagos-con-stripe)
  - [Contribuciones](#contribuciones)
  - [Licencia](#licencia)

## Características
- **Catálogo de Productos**: Visualización de productos con imágenes, descripciones y precios.
- **Carrito de Compras**: Añade productos al carrito y gestiona las cantidades.
- **Lista de Deseos**: Guarda productos en tu lista de deseos para futuras compras.
- **Autenticación**: Registro e inicio de sesión con email y contraseña.
- **Autenticación Social**: Inicia sesión con Google o GitHub.
- **Soporte en Tiempo Real**: Chat en vivo con soporte utilizando Socket.io y OpenAI.
- **Modo Oscuro/Claro**: Alterna entre temas claro y oscuro.
- **Procesamiento de Pagos**: Integración con Stripe para pagos seguros.
- **Perfil de Usuario**: Visualiza y gestiona tu información personal y pedidos.

## Tecnologías Utilizadas
### Frontend
- React con TypeScript
- React Router DOM
- Tailwind CSS para estilos
- Axios para peticiones HTTP
- Context API para manejo de estados globales
- Socket.io Client para chat en tiempo real
- Stripe.js y React Stripe.js para pagos

### Backend
- Node.js y Express
- MongoDB con Mongoose
- TypeScript
- Passport.js para autenticación
- Socket.io para chat en tiempo real
- OpenAI API para respuestas automatizadas en el chat
- Stripe API para procesamiento de pagos

## Requisitos Previos
- Node.js (versión 14 o superior)
- npm o yarn
- MongoDB instalado o una instancia en la nube (por ejemplo, MongoDB Atlas)
- Cuenta de Stripe y claves API
- Cuenta de Google y GitHub para OAuth
- Clave API de OpenAI

## Instalación
### Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/peru-scooter-parts.git
cd peru-scooter-parts
```

### Instalar Dependencias
#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

## Configuración
### Backend
Crea un archivo `.env` en la carpeta backend con las siguientes variables de entorno:

```env
PORT=5000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
SESSION_SECRET=tu_secreto_de_sesión

# Claves de OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Claves de Stripe
STRIPE_SECRET_KEY=tu_clave_secreta_de_stripe
STRIPE_WEBHOOK_SECRET=tu_secreto_de_webhook_de_stripe

# Clave de OpenAI
OPENAI_API_KEY=tu_clave_de_api_de_openai
```

### Frontend
Crea un archivo `.env` en la carpeta frontend con las siguientes variables:

```env
REACT_APP_STRIPE_PUBLIC_KEY=tu_clave_publicable_de_stripe
```

## Ejecución del Proyecto
### Backend
```bash
cd backend
npm run dev
```
El servidor backend estará ejecutándose en `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm start
```
La aplicación frontend estará disponible en `http://localhost:3000`.

## Estructura del Proyecto
```lua
peru-scooter-parts/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── index.css
    ├── package.json
    └── tsconfig.json
```

## Guía de Uso
### Registro e Inicio de Sesión
- Regístrate con tu correo electrónico y contraseña.
- O inicia sesión usando tu cuenta de Google o GitHub.

### Navegación de Productos
- Explora los productos disponibles en la página de inicio o en la sección de productos.
- Haz clic en un producto para ver detalles adicionales.

### Carrito de Compras
- Añade productos al carrito desde la página de detalles del producto.
- Visualiza y gestiona los productos en tu carrito desde la página del carrito.

### Procesamiento de Pagos
- En el carrito, procede al checkout.
- Proporciona la información de tu tarjeta y completa el pago.
- Después del pago exitoso, serás redirigido a una página de agradecimiento.

### Chat de Soporte
- Utiliza el chat de soporte en tiempo real haciendo clic en el ícono de chat en la esquina inferior izquierda.
- Comunícate con soporte y recibe respuestas automatizadas.

### Perfil de Usuario
- Accede a tu perfil para ver tus datos y el historial de pedidos.

## Autenticación OAuth con Google y GitHub
La aplicación permite a los usuarios iniciar sesión utilizando sus cuentas de Google o GitHub.

## Integración de Pagos con Stripe
La aplicación utiliza Stripe para procesar pagos de manera segura.

## Contribuciones
¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tu función o corrección de errores (`git checkout -b feature/nueva-funcion`).
3. Realiza tus cambios y haz commits descriptivos.
4. Envía una solicitud de pull para revisión.

## Licencia
Este proyecto está bajo la licencia MIT.
