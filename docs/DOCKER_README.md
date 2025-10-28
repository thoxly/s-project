# Portal S - Docker Deployment Guide

Простой и быстрый способ развертывания проекта Portal S на сервере.

## 🚀 Быстрый запуск на сервере

### Предварительные требования

- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)

### 1. Подготовка

```bash
# Клонируем репозиторий
git clone https://github.com/thoxly/s-project.git
cd s-project

# Копируем конфигурацию окружения
cp .env.docker .env

# Редактируем переменные окружения
nano .env
```

### 2. Запуск проекта

#### Вариант 1: С Tuna туннелями (рекомендуется)

```bash
# Запуск проекта с Docker + Tuna туннелем
./scripts/start-with-tunnel.sh
```

#### Вариант 2: Только Docker (без туннелей)

```bash
# Сборка и запуск всех сервисов
docker compose up -d --build

# Просмотр логов
docker compose logs -f

# Остановка
docker compose down
```

#### Вариант 3: Docker + Tuna в контейнере

```bash
# Запуск с Tuna туннелем в Docker
docker compose --profile tunnel up -d --build
```

## 🔧 Конфигурация

### Переменные окружения

Основные переменные в файле `.env`:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123

# ELMA365 Integration
ELMA_API_URL=https://your-elma-instance.elma365.ru/
ELMA_TOKEN=your-elma-token
ELMA_SECRET_KEY=your-secret-key

# CORS (Tuna domains)
CLIENT_URL=https://surius.ru.tuna.am
API_URL=https://api-surius.ru.tuna.am

# Tuna Tunnel
TUNA_TOKEN=your-tuna-token
```

### Порты

- **Nginx**: 80 (HTTP)
- **Backend API**: 3000 (внутренний)
- **MongoDB**: 27017 (внутренний)

## 🌐 Внешний доступ

Проект настроен для работы с Tuna туннелями:

- **Frontend**: `https://surius.ru.tuna.am`
- **API**: `https://api-surius.ru.tuna.am`
- **Health Check**: `https://api-surius.ru.tuna.am/api/health`

### Локальный доступ (для разработки):

- **Frontend**: `http://localhost:5173`
- **API**: `http://localhost:3000`

### Обновление проекта

```bash
# Остановка контейнеров
docker-compose down

# Пересборка и запуск
docker-compose up -d --build

# Или только перезапуск
docker-compose restart
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f mongodb
```

## 🗄️ База данных

### Подключение к MongoDB

```bash
# Через Docker
docker exec -it portal-s-mongodb mongosh -u admin -p password123

# Или через внешний клиент
mongodb://admin:password123@localhost:27017/portal-s?authSource=admin
```

### Бэкап базы данных

```bash
# Создание бэкапа
docker exec portal-s-mongodb mongodump --username admin --password password123 --authenticationDatabase admin --db portal-s --out /data/backup

# Копирование бэкапа на хост
docker cp portal-s-mongodb:/data/backup ./mongodb-backup
```

## 🛠️ Полезные команды

### Управление контейнерами

```bash
# Просмотр статуса
docker-compose ps

# Перезапуск сервиса
docker-compose restart backend

# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes
docker-compose down -v
```

### Отладка

```bash
# Подключение к контейнеру
docker exec -it portal-s-backend sh

# Просмотр переменных окружения
docker-compose config

# Проверка здоровья сервисов
curl http://localhost/api/health
```

## 📁 Структура файлов

```
s-project/
├── Dockerfile                 # Dockerfile для продакшена
├── docker-compose.yml        # Конфигурация Docker Compose
├── .dockerignore            # Исключения для Docker
├── .env.docker              # Пример переменных окружения
├── nginx.conf               # Конфигурация Nginx
└── DOCKER_README.md         # Этот файл
```

## 🚨 Устранение неполадок

### Проблемы с портами

```bash
# Проверка занятых портов
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Остановка процессов на портах
sudo lsof -ti:80 | xargs kill -9
sudo lsof -ti:443 | xargs kill -9
```

### Проблемы с базой данных

```bash
# Проверка подключения к MongoDB
docker-compose logs mongodb

# Перезапуск MongoDB
docker-compose restart mongodb
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что порты 80 и 443 свободны
3. Проверьте переменные окружения в `.env`
4. Перезапустите контейнеры: `docker-compose restart`

## 🔐 Безопасность

### Обязательные настройки:

1. Измените пароли по умолчанию в `.env`
2. Ограничьте доступ к MongoDB
3. Настройте файрвол

### SSL сертификаты (опционально):

Если нужен HTTPS, раскомментируйте HTTPS секцию в `nginx.conf` и добавьте сертификаты:

```bash
# Создание папки для сертификатов
mkdir -p ssl

# Генерация самоподписанного сертификата (для тестирования)
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```
