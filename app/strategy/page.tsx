import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

export const metadata: Metadata = {
  title: "Investment Strategy | Ondo Real Estate",
  description:
    "Learn how Ondo Real Estate identifies, acquires, and manages value-add multifamily and single-family properties in Utah to deliver consistent returns for investors.",
  alternates: { canonical: `${SITE_URL}/strategy/` },
  openGraph: {
    title: "Investment Strategy | Ondo Real Estate",
    description:
      "Ondo's disciplined acquisition and property management strategy focuses on Utah's high-growth markets to generate long-term passive income for investors.",
    url: `${SITE_URL}/strategy`,
  },
}

const pillars = [
  {
    icon: <MapPin className="h-7 w-7" />,
    title: "Market Selection",
    description:
      "We focus exclusively on Utah's Wasatch Front — one of the fastest-growing and most supply-constrained rental markets in the country. Strong job growth, in-migration, and limited new supply create durable rent appreciation.",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Disciplined Acquisition",
    description:
      "We target B and B+ class properties priced below replacement cost with identifiable value-add upside. Off-market sourcing and deep local relationships give us access to deals before they hit the open market.",
  },
  {
    icon: <Wrench className="h-7 w-7" />,
    title: "Value-Add Execution",
    description:
      "Interior renovations, exterior improvements, and operational efficiencies drive rent growth and NOI expansion. Our in-house construction team moves faster and at lower cost than third-party contractors.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Institutional Property Management",
    description:
      "Professionally managed properties perform better. Our team handles leasing, maintenance, tenant relations, and compliance — protecting asset value and investor returns at every stage.",
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Transparent Reporting",
    description:
      "Investors receive monthly statements, quarterly updates, and 24/7 portal access. We believe radical transparency builds trust and long-term relationships.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: "Risk Management",
    description:
      "Conservative underwriting, careful debt structuring, and multiple exit strategies protect downside. We stress-test every deal before acquisition.",
  },
]

const stats = [
  { value: "7–10%", label: "Target annual cash-on-cash return" },
  { value: "1.5–2×", label: "Target equity multiple" },
  { value: "3–7 yrs", label: "Typical hold period" },
  { value: "B / B+", label: "Target asset class" },
]

export default function StrategyPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Investment Strategy | Ondo Real Estate"
        description="Ondo's disciplined acquisition and property management strategy focuses on Utah's high-growth markets to generate consistent passive income."
        pathname="/strategy"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Strategy", url: `${SITE_URL}/strategy` },
        ])}
      />

      <PageBanner
        title="Our Investment Strategy"
        subtitle="A disciplined, market-tested approach to building lasting wealth through real estate"
      />

      {/* Stats bar */}
      <section className="py-10 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-sm opacity-80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our philosophy</h2>
          <p className="text-foreground/70 text-lg leading-relaxed">
            We believe the best real estate investments are bought right, managed exceptionally,
            and held with patience. By focusing on Utah&apos;s strongest submarkets and combining
            institutional-quality management with a value-add playbook, we consistently deliver
            risk-adjusted returns that outperform alternative income investments.
          </p>
        </div>
      </section>

      {/* Six pillars */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Six pillars of our strategy</h2>
            <p className="text-foreground/70">
              Each pillar reinforces the others to create a resilient, repeatable investment process.
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
              "Utah Wasatch Front — Salt Lake, Utah, Davis, and Weber Counties",
              "Properties priced at or below replacement cost",
              "Identifiable value-add upside through renovation or operational improvements",
              "Stable in-place cash flow with rent growth potential",
              "Conservative LTV — typically 60–70% at acquisition",
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
          <h2 className="text-2xl font-bold mb-4">Ready to invest alongside us?</h2>
          <p className="text-foreground/70 mb-8">
            Schedule a call with our investor relations team to learn about current opportunities
            and how our strategy can work for your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/new-investors">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/investments">View current investments</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
