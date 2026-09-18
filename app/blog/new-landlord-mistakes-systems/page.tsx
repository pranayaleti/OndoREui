import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
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

export default function NewLandlordMistakesSystems() {
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
        bannerSubtitle: "Systems beat luck every time.",
      }}
    >
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
          
    </ArticleShell>
  )
}

