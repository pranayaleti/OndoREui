import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, DollarSign, Shield, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conventional Loans in Utah | Ondo Real Estate",
  description: "Traditional mortgages with flexible terms and competitive rates. Learn requirements and compare options.",
  alternates: { canonical: `${SITE_URL}/loans/conventional/` },
  openGraph: {
    title: "Conventional Loans in Utah | Ondo Real Estate",
    description: "Traditional mortgages with flexible terms and competitive rates. Learn requirements and compare options.",
  },
}


export default function ConventionalLoanPage() {
  const benefits = [
    {
      title: "Flexible Down Payment",
      description: "As low as 3% down payment for qualified buyers",
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: "No PMI with 20% Down",
      description: "Eliminate private mortgage insurance with a 20% down payment",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Competitive Rates",
      description: "Get competitive interest rates based on your credit profile",
      icon: <Home className="h-6 w-6" />
    },
    {
      title: "Flexible Terms",
      description: "Choose from 15, 20, or 30-year fixed-rate terms",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Conventional Loans in Utah"
        description="Traditional mortgages with flexible terms and competitive rates. Learn requirements and compare options."
        pathname="/loans/conventional"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "Conventional", url: `${SITE_URL}/loans/conventional` },
        ])}
      />
      <PageBanner
        title="Conventional Loans"
        subtitle="Traditional home loans with flexible terms and competitive rates"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">What is a Conventional Loan?</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                Conventional loans are traditional mortgages not backed by government agencies like FHA, VA, or USDA. 
                They offer flexibility and competitive rates for qualified borrowers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted dark:bg-card rounded-lg flex items-center justify-center mb-4">
                      <div className="text-primary dark:text-primary">
                        {benefit.icon}
                      </div>
                    </div>
                    <CardTitle className="dark:text-foreground">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Conventional Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 dark:text-foreground">Credit Score</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• Minimum 620 for most programs</li>
                    <li>• 740+ for best rates</li>
                    <li>• Higher scores = better terms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 dark:text-foreground">Down Payment</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• As low as 3% for qualified buyers</li>
                    <li>• 20% to avoid PMI</li>
                    <li>• Gift funds allowed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 dark:text-foreground">Debt-to-Income Ratio</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• Maximum 43% DTI</li>
                    <li>• Lower DTI = better approval odds</li>
                    <li>• Consider all monthly debts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 dark:text-foreground">Employment</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• 2+ years employment history</li>
                    <li>• Stable income required</li>
                    <li>• Self-employed options available</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted dark:bg-card rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4 dark:text-foreground">Conventional vs. FHA Loans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 dark:text-foreground text-primary">Conventional Advantages</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• No upfront mortgage insurance</li>
                    <li>• PMI can be removed</li>
                    <li>• Higher loan limits</li>
                    <li>• More flexible terms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 dark:text-foreground text-primary">FHA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70 dark:text-foreground/70">
                    <li>• Lower credit score requirements</li>
                    <li>• Lower down payment (3.5%)</li>
                    <li>• More lenient DTI ratios</li>
                    <li>• Government-backed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Ready to Apply?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Calculate Your Payment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Pre-Approved</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CityLinksGrid title="Conventional Loans by City" servicePrefix="loans" subServiceSlug="conventional" />
    </main>
  )
}
