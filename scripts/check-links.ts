#!/usr/bin/env tsx
/**
 * Fails when the static export references a page or file it does not contain: links, images,
 * JSON-LD URLs, redirects, CSS url()s and site URLs in the Markdown / llms files. Run after
 * `npm run build` (CI does). What counts as a reference lives in lib/link-audit.ts.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, posix, relative, resolve, sep } from "node:path"
import {
  exportServes,
  extractReferences,
  extractTextReferences,
  isClientRenderedPath,
  sitePathOf,
  type Reference,
} from "../lib/link-audit"

// OUT_DIR overrides the export location, like scripts/generate-legacy-redirects.mjs.
const OUT_DIR = process.env["OUT_DIR"] ? resolve(process.env["OUT_DIR"]) : join(process.cwd(), "out")

function originOf(url: string | undefined): string | null {
  try {
    return url ? new URL(url).origin : null
  } catch {
    return null
  }
}

const SITE_ORIGINS = [
  ...new Set(
    ["https://www.ondorealestate.com", "https://ondorealestate.com", originOf(process.env["NEXT_PUBLIC_SITE_URL"])].filter(
      (origin): origin is string => Boolean(origin),
    ),
  ),
]

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) walk(abs, acc)
    else acc.push("/" + relative(OUT_DIR, abs).split(sep).join("/"))
  }
  return acc
}

/** URL path a file is served at (out/buy/index.html -> /buy/). */
const pagePathOf = (file: string) => (file.endsWith("/index.html") ? file.slice(0, -"index.html".length) : file.replace(/\.html$/, ""))

function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("check-links: out/ not found, run after next build")
    process.exit(1)
  }
  const files = walk(OUT_DIR)
  const served = new Set(files)
  const broken = new Map<string, { kinds: Set<string>; sources: Set<string> }>()
  let checked = 0

  const check = (refs: Reference[], fromPath: string, source: string) => {
    for (const ref of refs) {
      if (ref.kind === "json-ld:invalid") {
        record("(invalid JSON-LD)", ref.kind, source)
        continue
      }
      const path = sitePathOf(ref.url, fromPath, SITE_ORIGINS)
      if (path === null) continue
      checked++
      if (!exportServes(path, served) && !isClientRenderedPath(path)) record(path, ref.kind, source)
    }
  }
  const record = (target: string, kind: string, source: string) => {
    const entry = broken.get(target) ?? { kinds: new Set<string>(), sources: new Set<string>() }
    entry.kinds.add(kind)
    entry.sources.add(source)
    broken.set(target, entry)
  }

  for (const file of files) {
    const abs = join(OUT_DIR, file)
    if (file.endsWith(".html")) {
      check(extractReferences(readFileSync(abs, "utf8")), pagePathOf(file), pagePathOf(file))
    } else if (file.endsWith(".css")) {
      const refs = [...readFileSync(abs, "utf8").matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
        .filter((match) => !match[1]!.startsWith("data:"))
        .map((match) => ({ url: match[1]!, kind: "css:url" }))
      check(refs, posix.dirname(file) + "/", file)
    } else if (!file.startsWith("/_next/") && /\.(md|txt|xml|json)$/.test(file) && !file.endsWith("/index.txt") && file !== "/index.txt") {
      // index.txt files are RSC payloads (already covered through the HTML); the rest are for people and agents.
      check(extractTextReferences(readFileSync(abs, "utf8"), SITE_ORIGINS), "/", file)
    }
  }

  if (!broken.size) {
    console.log(`check-links: ${checked} site references across ${files.length} files, none broken`)
    return
  }
  console.error(`check-links: ${broken.size} missing target(s) referenced from the export:`)
  for (const [target, { kinds, sources }] of [...broken].sort((a, b) => b[1].sources.size - a[1].sources.size)) {
    const examples = [...sources].slice(0, 5).join(", ")
    console.error(`  ${target}  (${[...kinds].join(", ")}) from ${sources.size} file(s): ${examples}${sources.size > 5 ? ", ..." : ""}`)
  }
  console.error("Fix the reference, add the page, or map the old URL in public/_redirects.")
  process.exit(1)
}

main()
