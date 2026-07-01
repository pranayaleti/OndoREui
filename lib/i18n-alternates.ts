import { SITE_URL } from "@/lib/site"

function normalizePath(path: string): string {
  if (!path || path === "/") return "/"
  return `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, "")
  const cleanPath = normalizePath(path)
  return cleanPath === "/" ? `${cleanBase}/` : `${cleanBase}${cleanPath}/`
}

/**
 * next-sitemap alternateRefs entries for a given canonical path.
 */
export function buildSitemapAlternateRefs(
  path: string,
): Array<{ href: string; hreflang: string }> {
  const canonical = joinUrl(SITE_URL, path)
  return [
    { href: canonical, hreflang: "x-default" },
    { href: canonical, hreflang: "en-US" },
  ]
}

/**
 * Next.js Metadata `alternates.languages` for a given canonical path.
 */
export function buildMetadataLanguages(path: string): Record<string, string> {
  const canonical = joinUrl(SITE_URL, path)
  return {
    "x-default": canonical,
    "en-US": canonical,
  }
}
