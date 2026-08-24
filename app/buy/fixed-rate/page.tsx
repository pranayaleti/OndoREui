import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, TrendingUp, Calculator, Lock } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/fixed-rate", {
  title: "Fixed-Rate Mortgage Guide | Utah Real Estate",
  description: "Learn about fixed-rate mortgages in Utah and how predictable payments work.",
})


export default function FixedRatePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Fixed-Rate Mortgage Guide | Utah Real Estate"
        description="Learn about fixed-rate mortgages in Utah. Understand the benefits, rates, and terms of fixed-rate loans for predictable monthly payments."
        pathname="/buy/fixed-rate"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "Fixed-Rate Mortgage", url: `${SITE_URL}/buy/fixed-rate` },
        ])}
      />
      <PageBanner
        title="Fixed-Rate Mortgage"
        subtitle="Predictable payments with a stable interest rate for the life of your loan"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What is a Fixed-Rate Mortgage?</h2>
              <p className="text-lg text-foreground/70">
                A fixed-rate mortgage keeps your interest rate and monthly payment the same for the entire loan term, providing stability and predictability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Stable Payments</CardTitle>
                  <CardDescription>Your principal and interest payment never changes, making budgeting easier.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Rate Protection</CardTitle>
                  <CardDescription>Your interest rate is locked in, protecting you from future rate increases.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Long-Term Planning</CardTitle>
                  <CardDescription>Perfect for homeowners who plan to stay in their home for many years.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy to Understand</CardTitle>
                  <CardDescription>Simple, straightforward loan structure with no surprises.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Common Fixed-Rate Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">30-Year Fixed</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower monthly payments</li>
                    <li>• More interest paid over time</li>
                    <li>• Most popular option</li>
                    <li>• Best for long-term homeowners</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">15-Year Fixed</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Higher monthly payments</li>
                    <li>• Less interest paid overall</li>
                    <li>• Build equity faster</li>
                    <li>• Lower interest rate</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Calculate Your Payment</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Mortgage Calculator</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Current Rates</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Ready to Lock in Your Rate?"
              description="Our loan officers can help you understand fixed-rate mortgage options and find the best term for your situation."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

