/**
 * Broken-link audit for the static export (scripts/check-links.ts runs it in CI after the build).
 *
 * Checks every reference a visitor, crawler or agent can follow from the exported site: links,
 * images, scripts, stylesheets, Open Graph images, meta-refresh redirects, JSON-LD URLs,
 * links passed to client components in the RSC payload, CSS url()s, and site URLs inside the
 * Markdown / llms text files. A reference is fine when the export has a file for it, or when
 * app/not-found.tsx renders it client-side (listing detail, rental application, visit links).
 */
import { publicIdFromPathname } from "@/lib/public-property"
import { rentalClientRouteFromPathname } from "@/lib/rental-static-paths"
import { visitClientRouteFromPathname } from "@/lib/visit-static-paths"

export type Reference = { url: string; kind: string }

const TAG = /<(a|area|link|img|source|script|iframe|video|audio|track|embed|object|form|input|meta)\b([^>]*)>/gi
const ATTRIBUTE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const META_URL_KEYS = /^(og:image|og:image:url|og:image:secure_url|og:url|og:video|og:audio|twitter:image|twitter:image:src|twitter:url)$/i
const SOURCE_ATTRIBUTES: Record<string, string[]> = {
  a: ["href"],
  area: ["href"],
  link: ["href"],
  img: ["src", "srcset"],
  source: ["src", "srcset"],
  script: ["src"],
  iframe: ["src"],
  video: ["src", "poster"],
  audio: ["src"],
  track: ["src"],
  embed: ["src"],
  object: ["data"],
  form: ["action"],
  input: ["src"],
}

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

function attributesOf(source: string): Record<string, string> {
  const attributes: Record<string, string> = {}
  for (const match of source.matchAll(ATTRIBUTE)) {
    attributes[match[1]!.toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "")
  }
  return attributes
}

function collectJsonStrings(value: unknown, out: Reference[]): void {
  if (typeof value === "string") {
    if (/^https?:\/\//.test(value) || (value.startsWith("/") && !value.startsWith("//") && value.length > 1)) {
      out.push({ url: value, kind: "json-ld" })
    }
  } else if (Array.isArray(value)) {
    for (const item of value) collectJsonStrings(item, out)
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectJsonStrings(item, out)
  }
}

/** Every URL a page references. Fragment-only, mailto:, tel: and similar links are left out. */
export function extractReferences(html: string): Reference[] {
  const references: Reference[] = []
  const withoutScripts = html.replace(SCRIPT, (_whole, attributes: string, body: string) => {
    const attrs = attributesOf(attributes)
    if (attrs["src"]) references.push({ url: attrs["src"], kind: "script:src" })
    if ((attrs["type"] ?? "").toLowerCase() === "application/ld+json") {
      try {
        collectJsonStrings(JSON.parse(body), references)
      } catch {
        references.push({ url: "", kind: "json-ld:invalid" })
      }
    } else {
      // Props handed to client components, including links that only render after interaction.
      for (const match of body.matchAll(/\\"href\\":\\"(\/[^"\\]*)\\"/g)) references.push({ url: match[1]!, kind: "rsc:href" })
    }
    return ""
  })

  for (const match of withoutScripts.matchAll(TAG)) {
    const tag = match[1]!.toLowerCase()
    const attrs = attributesOf(match[2]!)
    if (tag === "meta") {
      const key = attrs["property"] ?? attrs["name"] ?? ""
      if (META_URL_KEYS.test(key) && attrs["content"]) references.push({ url: attrs["content"], kind: `meta:${key.toLowerCase()}` })
      if ((attrs["http-equiv"] ?? "").toLowerCase() === "refresh") {
        const target = /url=(.+)$/i.exec(attrs["content"] ?? "")?.[1]?.trim().replace(/^['"]|['"]$/g, "")
        if (target) references.push({ url: target, kind: "meta:refresh" })
      }
      continue
    }
    for (const name of SOURCE_ATTRIBUTES[tag] ?? []) {
      const value = attrs[name]
      if (!value) continue
      if (name === "srcset") {
        for (const candidate of value.split(",")) {
          const url = candidate.trim().split(/\s+/)[0]
          if (url) references.push({ url, kind: `${tag}:srcset` })
        }
      } else {
        references.push({ url: value, kind: tag === "link" ? `link:${(attrs["rel"] ?? "").toLowerCase()}` : `${tag}:${name}` })
      }
    }
  }
  return references
}

/** Site URLs mentioned in Markdown and plain-text files (llms.txt, .md twins, robots.txt). */
export function extractTextReferences(text: string, siteOrigins: readonly string[]): Reference[] {
  const references: Reference[] = []
  for (const origin of siteOrigins) {
    const escaped = origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    for (const match of text.matchAll(new RegExp(`${escaped}(/[^\\s)\\]"'<>\`\\\\]*)?`, "g"))) {
      references.push({ url: `${origin}${(match[1] ?? "/").replace(/[.,;:!*]+$/, "")}`, kind: "text" })
    }
  }
  for (const match of text.matchAll(/\]\((\/[^)\s]*)\)/g)) references.push({ url: match[1]!, kind: "text:markdown-link" })
  return references
}

/** Path on this site that a reference points to, or null for other hosts and non-page schemes. */
export function sitePathOf(url: string, fromPath: string, siteOrigins: readonly string[]): string | null {
  const raw = url.trim()
  if (!raw || raw.startsWith("#") || /^(mailto|tel|sms|javascript|data|blob|about|webcal):/i.test(raw)) return null
  // Templates such as "/[path].md" in agent discovery files describe URL patterns, not links.
  if (/[[\]{}<>]|\$\{/.test(raw)) return null
  let resolved: URL
  try {
    resolved = new URL(raw, `${siteOrigins[0]}${fromPath}`)
  } catch {
    return null
  }
  if (!siteOrigins.includes(resolved.origin)) return null
  try {
    return decodeURIComponent(resolved.pathname)
  } catch {
    return resolved.pathname
  }
}

/** Paths app/not-found.tsx renders client-side (GitHub Pages answers 404, visitors get the page). */
export function isClientRenderedPath(pathname: string): boolean {
  return Boolean(publicIdFromPathname(pathname) || rentalClientRouteFromPathname(pathname) || visitClientRouteFromPathname(pathname))
}

/** Whether the export serves a path, the way GitHub Pages resolves it. */
export function exportServes(pathname: string, files: ReadonlySet<string>): boolean {
  if (pathname.endsWith("/")) return files.has(`${pathname}index.html`)
  return files.has(pathname) || files.has(`${pathname}/index.html`) || files.has(`${pathname}.html`)
}
