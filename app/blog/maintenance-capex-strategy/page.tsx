import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

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

export default function MaintenanceCapexStrategy() {
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
        section="Operations"
        tags={["Maintenance", "CapEx", "Operations"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Plan the lifecycle, protect the NOI."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Maintenance</Badge>
            <Badge variant="outline">CapEx</Badge>
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
          </div>
        </div>
      </article>
    </main>
  )
}
