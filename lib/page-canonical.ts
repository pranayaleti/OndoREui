import type { Metadata } from "next"
import { CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { toAbsoluteSiteUrl } from "@/lib/site-index"

/**
 * Absolute self-canonical for a public page.
 * Matches `trailingSlash: true` so GitHub Pages `/path/` and `/path/index.html`
 * advertise the same URL Google should index.
 */
export function toCanonicalPageUrl(pathname: string): string {
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname
  }
  return toAbsoluteSiteUrl(pathname)
}

export function pageCanonicalMetadata(pathname: string, extra: Metadata = {}): Metadata {
  const canonical = toCanonicalPageUrl(pathname)
  const { alternates: extraAlternates, openGraph: extraOpenGraph, ...rest } = extra
  return {
    ...rest,
    alternates: {
      canonical,
      languages: buildMetadataLanguages(pathname),
      ...extraAlternates,
    },
    openGraph: {
      url: canonical,
      ...extraOpenGraph,
    },
  }
}

/** Pages Router leftover: `/calculators/mortgage-payment-calculator` vs App Router `/calculators/mortgage-payment/`. */
export function legacyCalculatorPathToCanonicalPath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const match = normalized.match(/^\/calculators\/([^/]+)-calculator$/)
  if (!match) return null
  const slug = match[1]
  if (!CALCULATOR_SLUGS.includes(slug)) return null
  return `/calculators/${slug}/`
}

export function legacyCalculatorSitemapExcludes(): string[] {
  return CALCULATOR_SLUGS.flatMap((slug) => [
    `/calculators/${slug}-calculator`,
    `/calculators/${slug}-calculator/`,
  ])
}
