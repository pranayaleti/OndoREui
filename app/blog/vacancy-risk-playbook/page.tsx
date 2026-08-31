import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/vacancy-risk-playbook"
const title = "Vacancy Risk Playbook"
const description = "How to model, reduce, and recover from vacancy, including Utah seasonality and leasing tactics." 
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "vacancy risk",
  "leasing playbook",
  "tenant retention",
  "rent concessions",
  "Utah leasing season"
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

export default function VacancyRiskPlaybook() {
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
        section="Operations"
        tags={["Vacancy", "Leasing", "Operations"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Vacancy is a controllable variable: if you plan for it."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Vacancy</Badge>
            <Badge variant="outline">Leasing</Badge>
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
              Vacancy kills cashflow faster than any single expense. Treat it as a modeled, managed risk.
            </p>

            <h2>Model It First</h2>
            <ul>
              <li>Budget 6–8% vacancy for residential; more if heavy seasonality.</li>
              <li>Map lease expirations; avoid stacking multiple ends in winter.</li>
              <li>Track lead velocity vs season; shift pricing/terms accordingly.</li>
            </ul>

            <h2>Reduce Likelihood</h2>
            <ul>
              <li>Renewal outreach at 90/60/30 days; offer options (term, minor upgrades).</li>
              <li>Maintenance responsiveness = retention. SLA: acknowledge same day.</li>
              <li>Photos + honest descriptions; cut “surprise” factor at showings.</li>
            </ul>

            <h2>Shorten Downtime</h2>
            <ul>
              <li>Pre-list before vacant when allowed; schedule showings around current tenant with notice.</li>
              <li>Turn kits ready: paint codes, vendor list, standard materials.</li>
              <li>Dynamic pricing: small concessions on term start dates beat big rent cuts.</li>
            </ul>

            <h2>Utah Lens</h2>
            <p>Leasing slows in deep winter. Front-load renewals before holidays; use flexible start dates and remote showings when roads/air quality are rough.</p>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Dashboard: expirations by month, lead-to-lease conversion, days vacant.</li>
              <li>Alerts: leases clustering in off-season; low lead count triggers marketing push.</li>
              <li>Templates: renewal offers, showing scripts, concession guardrails.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Vacancy is predictable. Model it, smooth expirations, and keep tenants by being responsive. The numbers will thank you.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
