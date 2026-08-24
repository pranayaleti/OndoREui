import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, BarChart, DollarSign, Info } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/rates", {
  title: "Mortgage Rates Explained | Utah Real Estate",
  description: "Understand how mortgage rates work in Utah and what affects the rate you are offered.",
})


export default function MortgageRatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Mortgage Rates Explained | Utah Real Estate"
        description="Understand how mortgage rates work in Utah. Learn about factors affecting rates, rate types, and how to get the best rate for your home loan."
        pathname="/buy/rates"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "Mortgage Rates", url: `${SITE_URL}/buy/rates` },
        ])}
      />
      <PageBanner
        title="Mortgage Rates Explained"
        subtitle="Everything you need to know about mortgage interest rates"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Understanding Mortgage Rates</h2>
              <p className="text-lg text-foreground/70">
                Your mortgage interest rate significantly impacts your monthly payment and total loan cost. Understanding how rates work can help you make informed decisions.
              </p>
            </div>

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
                  <CardDescription>Higher credit scores typically qualify for lower interest rates. A 20-point difference can save thousands.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Down Payment</CardTitle>
                  <CardDescription>Larger down payments often result in better rates. 20% down typically offers the best rates and avoids PMI.</CardDescription>
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
              <h3 className="text-2xl font-bold mb-6">Types of Mortgage Rates</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Fixed-Rate Mortgages</h4>
                  <p className="text-foreground/70">
                    Your interest rate stays the same for the entire loan term. Most common are 15-year and 30-year fixed-rate mortgages. Predictable payments make budgeting easier.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Adjustable-Rate Mortgages (ARMs)</h4>
                  <p className="text-foreground/70">
                    Start with a fixed rate for an initial period (e.g., 5, 7, or 10 years), then adjust periodically. Lower initial rates but can increase over time. Rate caps protect against excessive increases.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Rate Lock</h4>
                  <p className="text-foreground/70">
                    Once you lock your rate, it's protected from market fluctuations for a specified period (typically 30-60 days). Lock timing is important - too early and you might miss lower rates, too late and rates might rise.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">How to Get the Best Rate</h3>
              <ul className="space-y-3 text-foreground/70">
                <li>• <strong>Improve your credit score</strong> - Pay bills on time, reduce debt, and check your credit report for errors</li>
                <li>• <strong>Save for a larger down payment</strong> - 20% down typically gets the best rates</li>
                <li>• <strong>Shop around</strong> - Compare rates from multiple lenders</li>
                <li>• <strong>Consider points</strong> - Paying discount points can lower your rate</li>
                <li>• <strong>Choose the right loan term</strong> - Shorter terms often have lower rates</li>
                <li>• <strong>Lock at the right time</strong> - Work with your lender to time your rate lock</li>
              </ul>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Get Your Personalized Rate Quote</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Calculate Payment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Current Rates</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Expert Rate Guidance"
              description="Our loan officers can help you understand current market rates, improve your rate qualification, and lock in the best rate for your situation."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

