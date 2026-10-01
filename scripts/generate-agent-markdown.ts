#!/usr/bin/env tsx
/**
 * Emit first-party Markdown twins into `public/` so the static export copies
 * them to `out/` unchanged.
 *
 * Runs as `npm run generate:agent-md` and is wired into `prebuild`. Adding a
 * new calculator (`CALCULATOR_CATALOG`) auto-picks up here as long as its
 * slug has a matching entry in `CALCULATOR_DETAILS`.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import {
  buildCalculatorMarkdown,
  buildContactMarkdown,
  buildHomepageMarkdown,
  buildPropertiesMarkdown,
  getCalculatorMarkdownSlugs,
  isLocalSiteUrl,
} from "../lib/agent-markdown"
import { SITE_URL } from "../lib/site"

const PUBLIC_DIR = resolve(process.cwd(), "public")

function write(relPath: string, body: string) {
  const abs = resolve(PUBLIC_DIR, relPath)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, body, "utf8")
  console.log(`  wrote public/${relPath} (${body.length} bytes)`)
}

// The twins are tracked in git. Writing them against a localhost NEXT_PUBLIC_SITE_URL leaks
// localhost links into public/*.md, so CI fails and a local build leaves the tracked files alone.
if (isLocalSiteUrl(SITE_URL)) {
  const message = `NEXT_PUBLIC_SITE_URL is ${SITE_URL}; refusing to write Markdown twins with local URLs.`
  if (process.env["CI"]) {
    console.error(message)
    process.exit(1)
  }
  console.warn(`${message} Skipping; unset it or use https://www.ondorealestate.com to regenerate.`)
  process.exit(0)
}

console.log("Generating first-party Markdown twins…")

// `sitemap.md` is served by `app/sitemap.md/route.ts` (dynamic + cache-friendly),
// so it is NOT written into public/. Everything else here has no App Router route
// and must be shipped as a static file for GitHub Pages to serve directly.
write("index.md", buildHomepageMarkdown())
write("properties.md", buildPropertiesMarkdown())
write("contact.md", buildContactMarkdown())

const slugs = getCalculatorMarkdownSlugs()
for (const slug of slugs) {
  write(`calculators/${slug}.md`, buildCalculatorMarkdown(slug))
}

console.log(`Done — ${3 + slugs.length} Markdown twins written to public/.`)
