import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, DollarSign, TrendingUp, Home } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/30-year", {
  title: "30-Year Mortgage Guide | Utah Real Estate",
  description: "Learn about 30-year fixed-rate mortgages in Utah. Understand benefits, rates, and why it is a common home loan option.",
})


export default function ThirtyYearPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="30-Year Mortgage Guide | Utah Real Estate"
        description="Learn about 30-year fixed-rate mortgages in Utah. Understand benefits, rates, and why it's the most popular home loan option."
        pathname="/buy/30-year"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "30-Year Mortgage", url: `${SITE_URL}/buy/30-year` },
        ])}
      />
      <PageBanner
        title="30-Year Mortgage"
        subtitle="The most popular home loan option with lower monthly payments"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose a 30-Year Mortgage?</h2>
              <p className="text-lg text-foreground/70">
                The 30-year fixed-rate mortgage is America's most popular home loan, offering affordable monthly payments and long-term stability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lower Monthly Payments</CardTitle>
                  <CardDescription>Spread your loan over 30 years for more affordable monthly payments compared to shorter terms.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Buy More Home</CardTitle>
                  <CardDescription>Lower payments mean you may qualify for a larger loan amount and more expensive home.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Long-Term Stability</CardTitle>
                  <CardDescription>Fixed rate and payment for the full 30 years, perfect for long-term homeowners.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Flexibility</CardTitle>
                  <CardDescription>You can always make extra payments or refinance if your situation changes.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">30-Year vs. 15-Year Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">30-Year Mortgage</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower monthly payment</li>
                    <li>• More interest paid over time</li>
                    <li>• More cash flow flexibility</li>
                    <li>• Easier to qualify</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">15-Year Mortgage</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Higher monthly payment</li>
                    <li>• Less interest paid overall</li>
                    <li>• Build equity faster</li>
                    <li>• Lower interest rate</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Calculate Your 30-Year Payment</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Mortgage Calculator</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Current 30-Year Rates</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Ready for a 30-Year Mortgage?"
              description="Our loan officers can help you understand if a 30-year mortgage is right for you and get you pre-approved."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

