import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"

const slug = "/blog/renting-vs-owning-hidden-math"
const title = "The Hidden Math Behind Renting vs Owning"
const description = "A developer-landlord breaks down opportunity cost, inflation-adjusted rent, and equity velocity so you can compare renting vs owning with real numbers."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "rent vs own math",
  "equity velocity",
  "inflation adjusted rent",
  "opportunity cost down payment",
  "Utah housing math"
]


import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

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
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function RentingVsOwningHiddenMath() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-office-building.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Finance"
        tags={["Finance", "Rent vs Own", "Modeling"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Use real math: not slogans: to decide."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Finance</Badge>
            <Badge variant="outline">Modeling</Badge>
            <Badge variant="outline">Utah</Badge>
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

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              As both a full-stack developer and landlord, I model rent-vs-own the way I model systems: identify inputs, define flows, stress-test failure modes. Here is the practical math I use for clients along the Wasatch Front.
            </p>

            <h2>Core Definitions</h2>
            <ul>
              <li><strong>Opportunity cost</strong>: what your down payment could earn elsewhere (T-bills, index funds).</li>
              <li><strong>Equity velocity</strong>: speed at which equity grows (amortization + appreciation − costs).</li>
              <li><strong>Effective rent</strong>: gross rent minus concessions, plus expected increases.</li>
            </ul>

            <h2>Quick Model (Inputs)</h2>
            <ul>
              <li>Purchase price, down payment, rate, term</li>
              <li>Property tax, insurance, maintenance, HOA</li>
              <li>Expected appreciation and rent growth (use conservative Utah history: ~3–4%)</li>
              <li>Alt return on down payment (e.g., 4–5% T-bill, 7–9% index)</li>
            </ul>

            <h2>Flow: Renting vs Owning</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Down payment → (invest elsewhere?) → grows at alt return
Mortgage → P&I + taxes/ins/HOA/maint → compare to rent
Equity velocity → amortization + appreciation − carry costs
Breakeven → when equity outpaces invested-down-payment scenario`}
            </pre>

            <h2>Stress Tests (Do This Before Deciding)</h2>
            <ul>
              <li>Rate +1% and +2% (if ARM/refi risk).</li>
              <li>Appreciation at 0–2% (flat market years).</li>
              <li>Maintenance at 1–1.5% of property value annually (older homes near 2%).</li>
              <li>Alt return at 4–5% (T-bills) and 7–9% (index) to see opportunity cost.</li>
            </ul>

            <h2>Utah-Specific Considerations</h2>
            <ul>
              <li>Property taxes can reset post-sale; underwrite a jump year 1.</li>
              <li>Snow + sun swings: roof/HVAC lifecycle can be shorter; pad maintenance.</li>
              <li>Transit/schools drive rent deltas more than year-built; compare by corridor.</li>
            </ul>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Model in a spreadsheet with explicit scenarios; do not bury assumptions.</li>
              <li>Create a simple dashboard: monthly carry vs invest-alt-path; project 5/10-year outcomes.</li>
              <li>Use sensitivity toggles (vacancy for house hacking; refi timing; PMI drop-off).</li>
            </ul>

            <h2>Decision Rule</h2>
            <p>
              Owning usually wins when equity velocity (amortization + conservative appreciation) beats the opportunity cost of investing the down payment elsewhere, after subtracting the ownership friction (maintenance, tax, insurance, HOA). Renting wins when stability plus invested down payment outperforms and lifestyle flexibility matters more.
            </p>

            <div className="not-prose my-8 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Signals to Buy</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Stable job horizon; plan to stay 5–7+ years</li>
                  <li>Payment within 30–35% gross including T&I/HOA/maint</li>
                  <li>Conservative appreciation still beats alt return after costs</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Signals to Rent</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>High mobility; job/location uncertain</li>
                  <li>Down payment ROI is higher elsewhere (e.g., debt payoff, business)</li>
                  <li>Market priced for perfection; stress tests fail at 0–2% appreciation</li>
                </ul>
              </div>
            </div>

            <h2>Takeaway</h2>
            <p>
              Decide with math, not memes. Run the scenarios, stress-test the weak spots, and choose based on equity velocity versus opportunity cost. Utah or elsewhere, the framework holds.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
