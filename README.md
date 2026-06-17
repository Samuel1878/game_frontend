# TZ99 Player Frontend

Vue 3 + Vite + Pinia player-facing slot game PWA.

## Environment

Copy `.env.example` to `.env.local` for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_DEFAULT_CURRENCY=USD
VITE_DEFAULT_COUNTRY=MM
```

- `VITE_API_BASE_URL` points to `game_new_backend`.
- `VITE_SOCKET_URL` points to the Socket.IO host. Use the same value as the API host unless sockets are deployed separately.
- The default currency/country values are used only for provider game launch requests.

## Local Development

```bash
npm install
npm run dev
```

The dev server defaults to Vite's local URL. The backend must allow that origin in `CORS_ORIGIN`.

## Build

```bash
npm run build
```

The build runs `vue-tsc -b` first, then emits static assets into `dist/`.

## Preview

```bash
npm run preview
```

## Deploy

### Vercel

Set these project environment variables:

```env
VITE_API_BASE_URL=https://your-backend.example
VITE_SOCKET_URL=https://your-backend.example
VITE_DEFAULT_CURRENCY=USD
VITE_DEFAULT_COUNTRY=MM
```

Use the existing `vercel.json` SPA rewrite. Build command: `npm run build`. Output directory: `dist`.

### Static Hosting

Upload `dist/` to any static host and configure SPA fallback to `/index.html`.

## Backend Notes

The frontend currently uses implemented `game_new_backend` routes for:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/player/favorites`
- `POST /api/providers/:providerCode/launch`
- Socket.IO auth through `handshake.auth.token`

The new backend does not yet expose player business routes for deposit, withdraw, payment accounts, fund PIN, wallet profile/balance, game list/search, favorite mutations, promotions, or agent dashboard data. Those frontend services are intentionally left with their existing screen-level contract and can be remapped once backend routes are ready.

For production refresh cookies across domains, configure the backend with matching `CORS_ORIGIN`, `COOKIE_SECURE=true`, and an appropriate `COOKIE_SAME_SITE`/`COOKIE_DOMAIN`.
