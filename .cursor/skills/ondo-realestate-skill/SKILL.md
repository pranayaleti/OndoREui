---
name: ondo-realestate-skill
description: Project-specific guidance for working on the Ondo real estate Next.js application, including architecture, conventions, and when to reuse existing utilities and components.
---

# Ondo Real Estate Project Skill

## When to use this skill

Use this skill whenever:
- Working on pages or components in this repo.
- Modifying calculators, dashboards, search, or auth flows.
- Updating SEO, analytics, or Supabase integration.

## Rules

`AGENTS.md` at the repo root is the single source of truth. Read it before changing anything: the site is a static export on GitHub Pages (no server runtime, no server actions, trailing slashes, no prefetch), metadata comes from `export const metadata` with `pageTitle()`, sample investment pages stay noindex, and there is no auth in this app. Do not copy those rules into this file.

## Workflow guidance

1. Identify the relevant route under `app/` (or `pages/calculators/` for legacy calculators).
2. Check `components/` and `lib/` for existing patterns and logic before adding new code.
3. Add or update tests in the closest existing test file.
4. Run `npx tsc --noEmit`, `npm run lint` and `npm run test:run`; run `npm run check:links` after route or link changes.
