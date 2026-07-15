export type NewsItem = {
  title: string
  excerpt: string
  source: string
  sourceUrl: string
  category: string
  region?: string
  date: string
}

/** Shared curated news sources for `/news` and `/socials`. */
export const NEWS_ITEMS: readonly NewsItem[] = [
  {
    title: "National Housing Market Update: Inventory and Rates",
    excerpt:
      "Latest data on home prices, inventory, and mortgage rates across major U.S. metros and what it means for buyers and sellers.",
    source: "Redfin News",
    sourceUrl: "https://www.redfin.com/news/",
    category: "Market Trends",
    region: "US",
    date: "Updated Weekly",
  },
  {
    title: "Real Estate News and Analysis",
    excerpt:
      "In-depth reporting on residential and commercial real estate including financing, policy changes, and investor activity.",
    source: "The Wall Street Journal – Real Estate",
    sourceUrl: "https://www.wsj.com/news/realestate",
    category: "National",
    region: "US",
    date: "Updated Daily",
  },
  {
    title: "Housing Wire: Mortgage & Housing Industry",
    excerpt:
      "Breaking news on mortgage rates, lending guidelines, and housing policy for agents, lenders, and investors.",
    source: "HousingWire",
    sourceUrl: "https://www.housingwire.com/",
    category: "Mortgage",
    region: "US",
    date: "Updated Daily",
  },
  {
    title: "Local Utah Real Estate Headlines",
    excerpt:
      "Coverage of Utah housing affordability, new developments, and population growth across the Wasatch Front.",
    source: "KSL Real Estate",
    sourceUrl: "https://www.ksl.com/real-estate",
    category: "Utah",
    region: "Utah",
    date: "Updated Regularly",
  },
  {
    title: "Salt Lake City Housing Market Data",
    excerpt:
      "Trends in prices, days on market, and inventory for Salt Lake City and surrounding counties, plus neighborhood-level insights.",
    source: "Zillow Research",
    sourceUrl: "https://www.zillow.com/research/",
    category: "Market Data",
    region: "Utah",
    date: "Updated Monthly",
  },
  {
    title: "Real Estate Policy and Regulation Updates",
    excerpt:
      "News on zoning changes, landlord–tenant regulations, and housing policy that can impact Utah investors and homeowners.",
    source: "National Association of Realtors",
    sourceUrl: "https://www.nar.realtor/newsroom",
    category: "Policy",
    region: "US",
    date: "Updated Regularly",
  },
]

/** First N items for the `/socials` latest-news strip. */
export function getLatestNewsItems(limit = 4): NewsItem[] {
  return NEWS_ITEMS.slice(0, limit)
}
