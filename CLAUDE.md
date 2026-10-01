# CLAUDE.md — OndoREui

The rules for this repo live in [`AGENTS.md`](./AGENTS.md). Read it first; it is the single source of truth (static export, trailing slashes, metadata exports, `check:links`, no prefetch, noindex samples, brand voice, analytics, accessibility).

## Quick Start

```bash
npm run dev          # Next.js dev server (default :3000)
npm run dev:clean    # Clear .next + cache, then start (use if you see 404s for layout.css / main-app.js)
npm run build        # Production static export
npm run lint         # ESLint
npm run test:run     # Vitest single run
npm run test:a11y    # Accessibility audit (Playwright + axe)
npm run check:links  # Broken-link check on the export
```

Env: see `.env.example`. `NEXT_PUBLIC_SITE_URL=https://www.ondorealestate.com` is required for builds.

## Internationalization (i18n)

English only. Translation files at `public/locales/en/common.json`. Use `t()` from `useTranslation()` in client components. No language switcher. No other locales.
