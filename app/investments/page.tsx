import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Utah Investment Properties | Ondo Real Estate",
  description:
    "Discover high-yield investment properties in Utah. Turnkey rentals, multi-family, and commercial opportunities with expert management.",
  openGraph: {
    title: "Utah Investment Properties | Ondo Real Estate",
    description:
      "Discover high-yield investment properties in Utah. Turnkey rentals, multi-family, and commercial opportunities with expert management.",
  },
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import { Building2, Users, LayoutGrid, ArrowRight } from "lucide-react"

const sections = [
  {
    href: "/investments/commercial-real-estate",
    icon: Building2,
    title: "Commercial Real Estate",
    description:
      "Explore asset classes — office, retail, industrial, multifamily — and learn how institutional-quality CRE deals are structured.",
  },
  {
    href: "/investments/fractional",
    icon: Users,
    title: "Fractional Ownership",
    description:
      "Understand how LLC/SPV structures let you invest alongside other qualified investors with lower minimums and professional management.",
  },
  {
    href: "/investments/opportunities",
    icon: LayoutGrid,
    title: "Current Opportunities",
    description:
      "Browse open, upcoming, and recently funded deals across Utah. Each listing includes projected returns, hold periods, and risk factors.",
  },
]

export default function InvestmentsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SEO
        title="Commercial & Fractional Investment Opportunities"
        description="Explore commercial real estate and fractional ownership investment opportunities in Utah. Access institutional-quality properties with lower investment minimums."
        pathname="/investments"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
        ])}
      />

      <PageBanner
        title="Commercial & Fractional Investment Opportunities"
        subtitle="Build wealth through professionally managed real estate investments in Utah's fastest-growing markets"
      />

      {/* Quick Navigation */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4">
          <nav
            aria-label="Investment sections"
            className="flex flex-wrap justify-center gap-3"
          >
            <Button asChild variant="outline" size="sm">
              <Link href="/investments/commercial-real-estate">Commercial Real Estate</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/investments/fractional">Fractional Ownership</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/investments/opportunities">Browse Opportunities</Link>
            </Button>
          </nav>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">
                Why Invest in Utah Real Estate?
              </h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 max-w-3xl mx-auto">
                Utah consistently ranks among the top states for population growth, job creation, and
                economic expansion. The Wasatch Front corridor offers a compelling combination of
                strong tenant demand, limited supply, and long-term appreciation potential.
              </p>
            </div>

            {/* Section Cards — each links to its sub-route */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group"
                >
                  <Card className="h-full transition-shadow duration-200 group-hover:shadow-lg">
                    <CardHeader className="text-center">
                      <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-4">
                        <section.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg dark:text-foreground">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70 dark:text-foreground/70 text-center">
                        {section.description}
                      </p>
                      <p className="text-sm font-medium text-primary text-center mt-4 flex items-center justify-center gap-1 group-hover:underline">
                        Learn more <ArrowRight className="h-4 w-4" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Thesis Detail */}
            <div className="max-w-3xl mx-auto mb-16 space-y-4 text-foreground/70 dark:text-foreground/70">
              <p>
                Ondo Real Estate brings together institutional-quality deal sourcing, professional
                asset management, and transparent investor reporting. Whether you are looking to
                diversify into commercial real estate for the first time or expand an existing
                portfolio, our platform connects you with vetted opportunities across multiple asset
                classes.
              </p>
              <p>
                Each offering is structured as a standalone LLC or SPV, providing investors with
                liability protection, pass-through tax benefits, and clearly defined distribution and
                exit terms. We focus exclusively on the Utah market, where our local expertise and
                operator relationships give us a sourcing and management advantage.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center mb-16">
              <Button asChild size="lg">
                <Link href="/investments/opportunities">
                  View Current Opportunities
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            <RiskDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
