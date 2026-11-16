import type { Metadata } from "next"
import { CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import { htmlPathToMarkdownPath } from "@/lib/html-to-agent-markdown"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { SITE_NAME } from "@/lib/site"
import { toAbsoluteSiteUrl } from "@/lib/url"
import {
  SHARE_IMAGES,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  shareImageKeyForPath,
  type ShareImageKey,
} from "@/lib/share-images"

/**
 * Default social preview image, mirroring the root layout and `buildPageMetadata`: the brand card from
 * lib/share-images.ts (a real 1200x630 JPEG, so the size below is true).
 *
 * Next.js metadata REPLACES a parent segment's `openGraph` object rather than
 * deep-merging it, so any page that sets its own `openGraph` silently drops the
 * root layout's `og:image`. Pages built through `pageCanonicalMetadata` therefore
 * get an explicit image unless they supply their own: the card for their section.
 */
export const DEFAULT_OG_IMAGE_PATH = SHARE_IMAGES.default

/** Absolute URL form of {@link DEFAULT_OG_IMAGE_PATH}. */
export const DEFAULT_OG_IMAGE_URL = toAbsoluteSiteUrl(DEFAULT_OG_IMAGE_PATH)

const CARD_ALT: Record<ShareImageKey, string> = {
  default: `${SITE_NAME}: Utah real estate services`,
  rent: `${SITE_NAME}: homes for rent across the Wasatch Front`,
  buy: `${SITE_NAME}: buy a home in Utah`,
  sell: `${SITE_NAME}: sell your Utah home`,
  manage: `${SITE_NAME}: property management for Utah owners`,
  loans: `${SITE_NAME}: home loans in Utah`,
  notary: `${SITE_NAME}: online notary`,
  guides: `${SITE_NAME}: Utah real estate guides and calculators`,
}

const cardKeys = Object.keys(SHARE_IMAGES) as ShareImageKey[]

/** Absolute URL of each share card, for `twitter.images` and JSON-LD `image`. */
export const OG_IMAGE_URLS = Object.fromEntries(
  cardKeys.map((key) => [key, toAbsoluteSiteUrl(SHARE_IMAGES[key])]),
) as Record<ShareImageKey, string>

/** Ready-made `openGraph.images` value for each share card. */
export const OG_IMAGES = Object.fromEntries(
  cardKeys.map((key) => [
    key,
    [{ url: OG_IMAGE_URLS[key], width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT, alt: CARD_ALT[key] }],
  ]),
) as Record<ShareImageKey, { url: string; width: number; height: number; alt: string }[]>

/**
 * Ready-made `openGraph.images` value for routes that build their `Metadata`
 * by hand instead of going through {@link pageCanonicalMetadata}.
 */
export const DEFAULT_OG_IMAGES = OG_IMAGES.default

/** First image URL of an `openGraph.images` value, so the Twitter card can show the same picture. */
function firstImageUrl(images: NonNullable<Metadata["openGraph"]>["images"]): string | undefined {
  const first = Array.isArray(images) ? images[0] : images
  if (!first) return undefined
  if (typeof first === "string") return first
  if (first instanceof URL) return first.toString()
  return typeof first.url === "string" ? first.url : first.url.toString()
}

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

/** Plain string form of a Next `Metadata["title"]`, for reuse in OG and Twitter cards. */
function resolveTitleText(title: Metadata["title"]): string | undefined {
  if (!title) return undefined
  if (typeof title === "string") return title
  if ("absolute" in title && title.absolute) return title.absolute
  if ("default" in title && title.default) return title.default
  return undefined
}

export function pageCanonicalMetadata(pathname: string, extra: Metadata = {}): Metadata {
  const canonical = toCanonicalPageUrl(pathname)
  // A page that defines its own openGraph REPLACES the root layout's, and a page that
  // defines none inherits the homepage's title and description. Carry the page's own
  // title and description into the cards so previews describe the page being shared.
  const ogTitle = resolveTitleText(extra.title)
  const pageDescription = extra.description ?? undefined
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
  // No image named by the page: share the card for its section (loans, manage, guides, ...).
  const cardKey = shareImageKeyForPath(pathname)
  const ogImages = extraOpenGraph?.images ?? OG_IMAGES[cardKey]
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
      type: "website",
      siteName: SITE_NAME,
      url: canonical,
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(pageDescription ? { description: pageDescription } : {}),
      ...extraOpenGraph,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(pageDescription ? { description: pageDescription } : {}),
      ...extraTwitter,
      images: extraTwitter?.images ?? [firstImageUrl(ogImages) ?? OG_IMAGE_URLS[cardKey]],
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
