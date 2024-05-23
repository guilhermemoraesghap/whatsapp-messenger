# Usar uma imagem base do Node.js
FROM node:16-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json (se disponível)
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código do projeto
COPY . .

# Gerar o cliente Prisma
RUN npx prisma generate

# Compilar o projeto TypeScript
RUN npm run build

# Definir o comando padrão para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
