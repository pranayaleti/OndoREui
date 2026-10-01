import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import {
  Target,
  TrendingUp,
  Wrench,
  ShieldCheck,
  BarChart3,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

// Noindex until counsel approves the investment wording. Not listed in the sitemap.
export const metadata: Metadata = {
  title: pageTitle("Investment Strategy | Ondo Real Estate"),
  description:
    "How Ondo Real Estate approaches value-add multifamily and single-family rental properties in Utah. General information only, not an offer.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/strategy/` },
  openGraph: {
    title: pageTitleText("Investment Strategy | Ondo Real Estate"),
    description:
      "How Ondo Real Estate approaches value-add rental properties in Utah. General information only, not an offer.",
    url: `${SITE_URL}/strategy`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

const pillars = [
  {
    icon: <MapPin className="h-7 w-7" />,
    title: "Market Selection",
    description:
      "We focus on Utah's Wasatch Front, where we are based and know the local rental market.",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Disciplined Acquisition",
    description:
      "We look for B and B+ class properties with identifiable value-add upside and review each one on its own numbers.",
  },
  {
    icon: <Wrench className="h-7 w-7" />,
    title: "Value-Add Execution",
    description:
      "Interior renovations, exterior improvements, and operational efficiencies can raise rent and net operating income. Results vary by property.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Property Management",
    description:
      "Ondo's property management team handles leasing, maintenance, tenant relations, and compliance for the properties we manage.",
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Transparent Reporting",
    description:
      "Owners get reporting and portal access through the Ondo owner portal.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Risk Management",
    description:
      "Every real estate investment carries risk, including the loss of principal. We review each deal's numbers, debt and exit options before anyone commits.",
  },
]

export default function StrategyPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Investment Strategy | Ondo Real Estate"
        description="How Ondo Real Estate approaches value-add rental properties in Utah. General information only, not an offer."
        pathname="/strategy"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Strategy", url: `${SITE_URL}/strategy` },
        ])}
      />

      <PageBanner
        title="Our Investment Strategy"
        subtitle="How we approach value-add rental properties in Utah"
      />

      {/* Philosophy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our philosophy</h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            We believe real estate investments should be bought carefully, managed well, and held
            with patience. We focus on Utah submarkets and pair property management with a
            value-add approach. Returns are not guaranteed and can be negative.
          </p>
        </div>
      </section>

      {/* Six pillars */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Six pillars of our strategy</h2>
            <p className="text-foreground/70">
              How we think about each stage of an investment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-primary">{p.icon}</span>
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 text-sm leading-relaxed">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Acquisition criteria */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">Acquisition criteria</h2>
          <div className="space-y-3">
            {[
              "B and B+ class multifamily or single-family rentals",
              "Utah Wasatch Front, Salt Lake, Utah, Davis, and Weber Counties",
              "Identifiable value-add upside through renovation or operational improvements",
              "Stable in-place cash flow with rent growth potential",
              "Strong local school districts, employment anchors, and transit access",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <TrendingUp className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Questions about investing in Utah rentals?</h2>
          <p className="text-foreground/70 mb-8">
            Contact us to talk through your goals. This page is general information, not an offer
            or a recommendation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/new-investors">
                New investor guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/investments">Investment information</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <RiskDisclosure />
        </div>
      </section>
    </main>
  )
}
