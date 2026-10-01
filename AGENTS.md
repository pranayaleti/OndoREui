# AGENTS.md — OndoREui

## Overview

This is the **consumer-facing Next.js UI** for the Ondo Real Estate platform. It covers public-facing pages, property search, mortgage calculators, and user-facing dashboards — built with Next.js 15 App Router.

For shared product context (mission, roles, brand, repo map), see `../soul.md` and `../identity.md` at the workspace root, or the always-on Cursor rule at `../.cursor/rules/shared-context.mdc`.

**Positioning**: Product narrative includes (1) a conversational AI assistant for lease review, portfolio/finance insights, marketing generation, and auto-routing maintenance; (2) outbound sales engine from the ground up — prospecting, lead qualification, CRM/pipeline from zero, GTM collaboration, and Ondo RE as the first point of contact with potential clients (relationship-driven + data-driven).

This file is the single source of truth for agents working in this repo. `CLAUDE.md`, `SKILL.md`, `llm.txt` and `.cursor/skills/ondo-realestate-skill/SKILL.md` only point here; edit this file, not those.

## Hard constraints (read first)

The site is a **static export** (`output: 'export'`, `trailingSlash: true`) hosted on GitHub Pages behind Cloudflare. That rules out a lot:

- **No server runtime.** No server actions, no API routes, no middleware, no `headers()`/`cookies()`, no `next/image` optimization (`images.unoptimized`). Anything dynamic calls the backend (`NEXT_PUBLIC_BACKEND_BASE_URL`, Supabase Edge in production) from the browser. Lead forms post through `submitContactLead()` in `lib/leads-api.ts`.
- **Trailing slashes everywhere.** Canonical URLs, internal links and sitemap entries end with `/` (for example `${SITE_URL}/buy/`).
- **No prefetch or speculation rules.** GitHub Pages answers requests with `Sec-Purpose: prefetch` with an empty 503. Do not add `<link rel="prefetch">`, speculation rules or `prefetch` props.
- **Metadata comes from `export const metadata` / `generateMetadata`**, with titles built through `pageTitle()` (`lib/site.ts`). `components/seo.tsx` renders JSON-LD only; it never sets `<title>` or `<meta>`. Client components need a thin server `page.tsx` that exports the metadata.
- **Sample investment deals stay `noindex`** and are labelled as samples. No invest or apply calls to action on them.
- **Blog slugs** live in the `lib/blog-slugs.ts` registry. Blog posts define `title`, `description`, `slug`, `published`, `modified` and `author` constants at module scope; the author is the organization, "Ondo Real Estate".
- **Licensed-activity copy is intentional** (real estate agent, loan officer, NMLS number on `/loans/second-look`, `/refinance/watch`, `/links`). Do not remove it and do not add new licensing claims or numbers.
- **Never invent facts.** No made-up numbers, people, reviews, awards or partners. If the repo cannot verify a claim, remove it or make it general.
- **Brand voice**: direct and plain, no em dashes, never "straightforward", "genuinely" or "honestly".
- **Link check**: `npm run check:links` runs on the export in CI and on deploy. Run it (and `npm run check:seo`) after changing routes, links or metadata.
- **Generated files**: `prebuild` rewrites tracked `public/*.md` twins from `NEXT_PUBLIC_SITE_URL`. Build with the production origin (see `.env.example`); the script skips on a localhost URL and fails in CI.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS with design tokens (`src/styles/design-tokens.json`, `src/styles/_design-tokens.css`)
- **Backend**: the Ondo backend API (Supabase Edge Function in production) for leads and listings; the Supabase JS client only where `lib/supabase.ts` already uses it
- **Testing**: Vitest + React Testing Library; accessibility tests via `axe-core` (`npm run test:a11y`)
- **Bundle analysis**: `npm run analyze:bundle`

## Running the app

```bash
npm run dev          # Start dev server (Next.js, default :3000)
npm run dev:clean    # Clear .next + cache, then start dev (use if you see 404s for layout.css / main-app.js)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (watch)
npm run test:run     # Vitest (single run)
npm run test:a11y    # Accessibility audit (Playwright + axe, tests/a11y.spec.ts)
npm run check:links  # Broken-link check on the static export
npm run check:seo    # Titles, canonicals and structured data on the export
npm run sitemap      # Regenerate sitemap
```

**Dev 404s**: If the console shows 404s for `layout.css`, `main-app.js`, `app_pages_internals.js`, or `not-found.js`, stop the dev server, run `npm run dev:clean`, then start again. Ensure you open the app on the port Next reports (e.g. http://localhost:3000).

## Project structure

```
app/                     # Next.js App Router routes (primary)
│   └── auth/            # Redirects to the Dashboard portal login; no auth state lives in this app
pages/
│   └── calculators/     # Legacy calculator pages (gradual migration to app/)
components/              # Shared UI components, grouped by domain
│   ├── search/
│   ├── dashboard/
│   └── calculators/
lib/                     # All shared logic and utilities
│   ├── aiGuardrails.ts      # AI/chat input validation & output sanitization (align with backend)
│   ├── leads-api.ts         # submitContactLead(): every lead form posts through it
│   ├── blog-slugs.ts        # Blog slug registry
│   ├── session-utils.ts     # sessionStorage helpers (saved ZIP, last visit)
│   ├── seo.ts               # SEO metadata helpers
│   ├── site.ts              # Site-wide metadata constants
│   ├── analytics.ts         # Analytics event helpers
│   ├── mortgage-utils.ts    # Mortgage math (pure functions)
│   ├── accessibility.ts     # a11y helpers and ARIA patterns
│   ├── performance.ts       # Performance utilities
│   └── types.ts             # Shared TypeScript types
src/styles/
│   ├── design-tokens.json   # Design token source of truth
│   └── _design-tokens.css   # CSS variables from tokens
types/                   # Additional TypeScript type definitions
```

## WebMCP (agent-ready)

The site is aligned with [WebMCP](https://developer.chrome.com/blog/webmcp-epp): contact form uses declarative attributes; imperative tools: `/contact` — `submit_contact_lead`, `get_company_contact_info`; `/investments/opportunities` — `list_investment_opportunities`, `get_investment_opportunity`; `/buy` — `calculate_mortgage_payment`. See `docs/WEBMCP.md` for details.

## Key implementation rules

1. **Prefer reuse over new code**: Before adding utilities, search `lib/` and `components/` for similar behavior.
2. **Design tokens over hard-coded colors**: Use Tailwind classes aligned with `src/styles/_design-tokens.css`. Never hard-code hex values when a tokenized class or CSS variable exists.
3. **Server components by default**: Avoid `"use client"` unless the component needs interactivity (state, events, browser APIs). Keep components server-side to reduce bundle size.
4. **TypeScript strict**: No `any` unless absolutely unavoidable. Fix type errors rather than suppressing them. Use types from `lib/types.ts` and `types/`.
5. **Auth**: This site has no sign-in. `app/auth/` and `app/login/` redirect to the Dashboard portal (`APP_PORTAL_LOGIN_URL` in `lib/site.ts`). Do not add an auth context or session handling here.
6. **SEO**: Use `lib/seo.ts` and `lib/site.ts` helpers for metadata and `pageTitle()` for titles. Don't duplicate metadata objects.
7. **Analytics**: Use `lib/analytics.ts` (and `analyticsAttributes()` for click tracking), never call analytics APIs directly in components. One conversion event per successful lead.
8. **Accessibility**: Follow patterns in `lib/accessibility.ts`. Use semantic HTML and ARIA attributes consistent with existing components.
9. **Calculators**: New calculators go in `pages/calculators/`. Keep math in pure functions in `lib/mortgage-utils.ts`; keep components focused on rendering and interaction.
10. **AI/chat input**: When adding assistant chat or any user→LLM input, use `lib/aiGuardrails.ts` (`validateChatInput`, `sanitizeReply`) so limits and prompt-injection checks match the backend.

## Internationalization (i18n)

English only. Translation files: `public/locales/en/common.json`. Use `t()` in client components. No language switcher. No multi-locale logic.

## Backend and Supabase

- Leads, listings and calculators go through the backend API via `lib/backend.ts` and `lib/api/`. Env: `NEXT_PUBLIC_BACKEND_BASE_URL`.
- The Supabase JS client (`lib/supabase.ts`) reads `NEXT_PUBLIC_SUPABASE_URL` and the public anon or publishable key. There are no server actions in a static export, so prefer the backend API over direct Supabase calls from components.
- Never put secrets in this repo's env files. Only `NEXT_PUBLIC_*` values ship, and they are public. See `.env.example`.

## Learned User Preferences

<!-- Maintained automatically by the continual-learning skill. Do not edit manually. -->
- Push `main` only. Never create a feature branch.
- Always run `npm run db:push` in OndoREBackend whenever a migration is added or schema must be applied; do not wait to be asked.

## Learned Workspace Facts

<!-- Maintained automatically by the continual-learning skill. Do not edit manually. -->
