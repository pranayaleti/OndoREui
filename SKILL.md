# OndoREui — Skill

## Description

Context for working on the **Ondo Real Estate consumer-facing UI**: a Next.js 15 App Router site, built as a static export for GitHub Pages, covering public pages, property search and mortgage calculators.

## When to use

- Adding or changing public pages, property search or calculators in the consumer app.
- Working on SEO, analytics, accessibility or performance utilities in `lib/`.
- Implementing design tokens or Tailwind usage.
- Integrating WebMCP tools (contact, investments, mortgage; see `docs/WEBMCP.md`).

## Instructions

`AGENTS.md` is the single source of truth for the rules (static export limits, trailing slashes, `export const metadata` with `pageTitle()`, `check:links`, no prefetch, noindex sample investment pages, brand voice, design tokens, analytics, accessibility). Read it before changing anything and follow it. This file only points there so the rules are not kept in two places.

## References

- Workspace context: `../soul.md`, `../identity.md`, `../.cursor/rules/shared-context.mdc`.
- This repo: `AGENTS.md`, `docs/TESTING.md`, `docs/WEBMCP.md`, `docs/DESIGN_TOKENS.md`.
