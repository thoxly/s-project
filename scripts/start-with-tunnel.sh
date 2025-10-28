#!/bin/bash

# Portal S - Start with Tuna Tunnel
# Скрипт для запуска проекта с Tuna туннелем

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Portal S - Docker + Tuna${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Проверка наличия Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Пожалуйста, установите Docker и попробуйте снова."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose не установлен. Пожалуйста, установите Docker Compose и попробуйте снова."
        exit 1
    fi
}

# Проверка файла .env
check_env() {
    if [ ! -f .env ]; then
        print_warning "Файл .env не найден. Создаю из .env.docker..."
        cp .env.docker .env
        print_message "Файл .env создан. Пожалуйста, отредактируйте его при необходимости."
    fi
}

# Функция для очистки процессов
cleanup() {
    print_message "Остановка всех сервисов..."
    
    # Остановка Docker контейнеров
    docker compose down 2>/dev/null || true
    
    # Остановка Tuna процессов
    pkill -f tuna 2>/dev/null || true
    
    print_message "Все сервисы остановлены"
    exit 0
}

# Обработка сигналов
trap cleanup SIGINT SIGTERM

# Основная функция
main() {
    print_header
    
    check_docker
    check_env
    
    print_message "Запуск Docker контейнеров..."
    docker compose up -d --build
    
    print_message "Ожидание запуска сервисов..."
    sleep 10
    
    print_message "Запуск Tuna туннеля..."
    tuna http 80 --domain=surius.ru.tuna.am --token ${TUNA_TOKEN:-tt_x5q44rjthm9voo8gdgbvsxf8rtyigzqn} &
    TUNA_PID=$!
    
    print_message "Ожидание установки туннеля..."
    sleep 5
    
    print_message "🎉 Portal S запущен!"
    echo ""
    print_message "Доступные URL:"
    echo "  🌐 Frontend: https://surius.ru.tuna.am"
    echo "  🔌 API: https://surius.ru.tuna.am/api/health"
    echo "  📊 Локально: http://localhost"
    echo ""
    print_message "Полезные команды:"
    echo "  Просмотр логов: docker compose logs -f"
    echo "  Остановка: Ctrl+C"
    echo ""
    print_warning "Нажмите Ctrl+C для остановки всех сервисов"
    
    # Ожидание
    wait $TUNA_PID
}

# Запуск скрипта
main "$@"
