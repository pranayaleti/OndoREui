import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
const slug = "/blog/commercial-real-estate-101-tenant-mix"
const title = "Commercial Real Estate 101: Cap Rates, NNN, and Tenant Mix"
const description = "An operator’s primer on how cap rates, lease structure, and tenant mix shape commercial value and risk."
const published = "2025-12-10"
const modified = "2025-12-10"
const author = "ONDO Team"

const keywords = [
  "commercial real estate basics",
  "cap rate explained",
  "triple net lease",
  "tenant mix strategy",
  "vacancy risk"
]

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "Commercial",
})

export default function CommercialRE101() {
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
        category: "Commercial",
        bannerSubtitle: "The three levers that define CRE value.",
      }}
    >
            <p className="lead text-xl text-foreground/70 mb-6">
              Commercial real estate looks complex until you anchor on three ideas: cap rates, lease structure, and tenant mix. Once you see those levers, underwriting gets repeatable.
            </p>

            <h2>Cap Rates (Definition + Use)</h2>
            <ul>
              <li><strong>Definition</strong>: NOI / Purchase Price.</li>
              <li><strong>Use</strong>: A shorthand for yield; also a risk proxy by market/asset quality.</li>
              <li><strong>Move</strong>: Grow NOI or buy at a better multiple; small NOI changes swing value.</li>
            </ul>

            <h2>Lease Structures</h2>
            <ul>
              <li><strong>Gross</strong>: landlord pays expenses; simpler, more risk on owner.</li>
              <li><strong>NNN</strong>: tenant reimburses taxes/insurance/CAM; steadier NOI but watch CAM caps.</li>
              <li><strong>Modified Gross</strong>: splits the difference; read the expense stops carefully.</li>
            </ul>

            <h2>Tenant Mix (Risk and Resilience)</h2>
            <ul>
              <li><strong>Diversify cashflow</strong>: limit exposure to any one tenant unless credit is stellar.</li>
              <li><strong>Complementary uses</strong>: co-tenants that drive traffic to each other reduce vacancy risk.</li>
              <li><strong>Lease rollover map</strong>: avoid multiple big expirations in the same year.</li>
            </ul>

            <h2>Vacancy and Rollover Risk</h2>
            <p>Value swings with downtime. Underwrite realistic downtime and TI/LC (tenant improvement + leasing commissions) by tenant type.</p>

            <h2>Developer’s Angle</h2>
            <ul>
              <li>Model unit-level leases with expirations and option terms; visualize rollover by year.</li>
              <li>Track NNN recovery vs actuals; CAM caps can hide leakage.</li>
              <li>Scenario test: one anchor dark, two in-line vacants; does DSCR hold?</li>
            </ul>

            <h2>Utah/Regional Nuance</h2>
            <p>Tech-heavy corridors (Lehi/Draper) can have higher rent PSF but also more exposure to sector swings. Balance with service/medical tenants that are sticky.</p>

            <h2>Takeaway</h2>
            <p>CRE is three dials: cap rate, lease structure, and tenant mix. Map rollover, stress downtime, and mind CAM language. Everything else is detail.</p>
          
    </ArticleShell>
  )
}

