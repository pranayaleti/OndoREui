# CLAUDE.md — OndoREui

## Overview

Consumer-facing Next.js UI for the Ondo Real Estate platform. Public pages, property search, mortgage calculators, and user dashboards — built with Next.js 15 App Router.

## Quick Start

```bash
npm run dev          # Next.js dev server (default :3000)
npm run dev:clean    # Clear .next + cache, then start (use if you see 404s for layout.css / main-app.js)
npm run build        # Production build
npm run lint         # ESLint
npm run test:run     # Vitest single run
npm run test:a11y    # Accessibility audit (axe-core)
```

Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS with design tokens
- Supabase JS client, Vitest + React Testing Library, axe-core

## Key Rules

- **Server components by default**: Avoid `"use client"` unless the component needs interactivity.
- **Design tokens over hard-coded colors**: Use classes from `src/styles/_design-tokens.css`. No hard-coded hex.
- **Reuse before creating**: Search `lib/` and `components/` for existing utilities before adding new ones.
- **TypeScript strict**: No `any` unless unavoidable.
- **Auth**: Use `useAuth()` from `lib/auth-context.tsx` + `lib/session-utils.ts`.
- **SEO**: Use `lib/seo.ts` and `lib/site.ts` helpers. Don't duplicate metadata objects.
- **Analytics**: Use `lib/analytics.ts` and `lib/supabase-analytics.ts` — never call APIs directly in components.
- **Accessibility**: Follow patterns in `lib/accessibility.ts`. Semantic HTML + ARIA.
- **Calculators**: New calculators in `pages/calculators/`. Math in `lib/mortgage-utils.ts`.
- **AI guardrails**: Use `lib/aiGuardrails.ts` for any user→LLM input.
- **Supabase**: Never call Supabase directly from client components when a server action can handle it.
- **Dev 404s**: If layout.css/main-app.js 404s appear, stop server and run `npm run dev:clean`.

## Project Structure

```
app/              # Next.js App Router routes (primary)
components/       # Shared UI components by domain
lib/              # Shared logic (auth, seo, analytics, mortgage-utils, types)
pages/            # Legacy calculator pages (migrating to app/)
src/styles/       # Design tokens (JSON + CSS variables)
types/            # Additional TypeScript type definitions
```
