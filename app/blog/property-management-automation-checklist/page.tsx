import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/property-management-automation-checklist"
const title = "Property Management Automation Checklist"
const description = "High-ROI automations for rent, maintenance, and owner reporting, built by a dev who also manages units."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "property management automation",
  "maintenance workflow",
  "rent reminders",
  "owner reporting",
  "landlord dashboard"
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

export default function PropertyManagementAutomationChecklist() {
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
        tags={["Automation", "Landlording", "Operations"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Automate the boring; save human energy for decisions."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Automation</Badge>
            <Badge variant="outline">Operations</Badge>
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
              Automations should remove toil, not add opacity. Here are the flows that consistently pay off across small portfolios.
            </p>

            <h2>Rent & Payments</h2>
            <ul>
              <li>Reminders 5 and 1 day before due; soft tone; include pay link.</li>
              <li>Auto-receipts with ledger link; reduce “did you get my payment?” emails.</li>
              <li>NSF alerts → optional auto-late-fee with grace rules.</li>
            </ul>

            <h2>Maintenance</h2>
            <ul>
              <li>Intake with photos/audio; auto-tag emergency vs routine.</li>
              <li>Assign vendor by category + geography; SLA timers (acknowledge same day).</li>
              <li>Status notifications: scheduled, en route, done, rated.</li>
            </ul>

            <h2>Owner Reporting</h2>
            <ul>
              <li>Monthly P&L + variance to budget; link to invoices.</li>
              <li>DSCR/NOI trend with alerts when thresholds break.</li>
              <li>CapEx tracker with receipts and expected lifecycle dates.</li>
            </ul>

            <h2>Developer’s Build Notes</h2>
            <ul>
              <li>State machines for tickets/payments; webhooks for events.</li>
              <li>Single thread per unit for comms; push/email/SMS options.</li>
              <li>Role-based views: tenant simplicity; owner detail; PM control.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Automate reminders, receipts, status changes, and reports. Keep decisions human. Your tenants and owners feel the difference immediately.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
