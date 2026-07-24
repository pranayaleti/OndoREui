import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, DollarSign, Shield } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"

export default function FirstTimeBuyerPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="First-Time Homebuyer Guide | Utah Real Estate"
        description="Step-by-step guidance, programs, and calculators for first-time homebuyers in Utah. Learn about down payment assistance, FHA loans, and more."
        pathname="/buy/first-time"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "First-Time Homebuyer", url: `${SITE_URL}/buy/first-time` },
        ])}
      />
      <PageBanner
        title="First-Time Homebuyer Guide"
        subtitle="Everything you need to know about buying your first home"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Journey to Homeownership Starts Here</h2>
              <p className="text-lg text-foreground/70">
                Buying your first home is exciting, but it can also feel overwhelming. We're here to guide you through every step of the process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Find Your Dream Home</CardTitle>
                  <CardDescription>Browse properties and find the perfect match for your needs and budget.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Get Pre-Approved</CardTitle>
                  <CardDescription>Know exactly how much you can afford before you start shopping.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Down Payment Assistance</CardTitle>
                  <CardDescription>Explore programs that can help with your down payment and closing costs.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">First-Time Buyer Programs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">FHA Loans</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Low down payment (3.5%)</li>
                    <li>• Flexible credit requirements</li>
                    <li>• Government-backed</li>
                    <li>• Perfect for first-time buyers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">USDA Loans</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Zero down payment</li>
                    <li>• Rural and suburban areas</li>
                    <li>• Income limits apply</li>
                    <li>• No PMI required</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/buy/first-time/grants">See housing grants &amp; down payment assistance →</Link>
                </Button>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/affordability">Calculate What You Can Afford</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Speak with a Loan Officer</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Need Help Getting Started?"
              description="Our experienced team can guide you through the first-time homebuyer process and help you find the right loan program for your situation."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

