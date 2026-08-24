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
import { Clock, TrendingUp, ShieldCheck, MapPin, Landmark, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Opportunity Zone Investing: How It Works",
  description:
    "How Qualified Opportunity Zones work, capital-gains deferral, the long-term hold exclusion, designated tracts nationwide, and who the strategy fits.",
  alternates: { canonical: `${SITE_URL}/investments/opportunity-zones/` },
  openGraph: {
    title: "Opportunity Zone Investing: How It Works | Ondo Real Estate",
    description:
      "Understand Qualified Opportunity Zone tax benefits and how designated tracts across the U.S. fit a long-term real estate strategy.",
    url: `${SITE_URL}/investments/opportunity-zones/`,
  },
}

const taxBenefits = [
  {
    icon: "Clock",
    title: "Capital-gains deferral",
    description:
      "Reinvest an eligible capital gain into a Qualified Opportunity Fund within 180 days and defer tax on that gain until the fund is sold or the statutory recognition date.",
  },
  {
    icon: "TrendingUp",
    title: "Tax-free appreciation on the new investment",
    description:
      "Hold the Opportunity Fund investment for at least 10 years and the appreciation on that investment can be excluded from capital-gains tax, the headline long-term benefit.",
  },
  {
    icon: "ShieldCheck",
    title: "Community reinvestment",
    description:
      "Opportunity Zones were created to channel long-term capital into designated lower-income and high-growth census tracts, pairing a tax incentive with local development.",
  },
]

const zonePoints = [
  {
    icon: "MapPin",
    title: "Thousands of tracts nationwide",
    description:
      "There are roughly 8,700 designated Qualified Opportunity Zone tracts across all 50 states, D.C., and U.S. territories, spanning both urban and rural communities.",
  },
  {
    icon: "Landmark",
    title: "Growth-corridor overlap",
    description:
      "Many zones sit near job centers and transit corridors where population and employment growth support long-hold development strategies.",
  },
  {
    icon: "Users",
    title: "Best for patient, gain-holding investors",
    description:
      "The strategy rewards investors with an existing capital gain who can commit to a 10-year horizon, not short-term flippers.",
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Landmark,
  Users,
}

export default function OpportunityZonesPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SEO
        title="Opportunity Zone Investing: How It Works"
        description="How Qualified Opportunity Zones work, capital-gains deferral, the long-term hold exclusion, designated tracts nationwide, and who the strategy fits."
        pathname="/investments/opportunity-zones"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
          {
            name: "Opportunity Zones",
            url: `${SITE_URL}/investments/opportunity-zones`,
          },
        ])}
      />

      <PageBanner
        title="Opportunity Zone Investing"
        subtitle="A long-term, tax-advantaged strategy for reinvesting capital gains"
      />

      {/* Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">
                What is a Qualified Opportunity Zone?
              </h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 max-w-3xl mx-auto">
                Opportunity Zones are census tracts designated under the 2017 Tax Cuts and Jobs Act to
                encourage long-term investment in designated communities. Investors reinvest eligible
                capital gains into a Qualified Opportunity Fund (QOF), which in turn invests in real
                estate or businesses within the zone, in exchange for meaningful tax benefits.
              </p>
              <p className="mt-4 text-sm text-foreground/70 dark:text-foreground/70 max-w-3xl mx-auto">
                Looking for available properties to buy instead? See{" "}
                <Link href="/investments/opportunities" className="text-primary hover:underline">
                  investment opportunities
                </Link>{" "}
               , this page explains the Opportunity Zone tax program, not a property listing.
              </p>
            </div>

            {/* Tax benefits */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">
                The Tax Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {taxBenefits.map((benefit) => {
                  const Icon = iconMap[benefit.icon]
                  return (
                    <Card key={benefit.title}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg dark:text-foreground">
                            {benefit.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 dark:text-foreground/70">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <p className="text-center text-xs text-foreground/60 mt-6 max-w-3xl mx-auto">
                Opportunity Zone rules and deadlines have changed over time and continue to evolve.
                Benefits depend on your specific situation. This is educational information, not tax or
                legal advice, consult a qualified professional.
              </p>
            </div>

            {/* National landscape */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">
                Opportunity Zones Across the U.S.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {zonePoints.map((point) => {
                  const Icon = iconMap[point.icon]
                  return (
                    <Card key={point.title}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg dark:text-foreground">
                            {point.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 dark:text-foreground/70">
                          {point.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="mb-16 max-w-2xl mx-auto">
              <ConsultationCTA
                title="Considering an Opportunity Zone Investment?"
                description="Schedule a free consultation to discuss whether an Opportunity Zone strategy fits your capital gains and timeline."
                variant="card"
              />
            </div>

            {/* Cross-Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              <Button asChild variant="outline" size="sm">
                <Link href="/investments">Investment Overview</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/investments/commercial-real-estate">Commercial Real Estate</Link>
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
