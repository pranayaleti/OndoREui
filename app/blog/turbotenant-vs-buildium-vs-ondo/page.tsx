import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/turbotenant-vs-buildium-vs-ondo"
const title = "TurboTenant vs Buildium vs Ondo: The Honest Comparison (2026)"
const description = "A straight comparison of TurboTenant, Buildium, and Ondo across pricing, features, tenant fees, and who each one actually fits."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "TurboTenant vs Buildium",
  "Buildium alternative small landlord",
  "TurboTenant alternative free",
  "property management software comparison",
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

export default function TurbotenantVsBuildiumVsOndo() {
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
        section="Comparison"
        tags={["Comparison", "Pricing", "Software"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="No spin — where each platform wins, and where it does not."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Comparison</Badge>
            <Badge variant="outline">Pricing</Badge>
            <Badge variant="outline">Software</Badge>
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
              Every platform claims to be the best. Here is the honest version: what TurboTenant, Buildium, and Ondo each do well, what they charge, and which landlord each one actually fits.
            </p>

            <h2>At a glance</h2>
            <ul>
              <li><strong>TurboTenant:</strong> free for landlords, strong top-of-funnel (listings, screening). Tenants often pay the fees.</li>
              <li><strong>Buildium:</strong> deep accounting for larger portfolios; priced and built for professional PM firms.</li>
              <li><strong>Ondo:</strong> the only one combining a real-estate-agent layer, loan tools, and property management on one modern stack.</li>
            </ul>

            <h2>Pricing &amp; fees</h2>
            <p>Sticker price is only half the story — watch tenant-side ACH and e-signature fees, which quietly shift cost onto renters. Compare total annual cost for your unit count, not the headline plan. Our <Link href="/compare-utah-property-managers">comparison page</Link> breaks this down.</p>

            <h2>Who each fits</h2>
            <ul>
              <li><strong>Solo landlord, 1–4 units:</strong> a free/low-cost tool with fair tenant fees.</li>
              <li><strong>PM firm, 50+ doors:</strong> full accounting and owner reporting.</li>
              <li><strong>Agent-investor:</strong> a platform that spans finding, financing, and managing.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Pick for your actual workflow and total cost, not the brand. If you want the agent + financing + management combination on one login, see <Link href="/vs/buildium">how Ondo compares</Link>, or <Link href="/blog/switch-from-turbotenant-migration-guide">how to switch</Link> without losing data.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
