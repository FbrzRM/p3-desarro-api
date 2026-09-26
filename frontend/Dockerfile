# frontend/Dockerfile
# Imagen de desarrollo para el frontend (Angular 17 + ng serve).
FROM node:24-alpine

WORKDIR /app

# Instala dependencias primero (mejor uso de la caché de capas de Docker).
COPY package*.json ./
RUN npm install

# Copia el código fuente.
COPY . .

# El servidor de desarrollo de Angular escucha en el puerto 4200.
EXPOSE 4200

# Modo desarrollo con recarga en caliente (Hot Reload) vía ng serve.
# --poll permite detectar cambios en volúmenes montados dentro de Docker.
CMD ["npm", "start"]
