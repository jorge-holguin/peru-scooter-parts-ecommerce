# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build-frontend

WORKDIR /app/frontend

# Copiar archivos de configuración del frontend (package.json y lock files)
COPY ./frontend/package*.json ./
RUN npm install

# Copiar el resto de los archivos del frontend y construir
COPY ./frontend ./
RUN npm run build

# Etapa 2: Construcción y configuración del backend
FROM node:18-alpine AS build-backend

WORKDIR /app/backend

# Copiar archivos de configuración del backend (package.json y lock files)
COPY ./backend/package*.json ./
RUN npm install

# Copiar el resto de los archivos del backend y compilar
COPY ./backend ./
RUN npm run build

# Etapa 3: Imagen final para producción
FROM node:18-alpine

WORKDIR /app

# Copiar el backend compilado desde la etapa `build-backend`
COPY --from=build-backend /app/backend/dist ./dist

# Crear el directorio público y copiar el frontend construido desde la etapa `build-frontend`
RUN mkdir -p /app/public
COPY --from=build-frontend /app/frontend/dist /app/public

# Copiar `package.json` y `package-lock.json` del backend para instalar dependencias de producción
COPY ./backend/package*.json ./
RUN npm install --only=production

# Exponer el puerto del backend (puerto predeterminado 5000)
EXPOSE 5000

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/index.js"]
