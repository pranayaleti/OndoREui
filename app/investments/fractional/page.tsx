import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitleText } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InvestmentFAQ } from "@/components/investments/investment-faq"
import { FRACTIONAL_FAQ_ITEMS } from "@/lib/investments-faq-data"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  CalendarClock,
  LogOut,
  CheckCircle,
} from "lucide-react"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Fractional Real Estate Ownership",
  description:
    "Learn how fractional ownership of commercial real estate works: LLC/SPV structures, distributions, exits and the risks to weigh before you invest.",
  alternates: { canonical: `${SITE_URL}/investments/fractional/` },
  openGraph: {
    title: pageTitleText("Fractional Real Estate Ownership | Ondo Real Estate"),
    description:
      "Learn how fractional ownership of commercial real estate works: the structure, distributions, exit strategies and risks.",
    url: `${SITE_URL}/investments/fractional/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Deal Sourcing & Structuring",
    description:
      "In a typical fractional deal, a sponsor identifies and underwrites a commercial property. The deal is held in a dedicated LLC or SPV with its own operating agreement.",
  },
  {
    number: 2,
    icon: Users,
    title: "Investor Syndication",
    description:
      "In a typical structure, qualified investors purchase membership interests in the entity. The minimum investment, terms, and projected returns are disclosed in the offering materials.",
  },
  {
    number: 3,
    icon: DollarSign,
    title: "Acquisition & Management",
    description:
      "Once funded, the entity acquires the property. A property manager typically handles leasing, operations, maintenance, and financial reporting on behalf of investors.",
  },
  {
    number: 4,
    icon: TrendingUp,
    title: "Distributions & Reporting",
    description:
      "Investors typically receive cash-flow distributions (for example monthly or quarterly) and periodic performance reports, as set out in the operating agreement.",
  },
  {
    number: 5,
    icon: LogOut,
    title: "Exit & Disposition",
    description:
      "At the end of the hold period, the property is sold and net proceeds are distributed to investors proportional to their ownership interest.",
  },
]

export default function FractionalPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Fractional Real Estate Ownership"
        description="Learn how fractional ownership of commercial real estate works: LLC/SPV structures, distributions, exits and the risks to weigh before you invest."
        pathname="/investments/fractional"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Investments", url: `${SITE_URL}/investments` },
            { name: "Fractional Ownership", url: `${SITE_URL}/investments/fractional` },
          ]),
          ...(Array.isArray(FRACTIONAL_FAQ_ITEMS) && FRACTIONAL_FAQ_ITEMS.length > 0
            ? [generateFAQJsonLd(FRACTIONAL_FAQ_ITEMS)]
            : []),
        ].filter(Boolean)}
      />

      <PageBanner
        title="Fractional Real Estate Ownership"
        subtitle="How owning a share of a commercial property through an LLC works. Ondo has no offering open to investors today."
      />

      {/* Explanation */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">
                What Is Fractional Ownership?
              </h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 max-w-3xl mx-auto">
                Fractional ownership allows multiple investors to collectively purchase a commercial
                property through a legal entity. Each investor owns a proportional share and
                receives distributions based on their ownership percentage, making commercial
                real estate accessible without the capital requirements of full ownership.
              </p>
            </div>

            {/* How It Works */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">
                How the Structure Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((step) => {
                  const StepIcon = step.icon
                  return (
                    <Card key={step.number}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {step.number}
                          </div>
                          <StepIcon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg dark:text-foreground">
                            {step.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70 dark:text-foreground/70">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </div>

            {/* Key Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Minimum Investment */}
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-2">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="dark:text-foreground">Minimum Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">Set per offering</p>
                  <p className="text-sm text-foreground/70 dark:text-foreground/70">
                    Each offering sets its own minimum. It is usually far lower than buying an
                    entire commercial property outright.
                  </p>
                </CardContent>
              </Card>

              {/* Distribution Model */}
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-2">
                    <CalendarClock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="dark:text-foreground">Distribution Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">Set per offering</p>
                  <p className="text-sm text-foreground/70 dark:text-foreground/70">
                    Cash-flow distributions from net operating income are usually paid on a
                    regular schedule defined in the operating agreement. They are not guaranteed.
                  </p>
                </CardContent>
              </Card>

              {/* Exit Strategy */}
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-lg w-fit mb-2">
                    <LogOut className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="dark:text-foreground">Exit Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary mb-2">Defined hold period</p>
                  <p className="text-sm text-foreground/70 dark:text-foreground/70">
                    Properties are usually held for a defined period, then sold. Net proceeds,
                    including any appreciation, are distributed proportionally to investors.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-16">
              <h3 className="text-2xl font-bold mb-6 text-center dark:text-foreground">
                Benefits of Fractional Ownership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {[
                  "Lower capital requirement than direct ownership",
                  "Diversification across multiple properties and asset classes",
                  "Potential for professional asset management and reporting",
                  "Liability protection through LLC/SPV structure",
                  "Pass-through tax benefits including depreciation",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/70 dark:text-foreground/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">
                Frequently Asked Questions
              </h3>
              <div className="max-w-3xl mx-auto">
                <InvestmentFAQ />
              </div>
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
                <Link href="/investments/opportunities">Sample Deals</Link>
              </Button>
            </div>

            <RiskDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
