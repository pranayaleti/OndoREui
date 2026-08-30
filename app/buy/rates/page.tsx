import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, BarChart, DollarSign, Info } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, NEWS_AVERAGE_VS_QUOTE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"

const faqs = [
  {
    question: "Why is my quote not the 30-year average on the news?",
    answer: NEWS_AVERAGE_VS_QUOTE.notYourQuote,
  },
  {
    question: "Does this page publish current mortgage rates?",
    answer: NEWS_AVERAGE_VS_QUOTE.notATable,
  },
]

const newsVsQuoteColumns: readonly ComparisonColumn[] = [
  { id: "news", heading: "News 30-year average" },
  { id: "quote", heading: "Your Loan Estimate" },
]

const newsVsQuoteRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      news: NEWS_AVERAGE_VS_QUOTE.what,
      quote: "A Loan Estimate for a specific occupancy, credit file, LTV, property type, lock period, and points or credits.",
    },
  },
  {
    id: "file",
    criterion: "Typical file in the average",
    cells: {
      news: NEWS_AVERAGE_VS_QUOTE.typicalFile,
      quote: "Your occupancy (primary, second home, or investment), credit, down payment, condo or manufactured overlays, and program (conventional, FHA, VA, USDA, jumbo).",
    },
  },
  {
    id: "live",
    criterion: "Is it a live quote?",
    cells: {
      news: NEWS_AVERAGE_VS_QUOTE.notATable,
      quote: "An LE is still not a lock until you lock, and not a commitment to lend. Compare two LEs with the same lock period.",
    },
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/buy/rates", {
  title: "Why Your Quote Is Not the 30-Year Average | Ondo Real Estate",
  description:
    "Rate vs APR vs payment, what moves a Loan Estimate, and why a news average is not your quote. Not a live rate table.",
})


export default function MortgageRatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Why Your Quote Is Not the 30-Year Average"
        description="Rate vs APR vs payment, what moves a Loan Estimate, and why a news average is not your quote."
        pathname="/buy/rates"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Buy", url: `${SITE_URL}/buy` },
            { name: "Mortgage Rates", url: `${SITE_URL}/buy/rates` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Why your quote is not the 30-year average on the news"
        subtitle="Rate, APR, and payment are different numbers. This page is not a live rate table."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">A news average is a different product</h2>
              <p className="text-lg text-foreground/70">
                {NEWS_AVERAGE_VS_QUOTE.what} Your quote is a Loan Estimate for your occupancy, credit, LTV, property
                type, and lock period. Those are not the same number. Snapshot as of {LENDING_FACTS_AS_OF}.{" "}
                {NEWS_AVERAGE_VS_QUOTE.notATable}
              </p>
            </div>

            <ComparisonTable
              caption={`News average vs your Loan Estimate as of ${LENDING_FACTS_AS_OF}. Not a live-rate table.`}
              columns={newsVsQuoteColumns}
              rows={newsVsQuoteRows}
              footnote="Look up the official survey if you want the headline number. Then compare two Loan Estimates."
            />
            <p className="mb-8 text-foreground/70">
              {NEWS_AVERAGE_VS_QUOTE.methodology} Official survey:{" "}
              <a
                href={NEWS_AVERAGE_VS_QUOTE.officialUrl}
                className="text-primary underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Freddie Mac PMMS
              </a>
              . Confirm the published methodology; this site does not republish this week’s percent.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Market Factors</CardTitle>
                  <CardDescription>Rates are influenced by the economy, inflation, Federal Reserve policy, and bond market conditions.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Your Credit Score</CardTitle>
                  <CardDescription>Credit, occupancy, and LTV change pricing. There is no single score that “gets the news average.”</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Down Payment</CardTitle>
                  <CardDescription>Larger down payments often improve pricing and can avoid PMI at 20% equity. That is not a single “best rate” down-payment number.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Loan Type & Term</CardTitle>
                  <CardDescription>Fixed vs. adjustable, 15-year vs. 30-year, and loan type (conventional, FHA, VA) all affect your rate.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Rate vs APR vs payment</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Note rate</h4>
                  <p className="text-foreground/70">
                    The interest used to calculate principal and interest. Discount points can buy it down. That cost
                    belongs on the Loan Estimate, not hidden in a blog “rate.”
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">APR</h4>
                  <p className="text-foreground/70">
                    A broader cost measure that includes most lender prepaid finance charges. Two files with the same
                    note rate can have different APRs. Compare APR plus cash to close, not APR alone. Deep guide:{" "}
                    <Link href="/blog/apr-vs-rate-on-a-loan-estimate" className="text-primary underline-offset-4 hover:underline">
                      APR vs rate on a Loan Estimate
                    </Link>
                    .
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Payment</h4>
                  <p className="text-foreground/70">
                    Principal and interest plus taxes, insurance, HOA, and PMI/MIP when they apply. A “rate”
                    screenshot without those lines is not a payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">What moves a quote</h3>
              <ul className="space-y-3 text-foreground/70">
                <li>• Credit, occupancy (primary vs second home vs investment), and loan-to-value</li>
                <li>• Property type (condo and <Link href="/blog/manufactured-housing-adu-financing" className="text-primary underline-offset-4 hover:underline">manufactured or ADU</Link> overlays differ)</li>
                <li>• Lock period and whether you are buying <Link href="/blog/discount-points-breakeven-without-sales-pitch" className="text-primary underline-offset-4 hover:underline">discount points</Link> or taking a lender credit — or a <Link href="/blog/temporary-buydown-who-pays-year-three" className="text-primary underline-offset-4 hover:underline">temporary 2-1 / 3-2-1 buydown</Link>. How <Link href="/blog/apr-vs-rate-on-a-loan-estimate" className="text-primary underline-offset-4 hover:underline">APR vs rate on the Loan Estimate</Link> differ</li>
                <li>• Program (conventional, FHA, VA, USDA, jumbo) — jumbo starts at the{" "}
                  <Link href="/blog/jumbo-vs-conforming-fhfa-county-limit" className="text-primary underline-offset-4 hover:underline">
                    FHFA county limit
                  </Link>
                </li>
                <li>• Whether the file is a purchase or a refinance (see{" "}
                  <Link href="/blog/refinance-break-even-when-lower-rate-loses" className="text-primary underline-offset-4 hover:underline">
                    break-even after costs
                  </Link>
                  )</li>
              </ul>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Fixed, ARM, and locks</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Fixed-Rate Mortgages</h4>
                  <p className="text-foreground/70">
                    Your interest rate stays the same for the entire loan term. Most common are 15-year and 30-year fixed-rate mortgages. Predictable principal and interest — taxes and insurance can still change.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Adjustable-Rate Mortgages (ARMs)</h4>
                  <p className="text-foreground/70">
                    Start with a fixed rate for an initial period (e.g., 5, 7, or 10 years), then adjust periodically. Caps limit how far the <em>note rate</em> can move — they are not a payment promise. Read{" "}
                    <Link href="/blog/arm-caps-in-plain-english" className="text-primary underline-offset-4 hover:underline">
                      ARM caps in plain English
                    </Link>
                    . Product overview:{" "}
                    <Link href="/buy/adjustable-rate" className="text-primary underline-offset-4 hover:underline">
                      adjustable-rate mortgages
                    </Link>
                    .
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Interest-only (not a teaser)</h4>
                  <p className="text-foreground/70">
                    An interest-only period skips scheduled principal for a stated window. That is not an ARM teaser
                    and not a temporary buydown. Payment shock when amortization starts is the risk.{" "}
                    <Link href="/blog/interest-only-mortgages-who-they-are-for" className="text-primary underline-offset-4 hover:underline">
                      Interest-only: who it is for
                    </Link>
                    .
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Rate lock</h4>
                  <p className="text-foreground/70">
                    A lock holds a quoted rate for a stated window (often 30–60 days). It is not a promise that the market will not move after you lock, and it is not a commitment to lend. If rates fall while you are locked, you do not automatically get the lower rate — that is a written float-down, if it exists at all. Deep guides:{" "}
                    <Link href="/blog/rate-lock-if-rates-drop" className="text-primary underline-offset-4 hover:underline">
                      what a lock does if rates drop
                    </Link>
                    {" "}and{" "}
                    <Link href="/blog/rate-lock-extension-vs-floating" className="text-primary underline-offset-4 hover:underline">
                      lock extension vs floating
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">How to compare Loan Estimates</h3>
              <ul className="space-y-3 text-foreground/70">
                <li>• Hold loan amount, occupancy, property type, and lock period constant across lenders</li>
                <li>• Read note rate, APR, discount points, and lender credits on the same page — not rate alone</li>
                <li>• Compare cash to close and which fees are financed (MIP, funding fee, guarantee fee, points)</li>
                <li>• Separate origination from third-party title, recording, and prepaid lines</li>
                <li>• A news average is not an LE. Two LEs with the same rate can still differ in APR and cash to close</li>
              </ul>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Ask about current pricing</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Calculate Payment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/apr-vs-rate-on-a-loan-estimate">APR vs rate on the LE</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/rate-lock-if-rates-drop">If rates drop after you lock</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/rate-lock-extension-vs-floating">Lock vs float</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/discount-points-breakeven-without-sales-pitch">Discount points breakeven</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/temporary-buydown-who-pays-year-three">Temporary buydown</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Talk with a loan officer</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Rate guidance"
              description="Loan officers can explain current market rates, what changes pricing on your file, and whether a lock makes sense for your timeline. That conversation is not a quote from this page."
              variant="card"
            />
            <RelatedContent path="/buy/rates" />
            <NextStepCta path="/buy/rates" />
            <ContentFaq items={faqs} />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}

