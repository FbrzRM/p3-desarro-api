# backend/Dockerfile
# Imagen de desarrollo para el backend (Express + TypeScript + tsx).
FROM node:24-alpine

WORKDIR /app

# Instala dependencias primero (mejor uso de la caché de capas de Docker).
# --legacy-peer-deps: el proyecto usa TypeScript 7 y ts-jest@29 declara un peer
# `typescript <7`; npm bloquearía la resolución sin esta bandera.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia el código fuente.
COPY . .

# El backend escucha en el puerto 3000.
EXPOSE 3000

# Modo desarrollo con recarga en caliente (Hot Reload) vía tsx watch.
CMD ["npm", "run", "dev"]
