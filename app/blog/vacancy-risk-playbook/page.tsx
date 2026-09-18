import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
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

export default function VacancyRiskPlaybook() {
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
        bannerSubtitle: "Vacancy is a controllable variable: if you plan for it.",
      }}
    >
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
          
    </ArticleShell>
  )
}

