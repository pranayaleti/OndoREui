import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/mortgage-rate-trends-2025"
const title = "Mortgage Rate Trends: What to Expect in 2025"
const description = "Analysis of current mortgage rate trends and predictions for the coming year."
const published = "2024-11-28"
const modified = "2024-11-28"
const author = "Jennifer Martinez"
const category = "Mortgage"
const image = "/modern-townhouse-garage.png"
const keywords = ["mortgage rate trends 2025", "Utah mortgage rates", "when to lock mortgage rate", "Fed rate cuts 2025", "refinance timing Utah"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description: description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description: description },
}

export default function MortgageRateTrends2025() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="What buyers and refinancers should watch in the current rate environment." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              After a volatile 2023–2024, buyers and refinancers are watching rates carefully. Here is what the data, Fed signals, and Utah-specific demand suggest for the mortgage market.
            </p>

            <h2>How Mortgage Rates Are Set</h2>
            <p>The 30-year fixed mortgage rate is not directly set by the Federal Reserve — it tracks the 10-year Treasury yield with a spread. That spread (typically 150–200 basis points in normal conditions) widens when secondary market risk appetite falls. The Fed's federal funds rate influences the short end of the yield curve; longer-term rates are driven more by inflation expectations and investor demand for bonds.</p>
            <p>Key inputs to watch:</p>
            <ul>
              <li><strong>10-year Treasury yield</strong> — the single best leading indicator for 30-year fixed rates</li>
              <li><strong>PCE inflation (Personal Consumption Expenditures)</strong> — the Fed's preferred inflation gauge</li>
              <li><strong>Jobs data</strong> — strong employment keeps inflation sticky and rates elevated</li>
              <li><strong>MBS spreads</strong> — mortgage-backed securities spreads over Treasuries reflect lender risk appetite</li>
            </ul>

            <h2>What Happened in 2023–2024</h2>
            <p>The fastest rate hiking cycle in four decades pushed the 30-year fixed from sub-3% (2021) to above 8% (late 2023). Utah buyers saw purchasing power compressed by over 40% from peak to trough. The Fed began cutting its benchmark rate in late 2024, but 30-year mortgage rates did not fall proportionally — the 10-year yield remained elevated due to persistent inflation and large Treasury supply.</p>

            <h2>Reading a Rate Quote Correctly</h2>
            <p>When a lender quotes you a rate, understand the full cost picture:</p>
            <ul>
              <li><strong>Rate vs. APR</strong>: APR includes origination fees, discount points, and other costs — always compare APRs</li>
              <li><strong>Discount points</strong>: 1 point = 1% of loan amount paid upfront to buy down the rate. Break-even is typically 3–5 years; only worth it if you plan to stay</li>
              <li><strong>Rate lock period</strong>: Standard locks are 30–45 days; longer locks cost more. Know your close timeline before locking</li>
              <li><strong>Float-down options</strong>: Some lenders offer a one-time float-down if rates drop after you lock — worth asking about</li>
            </ul>

            <h2>When to Lock vs. Float</h2>
            <p>Trying to time rates perfectly is futile — even professional bond traders cannot do it consistently. A practical framework:</p>
            <ul>
              <li>If current rates make the purchase pencil and you are within 30–45 days of closing, lock</li>
              <li>If rates drop significantly (0.25%+ below your lock) before closing, ask about float-down provisions</li>
              <li>If you are 60–90 days out and rates are trending down, a float strategy with a predetermined trigger (e.g., "I lock when the 10-year hits X") is more systematic than daily monitoring</li>
            </ul>

            <h2>Utah-Specific Demand Context</h2>
            <p>Utah's population growth (top 3 nationally for the past decade) creates a structural demand floor for housing that softens rate-driven price corrections relative to slower-growth markets. Silicon Slopes tech employment concentration in Utah County and Salt Lake County creates income resilience. This means buyers should model purchase decisions on long-hold (7+ year) scenarios rather than trying to time the market bottom.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/buy/rates">See Rate Context</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/qualify">Get Pre-Approved</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
