# Usar una imagen base de Node.js
FROM node:18

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
COPY server.js ./
COPY frontend/build ./frontend/build
COPY routes ./routes
COPY models ./models

# Instalar dependencias
RUN npm install

# Exponer el puerto 8080
EXPOSE 8080

# Comando de inicio
CMD ["node", "server.js"]
