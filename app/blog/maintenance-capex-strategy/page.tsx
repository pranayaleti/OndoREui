import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import Link from "next/link"
const slug = "/blog/maintenance-capex-strategy"
const title = "Maintenance and CapEx Strategy for Rentals"
const description = "A practical lifecycle and reserve plan to keep NOI stable and assets healthy."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "rental maintenance plan",
  "CapEx reserves",
  "NOI stability",
  "lifecycle planning",
  "Utah housing maintenance"
]

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "Operations",
})

export default function MaintenanceCapexStrategy() {
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
        category: "Operations",
        bannerSubtitle: "Plan the lifecycle, protect the NOI.",
      }}
    >
            <p className="lead text-xl text-foreground/70 mb-6">
              Maintenance isn’t a cost center; it’s asset preservation. Here’s a lifecycle plan that keeps NOI stable and tenants happy.
            </p>

            <h2>Reserve Policy</h2>
            <ul>
              <li>Operating reserve: 3–6 months of expenses.</li>
              <li>CapEx reserve: 1–1.5% of property value per year (older stock toward 2%).</li>
              <li>Separate accounts; don’t co-mingle.</li>
            </ul>

            <h2>Lifecycle Intervals (Typical)</h2>
            <ul>
              <li>Roof: 20–25 yrs (snow/UV can shorten). HVAC: 12–15 yrs. Water heater: 8–12 yrs.</li>
              <li>Paint/carpet: 3–7 yrs depending on turnover.</li>
              <li>Appliances: 7–10 yrs; standardize SKUs to simplify replacements.</li>
            </ul>

            <h2>Playbook</h2>
            <ul>
              <li>Quarterly: filters, minor leaks, GFCIs, exterior walk.</li>
              <li>Annual: roof/attic check, HVAC service, caulking/weatherproofing.</li>
              <li>Per-turn: paint touch-up, deep clean, safety devices, photo doc.</li>
            </ul>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Track lifecycle dates per asset; alert 12 months before end-of-life.</li>
              <li>Standardize materials; bulk pricing; store SKUs in the system.</li>
              <li>Link maintenance tickets to asset IDs; see failure patterns.</li>
            </ul>

            <h2>Utah Lens</h2>
            <p>Freeze-thaw cycles stress roofs and concrete; HVAC strain in inversions. Build inspections around seasons.</p>

            <h2>Takeaway</h2>
            <p>Reserve well, schedule proactively, and standardize parts. You’ll cut downtime and stabilize returns.</p>
          
    </ArticleShell>
  )
}

