import { getContentNodeByPath } from "./graph"
import type { ContentCta } from "./types"

/**
 * Where an article sits on the site, and what it links to when the mortgage content
 * graph (lib/content/graph.ts) has no node for it.
 *
 * The graph only covers mortgage and homebuyer education. Landlord, neighborhood,
 * notary, home-care and developer posts are not in it, so `relatedLinksForPath` and
 * `ctaForPath` return nothing for them. Without a fallback they end in a dead end and,
 * before this module, were also breadcrumbed under the mortgage learning hub.
 */

export type ArticleHub = {
  /** Breadcrumb parent, site path without a trailing slash. */
  href: string
  /** Breadcrumb label. */
  label: string
  /** Label for the "back" button above the article. */
  backLabel: string
}

export type ArticleFallbackLink = { label: string; href: string; description: string }

export type ArticleFallback = {
  cta: ContentCta
  links: ArticleFallbackLink[]
}

const LEARN_HUB: ArticleHub = { href: "/learn", label: "Learn", backLabel: "← Mortgage learning hub" }
const BLOG_HUB: ArticleHub = { href: "/blog", label: "Blog", backLabel: "← All articles" }

/** Categories of posts that sit outside the graph but are still mortgage education. */
const MORTGAGE_CATEGORIES: ReadonlySet<string> = new Set([
  "Credit",
  "First-Time Buyers",
  "Loan Programs",
  "Mortgage",
  "Mortgage Basics",
  "Mortgages",
  "Refinance",
])

const PROPERTY_MANAGEMENT: ArticleFallback = {
  cta: { label: "See Ondo RE property management", href: "/property-management" },
  links: [
    {
      label: "Property management",
      href: "/property-management",
      description: "What Ondo RE manages, what it costs, and how owners are kept informed.",
    },
    {
      label: "Self-manage vs Ondo RE calculator",
      href: "/calculators/owner-vs-self",
      description: "Compare your net income managing it yourself against handing it over.",
    },
    { label: "Talk with Ondo RE", href: "/contact", description: "Ask a question or request a free rental analysis." },
  ],
}

const INVESTING: ArticleFallback = {
  cta: { label: "Run the ROI calculator", href: "/calculators/roi" },
  links: [
    { label: "ROI calculator", href: "/calculators/roi", description: "Model cash flow, paydown, appreciation and tax." },
    {
      label: "Cash-on-cash calculator",
      href: "/calculators/cash-on-cash",
      description: "Annual cash return on the cash you put in.",
    },
    { label: "All calculators", href: "/calculators", description: "Mortgage, rental and investment calculators." },
    { label: "Talk with Ondo RE", href: "/contact", description: "Ask a question about a property or a plan." },
  ],
}

const NEIGHBORHOODS: ArticleFallback = {
  cta: { label: "Explore Utah locations", href: "/locations" },
  links: [
    { label: "Utah locations", href: "/locations", description: "City guides across the Wasatch Front." },
    { label: "Market reports", href: "/market-reports", description: "Local market data by city." },
    {
      label: "Property management",
      href: "/property-management",
      description: "What Ondo RE manages, what it costs, and how owners are kept informed.",
    },
  ],
}

const SELLING: ArticleFallback = {
  cta: { label: "Talk about selling", href: "/sell" },
  links: [
    { label: "Selling with Ondo RE", href: "/sell", description: "How a listing with Ondo RE works." },
    {
      label: "Home sale proceeds calculator",
      href: "/calculators/home-sale",
      description: "Net proceeds after fees, taxes and payoff.",
    },
    { label: "Talk with Ondo RE", href: "/contact", description: "Ask a question or request a listing consult." },
  ],
}

const NOTARY: ArticleFallback = {
  cta: { label: "See notary services", href: "/notary" },
  links: [
    { label: "Notary services", href: "/notary", description: "Mobile and remote online notarization from Ondo RE." },
    { label: "Talk with Ondo RE", href: "/contact", description: "Ask about a signing." },
  ],
}

const MORTGAGE: ArticleFallback = {
  cta: { label: "Start a mortgage conversation", href: "/qualify" },
  links: [
    { label: "Mortgage learning hub", href: "/learn", description: "Plain-English mortgage education for Utah buyers." },
    { label: "Utah home loans", href: "/loans", description: "Conventional, FHA, VA, USDA, jumbo and specialty programs." },
    {
      label: "Mortgage payment calculator",
      href: "/calculators/mortgage-payment",
      description: "Estimate a payment with taxes, insurance and PMI.",
    },
  ],
}

const GENERAL: ArticleFallback = {
  cta: { label: "Talk with Ondo RE", href: "/contact" },
  links: [
    { label: "All articles", href: "/blog", description: "Guides on Utah property management, buying, selling and notary." },
    { label: "Property management", href: "/property-management", description: "What Ondo RE manages and what it costs." },
    { label: "Talk with Ondo RE", href: "/contact", description: "Ask a question." },
  ],
}

const BY_CATEGORY: Record<string, ArticleFallback> = {
  Analytics: PROPERTY_MANAGEMENT,
  Calculators: INVESTING,
  Comparison: PROPERTY_MANAGEMENT,
  Commercial: INVESTING,
  Finance: INVESTING,
  "For Agents": PROPERTY_MANAGEMENT,
  "For Renters": PROPERTY_MANAGEMENT,
  Investing: INVESTING,
  Investment: INVESTING,
  Migration: PROPERTY_MANAGEMENT,
  "Market Data": NEIGHBORHOODS,
  "Market Outlook": NEIGHBORHOODS,
  "Neighborhood Guide": NEIGHBORHOODS,
  Notary: NOTARY,
  Operations: PROPERTY_MANAGEMENT,
  Payments: PROPERTY_MANAGEMENT,
  Product: PROPERTY_MANAGEMENT,
  "Property Management": PROPERTY_MANAGEMENT,
  Selling: SELLING,
  Strategy: INVESTING,
  Taxes: INVESTING,
  Technology: PROPERTY_MANAGEMENT,
  Utah: NEIGHBORHOODS,
}

/** True when the post is mortgage education: in the content graph, or categorised as such. */
export function isMortgageArticle(path: string, category?: string): boolean {
  if (getContentNodeByPath(path)) return true
  return category ? MORTGAGE_CATEGORIES.has(category) : false
}

/** Breadcrumb parent and back link: Learn for mortgage posts, Blog for everything else. */
export function articleHubFor(path: string, category?: string): ArticleHub {
  return isMortgageArticle(path, category) ? LEARN_HUB : BLOG_HUB
}

/** Related links and a default call to action for a post the content graph does not cover. */
export function articleFallbackFor(category?: string): ArticleFallback {
  if (!category) return GENERAL
  if (MORTGAGE_CATEGORIES.has(category)) return MORTGAGE
  return BY_CATEGORY[category] ?? GENERAL
}
