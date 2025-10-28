#!/bin/bash

# Очистка и перезапуск dev сервера
echo "🧹 Очистка кэша..."

# Остановка всех процессов
pkill -f "vite\|nodemon\|concurrently" 2>/dev/null || true

# Очистка кэша
rm -rf client/node_modules/.vite
rm -rf client/dist
rm -rf server/dist

# Очистка npm кэша
npm cache clean --force 2>/dev/null || true
cd client && npm cache clean --force 2>/dev/null || true
cd ../server && npm cache clean --force 2>/dev/null || true
cd ..

echo "✅ Кэш очищен"
echo "🚀 Запуск dev сервера..."

# Запуск с чистой конфигурацией
npm run dev
