# Etapa 1: Construcción de la aplicación con Node.js
FROM node:18 AS build

WORKDIR /app

# Copiar solo los archivos esenciales para optimizar la caché de Docker
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . /app

# Compilar la aplicación con Vite
RUN npm run build

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine

# Copiar los archivos del build en Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
