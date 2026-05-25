# Smart Mock UI

![React](https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?logo=typescript&logoColor=white)

Demo admin-panel for [smart-mock-api](https://github.com/gatzxx/smart-mock-api): routing, two entities, async UX states.

## Live Demo

**https://smart-mock-ui.vercel.app**

| Resource | API |
|----------|-----|
| Users | https://smart-mock-api.onrender.com/api/users |
| Products | https://smart-mock-api.onrender.com/api/products |

## Pages

| Route | Description |
|-------|-------------|
| `/users` | User list (shadcn Table, link to detail) |
| `/users/:id` | User profile card (avatar, phone, bio) |
| `/products` | Product list with stock badges |

## UX states (each page)

- **Loading** - skeleton (set `RESPONSE_DELAY_MS=1000` on mock-api)
- **Error** - alert + retry button
- **Empty** - card when API returns `[]`

## Local run

```bash
# Terminal 1 - mock-api
git clone https://github.com/gatzxx/smart-mock-api.git
cd smart-mock-api && cp .env.example .env && npm install && npm run dev

# Terminal 2 - UI
cp .env.example .env
npm install && npm run dev
```

http://localhost:5173 · API: http://localhost:3000

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `http://localhost:3000` |

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run check` | typecheck + test |

## Related repos

- [smart-mock-api](https://github.com/gatzxx/smart-mock-api) - schema-driven mock

## Stack

Vite · React 19 · TypeScript · TanStack Query · React Router · shadcn/ui · Tailwind · Vitest

## License

MIT
