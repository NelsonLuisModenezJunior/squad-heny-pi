# Base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar apenas package.json e lockfile para cache
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar todo o código
COPY . .

# Expor porta
EXPOSE 3000

# Comando padrão
CMD ["pnpm", "run", "dev", "-H", "0.0.0.0", "-p", "3000"]
