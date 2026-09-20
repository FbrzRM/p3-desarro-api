# backend/Dockerfile
# Imagen de desarrollo para el backend (Express + TypeScript + tsx).
FROM node:24-alpine

WORKDIR /app

# Instala dependencias primero (mejor uso de la caché de capas de Docker).
COPY package*.json ./
RUN npm install

# Copia el código fuente.
COPY . .

# El backend escucha en el puerto 3000.
EXPOSE 3000

# Modo desarrollo con recarga en caliente (Hot Reload) vía tsx watch.
CMD ["npm", "run", "dev"]
