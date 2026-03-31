import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "@/components/investments/investment-card"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import { WebMCPOpportunitiesTool } from "@/components/investments/webmcp-opportunities-tool"
import { MOCK_OPPORTUNITIES } from "@/lib/investments-data"
// API functions available for runtime use in client components
// import { getOpportunities } from "@/lib/investments-api"

export const metadata: Metadata = {
  title: "Investment Opportunities",
  description:
    "Browse current commercial real estate and fractional ownership investment opportunities in Utah. View deal details, projected returns, and investment minimums.",
  alternates: { canonical: `${SITE_URL}/investments/opportunities/` },
  openGraph: {
    title: "Investment Opportunities | Ondo Real Estate",
    description:
      "Browse current commercial real estate and fractional ownership investment opportunities in Utah.",
    url: `${SITE_URL}/investments/opportunities/`,
  },
}

export default async function OpportunitiesPage() {
  // Use mock data for static export — live data fetched client-side where needed
  const opportunities = MOCK_OPPORTUNITIES
  const openDeals = opportunities.filter((o) => o.status === "open")
  const comingSoon = opportunities.filter((o) => o.status === "coming-soon")
  const fullyFunded = opportunities.filter((o) => o.status === "fully-funded")

  return (
    <main id="main-content" className="min-h-screen">
      <WebMCPOpportunitiesTool />
      <SEO
        title="Investment Opportunities"
        description="Browse current commercial real estate and fractional ownership investment opportunities in Utah. View deal details, projected returns, and investment minimums."
        pathname="/investments/opportunities"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
          { name: "Opportunities", url: `${SITE_URL}/investments/opportunities` },
        ])}
      />

      <PageBanner
        title="Investment Opportunities"
        subtitle="Browse current and upcoming commercial real estate deals across Utah"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Open Deals */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 dark:text-foreground">
                Open Opportunities
              </h2>
              {openDeals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openDeals.map((opportunity) => (
                    <InvestmentCard key={opportunity.slug} opportunity={opportunity} />
                  ))}
                </div>
              ) : (
                <p className="text-foreground/70 dark:text-foreground/70 text-center py-8">
                  No open opportunities at the moment. Check back soon or{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact our team
                  </Link>{" "}
                  to be notified when new deals are available.
                </p>
              )}
            </div>

            {/* Coming Soon */}
            {comingSoon.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 dark:text-foreground">Coming Soon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {comingSoon.map((opportunity) => (
                    <InvestmentCard key={opportunity.slug} opportunity={opportunity} />
                  ))}
                </div>
              </div>
            )}

            {/* Fully Funded */}
            {fullyFunded.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 dark:text-foreground">
                  Recently Funded
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fullyFunded.map((opportunity) => (
                    <InvestmentCard key={opportunity.slug} opportunity={opportunity} />
                  ))}
                </div>
              </div>
            )}

            {/* Cross-Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <Button asChild variant="outline" size="sm">
                <Link href="/investments">Investment Overview</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/investments/commercial-real-estate">Commercial Real Estate</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/investments/fractional">Fractional Ownership</Link>
              </Button>
            </div>

            <RiskDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
