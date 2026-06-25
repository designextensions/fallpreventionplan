# Fall Prevention Plan (FallPreventionPlan.com)

A subscription membership platform that turns physical therapist Dr. Geoff Angell's "Fall Prevention Plan" into a digital, video-driven program for seniors (70+) and their adult children. Members get a self-paced program (Introduction, balance/falls overview, an interactive fall self-assessment, a 10-step personalized plan, fall-response guidance, and equipment/home-safety appendices), plus — on higher tiers — live classes, a recorded library, and concierge 1-on-1 support.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/fall-prevention run dev` — run the front end (Vite)
- `pnpm run typecheck` — full typecheck across all packages (run before declaring work done)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks + Zod from the OpenAPI spec (runs `typecheck:libs` after)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed modules, sessions, library, demo users, billing, concierge
- Required env: `DATABASE_URL` (Postgres). Optional: `PORT`, `ADMIN_EMAILS` (comma-separated; defaults to admin@fallpreventionplan.com)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Front end: React 19 + Vite, Tailwind + shadcn/ui, `wouter` routing, `@tanstack/react-query`, `react-hook-form` + Zod, `react-markdown`
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (React Query hooks + Zod) from the OpenAPI spec
- Build: esbuild (CJS bundle)

## Where things live

- **Front end:** `artifacts/fall-prevention` — pages in `src/pages` (home, about, pricing, contact, assessment, dashboard, modules/{index,show}, sessions, library, account/{index,checkout}, concierge, auth, admin/{index,courses,members,course-editor}). Routing in `src/App.tsx`. Demo auth stub in `src/lib/demoAuth.tsx`.
- **API:** `artifacts/api-server` — routes in `src/routes/fpp.ts`; assessment questions + scoring in `src/lib/questions.ts`; demo auth/tier resolution in `src/lib/currentUser.ts`.
- **DB schema (source of truth):** `lib/db/src/schema/` — `modules`, `assessments`, `sessions` (table `live_sessions`), `library` (`library_items`), `billing` (`invoices`), `concierge` (`concierge_notes`, `concierge_check_ins`), `users`.
- **API contract (source of truth):** `lib/api-spec/openapi.yaml` (+ `orval.config.ts`). Generated outputs: `lib/api-client-react/src/generated` (hooks) and `lib/api-zod/src/generated` (Zod). DO NOT hand-edit generated files — edit the spec and run codegen.
- **Seed data:** `scripts/src/seed.ts`.
- **Content source of truth:** `../FPP-CONTENT-REFERENCE.md` (one level above repo root) — Geoff's verbatim program assembled from his Word docs. Use his exact clinical wording; do not paraphrase or invent clinical claims.

### `modules` table columns
`id, slug (unique), title, subtitle, order (int), planSection (text), durationMin (int?), videoEmbedUrl (text?), body (markdown text?), keyPoints (jsonb string[]), comingSoon (bool), freeTier (bool), printable (bool)`. No dedicated image column — images go inline in `body` markdown.

### `assessments` table columns
`id, userId (int?), guestEmail (text?), guestName (text?), answers (jsonb), score (int), level (text: low|moderate|high), completedAt`.

### `planSection` taxonomy
Enum lives in `openapi.yaml` (type `PlanSection`). Currently `intro | ten_point | five_point | appendix_a | appendix_b`. Referenced in: `modules/index.tsx` (hardcoded `renderSection` calls), `admin/courses.tsx` (LABELS + SECTION_ORDER), `admin/course-editor.tsx` (PlanSection union + Select), `dashboard.tsx` (filters `ten_point`). Changing it requires: edit spec enum → codegen → update those 4 files.

## Senior-first UX & accessibility (built per Geoff's Blueprint meeting)

- **Accessibility system:** `src/lib/accessibility.tsx` (AccessibilityProvider) holds text scale (normal/large/xlarge), high-contrast, grayscale, and reduce-motion; persists to `localStorage` (`fpp.a11y`) and applies to `<html>` via `data-text-scale` + `a11y-contrast`/`a11y-grayscale`/`a11y-reduce-motion` classes. The visible control is `src/components/layout/AccessibilityMenu.tsx` (a Popover in the Header, always present). CSS for the modes lives in `index.css`. Text scaling works by setting the **root** `font-size` (rem-based Tailwind text scales with it). Grayscale is applied to `.app-shell` (the Layout root) — NOT `<html>` — so it doesn't break the sticky header.
- **Module completion / progress:** no backend progress table yet — tracked client-side in `src/lib/progress.ts` (`localStorage` `fpp.completed`, emits a `fpp:progress` event). Drives the lesson "Mark as Complete" button, the dashboard progress bar, and "resume at first incomplete".
- **Module navigation:** `modules/show.tsx` derives Previous/Next + "X of Y" from the ordered `useListModules` list (no API change). Video modules show a transcript `<details>` (ADA) and a labeled video slot; image slots render as labeled placeholders.
- **Onboarding:** `src/pages/onboarding.tsx` (route `/onboarding`) — Geoff's 3 intro slides; sign-up routes here first (gated by `hasOnboarded()` / `fpp.onboarded`).
- **Dashboard search:** the "type 'I need a walker'" feature is a client-side token search over module titles/subtitles (`dashboard.tsx`).
- **Contrast:** light-mode tokens in `index.css` were darkened to meet WCAG AA (muted-foreground, secondary/sage, accent/terracotta, input/border, button-outline) and a global 3px `:focus-visible` ring added. Don't lighten these back without re-checking contrast.

## Hosting on Replit

The app is deployed via Replit's multi-artifact "application" router (`.replit` → `deploymentTarget = "autoscale"`):

- **Web artifact** (`artifacts/fall-prevention/.replit-artifact/artifact.toml`): builds with `vite build` and is served as STATIC files from `dist/public`, with an SPA rewrite of `/*` → `/index.html`. Served at `/`.
- **API artifact** (`artifacts/api-server/.replit-artifact/artifact.toml`): builds with esbuild, runs `node dist/index.mjs` on port 8080, mounted at `/api`, health check `/api/healthz`.
- The router composes them on one origin, so the SPA's relative `/api/...` calls work with no proxy or CORS in production. There is intentionally NO Express static-file serving — Replit serves the frontend.
- `vite.config.ts` defaults `BASE_PATH` to `/` and `PORT` to a dev value so the production build never fails on a missing env var.
- **Go-live needs:** set `DATABASE_URL` as a Replit secret (managed Postgres), then run `pnpm --filter @workspace/db run push` (schema) and `pnpm --filter @workspace/scripts run seed` (Geoff's content) once against the prod DB. `scripts/post-merge.sh` runs `db push` automatically when changes are merged into the workspace.

## Architecture decisions

- **Module ordering/grouping is data-driven** via `order` and `planSection`, so restructuring the program is a data change (seed) plus the planSection enum, not a rebuild.
- **Auth is a demo stub** (`demoAuth.tsx`): a base64 `Authorization: Bearer {email,name,tier}` header, parsed server-side in `currentUser.ts`. Not real auth. Tiers: `guest | one_time | subscription | concierge | admin`.
- **Tier gating** is enforced server-side in `fpp.ts` via `unlockedFor(tier, freeTier)`; modules return a `locked` flag the UI respects.
- **Module bodies are markdown** rendered with `react-markdown`. NOTE: `remark-gfm` is NOT installed, so GFM tables and some constructs do not render — must be added for Geoff's nutrition tables. Inline images use standard `![alt](url)`.
- **OpenAPI-first:** request/response shapes and the API client are generated from `openapi.yaml`. Any API surface change starts in the spec.

## Product

Three membership tiers: Tier 1 one-time (full program + appendix), Tier 2 subscription ~$10/mo (+ live classes, weekly Q&A, recorded library), Tier 3 concierge $125–250/mo (+ weekly 1-on-1, personalized equipment recs, 24h response). Revenue also from à la carte consults and affiliate links (Amazon equipment in appendices).

## Target program structure (from Geoff's plan; build to this, not the literal TOC)

1. **Preface** — marketing/sign-up page, OUTSIDE the paid program (not a gated module).
2. **Introduction** — General Introduction + Getting Started.
3. **Overview of Balance and Falls** — What is a fall? / What is balance? / How is balance created?
4. **Fall Self-Assessment** — "What causes falls?" + "Determining fall risk" (TUG-test based, interactive).
5. **Creating a Personalized Fall Prevention Plan (10 steps):** Mindset, Footwear, Vision, Medication, Nutrition and Hydration, Posture, Creating a Safe Home Environment, Choosing the Right Assistive Devices, Strength Training, Balance Exercises.
6. **What if a Fall Happens** — injury risk, reacting after a fall, standing up, fear of falling, warning signs.
7. **Appendices** — A: Assistive Devices; B: Home Safety Modifications & Equipment (affiliate links).

## Gotchas

- **Local macOS dev setup (this repo targets Replit/linux-x64):**
  - `pnpm` is not on PATH here; use `corepack pnpm ...` (or the shim at `~/.local/bin/pnpm`).
  - `pnpm install` exits non-zero because esbuild's darwin binary is intentionally excluded via `overrides` in `pnpm-workspace.yaml`. Set `verify-deps-before-run false` (already set in user npmrc) so `pnpm run` scripts don't re-trigger that check.
  - Orval codegen and the api-server build need esbuild's macOS binary: install it once (`npm i @esbuild/darwin-arm64@<esbuild ver> --prefix /tmp/esbshim --ignore-scripts`) and export `ESBUILD_BINARY_PATH=/tmp/esbshim/node_modules/@esbuild/darwin-arm64/bin/esbuild` before running codegen/typecheck/build.
  - No local Postgres / `DATABASE_URL` in this environment — DB `push` and `seed` must run where a database is available.
- **Import types from the package root** `@workspace/api-client-react`, NOT the deep `@workspace/api-client-react/src/generated/api.schemas` path (the deep path isn't in the package `exports` map and fails to resolve). Several pages had this pre-existing bug.
- Run `pnpm --filter @workspace/api-spec run codegen` after any `openapi.yaml` change; never hand-edit `lib/api-*/src/generated`.
- Run `pnpm run typecheck` before declaring a phase done.
- `pnpm-workspace.yaml` sets `minimumReleaseAge` (supply-chain defense) — new deps may need a moment.
- Seed is idempotent for modules (`onConflictDoUpdate` by slug) but **appends** sessions/library/invoices each run.
- Clinical content is medical-adjacent for a vulnerable audience: only use what Geoff provided; do not invent stats, claims, or instructions.

## User preferences

- Use Geoff's verbatim clinical copy from `FPP-CONTENT-REFERENCE.md`. When unsure on wording, defer to it.
- Keep section ordering data-driven (TOC is still being finalized).
- Scope changes to the brief; don't redesign unrelated areas.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
- Working brief lives at repo-root-parent `../CLAUDE-CODE-PROMPT.md`.
