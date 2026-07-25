import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/finishing-basement-roi"
const title = "Finishing a Basement: Costs, Permits & ROI"
const description = "What a finished basement really costs, the permits and egress rules that matter, and how the ROI compares to other projects."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "finishing basement cost",
  "basement ROI",
  "basement egress window",
  "basement permit requirements",
  "add value to home",
  "basement apartment",
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

export default function FinishingBasementRoi() {
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
        section="Home Improvement"
        tags={["Home Improvement", "Renovation", "ROI"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Add square footage without moving — if the numbers work."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Home Improvement</Badge>
            <Badge variant="outline">Renovation</Badge>
            <Badge variant="outline">ROI</Badge>
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
              A finished basement is one of the highest-leverage ways to add usable space in a home —
              often at a lower cost per square foot than an addition. But the return depends on doing it
              to code and matching the finish to the neighborhood.
            </p>

            <h2>What it costs</h2>
            <ul>
              <li><strong>Budget finish:</strong> roughly $30–$50 / sq ft for a basic rec room — framing, drywall, flooring, lighting.</li>
              <li><strong>Mid-range with a bath:</strong> $50–$85 / sq ft once you add a bathroom, egress, and better finishes.</li>
              <li><strong>Legal apartment / ADU:</strong> $85–$140+ / sq ft with a kitchen, separate entrance, and full code compliance.</li>
            </ul>

            <h2>Permits &amp; code (don’t skip these)</h2>
            <ul>
              <li><strong>Egress window:</strong> any bedroom needs a compliant egress window and well — this is the most-missed requirement.</li>
              <li><strong>Ceiling height:</strong> most jurisdictions require ~7 ft minimum finished height.</li>
              <li><strong>Permits &amp; inspections:</strong> framing, electrical, plumbing, and final — unpermitted work can sink an appraisal or a sale.</li>
              <li><strong>Smoke/CO &amp; exits:</strong> hard-wired detectors and proper emergency exits are required for bedrooms.</li>
            </ul>

            <h2>ROI vs other projects</h2>
            <p>
              Finished basements typically recoup ~70–75% of cost at resale — solid, though usually
              behind minor kitchen and bath updates. The bigger win is often <em>use value</em>: a
              rentable room, a home office, or a legal apartment that produces income changes the math
              entirely. If you’re weighing income potential, run the numbers with our{" "}
              <Link href="/calculators/cash-on-cash">cash-on-cash calculator</Link>.
            </p>

            <h2>Know your local rules</h2>
            <p>
              Building codes, permit fees, and — critically — accessory-dwelling-unit (ADU) and zoning
              rules vary widely by city and county. Where an internal ADU is allowed and rental supply
              is tight, a basement apartment can be especially valuable. Always verify local requirements
              before you frame.
            </p>

            <h2>Takeaway</h2>
            <p>
              Finish to code, match the finish level to the neighborhood, and decide up front whether
              you’re buying use, resale value, or rental income. For the seasonal upkeep that keeps a
              finished basement dry, see our{" "}
              <Link href="/blog/home-maintenance-schedule">home maintenance schedule</Link>, and
              for outdoor projects, our{" "}
              <Link href="/blog/backyard-upgrades-and-fertilizer-guide">backyard upgrades guide</Link>.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
