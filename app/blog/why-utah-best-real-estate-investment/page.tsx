import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const published = "2024-11-20"
const modified = "2024-11-20"
const slug = "/blog/why-utah-best-real-estate-investment"
const title = "Why Utah is the Best Place to Invest in Real Estate"
const description = "Discover why Utah's fundamentalsjobs, population growth, and landlord-friendly policiesmake it a top-tier market for real estate investors."
const author = "David Thompson"

const keywords = [
  "Utah real estate investment",
  "best places to invest Utah",
  "Utah population growth",
  "Utah landlord friendly",
  "Wasatch Front investing"
]


import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo Real Estate`,
    description: description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified || published,
    authors: [author],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
  },
}

const markets = [
  { name: "Salt Lake City", drivers: "Tech growth, transit, diverse employment" },
  { name: "Lehi / Silicon Slopes", drivers: "High-paying tech jobs, new construction" },
  { name: "Provo / Orem", drivers: "University anchor, stable rent demand" },
  { name: "American Fork / Pleasant Grove", drivers: "Commuter access, 3–4 bedroom housing stock" },
  { name: "Ogden", drivers: "Value play, transportation hub" },
  { name: "St. George", drivers: "Migration inflow, short-term rental corridors" },
]

const riskMitigations = [
  "Stress-test deals at higher interest rates and conservative rent growth",
  "Underwrite vacancy at 6-8% to reflect seasonality and lease-up time",
  "Model insurance and tax increases yearly instead of keeping them flat",
  "Keep a 3-6 month reserve for CapEx and unexpected maintenance",
  "Use long-term fixed-rate debt or strong rate caps when available",
]

export default function WhyUtahBestInvestment() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/city-map-with-pin.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Investment"
        tags={["Investment", "Utah", "Market Analysis"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: description,
          author: { "@type": "Person", name: author },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title={title}
        subtitle="Jobs, population growth, and landlord-friendly laws make Utah a standout market for long-term holds and cash-flow plays."
        backgroundImage="/city-map-with-pin.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Investment</Badge>
            <Badge variant="outline">Utah Market</Badge>
            <Badge variant="outline">Growth</Badge>
          </div>

          <div className="not-prose mb-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>

          {/* Gestalt: quick anchors */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Thesis" body="Jobs + in-migration + landlord-friendly laws create durable demand." />
            <CardSpot title="Plays" body="Value-add in Ogden, appreciation in Lehi, stability in Provo/Orem." />
            <CardSpot title="Guardrails" body="Stress-test vacancy, taxes, and rates; hold 3–6 month reserves." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-8">
              Utah combines job growth, net in-migration, and landlord-friendly regulation into a unique investment landscape. Whether you target cash flow in Ogden or appreciation in Lehi, the Wasatch Front offers diversified entry points for investors.
            </p>

            <h2>Four Fundamentals Driving Utah's Market</h2>
            <ol>
              <li><strong>Job Growth</strong>: Silicon Slopes companies continue hiring, supporting wage strength.</li>
              <li><strong>Population Inflow</strong>: Net migration and high birth rates sustain housing demand.</li>
              <li><strong>Landlord-Friendly Environment</strong>: Clear eviction timelines and supportive legislation reduce operational risk.</li>
              <li><strong>Transportation & Infrastructure</strong>: FrontRunner expansions and I-15 improvements compress travel times and expand viable submarkets.</li>
            </ol>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Simplicity" detail="Four fundamentals are the mental map; every submarket ties back to them." />
              <KeyLine title="Evidence" detail="Track job announcements and migration data to validate the thesis quarterly." />
            </div>

            <h2>Market-by-Market Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {markets.map((m) => (
                <Card key={m.name} className="bg-card border-border">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">{m.name}</h3>
                    <p className="text-sm text-foreground/70">{m.drivers}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2>Deal Profiles That Work in Utah</h2>
            <ul>
              <li><strong>Value-Add Duplex/Fourplex (Ogden/SLC)</strong>: Force appreciation with light renovations and raise to market rents.</li>
              <li><strong>Newer Construction Townhomes (Lehi/AF)</strong>: Lower CapEx risk and strong tenant demand from tech employers.</li>
              <li><strong>Student/Faculty Rentals (Provo/Orem)</strong>: Stable occupancy anchored by universities; underwrite turnover carefully.</li>
              <li><strong>Mid-Term Rentals (Lehi/Sandy)</strong>: Furnished units for relocating employees and project-based contractors.</li>
            </ul>

            <h2>Numbers to Watch</h2>
            <ul>
              <li><strong>Rent-to-Price Ratios</strong>: Aim for ≥0.7% monthly in value markets (higher in Ogden, lower in Lehi for appreciation plays).</li>
              <li><strong>Vacancy & Lease-Up</strong>: Track seasonality around winter; maintain conservative assumptions in pro formas.</li>
              <li><strong>Property Taxes & Insurance</strong>: Annualize increases; Utah valuations can reset after transactions.</li>
              <li><strong>Job Announcements</strong>: Follow major employer expansions in Silicon Slopes for forward-looking demand signals.</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Red flags" body="Underwriting flat taxes/insurance or ignoring winter lease-up drag." />
              <CardSpot title="Momentum" body="Track employer news; it often precedes rent growth and absorption." />
            </div>

            <h2>Risk Mitigation Checklist</h2>
            <div className="space-y-2">
              {riskMitigations.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <h2>Capital Stack Considerations</h2>
            <ul>
              <li><strong>Fixed-Rate Debt</strong>: Prefer 5-7 year fixed terms to ride out rate cycles.</li>
              <li><strong>DSCR-Friendly Products</strong>: DSCR loans can simplify underwriting for investors without W-2 income.</li>
              <li><strong>Bridge Debt with Caution</strong>: Use only when value-add timelines are short and CapEx is fully scoped.</li>
              <li><strong>Equity Partners</strong>: Align on hold period (5-7 years common) and distribution waterfalls up front.</li>
            </ul>

            <h2>Exit Strategies</h2>
            <ul>
              <li><strong>Refi-and-Hold</strong>: Stabilize, refinance after NOI lift, and redeploy capital.</li>
              <li><strong>1031 Exchange</strong>: Preserve gains while upgrading to larger assets in the same corridor.</li>
              <li><strong>Portfolio Sale</strong>: Package multiple small assets for institutional buyers seeking scale.</li>
            </ul>

            <h2>Why Act Now?</h2>
            <p>
              Supply pipelines are easing from 2021-2023 highs, and demand remains resilient. Entering with conservative leverage and realistic rent growth can capture both cash flow and appreciation as rates normalize.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: Is Utah better for cash flow or appreciation?</h4>
                <p>A: Core tech markets (Lehi, Draper) lean toward appreciation; secondary markets (Ogden) often pencil stronger cash flow. Many investors blend both.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: How should I underwrite vacancy?</h4>
                <p>A: Use 6-8% to reflect winter seasonality and turnover; tighten to 5% only after a proven rent roll.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: What hold period makes sense?</h4>
                <p>A: Five to seven years captures both amortization and likely rate normalization while giving time for value-add plays to season.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                Utah's combination of job growth, population inflow, and landlord-friendly laws creates a resilient environment for real estate investors. Target cash flow in value submarkets, appreciation in tech corridors, and protect your downside with conservative underwriting, fixed-rate debt, and healthy reserves.
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}

function CardSpot({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-primary mb-1">{title}</p>
      <p className="text-sm text-foreground">{body}</p>
    </div>
  )
}

function KeyLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/60 px-4 py-3 h-full">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground/70">{detail}</p>
    </div>
  )
}
