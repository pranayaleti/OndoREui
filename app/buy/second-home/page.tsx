import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, MapPin, DollarSign, TrendingUp } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/second-home", {
  title: "Buying a Second Home | Utah Real Estate",
  description:
    "Second-home occupancy is exclusive use for part of the year. A rental is investment occupancy. Education, not a credit decision.",
})


export default function SecondHomePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Buying a Second Home | Utah Real Estate"
        description="Second-home occupancy versus investment occupancy. Education, not a credit decision or occupancy coaching."
        pathname="/buy/second-home"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "Second Home", url: `${SITE_URL}/buy/second-home` },
        ])}
      />
      <PageBanner
        title="Buying a Second Home"
        subtitle="Your guide to purchasing a vacation home or investment property in Utah"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Buy a Second Home in Utah?</h2>
              <p className="text-lg text-foreground/70">
                Whether you're looking for a vacation retreat, rental income, or a future retirement home, Utah offers excellent opportunities for second home ownership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Vacation Home</CardTitle>
                  <CardDescription>Enjoy year-round recreation in Utah's beautiful mountains, lakes, and national parks.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Investment Property</CardTitle>
                  <CardDescription>
                    Generate rental income only when occupancy is actually investment — not by labeling a rental as a
                    second home. See occupancy vs rental qualification.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Future Retirement</CardTitle>
                  <CardDescription>Secure your retirement location now while prices are favorable.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Tax Benefits</CardTitle>
                  <CardDescription>Explore potential tax advantages of second home ownership and rental properties.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Occupancy is not a pricing label</h3>
              <div className="space-y-4 text-foreground/70">
                <p>
                  A second home is typically for your exclusive use for part of the year. A property you will rent as a
                  business is investment occupancy. Those are different loan files, with different down payment and
                  pricing. Stating the wrong occupancy to get a cheaper rate is occupancy fraud — a federal crime, not a
                  paperwork preference. Read{" "}
                  <Link href="/blog/second-home-vs-investment-occupancy" className="text-primary underline-offset-4 hover:underline">
                    second home vs investment occupancy
                  </Link>
                  .
                </p>
                <p>
                  Financing a second home often means more down payment than a primary and different overlays than a
                  rental. If the property will be a rental, qualification may be full-doc or DSCR — see{" "}
                  <Link href="/blog/dscr-vs-full-doc-rental-loan" className="text-primary underline-offset-4 hover:underline">
                    DSCR vs full-doc
                  </Link>
                  . A cash-out on the house you occupy to fund a rental down payment is{" "}
                  <Link href="/blog/cash-out-to-buy-a-rental" className="text-primary underline-offset-4 hover:underline">
                    two occupancies and two LTVs
                  </Link>
                  . Tax treatment of a second home or rental is not tax advice.
                </p>
                <p>
                  Our loan officers can explain occupancy, conventional and portfolio overlays, and when cash-out on a
                  primary is even in the conversation. That conversation is not a pre-approval from this page.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Ready to Explore Second Home Options?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/qualify">Talk with a loan officer</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Occupancy and second-home financing"
              description="Loan officers can explain occupancy, overlays, and when a rental is a different file. That conversation is not a pre-approval from this page."
              variant="card"
            />
            <RelatedContent path="/buy/second-home" title="Occupancy and investment reading" />
            <NextStepCta path="/buy/second-home" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}

