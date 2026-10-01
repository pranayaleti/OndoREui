export type NewsItem = {
  title: string
  excerpt: string
  source: string
  sourceUrl: string
  category: string
  region?: string
}

/**
 * Outside news and data sources for `/news` and `/socials`. These are links to the
 * publishers' own pages, not Ondo reporting, so do not add dates or "updated" labels
 * we cannot verify.
 */
export const NEWS_ITEMS: readonly NewsItem[] = [
  {
    title: "Redfin News: housing market data",
    excerpt:
      "Latest data on home prices, inventory, and mortgage rates across major U.S. metros and what it means for buyers and sellers.",
    source: "Redfin News",
    sourceUrl: "https://www.redfin.com/news/",
    category: "Market Trends",
    region: "US",
  },
  {
    title: "The Wall Street Journal: real estate coverage",
    excerpt:
      "In-depth reporting on residential and commercial real estate including financing, policy changes, and investor activity.",
    source: "The Wall Street Journal – Real Estate",
    sourceUrl: "https://www.wsj.com/news/realestate",
    category: "National",
    region: "US",
  },
  {
    title: "HousingWire: mortgage and housing industry",
    excerpt:
      "Breaking news on mortgage rates, lending guidelines, and housing policy for agents, lenders, and investors.",
    source: "HousingWire",
    sourceUrl: "https://www.housingwire.com/",
    category: "Mortgage",
    region: "US",
  },
  {
    title: "KSL: Utah real estate coverage",
    excerpt:
      "Coverage of Utah housing affordability, new developments, and population growth across the Wasatch Front.",
    source: "KSL Real Estate",
    sourceUrl: "https://www.ksl.com/real-estate",
    category: "Utah",
    region: "Utah",
  },
  {
    title: "Zillow Research: housing market data",
    excerpt:
      "Trends in prices, days on market, and inventory for Salt Lake City and surrounding counties, plus neighborhood-level insights.",
    source: "Zillow Research",
    sourceUrl: "https://www.zillow.com/research/",
    category: "Market Data",
    region: "Utah",
  },
  {
    title: "NAR Newsroom: policy and regulation",
    excerpt:
      "News on zoning changes, landlord–tenant regulations, and housing policy that can impact Utah investors and homeowners.",
    source: "National Association of Realtors",
    sourceUrl: "https://www.nar.realtor/newsroom",
    category: "Policy",
    region: "US",
  },
]

/** First N items for the `/socials` latest-news strip. */
export function getLatestNewsItems(limit = 4): NewsItem[] {
  return NEWS_ITEMS.slice(0, limit)
}
