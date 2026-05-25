# Smart Mock UI

![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?logo=typescript&logoColor=white)

Демо-фронт для [smart-mock-api](https://github.com/gatzxx/smart-mock-api): users, loading skeleton, error + retry.

## Live Demo

**https://smart-mock-ui.vercel.app**

API: https://smart-mock-api.onrender.com/api/users

## Что показывает

- Fetch users через TanStack Query
- **Loading** - skeleton (на mock-api: `RESPONSE_DELAY_MS=1000`)
- **Error** - сообщение + кнопка «Повторить»
- **Empty** - если API вернул пустой массив

## Локальный запуск

```bash
# Терминал 1 - mock-api
git clone https://github.com/gatzxx/smart-mock-api.git
cd smart-mock-api && cp .env.example .env && npm install && npm run dev

# Терминал 2 - UI
cp .env.example .env
npm install && npm run dev
```

http://localhost:5173 · mock: http://localhost:3000

| Переменная | Значение |
|------------|----------|
| `VITE_API_URL` | `http://localhost:3000` |

## Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npm run check` | typecheck + test |

## Связанные репозитории

- [smart-mock-api](https://github.com/gatzxx/smart-mock-api) - schema-driven mock

## Стек

Vite · React 19 · TypeScript · TanStack Query · Vitest · Testing Library

## Лицензия

MIT
