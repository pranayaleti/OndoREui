# AGENTS.md — OndoREui

## Overview

This is the **consumer-facing Next.js UI** for the Ondo Real Estate platform. It covers public-facing pages, property search, mortgage calculators, and user-facing dashboards — built with Next.js 15 App Router.

For shared product context (mission, roles, brand, repo map), see `../soul.md` and `../identity.md` at the workspace root, or the always-on Cursor rule at `../.cursor/rules/shared-context.mdc`.

**Positioning**: Product narrative includes (1) a conversational AI assistant for lease review, portfolio/finance insights, marketing generation, and auto-routing maintenance; (2) outbound sales engine from the ground up — prospecting, lead qualification, CRM/pipeline from zero, GTM collaboration, and Ondo RE as the first point of contact with potential clients (relationship-driven + data-driven).

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS with design tokens (`src/styles/design-tokens.json`, `src/styles/_design-tokens.css`)
- **Database / Backend**: Supabase JS client (`@supabase/supabase-js`)
- **Testing**: Vitest + React Testing Library; accessibility tests via `axe-core` (`npm run test:a11y`)
- **Bundle analysis**: `npm run analyze:bundle`

## Running the app

```bash
npm run dev          # Start dev server (Next.js, default :3000)
npm run dev:clean    # Clear .next + cache, then start dev (use if you see 404s for layout.css / main-app.js)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run test         # Vitest (watch)
npm run test:run     # Vitest (single run)
npm run test:a11y    # Accessibility audit (axe-core)
npm run sitemap      # Regenerate sitemap
```

**Dev 404s**: If the console shows 404s for `layout.css`, `main-app.js`, `app_pages_internals.js`, or `not-found.js`, stop the dev server, run `npm run dev:clean`, then start again. Ensure you open the app on the port Next reports (e.g. http://localhost:3000).

## Project structure

```
app/                     # Next.js App Router routes (primary)
│   └── auth/            # Auth routes (login, callback, etc.)
pages/
│   └── calculators/     # Legacy calculator pages (gradual migration to app/)
components/              # Shared UI components, grouped by domain
│   ├── search/
│   ├── dashboard/
│   └── calculators/
lib/                     # All shared logic and utilities
│   ├── aiGuardrails.ts      # AI/chat input validation & output sanitization (align with backend)
│   ├── auth-context.tsx     # Auth state (useAuth hook)
│   ├── session-utils.ts     # Session helpers
│   ├── seo.ts               # SEO metadata helpers
│   ├── site.ts              # Site-wide metadata constants
│   ├── analytics.ts         # Analytics event helpers
│   ├── supabase-analytics.ts # Supabase-based analytics
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
5. **Auth**: Use `useAuth()` from `lib/auth-context.tsx` and helpers from `lib/session-utils.ts`. Mirror existing flows when touching `app/auth/` or `app/login/`.
6. **SEO**: Use `lib/seo.ts` and `lib/site.ts` helpers for metadata. Don't duplicate metadata objects.
7. **Analytics**: Use `lib/analytics.ts` and `lib/supabase-analytics.ts` — never call analytics APIs directly in components.
8. **Accessibility**: Follow patterns in `lib/accessibility.ts`. Use semantic HTML and ARIA attributes consistent with existing components.
9. **Calculators**: New calculators go in `pages/calculators/`. Keep math in pure functions in `lib/mortgage-utils.ts`; keep components focused on rendering and interaction.
10. **AI/chat input**: When adding assistant chat or any user→LLM input, use `lib/aiGuardrails.ts` (`validateChatInput`, `sanitizeReply`) so limits and prompt-injection checks match the backend.
11. **i18n — ALL USER-FACING STRINGS MUST BE TRANSLATED**: See full rules below.

## Internationalization (i18n) — MANDATORY FOR ALL CHANGES

This site uses `react-i18next` with a static-export-compatible client-side setup. **Every change that introduces user-facing text must ship translations for all 8 languages in the same commit.**

### Supported locales

| Code | Language | Native label | BCP 47 |
|------|----------|--------------|--------|
| `en` | English | English (United States) | `en-US` |
| `es` | Spanish | Español | `es-ES` |
| `fr` | French | Français | `fr-FR` |
| `it` | Italian | Italiano | `it-IT` |
| `te` | Telugu | తెలుగు | `te-IN` |
| `hi` | Hindi | हिन्दी | `hi-IN` |
| `ta` | Tamil | தமிழ் | `ta-IN` |
| `kn` | Kannada | ಕನ್ನಡ | `kn-IN` |

### Rules — enforce on every change

1. **Client components**: Use `const { t } = useTranslation()` and `t('namespace.key')`. Never write English strings in JSX.
2. **Server components**: Cannot use `useTranslation`. Acceptable to keep purely static SEO metadata (page `<title>`, JSON-LD) in English for now. Leave a `// TODO(i18n): server component — translate when dynamic` comment.
3. **Translation files**: `public/locales/{locale}/common.json`. Each new key in `en/common.json` must have equivalents in all 7 other locale files.
4. **New namespaces**: Create for all 8 locales simultaneously and register in `lib/i18n.ts`.
5. **Navigation**: `components/navigation.tsx` uses `labelKey` on `NavigationItem`. Always add `labelKey` — never a raw `label` string.
6. **Language switcher**: `components/language-switcher.tsx` — already in the header. Do not add locale arrays elsewhere.
7. **i18n config**: `lib/i18n.ts` — `useSuspense: false` is mandatory for static export. Do not change this.
8. **I18nProvider**: `components/i18n-provider.tsx` — initializes i18n and syncs `<html lang>`. Already in `components/root-providers.tsx`. Do not bypass it.
9. **Adding a new language**: Update `lib/i18n.ts` `supportedLngs`, add locale files across all three repos, update the backend `SUPPORTED_LOCALES` in `src/types/locale.ts` and the DB migration CHECK constraint.

## Supabase integration

- Client: Use the Supabase JS client from `@supabase/supabase-js`.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never call Supabase directly from client components when a server action or API route can handle it.

## Learned User Preferences

<!-- Maintained automatically by the continual-learning skill. Do not edit manually. -->

## Learned Workspace Facts

<!-- Maintained automatically by the continual-learning skill. Do not edit manually. -->
