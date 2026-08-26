import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/collect-rent-with-crypto-guide"
const title = "How to Collect Rent Using Crypto: A Landlord's Guide"
const description = "A practical guide to accepting rent in crypto — stablecoins vs volatile assets, tax and record-keeping, and how to keep it low-risk."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "collect rent crypto",
  "property management software crypto payment",
  "stablecoin rent",
  "crypto rent payment landlord",
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

export default function CollectRentWithCryptoGuide() {
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
        section="Payments"
        tags={["Payments", "Crypto", "Operations"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Optional, fast settlement — done without taking on price risk."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Payments</Badge>
            <Badge variant="outline">Crypto</Badge>
            <Badge variant="outline">Operations</Badge>
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
              Accepting rent in crypto can mean faster settlement and a differentiator for tech-forward tenants — but only if you handle volatility, taxes, and records deliberately.
            </p>

            <h2>Stablecoins, not speculation</h2>
            <p>Accept a USD-pegged stablecoin (or auto-convert to USD on receipt) so a rent payment is still worth a month's rent tomorrow. Treat volatile assets as a personal choice, never as the rent rail.</p>

            <h2>Records &amp; taxes</h2>
            <ul>
              <li>Log the USD value at the moment of receipt — that is your rental income.</li>
              <li>Keep the transaction hash and wallet addresses for an audit trail.</li>
              <li>Talk to a tax professional; crypto rules evolve and vary by jurisdiction.</li>
            </ul>

            <h2>Keep it optional and low-risk</h2>
            <ul>
              <li>Offer crypto <em>alongside</em> ACH/card, never as the only option.</li>
              <li>Prefer platforms that auto-convert and keep a clean ledger entry.</li>
              <li>Never co-mingle investment holdings with operating rent.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Crypto rent is a feature, not a strategy: stablecoins, instant USD conversion, and clean records. For how alternative assets fit a broader portfolio, read <Link href="/blog/crypto-and-real-estate-hedge">Crypto and Real Estate: Building a Barbell Hedge</Link>.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
