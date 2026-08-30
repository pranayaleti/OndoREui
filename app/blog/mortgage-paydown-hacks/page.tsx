import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/mortgage-paydown-hacks"
const title = "Mortgage Pay-Down Hacks That Actually Save Interest"
const description = "Biweekly payments, extra principal, recasting, and refinancing, which mortgage pay-down tactics really move the needle, and when not to."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "mortgage payoff tips",
  "biweekly mortgage payments",
  "extra principal payment",
  "mortgage recast",
  "pay off mortgage early",
  "save on mortgage interest",
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

export default function MortgagePaydownHacks() {
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
        section="Finance"
        tags={["Finance", "Mortgage", "Strategy"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Small changes to how you pay can erase years of interest."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Finance</Badge>
            <Badge variant="outline">Mortgage</Badge>
            <Badge variant="outline">Strategy</Badge>
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
              A mortgage front-loads interest: in the early years, most of each payment is interest,
              not principal. Anything that adds to principal early compounds into large lifetime savings
             , but the right move depends on your rate and your alternatives.
            </p>

            <h2>Tactics that work</h2>
            <ul>
              <li><strong>Extra principal, early:</strong> a modest recurring extra payment in years 1–10 saves the most, because it removes the highest-interest balance first.</li>
              <li><strong>Biweekly payments:</strong> paying half the monthly amount every two weeks yields 26 half-payments, one extra full payment a year, shaving years off a 30-year loan.</li>
              <li><strong>Round up:</strong> rounding a $1,840 payment to $2,000 is a painless, automatic principal boost.</li>
              <li><strong>Recast:</strong> after a lump-sum principal payment, ask the servicer to recast, same rate and term, lower payment. Compare the fee with refinance costs in{" "}
                <Link href="/blog/recast-vs-refinance">recast vs refinance</Link>. Not a savings quote.</li>
              <li><strong>Refinance (when rates drop):</strong> a lower rate or shorter term can cut total interest, weigh closing costs against the break-even.</li>
            </ul>

            <h2>See the impact</h2>
            <p>
              Model how extra principal and rate changes affect your payoff with the{" "}
              <Link href="/calculators/mortgage-payment">mortgage payment calculator</Link>. Extra principal versus a
              new note: <Link href="/blog/biweekly-extra-principal-vs-refinance">biweekly vs refinance</Link>.
            </p>

            <h2>When NOT to pay down</h2>
            <ul>
              <li><strong>Low fixed rate:</strong> if your rate is well below what safe investments return, extra dollars may work harder invested than prepaying.</li>
              <li><strong>No emergency fund:</strong> liquidity first, you can’t easily pull cash back out of a paid-down mortgage without a refinance or HELOC.</li>
              <li><strong>Higher-interest debt:</strong> clear credit cards and other high-rate balances before prepaying a mortgage.</li>
              <li><strong>Investor cash flow:</strong> for rentals, prepaying reduces leverage and can lower your{" "}
                <Link href="/blog/cash-on-cash-return-explained">cash-on-cash return</Link>, a deliberate trade of yield for safety.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>
              Attack principal early, automate the extra, and use a recast to lock in a lower payment
              after a lump sum. But check the opportunity cost first, for a low-rate loan, prepaying is
              a guaranteed return equal to your rate, no more, no less.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
