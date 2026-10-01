import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitleText } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "@/components/investments/investment-card"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"
import { WebMCPOpportunitiesTool } from "@/components/investments/webmcp-opportunities-tool"
import { MOCK_OPPORTUNITIES, SAMPLE_DEAL_NOTICE } from "@/lib/investments-data"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
// API functions available for runtime use in client components
// import { getOpportunities } from "@/lib/investments-api"

const DESCRIPTION =
  "Sample investment deal pages that show how Ondo could present a commercial or fractional offering in Utah. The deals are illustrations, not live offerings."

export const metadata: Metadata = {
  title: "Sample Investment Deals",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/investments/opportunities/` },
  // Samples only, and no real offering exists: keep this out of search results and the sitemap.
  robots: { index: false, follow: true },
  openGraph: {
    title: pageTitleText("Sample Investment Deals | Ondo Real Estate"),
    description: DESCRIPTION,
    url: `${SITE_URL}/investments/opportunities/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default async function OpportunitiesPage() {
  // Sample records only. Nothing here is a live offering.
  const samples = MOCK_OPPORTUNITIES

  return (
    <main className="min-h-screen">
      <WebMCPOpportunitiesTool />
      <SEO
        title="Sample Investment Deals"
        description={DESCRIPTION}
        pathname="/investments/opportunities"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
          { name: "Sample deals", url: `${SITE_URL}/investments/opportunities` },
        ])}
      />

      <PageBanner
        title="Sample Investment Deals"
        subtitle="How an Ondo commercial or fractional deal page could look. These are samples, not offerings."
      />

      <section className="border-b bg-muted/40" aria-label="Sample deal notice">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-foreground/70 text-center max-w-3xl mx-auto">
            {SAMPLE_DEAL_NOTICE}{" "}
            <Link href="/contact/" className="text-primary hover:underline">
              Contact us
            </Link>{" "}
            if you want to be told if that changes.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 dark:text-foreground">Sample deals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {samples.map((opportunity) => (
                  <InvestmentCard key={opportunity.slug} opportunity={opportunity} />
                ))}
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
