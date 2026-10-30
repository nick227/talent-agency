# Talent / Agency — Project State

## Build Status

| Phase | Status |
|---|---|
| Phase 0 — Discovery | ✅ Complete |
| Phase 1 — Contract | ✅ Complete |
| Phase 2 — Server | ✅ Complete |
| Phase 3 — Frontend Shell | ✅ Complete |
| Phase 4 — Feature Pages | ✅ Complete |
| Phase 5 — Polish | ⏳ Pending bootstrap |
| Phase 6 — Documentation | ⏳ Pending |

## Stack

- **Monorepo**: PNPM workspaces
- **Web**: `apps/web` — Vite + React 18 + TypeScript + Tailwind CSS
- **API**: `apps/server` — Fastify + fastify-openapi-glue + TypeScript
- **Database**: `packages/db` — Prisma + MySQL
- **API Contract**: `packages/api-spec/openapi.yaml` — OpenAPI 3.1 YAML
- **SDK**: `packages/sdk` — openapi-fetch + React Query hooks
- **Deploy**: Railway (Dockerfile)

## Plugins Active

- `file-upload` — @fastify/multipart + @fastify/static, LocalStorageProvider (swap for R2 in prod)
- `railway` — Dockerfile + railway.json
- `quality-designer` — editorial-agency archetype, see docs/design-brief.md
- `smart-media` — MediaGallery, FileUpload, GalleryBrowser components
- `slideshow` — SlideShow (hero mode + gallery mode), Embla Carousel
- `animation` — FadeIn, SlideUp, StaggerList, PageTransition (Framer Motion)

## Design System

- **Archetype**: `stark-utility` — High-Contrast Minimalism
- **Theme**: Light only. White background, black borders.
- **Colors**: Background #FFFFFF · Foreground #1B1B1B · Border #000000 · Muted #EEEEEE
- **Typography**: Hanken Grotesk 800 (display) + Inter 400 (body) + JetBrains Mono 500 (labels)
- **Radius**: 0 — sharp everywhere, no rounded corners
- **Interaction**: Invert hover (bg becomes #000000, text becomes #FFFFFF). No shadows.
- **Cards**: Connected border grid (border-t border-l on container, border-b border-r on each card)
- **Images**: Grayscale headshots throughout
- **Forms**: Bottom-border-only inputs (underline style), JetBrains Mono uppercase labels
- See: `design/DESIGN.md`, `design/code.html`

## Auth

- httpOnly cookie session (no JWT)
- Admin creates performer accounts — no public registration
- `bearerAuth` security scheme → cookie token lookup
- `adminAuth` = bearerAuth + ADMIN role check

## Data Model

- `User` → `PerformerProfile` (1:1)
- `PerformerProfile` → `MediaItem[]` (ordered portfolio)
- `PerformerProfile` → `CastingInquiry[]`
- `Session` → token stored in DB, httpOnly cookie

## Routes

| Public | Auth required |
|---|---|
| GET /performers | GET /auth/me |
| GET /performers/:id | POST /auth/logout |
| POST /performers/:id/inquiries | GET /performers/me |
| POST /auth/login | POST /media/upload |
| — | DELETE /media/:key |
| — | /admin/* (ADMIN only) |

## Deviations from defaults

- No public user registration — admin creates performer accounts via `POST /admin/performers`
- No `/register` route in spec or handlers
- `GET /performers/me` uses Fastify's static route priority over `:performerId`
- `ContactPage` form is not wired to an API endpoint in V1 (noted in component)
- Admin panel uses sidebar shell, not top nav

## Seed Data (8 performers)

All seeded with `isPublished: true`. Featured (hero): Margaux Delacroix, Theo Vance, Inés Nakamura.

| Name | Category | Location |
|---|---|---|
| Margaux Delacroix | Model | Paris |
| Theo Vance | Actor | Los Angeles |
| Inés Nakamura | Dancer | New York |
| Rafferty Cole | Musician | London |
| Zola Mensah | Host | Lagos |
| Petra Wohl | Model | Berlin |
| Luca Ferraro | Actor | Milan |
| Sofía Reyes | Influencer | Mexico City |

Admin credentials: `admin@talent.agency` / `admin123`
Performer credentials: `<name>@talent.agency` / `performer123`

## Bootstrap

```bash
pnpm install
pnpm db:push
pnpm sdk:generate
pnpm db:seed
pnpm dev
```

Web: http://localhost:5173
API: http://localhost:3001
Admin: http://localhost:5173/login → admin@talent.agency / admin123

## Next Steps (Phase 5)

- [ ] Run `pnpm bootstrap` on fresh checkout
- [ ] Confirm both servers start cleanly
- [ ] Verify golden path in browser: home → talent → performer → inquiry
- [ ] Verify admin: login → add performer → upload headshot → publish
- [ ] `pnpm lint` clean
- [ ] `pnpm typecheck` clean
