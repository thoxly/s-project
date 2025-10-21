# Portal S - ELMA365 Integration Demo

Демо-портал для компании "С", демонстрирующий возможности интеграции ELMA365 + React/Node для внутренних процессов организации.

## Архитектура

- **Frontend**: React 18 + Vite + MUI + React Router
- **Backend**: Node.js + Express + MongoDB
- **Integration**: REST API ELMA365

## Структура проекта

```
portal-s/
├── client/          # React frontend
├── server/          # Express backend
├── nginx/           # Nginx configuration
├── docs/            # Documentation
└── .env             # Environment variables
```

## Быстрый старт

### 1. Установка зависимостей

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Настройка окружения

Скопируйте `.env` файл и настройте переменные окружения:

```bash
cp .env.example .env
```

### 3. Запуск в режиме разработки

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

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
- **E10**: ELMA365 — структура приложений
- **E11**: ELMA365 — процесс "Консультация / неисправность ПО"
- **E12**: ELMA365 — интеграция с Node API

## Технические требования

- Node.js 18+
- MongoDB 6+
- npm или yarn
