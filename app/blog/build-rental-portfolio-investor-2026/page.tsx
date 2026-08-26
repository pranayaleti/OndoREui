import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/build-rental-portfolio-investor-2026"
const title = "How to Build a Rental Portfolio as a Real Estate Investor in 2026"
const description = "A staged playbook for going from one rental to a portfolio — financing, metrics, systems, and when to scale."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "build rental portfolio",
  "property management for real estate investors",
  "scale rental portfolio",
  "real estate investing 2026",
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

export default function BuildRentalPortfolioInvestor2026() {
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
        section="Investing"
        tags={["Investing", "Strategy", "Portfolio"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="From your first door to a system that scales."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Investing</Badge>
            <Badge variant="outline">Strategy</Badge>
            <Badge variant="outline">Portfolio</Badge>
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
              A portfolio is not ten random purchases — it is a repeatable system: buy on the numbers, finance deliberately, and operate so the eleventh door is no harder than the first.
            </p>

            <h2>Stage 1 — Buy on the numbers</h2>
            <ul>
              <li>Screen every deal on <Link href="/calculators/cash-on-cash">cash-on-cash</Link>, <Link href="/calculators/cap-rate">cap rate</Link>, and <Link href="/calculators/dscr">DSCR</Link>.</li>
              <li>Reserve for CapEx from day one — see <Link href="/blog/maintenance-capex-strategy">maintenance &amp; CapEx strategy</Link>.</li>
            </ul>

            <h2>Stage 2 — Finance deliberately</h2>
            <ul>
              <li>Understand DSCR and portfolio loans as you scale past conventional limits.</li>
              <li>Track equity growth with <Link href="/calculators/cagr">CAGR</Link> and refinance strategically.</li>
            </ul>

            <h2>Stage 3 — Systematize operations</h2>
            <ul>
              <li>Standardize leasing, rent collection, and maintenance so adding a door adds minutes, not hours.</li>
              <li>Use dashboards to catch vacancy and delinquency early.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Buy on discipline, finance with intent, and let systems carry the operations. That is how one rental becomes a portfolio without becoming a full-time job.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
