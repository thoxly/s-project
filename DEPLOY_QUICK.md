# 🚀 Быстрая шпаргалка для девопса

## Обновление на сервере (3 команды):

```bash
cd /path/to/s-project
git pull origin main
docker compose up -d --build
```

## Проверка:

```bash
docker compose ps
docker compose logs -f
curl http://localhost/api/health
```

## Если проблемы:

```bash
docker compose down
docker compose up -d --build
docker compose logs -f backend
```

## TUNA версия (для демо):

```bash
git pull origin main
./start-with-custom-domain.sh
```

---
Полная инструкция: DEPLOY_INSTRUCTIONS.md
