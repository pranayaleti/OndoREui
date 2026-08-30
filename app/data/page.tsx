import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import { CITY_MARKET_AS_OF, CITY_MARKET_DATA_DISCLOSURE } from "@/lib/city-market-data"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/data") },
  title: "Utah Real Estate Market Data | Ondo Real Estate",
  description:
    "How Ondo publishes city-level housing and rent medians for the Wasatch Front, with links to each city report. Not an MLS pull, appraisal, or statewide average.",
}

const reportKinds = [
  {
    title: "City market reports",
    description: "Ondo medians, commute notes, and service links for each published city.",
    href: "/market-reports/",
  },
  {
    title: "Locations directory",
    description: "Every city we publish service pages for, grouped by county.",
    href: "/locations/",
  },
  {
    title: "School district guides",
    description: "District geography and official websites. Confirm details with the district.",
    href: "/schools/",
  },
]

export default function DataPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Real Estate Market Data | Ondo Real Estate"
        description="How Ondo publishes city-level housing and rent medians for the Wasatch Front. Not an MLS pull or appraisal."
        pathname="/data"
        image={`${SITE_URL}/modern-office-building.webp`}
      />
      <PageBanner
        title="Utah real estate market data"
        subtitle="City reports, not a single invented statewide median."
        backgroundImage="/modern-office-building.webp"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto max-w-3xl space-y-4 px-4 text-foreground/80">
          <p>
            We do not publish one Utah-wide rent, vacancy, or sale-price figure on this page. Those rollups hide
            county and city differences and are easy to get wrong. Instead we maintain city snapshots and date them.
          </p>
          <p>
            Latest internal verify stamp: <strong>{CITY_MARKET_AS_OF}</strong>. {CITY_MARKET_DATA_DISCLOSURE}
          </p>
          <p>
            If you need a property-specific opinion, request a CMA or rental analysis. Automated or city-median
            figures on this site are not either of those.
          </p>
        </div>
      </section>

      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Where to read the numbers</h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {reportKinds.map(({ title, description, href }) => (
              <Card key={title} className="border border-border">
                <CardContent className="flex flex-col gap-2 p-6">
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-foreground/70">{description}</p>
                  <Link href={href} className="mt-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
                    Open {title.toLowerCase()}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/contact">Ask for a market conversation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
