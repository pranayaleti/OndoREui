#!/usr/bin/env tsx
/**
 * After `next build` (static export), write a sibling `.md` twin for every
 * HTML page in `out/` that does not already have a first-party Markdown file.
 *
 * Hand-written twins from `scripts/generate-agent-markdown.ts` are left as-is.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import {
  exportedHtmlRelToMarkdownRel,
  htmlToAgentMarkdown,
} from "../lib/html-to-agent-markdown"
import { toAbsoluteSiteUrl } from "../lib/site-index"

const OUT_DIR = join(process.cwd(), "out")

function walkHtml(dir: string, acc: string[] = []): string[] {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, ent.name)
    if (ent.isDirectory()) walkHtml(abs, acc)
    else if (ent.name.endsWith(".html")) acc.push(abs)
  }
  return acc
}

function canonicalForMarkdownRel(destRel: string): string {
  if (destRel === "index.md") return toAbsoluteSiteUrl("/")
  const htmlPath = `/${destRel.replace(/\.md$/, "")}/`
  return toAbsoluteSiteUrl(htmlPath)
}

function main(): void {
  if (!existsSync(OUT_DIR)) {
    console.error("out/ is missing — run this after `next build` (static export).")
    process.exit(1)
  }

  const files = walkHtml(OUT_DIR)
  let wrote = 0
  let skipped = 0

  for (const abs of files) {
    const rel = relative(OUT_DIR, abs).replace(/\\/g, "/")
    const destRel = exportedHtmlRelToMarkdownRel(rel)
    if (!destRel) {
      skipped += 1
      continue
    }
    const dest = join(OUT_DIR, destRel)
    if (existsSync(dest)) {
      skipped += 1
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    const html = readFileSync(abs, "utf8")
    const md = htmlToAgentMarkdown(html, { canonical: canonicalForMarkdownRel(destRel) })
    writeFileSync(dest, md, "utf8")
    wrote += 1
  }

  console.log(`HTML → Markdown twins: wrote ${wrote}, skipped ${skipped} (${files.length} HTML files)`)
}

main()
