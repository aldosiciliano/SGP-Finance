FROM node:18-alpine

WORKDIR /app

# Copiar package files y instalar dependencias
COPY package.json ./
RUN npm install --no-optional

# Copiar código fuente
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
