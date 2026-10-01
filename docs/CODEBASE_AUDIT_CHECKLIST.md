# Ondo Real Estate — Codebase Audit Checklist & Overview

**Audit date:** February 2025  
**Scope:** Full codebase (app router, components, lib, pages/calculators, API usage, auth, SEO, performance, types, tests).

> **Historical snapshot.** This audit predates several decisions and is not maintained. Current rules are in `AGENTS.md`. Known differences: auth was removed from this app (`/auth` and `/login` redirect to the Dashboard portal, there is no `lib/auth-context.tsx`), speculation rules and `rel="prefetch"` were removed because GitHub Pages answers prefetch requests with a 503, and no coverage threshold is enforced (see `docs/TESTING.md`).

---

## 1. Executive Overview

- **Stack:** Next.js 15 (App Router), TypeScript, React 18, Tailwind CSS, Supabase (analytics + backend data), external backend via Supabase Edge Functions (`BACKEND_BASE_URL` → Supabase project `/functions/v1/api`).
- **Deployment:** Static export (`output: 'export'`) for GitHub Pages; **no server-side API routes at runtime** — all `/api/*` calls in production go to the external backend (Supabase Edge Functions).
- **Strengths:** Rich feature set (buy/sell, loans, calculators, dashboard, tenant/owner portals, blacklist, leads, SEO, speculation rules, bfcache), design tokens, accessibility utilities, security (rate limiting, blacklist, SecureStorage).
- **Main gaps:** Hardcoded backend URLs in 2 places, dead code in API route, widespread `any` usage, no unit tests, ErrorBoundary not used in layout, minor naming/config inconsistencies.

---

## 2. Architecture Summary

| Area | Location | Notes |
|------|----------|--------|
| **Routes** | `app/` | 111+ pages (home, buy/sell, loans, calculators, blog, FAQ, dashboard, owner, tenant, auth, etc.) |
| **Legacy calculators** | `pages/calculators/` | 18 calculator pages; skill says “gradually migrate” to app router |
| **Shared UI** | `components/` | ui/, dashboard/, owner/, tenant/, landing/, auth, forms |
| **Shared logic** | `lib/` | auth-context, backend, blacklist, seo, security, validations, performance, speculation-rules, bfcache, etc. |
| **API (runtime)** | External | `BACKEND_BASE_URL` → Supabase Edge Functions; lead submit, properties public, blacklist |
| **API (in repo)** | `app/api/` | Used at build time or duplicated on backend; **not run on GitHub Pages** |
| **Design tokens** | `src/styles/_design-tokens.css`, `design-tokens.json` | Imported in `app/globals.css`; Tailwind wired to CSS vars |
| **Types** | `lib/types.ts`, `app/types/property.ts` | User, Property, Blacklist, API responses, forms |

---

## 3. Audit Checklist

### 3.1 Configuration & Environment

| Item | Status | Notes |
|------|--------|--------|
| Env config centralization | ✅ | `lib/config.ts` and `lib/site.ts` |
| Backend URL config | ⚠️ | `lib/backend.ts` + `NEXT_PUBLIC_BACKEND_BASE_URL`; **2 components hardcode URL** (see Bugs) |
| Required env validation | ✅ | `validateConfig()` in config.ts (dev-only) |
| Site name consistency | ⚠️ | `lib/site.ts`: "Ondo Real Estate"; `lib/config.ts`: "ONDO Real Estate" — pick one |
| Phone number | ✅ | `+1-408-538-0420` in site.ts and config |

### 3.2 Auth & Session

| Item | Status | Notes |
|------|--------|--------|
| Auth context | Removed | `lib/auth-context.tsx` no longer exists; `/auth` redirects to the Dashboard portal |
| Token storage | ✅ | SecureStorage (lib/security), keys in context |
| Token verification | ✅ | Calls backend `GET /api/auth/me` with `Authorization: Bearer <token>` |
| Blacklist on login | ✅ | `checkUserBlacklist` before storing session |
| Rate limiting (login) | ✅ | 5 attempts per 5 min in auth-context |
| Session utils | ✅ | `lib/session-utils.ts` |

### 3.3 API & Backend

| Item | Status | Notes |
|------|--------|--------|
| Lead submit | ✅ | Backend `/api/leads/submit`; blacklist (IP, user, content) + Supabase insert |
| Properties public | ✅ | Backend `/api/properties/public`; blacklist filtering via RPC |
| Blacklist CRUD + check | ✅ | Backend `/api/blacklist`, `/api/blacklist/check`, `/api/blacklist/[id]` |
| Use of `backendUrl()` | ⚠️ | Most callers use `backendUrl()`; **property-lead-form.tsx** and **dashboard/lead-form.tsx** should use `backendUrl()` (see Bugs) |
| Static export vs API | ✅ | next.config `output: 'export'`; app correctly uses external backend for runtime |

### 3.4 Security

| Item | Status | Notes |
|------|--------|--------|
| Input sanitization | ✅ | `sanitizeInput`, `isValidEmail` in lib/security |
| Blacklist (user, IP, property, content) | ✅ | lib/blacklist + backend APIs |
| CSP in layout | ✅ | Meta Content-Security-Policy in layout |
| No secrets in client | ✅ | Service role / server-only env not exposed |

### 3.5 SEO & Metadata

| Item | Status | Notes |
|------|--------|--------|
| Root metadata | ✅ | app/layout.tsx (title template, OG, Twitter, robots, verification) |
| Per-route SEO | ✅ | SEO component + lib/seo.ts, lib/site.ts |
| JSON-LD | ✅ | Organization, Website, and per-page in lib/seo.ts; JsonLd component |
| Sitemap / robots | ✅ | app/sitemap.xml/route.ts, app/robots.txt/route.ts (with static export these may run at build) |

### 3.6 Performance & Prefetch

| Item | Status | Notes |
|------|--------|--------|
| Speculation rules | Removed | GitHub Pages returns an empty 503 for `Sec-Purpose: prefetch`; do not re-add (see app/layout.tsx) |
| Prefetch fallback | Removed | Same reason; no `rel="prefetch"` links |
| bfcache | ✅ | BfcacheProvider, lib/bfcache-optimization.ts; pagehide/pageshow, no beforeunload for non-essential |
| removeConsole (prod) | ✅ | next.config compiler.removeConsole in production |
| Bundle optimization | ✅ | optimizePackageImports (lucide, MUI, recharts, etc.), modularizeImports for lucide |

### 3.7 Styling & Design

| Item | Status | Notes |
|------|--------|--------|
| Design tokens | ✅ | src/styles/_design-tokens.css + design-tokens.json; docs/DESIGN_TOKENS.md |
| Tailwind + tokens | ✅ | globals.css imports tokens; semantic utilities (bg-background, text-foreground, etc.) |
| Responsive | ✅ | Tailwind breakpoints used across components |
| Theme (dark/light) | ✅ | ThemeProvider, next-themes |

### 3.8 Accessibility

| Item | Status | Notes |
|------|--------|--------|
| Accessibility lib | ✅ | lib/accessibility.ts (focus, live regions, IDs) |
| Semantic HTML / ARIA | ✅ | Followed in reviewed components |
| Contrast | ✅ | Docs and reports (theme-audit, contrast) |

### 3.9 Error Handling & Resilience

| Item | Status | Notes |
|------|--------|--------|
| Route-level error UI | ✅ | app/error.tsx (Try Again, Return Home) |
| Error boundary component | ⚠️ | components/error-boundary.tsx exists but **not used in layout** |
| Error handler utils | ✅ | lib/error-handler.ts (ValidationError, etc.) |
| not-found | ✅ | app/not-found.tsx with redirect logic and helpful links |

### 3.10 TypeScript & Types

| Item | Status | Notes |
|------|--------|--------|
| Shared types | ✅ | lib/types.ts (User, Property, Blacklist, API, forms) |
| Strict types | ⚠️ | **Many `any` usages** — see Gaps |
| next.config types | ✅ | ignoreBuildErrors: false |

### 3.11 Testing

| Item | Status | Notes |
|------|--------|--------|
| Unit tests | ✅ | Vitest + RTL; 186 tests across lib, components (see `docs/TESTING.md`) |
| Coverage | Report only | `npm run test:coverage`; no threshold is enforced (see `docs/TESTING.md`) |
| E2E | ✅ | Playwright in devDependencies |
| Lint | ✅ | next lint, eslint-config-next |

### 3.12 Code Quality

| Item | Status | Notes |
|------|--------|--------|
| Duplicate logic | ⚠️ | getClientIP duplicated in leads + properties API routes; **properties route defines getClientIP but never uses it** |
| Reuse (skill) | ✅ | lib/seo, lib/site, analytics, validations reused where expected |
| Console in prod | ✅ | Stripped by next.config in production |

---

## 4. Gaps

1. **No unit tests** — Business logic (mortgage-utils, validations, blacklist, auth flows) untested by automated tests.
2. **ErrorBoundary not in layout** — Component-level errors outside route boundaries are not caught by a boundary; `app/error.tsx` only covers route-level errors.
3. **Type safety** — Widespread `any` in:
   - `lib/types.ts` (e.g. `ApiResponse<T = any>`, `details?: any`, audit `oldValues`/`newValues`)
   - Owner/dashboard components (property, form data, handlers)
   - UI (chart data, footer Component type)
   - lib/performance.ts `logMetrics(metrics: any)`
   - Hooks (use-performance, use-toast)
   - Forms (validated-form zodResolver `as any`)
4. **Design token path vs skill** — Skill says “design tokens from … _design-tokens.css”; path is `src/styles/_design-tokens.css` (correct in globals.css); ensure all references in docs/skills match.
5. **Speculation rules include /login and /auth** — Prefetch is allowed by rules; if any prerender were added for these later, they should be excluded (user-specific).
6. **Legacy calculators** — Still under `pages/calculators/`; migration to app router optional but noted in skill.

---

## 5. Bugs & Fixes

1. **Hardcoded backend URL (lead submit)**  
   - **Files:** `components/property-lead-form.tsx`, `components/dashboard/lead-form.tsx`  
   - **Issue:** If either hardcodes the backend URL instead of `backendUrl('/api/leads/submit')`, env/config cannot control the base URL.  
   - **Fix:** Use `backendUrl('/api/leads/submit')` so env/config controls the base URL.

2. **Dead code in properties API route**  
   - **File:** `app/api/properties/public/route.ts`  
   - **Issue:** `getClientIP(request)` is defined but never used (GET handler doesn’t need client IP for current logic).  
   - **Fix:** Remove `getClientIP` from this file to avoid confusion and duplication (it’s still used in leads submit route).

3. **Possible typo: site phone**  
   - **File:** `lib/config.ts` has `+1-408-538-0420`; `lib/site.ts` has same. If the intent is Utah (e.g. 801), one of these may be wrong; confirm with product.

---

## 6. Enhancements (Recommendations)

1. **Use ErrorBoundary in layout** — Wrap `children` in `app/layout.tsx` with the existing `ErrorBoundary` so component tree errors show a friendly fallback and optional reporting.
2. **Replace `any` with concrete types** — Prioritize: `lib/types.ts`, owner/dashboard property and form types, chart/footer prop types; add small interfaces for callback payloads (e.g. `(data: AddLeadPayload) => void`).
3. **Add unit tests** — Start with `lib/mortgage-utils.ts`, `lib/validations.ts`, and blacklist/auth helpers; use Vitest or Jest.
4. **Single source for backend URL** — Enforce `backendUrl()` (or a single `getBackendUrl()`) for all backend API calls; add a lint rule or grep in CI to disallow hardcoded backend base URLs in frontend code.
5. **Centralize getClientIP** — Move to `lib/request-utils.ts` (or similar) and import in both API routes that need it; remove unused copy from properties route.
6. **Unify site name** — Use either "Ondo Real Estate" or "ONDO Real Estate" in both `lib/site.ts` and `lib/config.ts` (and metadata) for consistency.
7. **Loading states** — Ensure all data-fetching routes that can be slow have a `loading.tsx` where appropriate (you already have several; review dashboard and owner/tenant routes).
8. **Document static export + backend** — In README or docs, state clearly that the app is static and all runtime API calls go to the external backend (Supabase Edge Functions); list which env vars the backend expects vs the Next app.

---

## 7. Quick Reference — Key Files

| Purpose | File(s) |
|--------|---------|
| Backend base URL | `lib/backend.ts` |
| Auth (client) | None; `app/auth/page.tsx` redirects to the portal |
| Blacklist checks | `lib/blacklist.ts` |
| Lead submit (backend) | Backend server; client: property-lead-form, dashboard/lead-form, contact, ConsultationModal/Widget |
| Properties public | Backend server; client: app/properties/page.tsx uses `backendUrl('/api/properties/public')` |
| SEO / metadata | `lib/seo.ts`, `lib/site.ts`, `components/seo.tsx` |
| Speculation / prefetch | Removed (see note at top); app/layout.tsx explains why |
| Design tokens | `src/styles/_design-tokens.css`, `app/globals.css` |
| Types | `lib/types.ts`, `app/types/property.ts` |
| Validations | `lib/validations.ts` |

---

## 8. Checklist Summary

| Category | Done | Warnings | Gaps |
|----------|------|----------|------|
| Config & env | 4 | 2 | 0 |
| Auth & session | 6 | 0 | 0 |
| API & backend | 4 | 1 | 0 |
| Security | 4 | 0 | 0 |
| SEO | 4 | 0 | 0 |
| Performance / prefetch | 5 | 0 | 0 |
| Styling / design | 4 | 0 | 0 |
| Accessibility | 3 | 0 | 0 |
| Error handling | 3 | 1 | 0 |
| TypeScript | 2 | 1 | 0 |
| Testing | 1 | 0 | 1 |
| Code quality | 2 | 1 | 0 |

**Recommended next steps:** Fix the two hardcoded backend URLs and remove dead `getClientIP` from properties route; then add ErrorBoundary to layout and start replacing `any` in high-traffic types and components; finally add unit tests for core libs.
