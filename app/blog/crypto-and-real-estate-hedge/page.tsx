import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/crypto-and-real-estate-hedge"
const title = "Crypto and Real Estate: Building a Barbell Hedge"
const description = "A practitioner view on using fast/volatile assets and slow/real assets together without magical thinking."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "crypto and real estate strategy",
  "barbell investing",
  "hedge volatility",
  "real estate cashflow",
  "Utah investors"
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

export default function CryptoAndRealEstateHedge() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Strategy"
        tags={["Strategy", "Crypto", "Real Estate"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Fast beta on one side, slow cash on the other."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Strategy</Badge>
            <Badge variant="outline">Crypto</Badge>
            <Badge variant="outline">Real Estate</Badge>
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
              I hold volatile assets (crypto) and slow, cashflowing assets (rentals) for different jobs. The trick is letting each leg do its job without forcing them into the same risk bucket.
            </p>

            <h2>Roles in the Portfolio</h2>
            <ul>
              <li><strong>Crypto</strong>: asymmetry, liquidity, high beta. Treat as venture-like.</li>
              <li><strong>Real estate</strong>: cashflow, tax shelter (depreciation), slower appreciation.</li>
            </ul>

            <h2>Barbell Rules I Use</h2>
            <ul>
              <li>Size crypto so a drawdown doesn’t force a property sale.</li>
              <li>Use real estate cashflow to smooth volatility, not to lever more crypto.</li>
              <li>Keep reserves in boring assets (T-bills) for both legs.</li>
            </ul>

            <h2>Workflow: From Wallet to Roof</h2>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Crypto gains? → realize partial → move to fiat/T-bills → fund reserves → deploy to rehab/down payment
Rental cashflow? → build 3-6 month reserve → allocate surplus to DCA crypto or CapEx
Rule: never co-mingle operating reserves with speculative leg`}
            </pre>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Track both legs in a dashboard: yield, volatility, and correlation over time.</li>
              <li>Tag inflows/outflows; separate operating reserves from speculative capital.</li>
              <li>Automate alerts: if DSCR dips or reserves fall, pause speculative buys.</li>
            </ul>

            <h2>Utah Lens</h2>
            <p>Silicon Slopes income can be tech-heavy; barbell helps hedge sector risk. Keep housing bets conservative: underwrite higher taxes/insurance, seasonality, and realistic rent growth.</p>

            <h2>Takeaway</h2>
            <p>Crypto and real estate can coexist if each has a role: one for upside, one for stability. Separate reserves, watch sizing, and let time do the heavy lifting.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
