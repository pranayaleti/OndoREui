/**
 * Which footer disclosure an article carries. The credit disclosure (NMLS wording,
 * "not a commitment to lend") belongs on posts that discuss or solicit lending only.
 * Posts about property management, neighborhoods, selling, home care and similar topics
 * carry the real-estate disclosure instead, and investing, tax and legal posts add a
 * not-advice line. Anything not listed here defaults to "lending", the safer reading.
 *
 * A post can override its category default with `disclosure` in its ArticleShell meta
 * (a "Buying Guide" post with a loan officer CTA stays "lending").
 */
export type ArticleDisclosureKind = "lending" | "real-estate" | "advice"

const REAL_ESTATE_CATEGORIES = [
  "Analytics",
  "Calculators",
  "Comparison",
  "Home Care",
  "Home Improvement",
  "Market Data",
  "Market Outlook",
  "Migration",
  "Neighborhood Guide",
  "Notary",
  "Operations",
  "Payments",
  "Product",
  "Property Management",
  "For Agents",
  "For Renters",
  "Selling",
  "Technology",
  "Utah",
] as const

const ADVICE_CATEGORIES = ["Commercial", "Investing", "Investment", "Legal", "Strategy", "Taxes"] as const

const REAL_ESTATE_SET: ReadonlySet<string> = new Set(REAL_ESTATE_CATEGORIES)
const ADVICE_SET: ReadonlySet<string> = new Set(ADVICE_CATEGORIES)

export function articleDisclosureKind(
  category?: string,
  override?: ArticleDisclosureKind,
): ArticleDisclosureKind {
  if (override) return override
  if (category && ADVICE_SET.has(category)) return "advice"
  if (category && REAL_ESTATE_SET.has(category)) return "real-estate"
  return "lending"
}

export const ARTICLE_ADVICE_NOTICE =
  "This article is general education, not investment, tax or legal advice. Talk to a licensed professional about your own situation."
