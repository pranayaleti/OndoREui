import type { Metadata } from "next"
import { CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import { htmlPathToMarkdownPath } from "@/lib/html-to-agent-markdown"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { SITE_NAME } from "@/lib/site"
import { toAbsoluteSiteUrl } from "@/lib/site-index"

/**
 * Default social preview image, mirroring the root layout and `buildPageMetadata`.
 *
 * Next.js metadata REPLACES a parent segment's `openGraph` object rather than
 * deep-merging it, so any page that sets its own `openGraph` silently drops the
 * root layout's `og:image`. Pages built through `pageCanonicalMetadata` therefore
 * get an explicit image unless they supply their own.
 */
export const DEFAULT_OG_IMAGE_PATH = "/modern-office-building.webp"

/** Absolute URL form of {@link DEFAULT_OG_IMAGE_PATH}. */
export const DEFAULT_OG_IMAGE_URL = toAbsoluteSiteUrl(DEFAULT_OG_IMAGE_PATH)

/**
 * Ready-made `openGraph.images` value for routes that build their `Metadata`
 * by hand instead of going through {@link pageCanonicalMetadata}.
 */
export const DEFAULT_OG_IMAGES = [
  {
    url: DEFAULT_OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: `${SITE_NAME}: Utah real estate services`,
  },
]

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
  const {
    alternates: extraAlternates,
    openGraph: extraOpenGraph,
    twitter: extraTwitter,
    ...rest
  } = extra
  const markdownPath = htmlPathToMarkdownPath(pathname)
  const extraTypes = extraAlternates?.types
  const restExtraAlternates = extraAlternates
    ? Object.fromEntries(Object.entries(extraAlternates).filter(([key]) => key !== "types"))
    : {}
  const ogImages = extraOpenGraph?.images ?? DEFAULT_OG_IMAGES
  return {
    ...rest,
    alternates: {
      canonical,
      languages: buildMetadataLanguages(pathname),
      ...(markdownPath || extraTypes
        ? {
            types: {
              ...(markdownPath ? { "text/markdown": toAbsoluteSiteUrl(markdownPath) } : {}),
              ...extraTypes,
            },
          }
        : {}),
      ...restExtraAlternates,
    },
    openGraph: {
      url: canonical,
      ...extraOpenGraph,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      ...extraTwitter,
      images: extraTwitter?.images ?? [DEFAULT_OG_IMAGE_URL],
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
