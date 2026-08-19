# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Si tu build requiere variables de entorno públicas de Vite, puedes declararlas aquí con ARG/ENV
RUN npm run build

# Etapa 2: Servidor Web con Nginx para Producción
FROM nginx:alpine
# Copiamos los archivos compilados desde la etapa anterior al directorio público de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 por defecto de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]