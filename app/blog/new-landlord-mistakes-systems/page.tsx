import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/new-landlord-mistakes-systems"
const title = "New Landlord Mistakes and the Systems That Prevent Them"
const description = "Evergreen pitfalls, maintenance, documentation, vacancy, and the operational playbooks that stop them."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "landlord mistakes",
  "vacancy risk",
  "maintenance systems",
  "tenant onboarding",
  "Utah rentals"
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

export default function NewLandlordMistakesSystems() {
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
        tags={["Landlording", "Operations", "Playbooks"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Systems beat luck every time."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Landlording</Badge>
            <Badge variant="outline">Operations</Badge>
            <Badge variant="outline">Utah</Badge>
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
              After managing and coding systems for rentals, the biggest mistakes I see are operational, not financial. Here are the recurring ones and the simple systems that stop them.
            </p>

            <h2>Top Mistakes</h2>
            <ul>
              <li>Skipping move-in documentation (video, timestamped).</li>
              <li>Underwriting vacancy at 0–3% instead of 6–8%.</li>
              <li>No reserve policy (CapEx + operating blended in one pile).</li>
              <li>Unclear maintenance SLAs; tickets languish and tenants churn.</li>
              <li>Multiple channels for comms; no audit trail.</li>
            </ul>

            <h2>Systems to Prevent Them</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Documentation</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Video walk-through at move-in/out; store with lease.</li>
                  <li>Single thread per unit for all messages.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card/60 p-4">
                <p className="text-xs uppercase text-primary mb-1">Reserves & Underwriting</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>6–8% vacancy baked into pro formas.</li>
                  <li>CapEx reserve separate from operating cash (3–6 months).</li>
                </ul>
              </div>
            </div>

            <h2>Maintenance Playbook</h2>
            <ul>
              <li>States: new → triage → scheduled → in-progress → done → rated.</li>
              <li>Response targets: same day acknowledge; schedule within 24–48 hours.</li>
              <li>Preferred vendor list with price bands; avoid scramble pricing.</li>
            </ul>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Automate status updates; tenants see state changes without tickets.</li>
              <li>Store media (photos/video) with events; makes disputes trivial.</li>
              <li>Dashboards: vacancy pipeline, work order aging, reserve levels.</li>
            </ul>

            <h2>Utah Lens</h2>
            <p>Winter-proofing (pipes/roof) and summer HVAC strain are predictable cycles. Pre-schedule inspections; tenants appreciate proactive care.</p>

            <h2>Takeaway</h2>
            <p>Landlording is a process business. If you build simple systems, docs, reserves, maintenance states, you avoid the expensive mistakes most new landlords make.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
