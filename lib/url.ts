import { SITE_URL } from "@/lib/site"

/**
 * Leaf URL helpers. Keep this file free of heavy imports: `lib/seo.ts` and
 * `lib/page-canonical.ts` reach client bundles, and pulling `lib/site-index.ts`
 * in for a path helper drags the whole glossary and site index along.
 */
const baseSiteUrl = SITE_URL.replace(/\/$/, "")
const FILE_PATH = /\.[a-z0-9]{2,8}$/i

/** Canonical path with trailing slash (matches `trailingSlash: true`), except for static file paths like `/sitemap.xml`. */
export function toSitePath(href: string): string {
  if (href === "/") return "/"
  const trimmed = href.replace(/\/+$/, "") || "/"
  if (trimmed !== "/" && FILE_PATH.test(trimmed)) return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  if (trimmed === "/") return "/"
  return `${trimmed}/`
}

export function toAbsoluteSiteUrl(href: string): string {
  const path = toSitePath(href)
  if (path === "/") return `${baseSiteUrl}/`
  return `${baseSiteUrl}${path}`
}
