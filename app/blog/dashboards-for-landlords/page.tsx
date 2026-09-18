import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
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

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "Analytics",
})

export default function DashboardsForLandlords() {
  return (
    <ArticleShell
      meta={{
        path: slug,
        title,
        description,
        published,
        modified,
        author,
        keywords,
        category: "Analytics",
        bannerSubtitle: "From gut feel to instrument panel.",
      }}
    >
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
          
    </ArticleShell>
  )
}

