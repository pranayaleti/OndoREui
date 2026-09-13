/**
 * Search-intent titles and descriptions for the templated city pages.
 *
 * Lives here rather than in the route files because Next.js App Router only
 * allows a fixed set of exports from a `page.tsx`.
 *
 * Written against the Sep 2026 Search Console export: 106 pages held 14,731
 * impressions and zero clicks. The templates below had the head term buried
 * behind a sales framing ("Why <city> Is a Great Place to Live & Invest") and,
 * on location pages, one byte-identical meta description across all 55 cities.
 */
import { cityMarketData } from "@/lib/city-market-data"
import { fitTitle } from "@/lib/site"

/**
 * City guides rank for informational intent: "alpine utah", "magna utah",
 * "cost of living in nephi ut", "moving to west valley city", "best
 * neighborhoods in west jordan", "kearns ut city guide". Lead with the head
 * term, then name the three things those queries are asking for.
 */
export function cityGuideTitle(cityName: string): string {
  return fitTitle(
    `${cityName}, UT: Cost of Living, Home Prices & Neighborhoods`,
    `${cityName}, UT: Cost of Living, Homes & Neighborhoods`,
    `${cityName}, UT: Cost of Living & Home Prices`,
    `Living in ${cityName}, UT: Costs & Home Prices`,
  )
}

/** Compact USD for snippets: 425000 -> "$425K", 1450 -> "$1,450". */
function compactUsd(value: number): string {
  return value >= 100000
    ? `$${Math.round(value / 1000)}K`
    : `$${value.toLocaleString("en-US")}`
}

/**
 * One description per city, carrying that city's own medians. A concrete
 * number in the snippet is the strongest CTR lever available here; these are
 * the same figures the page already renders under CITY_MARKET_DATA_DISCLOSURE.
 */
export function cityGuideDescription(cityName: string): string {
  const market = cityMarketData[cityName]
  if (!market) {
    return `What it costs to live in ${cityName}, Utah: median home and rent prices, commute times, schools, and the neighborhoods locals recommend.`
  }
  return `What it costs to live in ${cityName}, Utah: median home ${compactUsd(market.medianHomePrice)}, median rent ${compactUsd(market.medianRent)}, plus commute times, schools and neighborhoods.`
}

/**
 * Owners searching "<city> property management" price-shop first: "utah
 * property management pricing" and "how much does a property manager cost in
 * utah" outweigh the service terms. Fees in the title is the differentiator
 * almost no competitor uses.
 */
export function pmCityTitle(cityName: string): string {
  return fitTitle(
    `${cityName} Property Management: Fees, Leasing & Screening`,
    `${cityName} Property Management: Fees & Services`,
    `Property Management in ${cityName}, UT`,
  )
}

export function pmCityDescription(cityName: string): string {
  return `Property management in ${cityName}, Utah with fees quoted up front: management rate, leasing fee and maintenance markup. Free rental analysis.`
}

/** "<city> housing market" is what people type; "market report" is trade jargon. */
export function marketReportTitle(cityName: string): string {
  return fitTitle(
    `${cityName}, UT Housing Market: Prices, Rent & Trends`,
    `${cityName}, UT Housing Market: Prices & Rent`,
    `${cityName}, UT Housing Market`,
  )
}

export function marketReportDescription(cityName: string): string {
  return `${cityName}, Utah housing data: median sale price, median rent, days on market, inventory and rent-to-price ratio, compared to nearby cities.`
}
