# Portal S - ELMA365 Integration Demo

Демо-портал для компании "С", демонстрирующий возможности интеграции ELMA365 + React/Node для внутренних процессов организации.

## 🚀 Быстрый запуск

```bash
# 1. Установка зависимостей
npm run install:all

# 2. Настройка .env файла (добавьте TUNA_TOKEN)
# 3. Запуск с вашим доменом
npm run tuna:domain
```

**Результат**:

- Frontend: `https://surius.ru.tuna.am`
- API: `https://api-surius.ru.tuna.am`

## Архитектура

- **Frontend**: React 18 + Vite + MUI + React Router
- **Backend**: Node.js + Express + MongoDB
- **Integration**: REST API ELMA365
- **Tunnels**: Tuna для публичного доступа
- **API для внешних систем**: Отдельный домен для webhook'ов

## Структура проекта

```
portal-s/
├── client/          # React frontend
├── server/          # Express backend
├── docs/            # Documentation
├── start-with-custom-domain.sh     # Скрипт для TUNA туннелей
├── test-webhook.js                 # Тестирование webhook'ов
└── .env             # Environment variables
```

## Быстрый старт

### 1. Установка зависимостей

```bash
# Все зависимости одной командой
npm run install:all
```

### 2. Настройка окружения

#### MongoDB
```bash
# Запуск MongoDB (если не запущен)
brew services start mongodb-community

# Проверка подключения
mongosh --eval "db.runCommand('ping')"
```

#### Переменные окружения
Настройте переменные окружения в `.env`:

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portal-s
ELMA_API_URL=https://your-elma-instance.elma365.com/api
ELMA_TOKEN=your-elma-token-here
TUNA_TOKEN=your-tuna-token-here
```

### 3. Запуск в режиме разработки

#### Локальная разработка

```bash
# Запуск фронта и бэка одновременно
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

#### Публичный доступ через Tuna Tunnels

```bash
# Запуск с TUNA туннелями
npm run tuna:domain
```

## 🌍 Публичный доступ через Tuna Tunnels

Для демонстрации проекта используется Tuna для создания публичных HTTPS-доменов.

### Запуск проекта

```bash
# Запуск с TUNA туннелями
npm run tuna:domain
```

**Результат**:

- Frontend: `https://surius.ru.tuna.am`
- API: `https://api-surius.ru.tuna.am`

### Дополнительные команды

```bash
# Проверка статуса туннелей
npm run tuna:status

# Тестирование webhook'ов
npm run test:webhook

# Сборка для продакшена
npm run build
```

### Требования

- **tuna**: Установите с https://tuna.yuccastream.com/
- **TUNA_TOKEN**: Настройте в `.env` файле
- **Домены в Tuna**: Создайте в админке Tuna:
  - `surius.ru.tuna.am` (для фронтенда)
  - `api-surius.ru.tuna.am` (для API)
- **Интернет-соединение**: Для подключения к Tuna
- **Порты 3000, 5173**: Должны быть свободны

### Особенности

- ✅ **Постоянный домен**: `surius.ru.tuna.am`
- ✅ **HTTPS**: Автоматические SSL-сертификаты
- ✅ **Неограниченное время**: Работает пока запущен скрипт
- ✅ **Простота**: Один скрипт для запуска

## 🔌 Внешние интеграции

Проект поддерживает получение webhook'ов от внешних систем через отдельный API домен.

### Webhook endpoints

- `POST https://api-surius.ru.tuna.am/api/webhooks` - Общий webhook
- `POST https://api-surius.ru.tuna.am/api/webhooks/:system` - Webhook для конкретной системы

### Примеры использования

```bash
# Тест webhook
curl -X POST https://api-surius.ru.tuna.am/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{"type": "user.created", "data": {"id": 123, "name": "John"}}'

# Тестирование через npm
npm run test:webhook
```

## Функциональные блоки

- **E1**: Инфраструктура и окружение ✅
- **E2**: Главная страница (Dashboard)
- **E3**: Личный кабинет сотрудника
- **E4**: Интеграция с ELMA365
- **E5**: Сервис заявок (каталог услуг)
- **E6**: Организационная структура
- **E7**: База знаний
- **E8**: UI-полировка и контент
- **E9**: Деплой и демонстрация
- **E10**: ELMA365 — приложения, процесс "Консультация / неисправность ПО"?, интеграция с Node API

## Технические требования

- Node.js 18+
- MongoDB 6+ (опционально, есть mock режим)
- npm или yarn
- tuna (для публичного доступа)

## 📚 Документация

- [Tuna Tunnels](TUNA_README.md) - Подробная документация по туннелям
- [Стиль кода](docs/STYLE_GUIDE.md) - Руководство по стилю кода
- [Контекст проекта](docs/PROJECT_CONTEXT.md) - Описание проекта
