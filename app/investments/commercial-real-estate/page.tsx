import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ConsultationCTA from "@/components/ConsultationCTA"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import { ASSET_CLASSES } from "@/lib/investments-data"
import {
  Building2,
  Store,
  Warehouse,
  Hotel,
  HeartPulse,
  Container,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Store,
  Warehouse,
  Hotel,
  HeartPulse,
  Container,
}

export const metadata: Metadata = {
  title: "Commercial Real Estate Investing",
  description:
    "Learn about commercial real estate investment opportunities in Utah. Explore asset classes including office, retail, industrial, multifamily, medical office, and self-storage.",
  alternates: { canonical: `${SITE_URL}/investments/commercial-real-estate/` },
  openGraph: {
    title: "Commercial Real Estate Investing | Ondo Real Estate",
    description:
      "Explore commercial real estate asset classes and investment structures in Utah's high-growth markets.",
    url: `${SITE_URL}/investments/commercial-real-estate/`,
  },
}

const sampleDeal = {
  property: "Class A Office Building, Silicon Slopes",
  purchasePrice: "$6,200,000",
  totalEquityRaise: "$2,480,000",
  loanAmount: "$3,720,000 (60% LTV)",
  projectedNOI: "$496,000",
  projectedCapRate: "8.0%",
  holdPeriod: "5–7 years",
  distributionTarget: "Quarterly",
}

export default function CommercialRealEstatePage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SEO
        title="Commercial Real Estate Investing"
        description="Learn about commercial real estate investment opportunities in Utah. Explore asset classes including office, retail, industrial, multifamily, medical office, and self-storage."
        pathname="/investments/commercial-real-estate"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
          {
            name: "Commercial Real Estate",
            url: `${SITE_URL}/investments/commercial-real-estate`,
          },
        ])}
      />

      <PageBanner
        title="Commercial Real Estate Investing"
        subtitle="Institutional-quality assets across Utah's highest-growth corridors"
      />

      {/* Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">
                Why Commercial Real Estate?
              </h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 max-w-3xl mx-auto">
                Commercial real estate has historically offered investors attractive risk-adjusted
                returns through a combination of contractual rental income and long-term property
                appreciation. Compared to residential properties, commercial assets often feature
                longer lease terms, creditworthy tenants, and NNN structures that shift operating
                expenses to tenants.
              </p>
            </div>

            {/* Asset Classes Grid */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">
                Asset Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSET_CLASSES.map((asset) => {
                  const Icon = iconMap[asset.icon] ?? Building2
                  return (
                    <Card key={asset.name}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg dark:text-foreground">
                            {asset.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 dark:text-foreground/70">
                          {asset.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Sample Deal Breakdown */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-2 text-center dark:text-foreground">
                Illustrative Deal Structure
              </h3>
              <p className="text-center text-sm text-foreground/70 dark:text-foreground/70 mb-8">
                The following is a hypothetical example for educational purposes only. It does not
                represent an actual offering or guarantee of returns.
              </p>
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="dark:text-foreground">{sampleDeal.property}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Purchase Price</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.purchasePrice}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Total Equity Raise</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.totalEquityRaise}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Loan Amount</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.loanAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Projected NOI</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.projectedNOI}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Projected Cap Rate</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.projectedCapRate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/70">Hold Period</p>
                        <p className="font-semibold dark:text-foreground">
                          {sampleDeal.holdPeriod}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Consultation CTA */}
            <div className="mb-16 max-w-2xl mx-auto">
              <ConsultationCTA
                title="Ready to Explore Commercial Investments?"
                description="Schedule a free consultation to discuss your investment goals and current opportunities"
                variant="card"
              />
            </div>

            {/* Cross-Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <Button asChild variant="outline" size="sm">
                <Link href="/investments">Investment Overview</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/investments/fractional">Fractional Ownership</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/investments/opportunities">Browse Opportunities</Link>
              </Button>
            </div>

            <RiskDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
