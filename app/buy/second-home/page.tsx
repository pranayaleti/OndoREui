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
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/buy/second-home", {
  title: "Buying a Second Home | Utah Real Estate",
  description: "Guidance on buying a second home in Utah, including financing considerations for vacation and rental properties.",
})


export default function SecondHomePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Buying a Second Home | Utah Real Estate"
        description="Expert guidance on buying a second home in Utah. Learn about financing options, tax implications, and investment strategies for vacation homes and rental properties."
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
                  <CardDescription>Generate rental income while building equity in Utah's growing real estate market.</CardDescription>
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
              <h3 className="text-2xl font-bold mb-6">Financing Your Second Home</h3>
              <div className="space-y-4 text-foreground/70">
                <p>
                  Financing a second home typically requires a larger down payment (usually 10-20%) and may have slightly higher interest rates than a primary residence. However, if you plan to rent the property, you may qualify for investment property financing.
                </p>
                <p>
                  Our loan officers can help you explore all your options, including conventional loans, portfolio loans, and cash-out refinancing from your primary residence.
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
                  <Link href="/contact">Get Financing Pre-Approval</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA 
              title="Expert Guidance on Second Home Purchases"
              description="Our team can help you navigate the unique considerations of buying a second home, from financing to property management."
              variant="card"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

