# Production Dockerfile для Portal S
FROM node:18-alpine

# Установка необходимых пакетов
RUN apk add --no-cache git

# Рабочая директория
WORKDIR /app

# Копируем package.json файлы для установки зависимостей
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Устанавливаем зависимости
RUN npm ci --only=production && \
    cd client && npm ci && \
    cd ../server && npm ci

# Копируем исходный код
COPY . .

# Собираем клиент для продакшена с production конфигурацией
RUN cd client && npm run build -- --config vite.config.prod.js

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose порт
EXPOSE 3000

# Команда для запуска
CMD ["npm", "start"]
