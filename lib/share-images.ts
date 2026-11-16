/**
 * Link-preview (Open Graph / Twitter) images: 1200x630 JPEGs in public/og/, rendered by
 * scripts/generate-share-images.mjs. JPEG because LinkedIn and some messaging apps drop WebP previews.
 *
 * Pages name these paths directly in their metadata. `shareImagePath()` is for code that receives an
 * image from content (a blog post's `image`, an SEO prop) and must not share the retired stock art.
 */
export const SHARE_IMAGES = {
  /** Brand card: the homepage headline. Used wherever no service card fits. */
  default: "/og/ondo-real-estate.jpg",
  rent: "/og/rent.jpg",
  buy: "/og/buy.jpg",
  sell: "/og/sell.jpg",
  manage: "/og/manage.jpg",
  loans: "/og/loans.jpg",
  notary: "/og/notary.jpg",
  /** Blog, learn, FAQ, glossary, calculators and other reference pages. */
  guides: "/og/guides.jpg",
} as const

export type ShareImageKey = keyof typeof SHARE_IMAGES

export const SHARE_IMAGE_WIDTH = 1200
export const SHARE_IMAGE_HEIGHT = 630

/** Stock art that used to be shared as the preview for almost every page. None of it shows Utah or Ondo. */
const RETIRED_STOCK_ART =
  /(^|\/)(modern-office-building|modern-apartment-balcony|modern-townhouse-garage|suburban-house-garden|property-manager-meeting)\.(png|webp|jpe?g)$/i

export function isRetiredStockArt(src: string): boolean {
  return RETIRED_STOCK_ART.test(src)
}

/**
 * The image a page should share. A missing image or retired stock art becomes the `fallback` card; any
 * other image (a listing photo, the founder's letter card) is returned unchanged.
 */
export function shareImagePath(src: string | undefined | null, fallback: ShareImageKey = "default"): string {
  if (!src || isRetiredStockArt(src)) return SHARE_IMAGES[fallback]
  return src
}

/** Which card a URL path should share, by its first segment. Unlisted sections get the brand card. */
const SECTION_CARDS: Record<string, ShareImageKey> = {
  properties: "rent",
  buy: "buy",
  "get-matched": "buy",
  sell: "sell",
  "whats-my-home-worth": "sell",
  "property-management": "manage",
  pricing: "manage",
  "compare-utah-property-managers": "manage",
  loans: "loans",
  refinance: "loans",
  learn: "loans",
  qualify: "loans",
  notary: "notary",
  blog: "guides",
  faq: "guides",
  resources: "guides",
  glossary: "guides",
  calculators: "guides",
  "market-reports": "guides",
}

export function shareImageKeyForPath(pathname: string): ShareImageKey {
  const path = pathname.replace(/^https?:\/\/[^/]+/, "")
  const first = path.split("/").filter(Boolean)[0] ?? ""
  return SECTION_CARDS[first] ?? "default"
}
