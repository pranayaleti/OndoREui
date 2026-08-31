import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/dashboards-for-landlords"
const title = "Dashboards for Landlords: See Patterns, Act Faster"
const description = "What to track, how to visualize it, and why dashboards turn rentals into a real business."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "landlord dashboard",
  "rental analytics",
  "property KPIs",
  "DSCR tracking",
  "vacancy metrics"
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

export default function DashboardsForLandlords() {
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
        section="Analytics"
        tags={["Analytics", "Operations", "Product"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="From gut feel to instrument panel."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Analytics</Badge>
            <Badge variant="outline">Operations</Badge>
            <Badge variant="outline">Product</Badge>
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
              A dashboard is a mirror: it shows whether your systems are healthy. Here’s what to track and why.
            </p>

            <h2>Baseline KPIs</h2>
            <ul>
              <li>DSCR, NOI trend, variance to budget.</li>
              <li>Vacancy rate, days vacant, lead-to-lease conversion.</li>
              <li>Maintenance aging: count by state, average time to close.</li>
              <li>Payment punctuality: % on-time, late patterns by tenant profile.</li>
            </ul>

            <h2>Design Principles</h2>
            <ul>
              <li>Actionable: every metric links to its next action (message tenant, schedule vendor).</li>
              <li>Timely: update frequency matches decision cadence (daily for payments, weekly for maintenance).</li>
              <li>Segmented: slice by property/unit to avoid averages hiding problems.</li>
            </ul>

            <h2>Developer’s Build Notes</h2>
            <ul>
              <li>Event-driven ingestion (payments, tickets, leases) with idempotent upserts.</li>
              <li>Role-based views: owners see rollups; PMs see queues; tenants see their own items.</li>
              <li>Alerting: thresholds on DSCR, vacancy days, work-order aging.</li>
            </ul>

            <h2>Utah Lens</h2>
            <p>Seasonality in leasing and weather-driven maintenance show up as patterns. Dashboards help you pre-allocate budget and vendor time before winter or inversion season hits.</p>

            <h2>Takeaway</h2>
            <p>Dashboards turn rentals into a managed system. Track the few KPIs that drive outcomes, connect them to actions, and review them on a cadence.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
