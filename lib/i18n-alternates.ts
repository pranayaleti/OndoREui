import { SUPPORTED_LOCALES, type SupportedLocale } from "@/lib/locales"
import { SITE_URL } from "@/lib/site"

/**
 * BCP 47 tags keyed by our app's locale code. Used for hreflang output.
 */
export const BCP47_BY_LOCALE: Record<SupportedLocale, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  te: "te-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  kn: "kn-IN",
}

/**
 * Set NEXT_PUBLIC_I18N_ROUTED=1 once per-locale URL paths ship (e.g. /es/about).
 * Until then we emit only `x-default` + `en` alternates because every locale
 * resolves to the same English URL; claiming per-locale hreflang on identical
 * URLs would confuse search engines.
 */
export function isLocaleRoutingEnabled(): boolean {
  return process.env["NEXT_PUBLIC_I18N_ROUTED"] === "1"
}

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
  if (!isLocaleRoutingEnabled()) {
    return [
      { href: canonical, hreflang: "x-default" },
      { href: canonical, hreflang: BCP47_BY_LOCALE.en },
    ]
  }
  return [
    { href: canonical, hreflang: "x-default" },
    ...SUPPORTED_LOCALES.map((loc) => ({
      href: loc === "en" ? canonical : joinUrl(SITE_URL, `/${loc}${path}`),
      hreflang: BCP47_BY_LOCALE[loc],
    })),
  ]
}

/**
 * Next.js Metadata `alternates.languages` for a given canonical path.
 */
export function buildMetadataLanguages(path: string): Record<string, string> {
  const canonical = joinUrl(SITE_URL, path)
  if (!isLocaleRoutingEnabled()) {
    return {
      "x-default": canonical,
      [BCP47_BY_LOCALE.en]: canonical,
    }
  }
  const out: Record<string, string> = { "x-default": canonical }
  for (const loc of SUPPORTED_LOCALES) {
    out[BCP47_BY_LOCALE[loc]] =
      loc === "en" ? canonical : joinUrl(SITE_URL, `/${loc}${path}`)
  }
  return out
}
