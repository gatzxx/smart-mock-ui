# Smart Mock UI

![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?logo=typescript&logoColor=white)

Демо admin-panel для [smart-mock-api](https://github.com/gatzxx/smart-mock-api): routing, две сущности, поиск, meta API.

## Live Demo

**https://smart-mock-ui.vercel.app**

| Ресурс | API |
|--------|-----|
| Пользователи | https://smart-mock-api.onrender.com/api/users |
| Товары | https://smart-mock-api.onrender.com/api/products |
| Meta | https://smart-mock-api.onrender.com/__meta |

## Страницы

| Маршрут | Описание |
|---------|----------|
| `/users` | Список пользователей, поиск, ссылка на карточку |
| `/users/:id` | Профиль: avatar, phone, bio, breadcrumbs |
| `/products` | Список товаров, badge наличия, поиск |
| `/meta` | Discovery-эндпoинты mock-api |
| `*` | Страница 404 |

## UX-состояния (на каждой data-странице)

- **Loading** - skeleton (`RESPONSE_DELAY_MS=1000` на mock-api)
- **Error** - alert + «Повторить»
- **Empty** - card при пустом массиве
- **Search empty** - «Ничего не найдено» при фильтре

## Локальный запуск

```bash
# Терминал 1 - mock-api
git clone https://github.com/gatzxx/smart-mock-api.git
cd smart-mock-api && cp .env.example .env && npm install && npm run dev

# Терминал 2 - UI
cp .env.example .env
npm install && npm run dev
```

http://localhost:5173 · API: http://localhost:3000

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

Vite · React 19 · TypeScript · TanStack Query · React Router · shadcn/ui · Tailwind · Vitest

## Лицензия

MIT
