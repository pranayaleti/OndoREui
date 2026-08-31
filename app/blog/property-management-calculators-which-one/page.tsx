import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/property-management-calculators-which-one"
const title = "Property Management Calculators: Which One Should You Use and When"
const description = "A field guide to the core real-estate calculators — cash-on-cash, cap rate, DSCR, ROI, and more — and exactly when each one earns its keep."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "property management calculators",
  "real estate calculators",
  "cash on cash vs cap rate",
  "DSCR calculator",
  "which real estate calculator",
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

export default function PropertyManagementCalculatorsWhichOne() {
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
        section="Calculators"
        tags={["Calculators", "Finance", "Investing"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="The right metric for the decision in front of you."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Calculators</Badge>
            <Badge variant="outline">Finance</Badge>
            <Badge variant="outline">Investing</Badge>
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
              There is no single "right" number in real estate — each calculator answers a specific question. Use the wrong one and a good deal looks bad (or a bad one looks good).
            </p>

            <h2>Screening a deal</h2>
            <ul>
              <li><Link href="/calculators/one-percent-rule">1% rule</Link> and <Link href="/calculators/grm">GRM</Link> — fast first-pass filters.</li>
              <li><Link href="/calculators/cap-rate">Cap rate</Link> — the asset's unleveraged yield.</li>
            </ul>

            <h2>Judging your actual return</h2>
            <ul>
              <li><Link href="/calculators/cash-on-cash">Cash-on-cash</Link> — annual cash yield on the money you put in.</li>
              <li><Link href="/calculators/roi">ROI</Link> and <Link href="/calculators/cagr">CAGR</Link> — total and annualized growth over the hold.</li>
              <li><Link href="/calculators/dscr">DSCR</Link> — whether the income covers the loan (and qualifies you for one).</li>
            </ul>

            <h2>Buying a home to live in</h2>
            <ul>
              <li><Link href="/calculators/affordability">Affordability</Link>, <Link href="/calculators/mortgage-payment">mortgage payment</Link>, and <Link href="/calculators/rent-vs-own">rent vs own</Link>.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Match the calculator to the decision: filters to screen, yield to judge returns, DSCR to finance. Browse the full set on the <Link href="/calculators">calculators hub</Link>.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
