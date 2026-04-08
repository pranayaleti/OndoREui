/**
 * Bulk city blog generator
 * Generates 5 blog post templates × 55 cities = up to 275 blog posts
 * from existing city-market-data.ts and city-content.ts data.
 *
 * Run: npx tsx scripts/generate-city-blogs.ts
 * Dry run: npx tsx scripts/generate-city-blogs.ts --dry-run
 * Limit: npx tsx scripts/generate-city-blogs.ts --limit 10
 *
 * Idempotent — skips files that already exist.
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const BLOG_DIR = path.join(ROOT, "app", "blog")
const YEAR = "2026"

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")
const limitArg = args.find((a) => a.startsWith("--limit="))
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity

// ── Inline city data (extracted from utah-cities.ts to avoid ESM/CJS issues) ─

type CityMarketData = {
  medianHomePrice: number
  medianRent: number
  population: number
  growthRate: string
  avgDaysOnMarket: number
  medianHouseholdIncome: number
  ownerOccupiedPct: number
  topEmployers: string[]
  schoolDistrict: string
  notableSchools: string[]
  outdoorRec: string[]
  localLandmarks: string[]
  geographyNote?: string
}

type CityContent = {
  overview?: string
  neighborhoods?: string[]
  highlights?: string[]
  lifestyleDescription?: string
}

// Read the data files at runtime using dynamic require trick
// (tsx handles TypeScript imports natively)
const { utahCitiesFromNorthOgdenToNephi, toCitySlug } = await import("../lib/utah-cities.js").catch(
  () => import("../lib/utah-cities.ts" as string)
) as any
const { cityMarketData } = await import("../lib/city-market-data.js").catch(
  () => import("../lib/city-market-data.ts" as string)
) as any
const { cityContentByName } = await import("../lib/city-content.js").catch(
  () => import("../lib/city-content.ts" as string)
) as any

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString()
}

function citySlug(name: string): string {
  return toCitySlug(name)
}

function escapeApos(s: string): string {
  return s.replace(/'/g, "&apos;").replace(/"/g, "&quot;")
}

// ── Template 1: Best Neighborhoods ───────────────────────────────────────────

function bestNeighborhoodsPost(
  city: string,
  slug: string,
  market: CityMarketData,
  content: CityContent
): string {
  const neighborhoods = content?.neighborhoods ?? ["Downtown", "North Side", "East Bench"]
  const schools = market.notableSchools.slice(0, 3).join(", ") || market.schoolDistrict
  const title = `Best Neighborhoods in ${city}, Utah (${YEAR} Guide)`
  const description = `A local breakdown of the top neighborhoods in ${city}, UT — home prices, schools, lifestyle, and investment notes for renters, buyers, and investors.`
  const postSlug = `/blog/best-neighborhoods-${slug}-utah`
  const keywords = [`best neighborhoods ${city} Utah`, `${city} neighborhoods`, `living in ${city} Utah`, `${city} UT real estate`]

  const neighborhoodSections = neighborhoods.map((n, i) => {
    // Parse "Name — Description" format if present
    const [nameRaw, ...descParts] = n.split(" — ")
    const nName = nameRaw.trim()
    const nDesc = descParts.join(" — ").trim() || `A well-established area in ${city} with strong community character.`
    return `
            <h2>${i + 1}. ${escapeApos(nName)}</h2>
            <p>${escapeApos(nDesc)}</p>
            <p><strong>Best for:</strong> Families, professionals, and long-term renters who want stability and community amenities.</p>
            <p><strong>School highlight:</strong> Served by ${market.schoolDistrict}. Notable schools nearby: ${schools}.</p>`
  }).join("\n")

  return `import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "${postSlug}"
const title = "${title}"
const description = "${description}"
const published = "${YEAR}-04-06"
const author = "Ondo RE Team"
const category = "Neighborhood Guide"
const image = "/suburban-house-garden.png"
const keywords = ${JSON.stringify(keywords)}

export const metadata: Metadata = {
  title: \`\${title} | Ondo Real Estate\`,
  description,
  alternates: { canonical: \`\${SITE_URL}\${slug}/\` },
  openGraph: { title: \`\${title} | Ondo Real Estate\`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function BestNeighborhoods${city.replace(/[^a-zA-Z]/g, "")}() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={\`\${SITE_URL}\${image}\`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Find the right neighborhood before you sign a lease or make an offer." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">${city}, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead text-xl text-foreground/70 mb-6">
              ${escapeApos(content?.overview ?? `${city} offers a range of neighborhoods for every lifestyle and budget. Here&apos;s what you need to know before choosing where to live or invest.`)}
            </p>
            ${neighborhoodSections}
            <h2>Market Snapshot</h2>
            <ul>
              <li><strong>Median Home Price:</strong> ${fmtUsd(market.medianHomePrice)}</li>
              <li><strong>Median Rent:</strong> ${fmtUsd(market.medianRent)}/mo</li>
              <li><strong>Avg Days on Market:</strong> ${market.avgDaysOnMarket} days</li>
              <li><strong>Year-over-Year Growth:</strong> ${market.growthRate}</li>
            </ul>
            <h2>Working with a Local Expert</h2>
            <p>
              Ondo Real Estate serves all ${city} neighborhoods with local property management, buy/sell representation, and mortgage solutions.
              Our team knows which streets fill fastest and which blocks carry hidden risk.
            </p>
          </div>
          <div className="not-prose mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Talk to a ${city} Expert</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/locations/${slug}/">${city} City Guide</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
`
}

// ── Template 2: Cost of Living ────────────────────────────────────────────────

function costOfLivingPost(
  city: string,
  slug: string,
  market: CityMarketData,
): string {
  const monthlyMortgage = Math.round((market.medianHomePrice * 0.8 * 0.00668))
  const title = `Cost of Living in ${city}, Utah (${YEAR})`
  const description = `Housing costs, rent prices, taxes, utilities, and daily expenses in ${city}, UT. A practical breakdown for people moving to the Wasatch Front.`
  const postSlug = `/blog/cost-of-living-${slug}-utah`
  const keywords = [`cost of living ${city} Utah`, `${city} UT housing costs`, `moving to ${city} Utah`, `${city} rent prices`]

  return `import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "${postSlug}"
const title = "${title}"
const description = "${description}"
const published = "${YEAR}-04-06"
const author = "Ondo RE Team"
const category = "Cost Guide"
const image = "/suburban-house-garden.png"
const keywords = ${JSON.stringify(keywords)}

export const metadata: Metadata = {
  title: \`\${title} | Ondo Real Estate\`,
  description,
  alternates: { canonical: \`\${SITE_URL}\${slug}/\` },
  openGraph: { title: \`\${title} | Ondo Real Estate\`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function CostOfLiving${city.replace(/[^a-zA-Z]/g, "")}() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={\`\${SITE_URL}\${image}\`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="What does it actually cost to live in ${city}?" backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">${city}, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Housing Costs</h2>
            <p>
              The median home price in ${city} is <strong>${fmtUsd(market.medianHomePrice)}</strong>.
              A 20% down payment puts the purchase at ${fmtUsd(Math.round(market.medianHomePrice * 0.8))},
              with an estimated monthly mortgage payment of approximately <strong>$${monthlyMortgage.toLocaleString()}/month</strong>
              (30-year fixed at current rates).
            </p>
            <p>
              Renters can expect to pay around <strong>${fmtUsd(market.medianRent)}/month</strong> for a typical unit.
              ${city} has a ${market.ownerOccupiedPct}% owner-occupancy rate, meaning roughly ${100 - market.ownerOccupiedPct}% of residents rent.
            </p>

            <h2>Income &amp; Affordability</h2>
            <p>
              Median household income in ${city} is <strong>${fmtUsd(market.medianHouseholdIncome)}/year</strong>
              (${fmtUsd(Math.round(market.medianHouseholdIncome / 12))}/month). Using the 30% rule, a household at the median
              income should spend no more than <strong>${fmtUsd(Math.round(market.medianHouseholdIncome * 0.3 / 12))}/month</strong> on housing.
              At ${fmtUsd(market.medianRent)}/mo median rent, ${city} is
              ${market.medianRent <= market.medianHouseholdIncome * 0.3 / 12 ? "within the 30% threshold" : "slightly above the 30% threshold"} for a median-income household.
            </p>

            <h2>Utilities &amp; Daily Expenses</h2>
            <ul>
              <li><strong>Electricity:</strong> $80–$150/month (summer A/C adds $50–$100)</li>
              <li><strong>Gas &amp; Heat:</strong> $60–$120/month (winter peaks higher)</li>
              <li><strong>Internet:</strong> $50–$80/month (Xfinity/CenturyLink/Utopia Fiber)</li>
              <li><strong>Groceries:</strong> $400–$600/month for a family of 4</li>
              <li><strong>Utah State Income Tax:</strong> 4.55% flat rate</li>
              <li><strong>Sales Tax (Salt Lake/Utah Co.):</strong> 7.25%</li>
            </ul>

            <h2>Commute Costs</h2>
            <p>
              Major employers near ${city} include ${market.topEmployers.slice(0, 3).join(", ")}.
              ${market.outdoorRec.length > 0 ? `Outdoor recreation — ${market.outdoorRec[0]} — is a free lifestyle benefit residents consistently value.` : ""}
            </p>

            <h2>Is ${city} Affordable in ${YEAR}?</h2>
            <p>
              ${city} home prices have grown at <strong>${market.growthRate}</strong> year-over-year. With
              ${market.avgDaysOnMarket} average days on market, competition remains steady. For renters,
              the ${fmtUsd(market.medianRent)} median is competitive with other Wasatch Front cities.
            </p>
          </div>
          <div className="not-prose mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/calculators/affordability">Run Affordability Calculator</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing/${slug}/">${city} Pricing Guide</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
`
}

// ── Template 3: Renting vs Buying ─────────────────────────────────────────────

function rentVsBuyPost(
  city: string,
  slug: string,
  market: CityMarketData,
): string {
  const monthlyMortgage = Math.round(market.medianHomePrice * 0.8 * 0.00668)
  const breakEvenYears = Math.round((market.medianHomePrice * 0.03) / ((monthlyMortgage - market.medianRent) * 12 || 1))
  const title = `Renting vs. Buying in ${city}, Utah: A ${YEAR} Analysis`
  const description = `Should you rent or buy in ${city}, UT? We break down the numbers — monthly payments, break-even timelines, equity building, and lifestyle factors.`
  const postSlug = `/blog/renting-vs-buying-${slug}`
  const keywords = [`renting vs buying ${city}`, `should I buy a home in ${city} Utah`, `${city} UT rent or buy`, `${city} real estate ${YEAR}`]

  return `import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "${postSlug}"
const title = "${title}"
const description = "${description}"
const published = "${YEAR}-04-06"
const author = "Ondo RE Team"
const category = "Buyer Guide"
const image = "/suburban-house-garden.png"
const keywords = ${JSON.stringify(keywords)}

export const metadata: Metadata = {
  title: \`\${title} | Ondo Real Estate\`,
  description,
  alternates: { canonical: \`\${SITE_URL}\${slug}/\` },
  openGraph: { title: \`\${title} | Ondo Real Estate\`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function RentVsBuy${city.replace(/[^a-zA-Z]/g, "")}() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={\`\${SITE_URL}\${image}\`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="The numbers behind one of the biggest financial decisions you'll make." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">${city}, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>The Numbers in ${city}</h2>
            <p>
              Median home price: <strong>${fmtUsd(market.medianHomePrice)}</strong> &bull;
              Median rent: <strong>${fmtUsd(market.medianRent)}/mo</strong> &bull;
              Annual price growth: <strong>${market.growthRate}</strong>
            </p>
            <p>
              With a 20% down payment (${fmtUsd(Math.round(market.medianHomePrice * 0.2))}), your estimated monthly
              mortgage payment is approximately <strong>$${monthlyMortgage.toLocaleString()}/month</strong> — about
              <strong> $${Math.abs(monthlyMortgage - market.medianRent).toLocaleString()} ${monthlyMortgage > market.medianRent ? "more" : "less"}</strong> than
              the median rent of ${fmtUsd(market.medianRent)}.
            </p>

            <h2>Break-Even Timeline</h2>
            <p>
              After accounting for transaction costs, maintenance, and opportunity cost on the down payment,
              buyers in ${city} typically reach break-even compared to renting in approximately
              <strong> ${Math.max(3, Math.min(breakEvenYears, 12))} years</strong>.
              If you plan to stay longer than that, buying starts to build significant equity.
            </p>

            <h2>When Renting Wins</h2>
            <ul>
              <li>You plan to relocate within 3 years</li>
              <li>You lack a 10–20% down payment (${fmtUsd(Math.round(market.medianHomePrice * 0.1))}–${fmtUsd(Math.round(market.medianHomePrice * 0.2))})</li>
              <li>Your income is variable or you&apos;re starting a new job</li>
              <li>You want to explore different ${city} neighborhoods before committing</li>
            </ul>

            <h2>When Buying Wins</h2>
            <ul>
              <li>You plan to stay 5+ years in ${city}</li>
              <li>You have a stable income and a down payment saved</li>
              <li>You want to lock in a fixed payment against ${city}&apos;s ${market.growthRate} annual appreciation</li>
              <li>You want to eventually rent the property out — ${city} generates a ~${((market.medianRent * 12) / market.medianHomePrice * 100).toFixed(1)}% gross yield</li>
            </ul>

            <h2>Market Trend</h2>
            <p>
              ${city} homes have averaged <strong>${market.avgDaysOnMarket} days on market</strong> recently.
              ${market.avgDaysOnMarket < 20
                ? "That's a fast-moving market — buyers need pre-approval ready before touring."
                : "The pace gives buyers reasonable time to evaluate options without panic offers."}
            </p>
          </div>
          <div className="not-prose mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/calculators/mortgage">Run Mortgage Calculator</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/buy-sell/${slug}/">Buy or Sell in ${city}</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
`
}

// ── Template 4: Property Management Guide for Investors ──────────────────────

function pmGuidePost(
  city: string,
  slug: string,
  market: CityMarketData,
  content: CityContent
): string {
  const grossYield = ((market.medianRent * 12) / market.medianHomePrice * 100).toFixed(1)
  const title = `${city} Property Management Guide for Investors (${YEAR})`
  const description = `A complete guide to managing rental properties in ${city}, UT — tenant profiles, pricing strategy, legal requirements, and working with a local PM firm.`
  const postSlug = `/blog/property-management-guide-${slug}-investors`
  const keywords = [`${city} property management`, `rental property ${city} Utah`, `${city} UT landlord guide`, `property management ${city} ${YEAR}`]

  return `import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "${postSlug}"
const title = "${title}"
const description = "${description}"
const published = "${YEAR}-04-06"
const author = "Ondo RE Team"
const category = "Investor Guide"
const image = "/suburban-house-garden.png"
const keywords = ${JSON.stringify(keywords)}

export const metadata: Metadata = {
  title: \`\${title} | Ondo Real Estate\`,
  description,
  alternates: { canonical: \`\${SITE_URL}\${slug}/\` },
  openGraph: { title: \`\${title} | Ondo Real Estate\`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function PMGuide${city.replace(/[^a-zA-Z]/g, "")}() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={\`\${SITE_URL}\${image}\`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Everything a ${city} landlord needs to know in ${YEAR}." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">${city}, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Why ${city}?</h2>
            <p>
              ${escapeApos(content?.overview ?? `${city} is one of Utah's stable rental markets with consistent demand from local employers and families.`)}
            </p>
            <p>
              At a median home price of <strong>${fmtUsd(market.medianHomePrice)}</strong> and median rent of
              <strong> ${fmtUsd(market.medianRent)}/mo</strong>, the gross rental yield is approximately
              <strong> ${grossYield}%</strong>. Population growth of <strong>${market.growthRate}</strong>
              signals continued rental demand.
            </p>

            <h2>Tenant Profile</h2>
            <p>
              The median household income is ${fmtUsd(market.medianHouseholdIncome)}/year.
              Top local employers include ${market.topEmployers.slice(0, 4).join(", ")}.
              The ${100 - market.ownerOccupiedPct}% renter rate creates a consistent demand pool.
            </p>

            <h2>Pricing Your Rental</h2>
            <p>
              Price within 3–5% of the ${fmtUsd(market.medianRent)} median and you should lease
              in under ${market.avgDaysOnMarket} days. Properties priced above market in ${city}
              sit 2–3× longer on average — vacancies erode returns faster than a modest rent reduction.
            </p>

            <h2>Utah Landlord Law Essentials</h2>
            <ul>
              <li>Security deposit: No statutory limit, but must be returned within 30 days of move-out</li>
              <li>Notice to vacate (month-to-month): 15 days</li>
              <li>Eviction (unlawful detainer): 3-day pay-or-quit notice, then court filing</li>
              <li>Habitability: Landlord must maintain heat, running water, and structural integrity</li>
              <li>Entry notice: 24 hours minimum except in emergencies</li>
            </ul>

            <h2>Working with a Property Manager</h2>
            <p>
              A full-service PM firm handles marketing, tenant screening, rent collection, maintenance
              coordination, and legal compliance. For ${city} properties, typical fees run
              8–12% of monthly rent plus a leasing fee (50–100% of first month&apos;s rent).
            </p>
            ${content?.highlights ? `<p>Local advantages: ${escapeApos(content.highlights.join("; "))}.</p>` : ""}
          </div>
          <div className="not-prose mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/property-management/${slug}/">Get a ${city} PM Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/calculators/cap-rate">Cap Rate Calculator</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
`
}

// ── Template 5: Market Report ─────────────────────────────────────────────────

function marketReportPost(
  city: string,
  slug: string,
  market: CityMarketData,
): string {
  const title = `${city} Real Estate Market Report ${YEAR}`
  const description = `${YEAR} real estate market data for ${city}, UT — median home prices, rent trends, days on market, top employers, and investment outlook.`
  const postSlug = `/blog/${slug}-real-estate-market-${YEAR}`
  const keywords = [`${city} real estate market ${YEAR}`, `${city} UT home prices`, `${city} housing market`, `${city} Utah investment`]

  return `import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "${postSlug}"
const title = "${title}"
const description = "${description}"
const published = "${YEAR}-04-06"
const author = "Ondo RE Team"
const category = "Market Report"
const image = "/suburban-house-garden.png"
const keywords = ${JSON.stringify(keywords)}

export const metadata: Metadata = {
  title: \`\${title} | Ondo Real Estate\`,
  description,
  alternates: { canonical: \`\${SITE_URL}\${slug}/\` },
  openGraph: { title: \`\${title} | Ondo Real Estate\`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function MarketReport${city.replace(/[^a-zA-Z]/g, "")}${YEAR}() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={\`\${SITE_URL}\${image}\`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Data-driven insights for buyers, sellers, and investors in ${city}." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">${city}, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Key Statistics — ${YEAR}</h2>
            <ul>
              <li><strong>Median Home Price:</strong> ${fmtUsd(market.medianHomePrice)}</li>
              <li><strong>Median Monthly Rent:</strong> ${fmtUsd(market.medianRent)}</li>
              <li><strong>Population:</strong> ${market.population.toLocaleString()}</li>
              <li><strong>Year-over-Year Growth:</strong> ${market.growthRate}</li>
              <li><strong>Avg Days on Market:</strong> ${market.avgDaysOnMarket}</li>
              <li><strong>Median Household Income:</strong> ${fmtUsd(market.medianHouseholdIncome)}</li>
              <li><strong>Owner-Occupancy Rate:</strong> ${market.ownerOccupiedPct}%</li>
              <li><strong>Gross Rental Yield:</strong> ${((market.medianRent * 12) / market.medianHomePrice * 100).toFixed(1)}%</li>
            </ul>

            <h2>Economic Drivers</h2>
            <p>
              Top employers in ${city}: <strong>${market.topEmployers.join(", ")}</strong>.
              ${market.geographyNote ?? ""}
            </p>

            <h2>School District</h2>
            <p>
              ${city} is served by <strong>${market.schoolDistrict}</strong>.
              Notable schools: ${market.notableSchools.join(", ") || "See district website for full list"}.
            </p>

            ${market.outdoorRec.length > 0 ? `<h2>Lifestyle &amp; Recreation</h2>
            <p>
              ${city} residents enjoy: ${market.outdoorRec.join(", ")}.
              ${market.localLandmarks.length > 0 ? `Local landmarks include ${market.localLandmarks.join(", ")}.` : ""}
            </p>` : ""}

            <h2>Investment Outlook</h2>
            <p>
              With ${market.growthRate} annual appreciation and ${market.avgDaysOnMarket} average days on market,
              ${city} ${market.avgDaysOnMarket < 25 ? "remains a competitive seller&apos;s market with strong rental demand" : "offers balanced conditions for buyers willing to move decisively"}.
              The ${((market.medianRent * 12) / market.medianHomePrice * 100).toFixed(1)}% gross yield is
              ${(market.medianRent * 12) / market.medianHomePrice > 0.07 ? "above average for the Wasatch Front — positive cash flow is achievable with appropriate leverage" : "typical for the Wasatch Front — appreciation rather than cash flow is the primary driver"}.
            </p>
          </div>
          <div className="not-prose mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/market-reports/${slug}/">Full ${city} Market Report</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/calculators/cash-on-cash">Cash-on-Cash Calculator</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
`
}

// ── Main ──────────────────────────────────────────────────────────────────────

type Template = {
  name: string
  slugFn: (slug: string, city: string) => string
  generate: (city: string, slug: string, market: CityMarketData, content: CityContent) => string
}

const TEMPLATES: Template[] = [
  {
    name: "best-neighborhoods",
    slugFn: (slug) => `best-neighborhoods-${slug}-utah`,
    generate: bestNeighborhoodsPost,
  },
  {
    name: "cost-of-living",
    slugFn: (slug) => `cost-of-living-${slug}-utah`,
    generate: (city, slug, market) => costOfLivingPost(city, slug, market),
  },
  {
    name: "renting-vs-buying",
    slugFn: (slug) => `renting-vs-buying-${slug}`,
    generate: (city, slug, market) => rentVsBuyPost(city, slug, market),
  },
  {
    name: "pm-guide-investors",
    slugFn: (slug) => `property-management-guide-${slug}-investors`,
    generate: pmGuidePost,
  },
  {
    name: "market-report",
    slugFn: (slug) => `${slug}-real-estate-market-${YEAR}`,
    generate: (city, slug, market) => marketReportPost(city, slug, market),
  },
]

let generated = 0
let skipped = 0
let total = 0

for (const cityObj of utahCitiesFromNorthOgdenToNephi) {
  const cityName: string = cityObj.name
  const slug: string = citySlug(cityName)
  const market: CityMarketData | undefined = cityMarketData[cityName]
  const content: CityContent = cityContentByName[cityName] ?? {}

  if (!market) {
    console.warn(`⚠  No market data for ${cityName} — skipping`)
    continue
  }

  for (const template of TEMPLATES) {
    if (total >= LIMIT) break
    total++

    const postSlug = template.slugFn(slug, cityName)
    const dir = path.join(BLOG_DIR, postSlug)
    const file = path.join(dir, "page.tsx")

    if (fs.existsSync(file)) {
      skipped++
      continue
    }

    const content_str = template.generate(cityName, slug, market, content)

    if (DRY_RUN) {
      console.log(`[dry-run] Would write: app/blog/${postSlug}/page.tsx`)
      generated++
    } else {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(file, content_str, "utf8")
      console.log(`✓  app/blog/${postSlug}/page.tsx`)
      generated++
    }
  }

  if (total >= LIMIT) break
}

console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}Done: ${generated} generated, ${skipped} skipped (already exist)`)
