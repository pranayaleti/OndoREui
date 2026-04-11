import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp, FileText, Clock, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Refinance Process | Ondo Real Estate",
  description: "Step-by-step guide to refinancing your home loan in Utah, from evaluation to closing.",
  alternates: { canonical: `${SITE_URL}/refinance/process/` },
  openGraph: {
    title: "Mortgage Refinance Process | Ondo Real Estate",
    description: "Step-by-step guide to refinancing your home loan in Utah, from evaluation to closing.",
  },
}


export default function RefinanceProcessPage() {
  const steps = [
    {
      number: 1,
      title: "Evaluate Your Current Situation",
      description: "Review your current mortgage terms, interest rate, and financial goals to determine if refinancing makes sense.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      number: 2,
      title: "Get Pre-Approved",
      description: "Complete our quick pre-approval process to see what rates and terms you qualify for.",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      number: 3,
      title: "Choose Your Loan Program",
      description: "Select from various refinance options including rate-and-term, cash-out, or streamline refinancing.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      number: 4,
      title: "Submit Your Application",
      description: "Complete the full application with required documentation and financial information.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      number: 5,
      title: "Underwriting & Approval",
      description: "Our team reviews your application and property to finalize your loan approval.",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      number: 6,
      title: "Closing",
      description: "Sign your loan documents and complete the refinance process, typically in 30-45 days.",
      icon: <Clock className="h-6 w-6" />
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Mortgage Refinance Process"
        description="Step-by-step guide to refinancing your home loan in Utah, from evaluation to closing."
        pathname="/refinance/process"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Refinance", url: `${SITE_URL}/refinance` },
          { name: "Process", url: `${SITE_URL}/refinance/process` },
        ])}
      />
      <PageBanner
        title="Mortgage Refinance Process"
        subtitle="A step-by-step guide to refinancing your home loan"
      />

      <section className="py-16 bg-background dark:bg-gradient-to-b dark:from-background dark:to-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">How Refinancing Works</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                Refinancing your mortgage can help you lower your monthly payment, reduce your interest rate, or access your home's equity. Here's how the process works:
              </p>
            </div>

            <div className="space-y-8 mb-12">
              {steps.map((step, _index) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center text-primary font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center text-primary">
                            {step.icon}
                          </div>
                          <CardTitle className="dark:text-foreground">{step.title}</CardTitle>
                        </div>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Types of Refinancing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 dark:text-foreground">Rate-and-Term Refinance</h4>
                  <p className="text-foreground/70 dark:text-foreground/70 mb-3">
                    Lower your interest rate or change your loan term without taking cash out.
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70 dark:text-foreground/70">
                    <li>• Reduce monthly payments</li>
                    <li>• Pay off loan faster</li>
                    <li>• Switch from ARM to fixed rate</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 dark:text-foreground">Cash-Out Refinance</h4>
                  <p className="text-foreground/70 dark:text-foreground/70 mb-3">
                    Access your home's equity to get cash for major expenses or investments.
                  </p>
                  <ul className="space-y-1 text-sm text-foreground/70 dark:text-foreground/70">
                    <li>• Home improvements</li>
                    <li>• Debt consolidation</li>
                    <li>• Major purchases</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Ready to Refinance?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/refinance">Calculate Your Savings</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
