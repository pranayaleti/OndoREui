# OndoREui

Public marketing site and listings for [Ondo Real Estate](https://www.ondorealestate.com): Next.js App Router plus a few Pages Router calculators, exported as a static site and served from GitHub Pages behind Cloudflare.

The rules for working in this repo live in [AGENTS.md](./AGENTS.md) (static export, trailing slashes, metadata exports, no prefetch, noindex samples, brand voice, analytics, accessibility). Read it before changing anything; [CLAUDE.md](./CLAUDE.md) is the short version for AI assistants.

## Quick start

```bash
npm ci
cp .env.example .env.local      # then fill in the values you need (see Environment)
npm run dev                     # http://localhost:3000
```

Prod-like local setup with the dashboard and API on one port is described in [../DEV-PROD-LIKE.md](../DEV-PROD-LIKE.md) (`npm run dev:prod-like` serves on :3100 behind the backend's proxy).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `npm run dev:clean` | Dev server; `dev:clean` clears `.next` first (use it if layout.css or main-app.js 404) |
| `npm run build` | Production static export to `out/` (runs `generate:agent-md` before and the sitemap, headers, redirects, discovery files, Markdown twins and landmark checks after) |
| `npm run lint` | ESLint, zero warnings allowed in CI |
| `npm run test:run` | Vitest, single run (`npm test` to watch) |
| `npm run test:a11y` | Playwright + axe against the built export (`out/` must exist) |
| `npm run test:links` / `npm run test:popups` | Playwright checks for the /links page and popups |
| `npm run check:links` / `npm run check:seo` | Broken-link and SEO checks on the export |
| `npm run analyze:bundle` | Bundle size report |
| `npm run indexnow` | Submit changed URLs to IndexNow (needs `INDEXNOW_KEY`) |

## Environment

Everything the site needs is `NEXT_PUBLIC_*` and baked in at build time; there is no server. `.env.example` documents every variable. The ones that matter most:

- `NEXT_PUBLIC_SITE_URL` is required for builds. Production is `https://www.ondorealestate.com`; a localhost value makes `generate:agent-md` skip rather than write localhost into tracked files.
- `NEXT_PUBLIC_BACKEND_BASE_URL` is where lead forms, calculators and the AI chat post. Local Express dev is `http://localhost:3030`; production is the Supabase Edge function URL set in `deploy.yml`.
- `NEXT_PUBLIC_DASHBOARD_URL` is the portal origin for login links. When the site URL is production, a localhost value here is ignored.
- `NEXT_PUBLIC_BROKERAGE_DISCLOSURE` is the brokerage identification line rendered on pages that advertise real estate services. Leave it empty until the licence is active.

Analytics and pixel IDs are optional and are no-ops when blank. Never put server secrets in this repo.

## Where things live

- `app/` App Router pages. Pages that need a browser (`"use client"`) get a thin server `page.tsx` wrapper that exports `metadata`.
- `pages/calculators/` Pages Router calculators, served at `/calculators/[slug]` through the App Router.
- `components/` UI, including shared lead-form fields (`lead-contact-fields.tsx`) and the shared SMS consent wording (`lib/text-consent.ts`).
- `lib/` site constants (`site.ts`), SEO helpers (`seo.ts`), the API client for lead forms (`leads-api.ts`), analytics, attribution.
- `test/edge-lead-schemas.ts` a parity copy of the request schemas the Edge API enforces; the form tests validate payloads against it so a form can never send a shape the API rejects.
- `tests/` Playwright suites; `scripts/` build-time generators and checks.

## Testing

Unit and component tests run with Vitest and Testing Library (`npm run test:run`). Accessibility tests run with Playwright and axe against the real export: build first, then `npm run test:a11y`. Add every new public route to the `routes` list in `tests/a11y.spec.ts`.

## Deploy

CI (`.github/workflows/ci.yml`) runs lint, tsc, tests, the build and the link, SEO and bundle checks. `deploy.yml` builds with the production environment and publishes `out/` to GitHub Pages; the `CNAME` file sets the custom domain. Deploys skip on any TypeScript error, so keep `npx tsc --noEmit` clean.

Commit on `main` and push `main` only (see the workspace [AGENTS.md](../AGENTS.md)).
