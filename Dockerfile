# Dockerfile
# 1. Construcción del frontend
FROM node:18-alpine as build-frontend
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

# 2. Construcción del backend
FROM node:18-alpine as build-backend
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./
RUN npm run build

# 3. Crear la imagen final que combina el frontend y el backend
FROM node:18-alpine
WORKDIR /app

# Copiar el backend ya compilado
COPY --from=build-backend /app/backend/dist ./dist

# Crear el directorio `public` y copiar el build del frontend
RUN mkdir -p /app/public
COPY --from=build-frontend /app/frontend/build /app/build

# Después de copiar el build del frontend, agrega esto:
RUN ls -la /app/build

# Copiar `package.json` y `package-lock.json` del backend para instalar dependencias de producción
COPY ./backend/package*.json ./
RUN npm install --production

# Exponer el puerto 5000 para el servidor Express
EXPOSE 5000

# Iniciar la aplicación con `node`
CMD ["node", "dist/index.js"]
