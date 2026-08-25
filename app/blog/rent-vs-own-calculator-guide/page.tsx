import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/rent-vs-own-calculator-guide"
const title = "Rent vs Own Calculator: How to Make the Call in 2026"
const description = "The real math behind renting versus owning — opportunity cost, break-even horizon, and how to use a calculator to decide."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "rent vs own calculator",
  "rent vs buy 2026",
  "should I rent or buy",
  "break even home buying",
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

export default function RentVsOwnCalculatorGuide() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/suburban-house-garden.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Finance"
        tags={["Finance", "Buying", "Calculators"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Past the rules of thumb — the numbers that actually decide it."
        backgroundImage="/suburban-house-garden.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Finance</Badge>
            <Badge variant="outline">Buying</Badge>
            <Badge variant="outline">Calculators</Badge>
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
              Renting is not "throwing money away," and owning is not always the win. The right answer is a number: your break-even horizon, adjusted for opportunity cost.
            </p>

            <h2>What the calculator actually compares</h2>
            <ul>
              <li><strong>Owning costs:</strong> mortgage, taxes, insurance, maintenance, and the opportunity cost of the down payment.</li>
              <li><strong>Renting costs:</strong> rent growth over time, minus what you earn investing the money you did not tie up.</li>
              <li><strong>Break-even year:</strong> when cumulative owning cost drops below renting.</li>
            </ul>

            <h2>The variables that swing it most</h2>
            <ul>
              <li>How long you will stay (the single biggest lever).</li>
              <li>Rent growth vs home appreciation in your market.</li>
              <li>Your alternative investment return on the down payment.</li>
            </ul>

            <h2>Run your numbers</h2>
            <p>Plug your own figures into the <Link href="/calculators/rent-vs-own">rent vs own calculator</Link> and the <Link href="/calculators/affordability">affordability calculator</Link> — the break-even year usually makes the decision obvious.</p>

            <h2>Takeaway</h2>
            <p>Decide on your horizon and opportunity cost, not a rule of thumb. For the deeper model, read <Link href="/blog/renting-vs-owning-hidden-math">The Hidden Math Behind Renting vs Owning</Link>.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
