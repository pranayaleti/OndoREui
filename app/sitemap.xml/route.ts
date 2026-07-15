import { backendUrl } from "@/lib/backend"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { SITE_URL } from "@/lib/site"
import { getAllNotaryCityParams, getAllNotaryStateParams } from "@/lib/notary-cities"

/**
 * Dynamic sitemap. Includes:
 *   - Static marketing routes
 *   - Every calculator slug from CALCULATOR_CATALOG (auto-updates when a new
 *     calculator is registered — no sitemap edit needed)
 *   - One entry per active public property listing (sourced from /api/properties/public)
 *
 * Cached for 1 hour to keep the response cheap; Google won't re-crawl faster than
 * that anyway. If this needs more freshness, drop revalidate to 600.
 */

export const revalidate = 3600

interface ApiPropertyLite {
  publicId?: string
  id?: string
  updatedAt?: string
  updated_at?: string
}

const STATIC_PATHS: string[] = [
  "",
  "/about",
  "/properties",
  "/locations",
  "/neighborhoods",
  "/schools",
  "/market-reports",
  "/pricing",
  "/contact",
  "/apply",
  "/buy",
  "/sell",
  "/property-management",
  "/loans",
  "/mortgages",
  "/refinance",
  "/insights",
  "/founders-letter",
  "/privacy-policy",
  "/terms-of-service",
  "/accessibility",
  "/affiliate",
  "/calculators",
  "/qualify",
  "/feedback",
  "/notary",
  "/notary/on-demand",
  "/notary/locations",
  "/get-matched",
  "/compare-utah-property-managers",
  "/whats-my-home-worth",
  "/blog/ultimate-guide-becoming-utah-landlord-2026",
]

// Auto-include every calculator slug. Adding a new calculator (see
// lib/calculator-catalog.ts) requires no sitemap edit.
const CALCULATOR_PATHS: string[] = Object.keys(CALCULATOR_CATALOG).map(
  (slug) => `/calculators/${slug}`
)

async function fetchListings(): Promise<ApiPropertyLite[]> {
  try {
    const res = await fetch(backendUrl("/api/properties/public"), { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json: unknown = await res.json()
    if (Array.isArray(json)) return json as ApiPropertyLite[]
    if (json && typeof json === "object" && "data" in json && Array.isArray((json as { data: unknown }).data)) {
      return (json as { data: ApiPropertyLite[] }).data
    }
    return []
  } catch {
    return []
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const listings = await fetchListings()

  const staticUrls = STATIC_PATHS.map((p) => {
    const loc = `${SITE_URL}${p}`
    return `  <url><loc>${escapeXml(loc)}</loc><changefreq>${p === "" ? "daily" : "weekly"}</changefreq><priority>${p === "" ? "1.0" : "0.7"}</priority></url>`
  })

  // Calculators: stable utility pages, low-priority but worth indexing for
  // long-tail SEO ("Utah cap rate calculator", etc.).
  const calculatorUrls = CALCULATOR_PATHS.map((p) => {
    const loc = `${SITE_URL}${p}`
    return `  <url><loc>${escapeXml(loc)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
  })

  // Trailing slash matches next.config trailingSlash + page canonicals.
  const notaryStateUrls = getAllNotaryStateParams().map(({ state }) => {
    const loc = `${SITE_URL}/notary/${state}/`
    return `  <url><loc>${escapeXml(loc)}</loc><changefreq>monthly</changefreq><priority>0.65</priority></url>`
  })

  const notaryCityUrls = getAllNotaryCityParams().map(({ state, city }) => {
    const loc = `${SITE_URL}/notary/${state}/${city}/`
    return `  <url><loc>${escapeXml(loc)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
  })

  const listingUrls = listings.map((l) => {
    const id = encodeURIComponent(l.publicId ?? l.id ?? "")
    if (!id) return ""
    const lastmod = l.updatedAt ?? l.updated_at
    return `  <url><loc>${SITE_URL}/properties/${id}</loc>${
      lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : ""
    }<changefreq>weekly</changefreq><priority>0.8</priority></url>`
  }).filter(Boolean)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...calculatorUrls, ...notaryStateUrls, ...notaryCityUrls, ...listingUrls].join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  })
}
