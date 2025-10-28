#!/bin/bash

echo "🚀 Запуск Portal S Development Server"
echo "======================================"

# Проверка и остановка существующих процессов
echo "🛑 Остановка существующих процессов..."
pkill -f "vite|nodemon|concurrently" 2>/dev/null || true
sleep 2

# Проверка, что процессы остановлены
if pgrep -f "vite|nodemon" > /dev/null; then
    echo "❌ Не удалось остановить все процессы. Попробуйте:"
    echo "   sudo pkill -f 'vite|nodemon'"
    exit 1
fi

echo "✅ Процессы остановлены"

# Очистка кэша
echo "🧹 Очистка кэша..."
rm -rf client/node_modules/.vite
rm -rf client/dist
rm -rf server/dist

echo "✅ Кэш очищен"

# Проверка портов
echo "🔍 Проверка портов..."
if lsof -ti:5173 > /dev/null; then
    echo "⚠️  Порт 5173 занят. Освобождаем..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

if lsof -ti:3000 > /dev/null; then
    echo "⚠️  Порт 3000 занят. Освобождаем..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

echo "✅ Порты свободны"

# Запуск сервера
echo "🚀 Запуск сервера..."
npm run dev &

# Ожидание запуска
echo "⏳ Ожидание запуска серверов..."
sleep 5

# Проверка статуса
echo "📊 Статус серверов:"
echo "Client (Vite): http://localhost:5173"
echo "Server (Node): http://localhost:3000"
echo ""
echo "🔧 Для отладки горячей перезагрузки:"
echo "1. Откройте DevTools (F12)"
echo "2. Network → Disable cache"
echo "3. Application → Storage → Clear storage"
echo ""
echo "📝 Логи сервера выше. Для остановки нажмите Ctrl+C"
