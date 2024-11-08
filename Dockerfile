# Etapa de build
FROM node:18-alpine AS build

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos de configuração do projeto
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código do frontend para o contêiner
COPY . .

# Compile o projeto para produção
RUN npm run build

# Etapa de produção
FROM nginx:stable-alpine

# Copie os arquivos buildados da etapa anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponha a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
