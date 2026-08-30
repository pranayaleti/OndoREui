import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, DollarSign, Shield } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/first-time", {
  title: "First-Time Homebuyer Guide | Utah Real Estate",
  description: "Step-by-step guidance, programs, and calculators for first-time homebuyers in Utah.",
})


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
        subtitle="Cash besides down payment, assistance programs, and Utah title closings"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Cash besides down payment is the first question</h2>
              <p className="text-lg text-foreground/70">
                A 3.5% down payment is not cash to close. Earnest money, title, prepaids, and sometimes a second-lien
                DPA still have to be sourced. Start with{" "}
                <Link href="/learn/first-time" className="text-primary underline-offset-4 hover:underline">
                  first-time cash and closing
                </Link>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>First-time cash map</CardTitle>
                  <CardDescription>
                    <Link href="/learn/first-time" className="text-primary underline-offset-4 hover:underline">
                      Cash besides down payment, DPA, and Utah title closings
                    </Link>
                    .
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Know cash to close</CardTitle>
                  <CardDescription>
                    <Link href="/blog/utah-cash-to-close-besides-down-payment" className="text-primary underline-offset-4 hover:underline">
                      Down payment plus title, prepaids, and earnest money
                    </Link>
                    . Three cash lines:{" "}
                    <Link href="/blog/earnest-money-vs-down-payment-vs-closing-costs" className="text-primary underline-offset-4 hover:underline">
                      earnest vs down vs closing costs
                    </Link>
                    .
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Down payment assistance + gifts</CardTitle>
                  <CardDescription>
                    <Link href="/blog/dpa-stacked-with-fha-gift-funds" className="text-primary underline-offset-4 hover:underline">
                      How DPA and an FHA gift can sit on the same file
                    </Link>
                    . Signatures when a parent is the donor:{" "}
                    <Link href="/blog/parent-gifting-down-payment-who-signs" className="text-primary underline-offset-4 hover:underline">
                      who signs what
                    </Link>
                    .
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">First-Time Buyer Programs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">FHA Loans</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• HUD policy can allow 3.5% down at 580+; many lender overlays sit higher</li>
                    <li>• Upfront and annual MIP — compare to conventional PMI on two Loan Estimates</li>
                    <li>• Primary residence; condos need{" "}
                      <Link href="/blog/fha-condo-roster-project-approval" className="text-primary underline-offset-4 hover:underline">
                        FHA project approval
                      </Link>
                    </li>
                    <li>• See{" "}
                      <Link href="/blog/fha-vs-conventional-loans-utah" className="text-primary underline-offset-4 hover:underline">
                        FHA vs conventional at a 640 FICO
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">USDA Loans</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Zero down only when map, household income, and occupancy tests pass</li>
                    <li>• Address-specific USDA map — a city name is not enough</li>
                    <li>• Household income limits, not just the borrowers on the note</li>
                    <li>• No monthly PMI; USDA charges a guarantee fee instead (confirm current RD notice)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/buy/first-time/grants">See housing grants &amp; down payment assistance →</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/should-i-wait-for-20-percent-down">Should I wait for 20% down?</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/how-long-first-purchase-takes">How long a first purchase takes</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/first-time-buyer-file-mistakes">File mistakes, not listicles</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/utah-repc-deadline-and-your-loan">Utah REPC deadlines</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">Townhome vs condo HOA docs</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>
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
            <RelatedContent path="/buy/first-time" title="First-time buyer reading" />
            <NextStepCta path="/buy/first-time" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}

