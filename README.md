# Talent / Agency

A visual roster platform for a talent agency. Dark editorial aesthetic — performers browse publicly, casting directors submit inquiries, agents manage the roster from an admin panel.

## Stack

- **Web**: Vite + React + TypeScript + Tailwind CSS
- **API**: Fastify + fastify-openapi-glue
- **Database**: MySQL + Prisma
- **SDK**: openapi-fetch + React Query hooks (portable)

## Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env — set DATABASE_URL and SESSION_SECRET at minimum

# 2. Bootstrap (install, push schema, generate SDK types, seed)
pnpm bootstrap

# 3. Start development servers
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:3001
- API docs: http://localhost:3001/docs

## Default Credentials

After seeding:

| Role | Email | Password |
|---|---|---|
| Admin | admin@talent.agency | admin123 |
| Performer | margaux@talent.agency | performer123 |

## Project Structure

```
apps/
  web/          Vite + React frontend
  server/       Fastify API server
packages/
  api-spec/     OpenAPI 3.1 spec (source of truth)
  db/           Prisma schema + client
  sdk/          Typed API client + React Query hooks
```

## SDK Pipeline

The OpenAPI spec drives everything:

```
packages/api-spec/openapi.yaml
  → packages/sdk/src/generated/types.ts   (pnpm sdk:generate)
  → packages/sdk/src/client.ts            (openapi-fetch)
  → packages/sdk/src/hooks/              (React Query hooks)
  → apps/web/src/pages/                  (import from @talent/sdk)
```

To add a new route: edit the spec → regenerate types → add handler → add hook.

## Environment Variables

See `.env.example` for all variables. Key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `SESSION_SECRET` | Random secret for session signing |
| `STORAGE_PROVIDER` | `local` (default) or `r2` |
| `VITE_API_URL` | API URL for frontend (default: http://localhost:3001) |

## Deployment

Configured for Railway. Push to Railway with the included `Dockerfile` and `railway.json`.

For production, set `STORAGE_PROVIDER=r2` and add Cloudflare R2 credentials to environment variables.

## Media Storage

In development, uploads are stored locally in `apps/server/uploads/`.
In production, set `STORAGE_PROVIDER=r2` with `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, and `R2_PUBLIC_URL`.
