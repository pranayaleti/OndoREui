import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

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

export default function CommercialRE101() {
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
        section="Commercial"
        tags={["Commercial", "Finance", "Leasing"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="The three levers that define CRE value."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Commercial</Badge>
            <Badge variant="outline">Finance</Badge>
            <Badge variant="outline">Leasing</Badge>
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
          </div>
        </div>
      </article>
    </main>
  )
}
