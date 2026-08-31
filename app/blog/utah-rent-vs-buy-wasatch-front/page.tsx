import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/utah-rent-vs-buy-wasatch-front"
const title = "Utah Rent vs Buy: Wasatch Front Playbook"
const description = "A local framework for comparing rent and buy decisions in Salt Lake, Utah County, and Davis/Weber corridors."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "Utah rent vs buy",
  "Wasatch Front housing",
  "Salt Lake home buying",
  "Utah County rent math",
  "rent vs own playbook"
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

export default function UtahRentVsBuy() {
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
        section="Utah"
        tags={["Utah", "Rent vs Buy", "Finance"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Local taxes, transit, and school clusters change the math."
        backgroundImage="/city-map-with-pin.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Utah</Badge>
            <Badge variant="outline">Finance</Badge>
            <Badge variant="outline">Rent vs Buy</Badge>
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
              The Wasatch Front isn’t one market. Salt Lake urban cores, Silicon Slopes (Lehi/Draper), and Ogden value plays have different rent-to-price ratios, taxes, and maintenance realities. Here’s how I frame the decision for locals.
            </p>

            <h2>Key Inputs (Utah-Specific)</h2>
            <ul>
              <li>Property tax reset after sale; check county rates by city.</li>
              <li>Snow/ice wear on roofs/pavement; budget maintenance at 1–1.5%/yr.</li>
              <li>Transit + schools drive rent premiums (FrontRunner, I-15 exits, school clusters).</li>
            </ul>

            <h2>Compare These Ratios</h2>
            <ul>
              <li><strong>Rent-to-price</strong>: SLC urban often ~0.4–0.5%; Ogden can be higher.</li>
              <li><strong>Payment-to-income</strong>: keep total housing ≤ 30–35% gross.</li>
              <li><strong>Equity velocity</strong>: amortization + conservative appreciation (3–4%) vs alt return.</li>
            </ul>

            <h2>Scenario Grid</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`SLC urban: higher price, lower rent yield; pay for proximity + transit.
Lehi/Draper: tech wage anchor; appreciation leaning, watch HOA/amenities.
Ogden: value/cashflow; stress-test vacancy and older-building CapEx.
Provo/Orem: student/education anchor; seasonality + parking constraints.`}
            </pre>

            <h2>House Hack Angle</h2>
            <p>Basement ADUs and duplexes along the corridor can tilt math toward owning if you underwrite vacancy and CapEx conservatively.</p>

            <h2>Developer’s Toolkit</h2>
            <ul>
              <li>Build a simple simulator: inputs above + rent growth 2–3%, appreciation 3–4%.</li>
              <li>Run sensitivity: +1% rates, +10% expenses, 0–2% appreciation.</li>
              <li>Track by city; don’t apply a single Utah average to all submarkets.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Utah rent vs buy is corridor-specific. Model taxes, transit, school-driven rent spreads, and maintenance. Let the numbers, plus your time horizon, decide.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
