#!/usr/bin/env node
/**
 * Post-build SEO check over the static export (out/**\/index.html and out/sitemap*.xml).
 *
 * Metadata comes from three helpers (lib/seo.ts, lib/page-canonical.ts, components/seo.tsx), so one
 * page can drift from the rest without any unit test noticing. This reads the finished HTML.
 *
 * Errors (exit 1), objective defects only:
 *   - og:url differs from the canonical URL
 *   - canonical or og:url without a trailing slash (file URLs such as /feed.xml are exempt)
 *   - a same-site JSON-LD "url" without a trailing slash
 *   - an indexable page with no og:type, no title or no meta description
 *   - a sitemap entry that is not an exported HTML page (a file URL, or no out/<path>/index.html)
 * Warnings (printed, never fail the build): title length outside 30-65, description length outside
 * 70-160, and indexable pages with fewer than 3 internal pages linking to them.
 *
 * Usage: node scripts/check-seo-export.mjs [outDir]   (default: out)
 * Redirect stubs (meta refresh), 404.html and noindex pages are exempt from the indexable-page rules.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const TITLE_RANGE = [30, 65]
const DESCRIPTION_RANGE = [70, 160]
const MIN_INBOUND_LINKS = 3

const ENTITIES = { "&amp;": "&", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&lt;": "<", "&gt;": ">" }
function decode(text) {
  return text.replace(/&(?:amp|quot|lt|gt|#x27|#39);/g, (entity) => ENTITIES[entity] ?? entity)
}

function attributes(source) {
  const attrs = {}
  for (const match of source.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? "")
  }
  return attrs
}

/** A static redirect page (meta refresh) has no SEO surface by design. */
export function isRedirectStub(html) {
  return /<meta[^>]+http-equiv=["']refresh["']/i.test(html)
}

/** Reads the head fields this check cares about. Script bodies are removed first so the RSC payload cannot match. */
export function parsePage(html) {
  const jsonLd = []
  const withoutScripts = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_all, attrSource, body) => {
    if (/ld\+json/i.test(attrSource)) jsonLd.push(body)
    return ""
  })
  const meta = {}
  let canonical
  for (const tag of withoutScripts.matchAll(/<(meta|link)\b([^>]*)>/gi)) {
    const attrs = attributes(tag[2])
    if (tag[1].toLowerCase() === "meta") {
      const key = (attrs.name ?? attrs.property ?? "").toLowerCase()
      if (key && !(key in meta)) meta[key] = attrs.content ?? ""
    } else if ((attrs.rel ?? "").toLowerCase() === "canonical" && canonical === undefined) {
      canonical = attrs.href
    }
  }
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(withoutScripts)?.[1]
  const hrefs = [...withoutScripts.matchAll(/<a\b([^>]*)>/gi)].map((m) => attributes(m[1]).href).filter(Boolean)
  return {
    title: title === undefined ? undefined : decode(title).trim(),
    description: meta.description,
    robots: meta.robots ?? "",
    canonical,
    ogUrl: meta["og:url"],
    ogType: meta["og:type"],
    hrefs,
    jsonLd,
  }
}

function hasFileExtension(pathname) {
  return /\.[a-z0-9]+$/i.test(pathname.split("/").pop() ?? "")
}

/** True when a URL's path is a directory-style page URL that ends in a slash (or is a file URL). */
export function hasTrailingSlash(url) {
  let pathname
  try {
    pathname = new URL(url).pathname
  } catch {
    return false
  }
  return pathname.endsWith("/") || hasFileExtension(pathname)
}

function* jsonLdUrls(node) {
  if (Array.isArray(node)) {
    for (const item of node) yield* jsonLdUrls(item)
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "url" && typeof value === "string") yield value
      else yield* jsonLdUrls(value)
    }
  }
}

/** Objective defects and soft warnings for one page. `page` comes from parsePage. */
export function auditPage(page) {
  const errors = []
  const warnings = []
  const indexable = !/noindex/i.test(page.robots)

  if (page.canonical && page.ogUrl && page.canonical !== page.ogUrl) {
    errors.push(`og:url (${page.ogUrl}) differs from canonical (${page.canonical})`)
  }
  if (page.canonical && !hasTrailingSlash(page.canonical)) errors.push(`canonical has no trailing slash: ${page.canonical}`)
  if (page.ogUrl && !hasTrailingSlash(page.ogUrl)) errors.push(`og:url has no trailing slash: ${page.ogUrl}`)

  let origin
  try {
    origin = page.canonical ? new URL(page.canonical).origin : undefined
  } catch {
    origin = undefined
  }
  for (const body of page.jsonLd) {
    let data
    try {
      data = JSON.parse(body)
    } catch {
      errors.push("JSON-LD block is not valid JSON")
      continue
    }
    for (const url of jsonLdUrls(data)) {
      let parsed
      try {
        parsed = new URL(url)
      } catch {
        continue
      }
      if (origin && parsed.origin === origin && !hasTrailingSlash(url)) errors.push(`JSON-LD url has no trailing slash: ${url}`)
    }
  }

  if (indexable) {
    if (!page.title) errors.push("indexable page has no <title>")
    if (!page.description) errors.push("indexable page has no meta description")
    if (!page.ogType) errors.push("indexable page has no og:type")
    if (page.title && (page.title.length < TITLE_RANGE[0] || page.title.length > TITLE_RANGE[1])) {
      warnings.push(`title is ${page.title.length} characters (aim for ${TITLE_RANGE[0]}-${TITLE_RANGE[1]})`)
    }
    if (page.description && (page.description.length < DESCRIPTION_RANGE[0] || page.description.length > DESCRIPTION_RANGE[1])) {
      warnings.push(`description is ${page.description.length} characters (aim for ${DESCRIPTION_RANGE[0]}-${DESCRIPTION_RANGE[1]})`)
    }
  }
  return { errors, warnings, indexable }
}

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_next")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name === "index.html") yield full
  }
}

function routeOf(outDir, file) {
  const rel = path.relative(outDir, path.dirname(file)).split(path.sep).filter(Boolean).join("/")
  return rel ? `/${rel}/` : "/"
}

function internalPath(href, origin) {
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return null
  try {
    const url = new URL(href, origin ?? "https://site.invalid")
    if (origin && url.origin !== origin) return null
    return url.pathname.endsWith("/") || hasFileExtension(url.pathname) ? url.pathname : `${url.pathname}/`
  } catch {
    return null
  }
}

/** Page <loc> paths from every out/sitemap*.xml. A sitemap index's <sitemap> entries point at other sitemaps, not pages. */
export function sitemapPaths(outDir) {
  const paths = []
  for (const name of fs.readdirSync(outDir)) {
    if (!/^sitemap.*\.xml$/.test(name)) continue
    const xml = fs.readFileSync(path.join(outDir, name), "utf8").replace(/<sitemap>[\s\S]*?<\/sitemap>/g, "")
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
      try {
        paths.push({ sitemap: name, loc: match[1], pathname: new URL(match[1]).pathname })
      } catch {
        paths.push({ sitemap: name, loc: match[1], pathname: null })
      }
    }
  }
  return paths
}

export function auditExport(outDir) {
  const errors = []
  const warnings = []
  const pages = new Map()

  for (const file of htmlFiles(outDir)) {
    const html = fs.readFileSync(file, "utf8")
    if (isRedirectStub(html)) continue
    const route = routeOf(outDir, file)
    pages.set(route, parsePage(html))
  }

  const inbound = new Map()
  for (const [route, page] of pages) {
    const origin = page.canonical ? new URL(page.canonical).origin : undefined
    for (const href of page.hrefs) {
      const target = internalPath(href, origin)
      if (!target || target === route) continue
      if (!inbound.has(target)) inbound.set(target, new Set())
      inbound.get(target).add(route)
    }
  }

  for (const [route, page] of pages) {
    const result = auditPage(page)
    for (const message of result.errors) errors.push({ route, message })
    for (const message of result.warnings) warnings.push({ route, message })
    const links = inbound.get(route)?.size ?? 0
    if (result.indexable && route !== "/" && links < MIN_INBOUND_LINKS) {
      warnings.push({ route, message: `only ${links} internal page(s) link here (aim for ${MIN_INBOUND_LINKS}+)` })
    }
  }

  for (const entry of sitemapPaths(outDir)) {
    const where = `${entry.sitemap}: ${entry.loc}`
    if (entry.pathname === null) errors.push({ route: where, message: "sitemap entry is not a valid URL" })
    else if (hasFileExtension(entry.pathname)) errors.push({ route: where, message: "sitemap entry is a file, not an HTML page" })
    else if (!pages.has(entry.pathname.endsWith("/") ? entry.pathname : `${entry.pathname}/`)) {
      errors.push({ route: where, message: "sitemap entry has no exported page (or the page is a redirect stub)" })
    }
  }

  return { errors, warnings, pageCount: pages.size }
}

/* eslint-disable no-console -- CLI output */
const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isCli) {
  const outDir = path.resolve(process.argv[2] ?? "out")
  if (!fs.existsSync(outDir)) {
    console.error(`check-seo-export: ${outDir} not found, run the build first`)
    process.exit(1)
  }
  const { errors, warnings, pageCount } = auditExport(outDir)
  if (warnings.length > 0) {
    console.warn(`check-seo-export: ${warnings.length} warning(s) (not blocking), first 15:`)
    for (const w of warnings.slice(0, 15)) console.warn(`  warn ${w.route}: ${w.message}`)
  }
  if (errors.length > 0) {
    for (const e of errors.slice(0, 50)) console.error(`  ${e.route}: ${e.message}`)
    if (errors.length > 50) console.error(`  ...and ${errors.length - 50} more`)
    console.error(`check-seo-export: ${errors.length} defect(s) across ${pageCount} pages`)
    process.exit(1)
  }
  console.log(`check-seo-export: ${pageCount} pages pass the SEO checks`)
}
