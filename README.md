# Gaba Backend - Promo Codes API

REST API для системы промокодов: создание/удаление/просмотр промокодов и активация промокода по email.

## Стек

- Node.js + TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Docker

## Запуск

1. Запустите PostgreSQL:
   ```bash
   pnpm docker:up
   ```

2. Подготовьте переменные окружения:
   ```bash
   cp .env.example .env
   ```

3. Установите зависимости:
   ```bash
   pnpm install
   ```

4. Сгенерируйте Prisma Client и примените схему в БД:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate:dev
   ```

5. Запустите API:
   ```bash
   pnpm start:dev
   ```

API будет доступно по адресу `http://localhost:3000`.

## Endpoints

### CRUD промокодов

1. Создать промокод
   ```http
   POST /promo-codes
   ```
   Body:
   ```json
   {
     "code": "WELCOME10",
     "discountPercent": 10,
     "activationLimit": 100,
     "expiresAt": "2030-12-31T00:00:00.000Z"
   }
   ```
   Response:
   ```json
   {
     "id": "...",
     "code": "WELCOME10",
     "discountPercent": 10,
     "activationLimit": 100,
     "expiresAt": "2030-12-31T00:00:00.000Z",
     "createdAt": "...",
     "updatedAt": "..."
   }

2. Список промокодов
   ```http
   GET /promo-codes?limit=20&offset=0
   ```

3. Получить промокод по `id`
   ```http
   GET /promo-codes/:id
   ```

4. Удалить промокод
   ```http
   DELETE /promo-codes/:id
   ```

### Активация промокода по email (через `User`)

Каждый `email` соответствует одному `User`, и этот `User` может активировать конкретный промокод только один раз,
а также нельзя активировать промокод сверх лимита.

```http
POST /promo-codes/activate
```

Body:
```json
{
  "email": "user@example.com",
  "code": "WELCOME10"
}
```

Response:
```json
{
  "promoCode": {
    "id": "...",
    "code": "WELCOME10",
    "discountPercent": 10,
    "activationLimit": 100,
    "expiresAt": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "activation": {
    "promoCodeId": "...",
    "userId": "...",
    "createdAt": "..."
  },
  "user": {
    "id": "...",
    "email": "user@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### CRUD пользователей

Email уникален. Активация промокода использует `email` для получения/создания `User` и привязывает активацию к `userId`.

- `POST /users`
- `GET /users?limit=20&offset=0`
- `GET /users/:id`
- `DELETE /users/:id`



