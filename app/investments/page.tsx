import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { toCanonicalPageUrl } from "@/lib/page-canonical"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/investments") },
  title: pageTitle("Utah Investment Property: Rentals & Multifamily"),
  description:
    "Utah investment property that cash flows: single-family rentals, small multifamily, and how commercial and fractional ownership work, with management in-house.",
  openGraph: {
    title: pageTitleText("Utah Investment Property: Rentals & Multifamily"),
    description:
      "Utah investment property that cash flows: single-family rentals, small multifamily, and how commercial and fractional ownership work, with management in-house.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import { Building2, Users, LayoutGrid, MapPin, ArrowRight } from "lucide-react"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const sections = [
  {
    href: "/investments/commercial-real-estate",
    icon: Building2,
    title: "Commercial Real Estate",
    description:
      "Utah investment property that cash flows: single-family rentals, small multifamily, commercial and fractional deals, with management in-house.",
  },
  {
    href: "/investments/opportunity-zones",
    icon: MapPin,
    title: "Opportunity Zones",
    description:
      "Utah investment property that cash flows: single-family rentals, small multifamily, commercial and fractional deals, with management in-house.",
  },
  {
    href: "/investments/fractional",
    icon: Users,
    title: "Fractional Ownership",
    description:
      "Utah investment property that cash flows: single-family rentals, small multifamily, commercial and fractional deals, with management in-house.",
  },
  {
    href: "/investments/opportunities",
    icon: LayoutGrid,
    title: "Sample Deals",
    description:
      "See how a commercial or fractional deal page could look. These are samples, not live offerings.",
  },
]

export default function InvestmentsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <SEO
        title="Commercial & Fractional Real Estate Investing in Utah"
        description="Learn how commercial real estate and fractional ownership investing works in Utah. Sample deal pages show how an offering could be presented; there is no live offering."
        pathname="/investments"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
        ])}
      />

      <PageBanner
        title="Commercial & Fractional Real Estate Investing"
        subtitle="How commercial and fractional ownership work in Utah, and what to ask before you invest"
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
              <Link href="/investments/opportunities">Sample Deals</Link>
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

            {/* Section Cards, each links to its sub-route */}
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
                Ondo Real Estate manages rental properties in Utah. This section explains how
                commercial and fractional real estate investing works, so you can decide whether it
                fits your plan. Ondo has no investment open to investors on this site today, and the
                deal pages here are samples. If you want to be told if that changes,{" "}
                <Link href="/contact/" className="text-primary hover:underline">
                  get in touch
                </Link>
                .
              </p>
              <p>
                Deals like these are often held in a standalone LLC or SPV, which can separate
                liability and pass income through for tax purposes. Distribution and exit terms are
                set in each offering&apos;s documents, so read them closely and talk to an attorney
                and tax professional before you invest.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center mb-16">
              <Button asChild size="lg">
                <Link href="/investments/opportunities">
                  See Sample Deals
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
