# Base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar apenas package.json e lockfile para cache
COPY [pnpm-lock.yaml](http://_vscodecontentref_/4) [pnpm-lock.yaml](http://_vscodecontentref_/5)
COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY [package.json](http://_vscodecontentref_/6) ./

ENV CI=true

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar todo o código
COPY . .

# Expor porta
EXPOSE 3000

# Comando padrão
CMD ["pnpm", "run", "dev", "-H", "0.0.0.0", "-p", "3000"]
