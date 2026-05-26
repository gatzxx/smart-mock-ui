# Smart Mock UI

![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?logo=typescript&logoColor=white)

Демо admin-panel для [smart-mock-api](https://github.com/gatzxx/smart-mock-api): dashboard, routing, sortable tables, detail pages, meta API.

## Live Demo

**[Открыть demo →](https://smart-mock-ui.vercel.app)**

| Ресурс | URL |
|--------|-----|
| Dashboard | https://smart-mock-ui.vercel.app/ |
| API users | https://smart-mock-api.onrender.com/api/users |
| Meta | https://smart-mock-api.onrender.com/__meta |

![Dashboard demo](docs/demo.png)

> Скриншот статичный. Актуальная версия всегда на live-ссылке выше.

## Страницы

| Маршрут | Описание |
|---------|----------|
| `/` | Dashboard: KPI, health API, ссылки на разделы |
| `/users` | Список пользователей, поиск, sort + pagination |
| `/users/:id` | Профиль: avatar, phone, bio, breadcrumbs |
| `/products` | Список товаров, badge наличия, поиск, sort + pagination |
| `/products/:id` | Карточка товара, breadcrumbs |
| `/meta` | Discovery-эндпoинты mock-api |
| `*` | Страница 404 |

## UX-состояния (на каждой data-странице)

- **Loading** - skeleton (`RESPONSE_DELAY_MS=1000` на mock-api)
- **Error** - alert + «Повторить» + toast при успешном refetch
- **Empty** - card при пустом массиве
- **Search empty** - «Ничего не найдено» при фильтре
- **Theme** - light/dark toggle, сохранение в localStorage
- **API Activity** - лог запросов UI к mock-api (status, latency)

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

Vite · React 19 · TypeScript · TanStack Query · TanStack Table · React Router · shadcn/ui · Tailwind · sonner · Vitest

## Лицензия

MIT
