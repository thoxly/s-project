# Portal S - DevOps Guide

## 🏗️ Архитектура системы Portal S

### 📋 Общий обзор

Portal S - это корпоративный портал, состоящий из React фронтенда и Node.js бэкенда, доступный через публичные туннели TUNA.

### 🔧 Компоненты системы

#### 1. **Frontend (React + Vite)**

- **Порт**: 5173
- **Технологии**: React 18, Material-UI, React Router
- **Конфигурация**: Vite с отключенным HMR для совместимости с туннелем
- **Хост**: `0.0.0.0` (принимает внешние подключения)

#### 2. **Backend (Node.js + Express)**

- **Порт**: 3000
- **Технологии**: Express, MongoDB
- **API**: RESTful endpoints с CORS для всех доменов
- **База данных**: MongoDB с fallback на mock данные

#### 3. **Туннели TUNA**

- **Frontend туннель**: `https://surius.ru.tuna.am` → `localhost:5173`
- **API туннель**: `https://api-surius.ru.tuna.am` → `localhost:3000`

### 🌐 Схема работы

```
Пользователь → https://surius.ru.tuna.am → TUNA Tunnel → Vite Dev Server (5173) → Backend API (3000)
Внешние системы → https://api-surius.ru.tuna.am → TUNA Tunnel → Backend API (3000)
```

### 📁 Структура проекта

```
/Users/shoxy/s-project/
├── client/                    # React фронтенд
│   ├── src/
│   │   ├── components/       # UI компоненты
│   │   ├── pages/           # Страницы приложения
│   │   ├── hooks/           # React хуки
│   │   ├── store/           # Глобальное состояние
│   │   └── mock/            # Mock данные
│   ├── vite.config.js       # Конфигурация Vite
│   └── package.json
├── server/                   # Node.js бэкенд
│   ├── src/
│   │   ├── routes/          # API маршруты
│   │   └── index.js         # Главный файл сервера
│   └── package.json
├── start-with-custom-domain.sh  # Скрипт запуска с туннелями
├── .env                     # Переменные окружения
└── docker-compose.yml       # Docker конфигурация (альтернативный запуск)
```

## 🚀 Процесс запуска

### Через туннели (основной способ):

```bash
./start-with-custom-domain.sh
```

**Что происходит:**

1. Проверка и освобождение портов 3000, 5173, 4040, 4041
2. Запуск backend сервера на порту 3000
3. Запуск frontend сервера на порту 5173
4. Создание туннелей TUNA:
   - Frontend: `surius.ru.tuna.am` → `localhost:5173`
   - API: `api-surius.ru.tuna.am` → `localhost:3000`

### Через Docker (альтернативный способ):

```bash
docker compose up -d
```

## ⚙️ Конфигурация

### Vite (Frontend)

```javascript
server: {
  port: 5173,
  host: '0.0.0.0',           // Внешние подключения
  hmr: false,                 // Отключен для туннеля
  allowedHosts: ['.ru.tuna.am', 'all'],
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### Express (Backend)

```javascript
// CORS настроен для всех доменов
app.use(
  cors({
    origin: ["https://surius.ru.tuna.am", "https://api-surius.ru.tuna.am"],
    credentials: true,
  })
);
```

## 🔌 API Endpoints

### Основные:

- `GET /api/health` - Проверка состояния
- `GET /api/users` - Список пользователей
- `POST /api/webhooks` - Webhook endpoint

### Доступ через туннели:

- **Frontend**: `https://surius.ru.tuna.am/api/*`
- **Прямой API**: `https://api-surius.ru.tuna.am/api/*`

## 📊 Мониторинг и логи

### Логи туннелей:

```
INFO[09:36:02] GET / – 200 OK
INFO[09:36:02] GET /src/main.jsx – 200 OK
INFO[09:36:03] GET /api/health – 200 OK
```

### Статус сервисов:

- Backend: `http://localhost:3000/api/health`
- Frontend: `http://localhost:5173`
- TUNA Web Interface: `http://127.0.0.1:4040`

## 🛠️ Переменные окружения

```bash
# .env
TUNA_TOKEN=tt_x5q44rjthm9voo8gdgbvsxf8rtyigzqn
PORT=3000
NODE_ENV=production
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
CLIENT_URL=https://surius.ru.tuna.am
API_URL=https://api-surius.ru.tuna.am
```

## 🔄 Процессы и порты

### Активные процессы:

```bash
node src/index.js              # Backend (PID: 47793)
node vite                      # Frontend (PID: 47822)
tuna http 3000 --domain=api-surius.ru.tuna.am  # API туннель
tuna http 5173 --domain=surius.ru.tuna.am       # Frontend туннель
```

### Порты:

- **3000**: Backend API
- **5173**: Frontend Dev Server
- **4040/4041**: TUNA Web Interface

## 🚨 Устранение проблем

### Белый экран:

- Проверить статус туннелей
- Очистить кэш Vite: `rm -rf node_modules/.vite`
- Перезапустить сервисы

### WebSocket ошибки:

- HMR отключен в `vite.config.js`
- Туннели не поддерживают WebSocket

### Material-UI ошибки:

- Переустановить зависимости: `npm install`
- Очистить кэш браузера

## 📈 Производительность

### Оптимизации:

- Vite для быстрой разработки
- Отключен HMR для стабильности
- Прокси API через фронтенд
- Mock данные для fallback

### Мониторинг:

- Логи TUNA в реальном времени
- Health checks для всех сервисов
- Статус туннелей через Web Interface

## 🔐 Безопасность

- HTTPS через туннели TUNA
- CORS настроен для конкретных доменов
- Токен TUNA в переменных окружения
- MongoDB с аутентификацией

## 🛠️ Команды для девопса

### Запуск системы:

```bash
cd /Users/shoxy/s-project
./start-with-custom-domain.sh
```

### Остановка системы:

```bash
# Нажать Ctrl+C в терминале или:
pkill -f "tuna.*http"
pkill -f "node.*src/index"
pkill -f vite
```

### Проверка статуса:

```bash
# Проверить процессы
ps aux | grep -E "(tuna|node.*src/index|vite)" | grep -v grep

# Проверить порты
lsof -i :3000
lsof -i :5173

# Проверить доступность
curl https://surius.ru.tuna.am
curl https://api-surius.ru.tuna.am/api/health
```

### Очистка и перезапуск:

```bash
# Остановить все
pkill -f "tuna.*http" && pkill -f "node.*src/index" && pkill -f vite

# Очистить кэш
cd client && rm -rf node_modules/.vite && rm -rf dist

# Перезапустить
cd .. && ./start-with-custom-domain.sh
```

### Docker альтернатива:

```bash
# Запуск через Docker
docker compose up -d

# Остановка Docker
docker compose down

# Пересборка
docker compose build --no-cache
```

## 📝 Логи и отладка

### Просмотр логов:

```bash
# Логи туннелей (в терминале запуска)
# Логи backend
tail -f server/logs/app.log

# Логи frontend (в терминале Vite)
```

### Отладка проблем:

1. Проверить статус всех процессов
2. Проверить доступность портов
3. Проверить логи туннелей
4. Очистить кэш и перезапустить

## 🔄 Обновление системы

### Обновление зависимостей:

```bash
# Frontend
cd client && npm update

# Backend
cd server && npm update

# Перезапуск
cd .. && ./start-with-custom-domain.sh
```

### Обновление TUNA:

```bash
# Проверить версию
tuna version

# Обновить (если нужно)
# Следуйте инструкциям из логов
```

---

**Примечание**: Эта система обеспечивает публичный доступ к локальному приложению через безопасные туннели с автоматическим SSL и доменными именами. Все изменения в коде автоматически применяются благодаря горячей перезагрузке Vite.
