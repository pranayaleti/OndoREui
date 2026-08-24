import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/full-stack-dev-landlord-gaps"
const title = "I’m a Full-Stack Dev and Landlord: What Software Gets Wrong"
const description = "A dual lens on why property software frustrates tenants and owners, and how to design for human workflows." 
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "property management software UX",
  "landlord workflow gaps",
  "full stack developer landlord",
  "tenant experience design",
  "owner dashboards"
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

export default function FullStackDevLandlordGaps() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Product"
        tags={["Product", "UX", "Property Management"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Design for humans first, data second."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Product</Badge>
            <Badge variant="outline">UX</Badge>
            <Badge variant="outline">Engineering</Badge>
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
              Most landlord software is built around ledgers, not people. Tenants want simple, mobile-first interactions; owners want accurate, drillable numbers. Both groups get friction because the workflows aren’t designed end-to-end.
            </p>

            <h2>Common UX Gaps (From Experience)</h2>
            <ul>
              <li><strong>Fragmented channels</strong>: tenants text, owners email, PMs use portals. No single source of truth.</li>
              <li><strong>Low empathy flows</strong>: maintenance forms assume users know part names; payments ignore variable fees.</li>
              <li><strong>Dashboards without decisions</strong>: charts that don’t link to actions (e.g., message tenant, approve work order).</li>
            </ul>

            <h2>Design Principles</h2>
            <ul>
              <li><strong>System of record first</strong>: one canonical thread per unit/tenant; everything attaches there.</li>
              <li><strong>Action adjacency</strong>: every metric links to its action (late rent → message; high repair cost → quote).</li>
              <li><strong>Context carry</strong>: pre-fill what you know (unit, lease, preferred vendors) to avoid user re-entry.</li>
            </ul>

            <h2>Feature Blueprint</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Tenant-facing</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>2-click pay; clear fees; reminders with soft tone.</li>
                  <li>Maintenance with photos/audio; status visibility; ETA expectations.</li>
                  <li>Mobile-first ID and lease docs; simple renewal accept/decline.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Owner-facing</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Cashflow + variance alerts; drill to ledger lines.</li>
                  <li>DSCR/NOI trend; attach invoices; approve/deny with thresholds.</li>
                  <li>Vacancy pipeline; turn costs; make-ready timers.</li>
                </ul>
              </div>
            </div>

            <h2>Developer Notes</h2>
            <ul>
              <li>Model states explicitly (requested → scheduled → in-progress → done → billed).</li>
              <li>Use webhooks for payment/maintenance events; fan out to email/SMS/push.</li>
              <li>Add audit trails by default, users rarely complain about too much clarity.</li>
            </ul>

            <h2>Utah/Regional Nuance</h2>
            <p>Snow/ice damage, swamp coolers vs HVAC, and HOA nuances change maintenance SLAs. Build region-specific playbooks into the UI.</p>

            <h2>Takeaway</h2>
            <p>Great landlord software feels invisible: tenants see clarity, owners see decisions, PMs see fewer tickets. Build for the human loop, not just the ledger.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
