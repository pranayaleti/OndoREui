import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/cash-on-cash-return-explained"
const title = "Cash-on-Cash Return, Explained (with the Math)"
const description = "What cash-on-cash return measures, the exact formula, a worked example, and how it differs from cap rate and CAGR."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "cash on cash return",
  "cash on cash formula",
  "rental property returns",
  "cap rate vs cash on cash",
  "CAGR real estate",
  "investment property metrics",
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

export default function CashOnCashReturnExplained() {
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
        tags={["Finance", "Investing", "Metrics"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="The return that actually lands in your pocket each year."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Finance</Badge>
            <Badge variant="outline">Investing</Badge>
            <Badge variant="outline">Metrics</Badge>
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
              Cash-on-cash return answers a simple question: for every dollar of your own cash you put
              into a property, how many cents come back as cash each year? It’s the metric that best
              reflects a leveraged investor’s actual experience.
            </p>

            <h2>The formula</h2>
            <p>
              <strong>Cash-on-cash = Annual pre-tax cash flow ÷ Total cash invested</strong>
            </p>
            <ul>
              <li><strong>Annual pre-tax cash flow</strong> = rental income − operating expenses − debt service (mortgage principal + interest).</li>
              <li><strong>Total cash invested</strong> = down payment + closing costs + upfront repairs, i.e. the real money out of pocket, not the purchase price.</li>
            </ul>

            <h2>A worked example</h2>
            <ul>
              <li>Purchase $300,000; 25% down = $75,000; closing + initial repairs = $15,000 → <strong>$90,000 cash in.</strong></li>
              <li>Rent $2,500/mo → $30,000/yr. Operating expenses $9,000. Mortgage (P&amp;I) $13,600/yr.</li>
              <li>Annual cash flow = $30,000 − $9,000 − $13,600 = <strong>$7,400.</strong></li>
              <li>Cash-on-cash = $7,400 ÷ $90,000 = <strong>8.2%.</strong></li>
            </ul>
            <p>
              Try your own numbers in the{" "}
              <Link href="/calculators/cash-on-cash">cash-on-cash calculator</Link>.
            </p>

            <h2>How it differs from cap rate and CAGR</h2>
            <ul>
              <li><strong>Cap rate</strong> = NOI ÷ property value, ignores financing, so it measures the asset, not your leveraged position.</li>
              <li><strong>Cash-on-cash</strong> includes your loan, so it reflects the effect of leverage on <em>your</em> cash.</li>
              <li><strong>CAGR</strong> measures the compounded annual growth of a value over time (e.g. equity or portfolio), while cash-on-cash is a single-year yield. Use the{" "}
                <Link href="/calculators/cagr">CAGR calculator</Link> for the growth-over-time view.</li>
            </ul>

            <h2>What a “good” number is</h2>
            <p>
              It depends on strategy and market, but many buy-and-hold investors target roughly 8–12%
              cash-on-cash. Pair it with cap rate and CAGR, no single metric tells the whole story.
            </p>

            <h2>Takeaway</h2>
            <p>
              Cash-on-cash is the clearest read on annual cash yield for a financed deal. Combine it
              with the growth picture, and see our{" "}
              <Link href="/blog/mortgage-paydown-hacks">mortgage pay-down hacks</Link> for how debt
              choices change the cash flow.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
