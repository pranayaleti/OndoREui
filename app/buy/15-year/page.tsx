import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingDown, Calendar, DollarSign, Target } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/15-year", {
  title: "15-Year Mortgage Guide | Utah Real Estate",
  description: "Learn about 15-year fixed-rate mortgages in Utah. Build equity faster and pay less interest with shorter loan terms.",
})


export default function FifteenYearPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="15-Year Mortgage Guide | Utah Real Estate"
        description="Learn about 15-year fixed-rate mortgages in Utah. Build equity faster and pay less interest with shorter loan terms."
        pathname="/buy/15-year"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "15-Year Mortgage", url: `${SITE_URL}/buy/15-year` },
        ])}
      />
      <PageBanner
        title="15-Year Mortgage"
        subtitle="Build equity faster and save thousands in interest"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose a 15-Year Mortgage?</h2>
              <p className="text-lg text-foreground/70">
                Pay off your home in half the time with a 15-year mortgage. While monthly payments are higher, you'll save significantly on interest and build equity faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingDown className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Save on Interest</CardTitle>
                  <CardDescription>Pay significantly less interest over the life of the loan compared to a 30-year mortgage.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Build Equity Faster</CardTitle>
                  <CardDescription>Own your home outright in 15 years instead of 30, building wealth more quickly.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lower Interest Rate</CardTitle>
                  <CardDescription>15-year mortgages typically come with lower interest rates than 30-year loans.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Financial Freedom</CardTitle>
                  <CardDescription>Be mortgage-free in 15 years, freeing up income for other goals like retirement or investments.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">15-Year vs. 30-Year Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">15-Year Mortgage</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Higher monthly payment</li>
                    <li>• Less interest paid overall</li>
                    <li>• Build equity faster</li>
                    <li>• Lower interest rate</li>
                    <li>• Own home in 15 years</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">30-Year Mortgage</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower monthly payment</li>
                    <li>• More interest paid over time</li>
                    <li>• More cash flow flexibility</li>
                    <li>• Easier to qualify</li>
                    <li>• Own home in 30 years</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Calculate Your 15-Year Payment</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Mortgage Calculator</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Current 15-Year Rates</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Is a 15-Year Mortgage Right for You?"
              description="Our loan officers can help you determine if you can comfortably afford a 15-year mortgage and show you the long-term savings."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

