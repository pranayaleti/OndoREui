import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ConsultationCTA from "@/components/ConsultationCTA"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "@/lib/utah-cities"
import { cityMarketData } from "@/lib/city-market-data"
import { Home, DollarSign, Users, MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `Real Estate Services Across Utah | ${SITE_BRAND_SHORT}`,
  description:
    "Property management, home loans, and buying & selling services across 55 Utah cities. Find local real estate expertise in your city.",
  alternates: { canonical: `${SITE_URL}/locations/` },
  openGraph: {
    title: `Real Estate Services Across Utah | ${SITE_BRAND_SHORT}`,
    description:
      "Property management, home loans, and buying & selling services across 55 Utah cities.",
    url: `${SITE_URL}/locations/`,
  },
}

type CountyGroup = {
  county: string
  cities: typeof utahCitiesFromNorthOgdenToNephi
}

function groupByCounty(): CountyGroup[] {
  const groups: Record<string, typeof utahCitiesFromNorthOgdenToNephi> = {}
  for (const city of utahCitiesFromNorthOgdenToNephi) {
    const county = city.county || "Other"
    if (!groups[county]) groups[county] = []
    groups[county].push(city)
  }
  const order = ["Weber", "Davis", "Salt Lake", "Utah", "Juab"]
  return order
    .filter((c) => groups[c])
    .map((county) => ({ county, cities: groups[county] }))
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K"
  return n.toLocaleString("en-US")
}

export default function LocationsPage() {
  const countyGroups = groupByCounty()
  const totalCities = utahCitiesFromNorthOgdenToNephi.length

  return (
    <>
      <SEO
        title={`Real Estate Services Across Utah | ${SITE_BRAND_SHORT}`}
        description="Property management, home loans, and buying & selling services across 55 Utah cities."
        pathname="/locations/"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Locations", url: `${SITE_URL}/locations/` },
        ])}
      />

      <main className="min-h-screen">
        <PageBanner
          title="Real Estate Services Across Utah"
          subtitle={`Property management, home loans, and buying & selling in ${totalCities} cities along the Wasatch Front`}
          backgroundImage="/modern-office-building.webp"
        />

        <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Badge variant="secondary" className="text-base py-2 px-4">
              <MapPin className="h-4 w-4 mr-2" /> {totalCities} Cities
            </Badge>
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Home className="h-4 w-4 mr-2" /> 4 Counties
            </Badge>
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Users className="h-4 w-4 mr-2" /> 600+ Service Pages
            </Badge>
          </div>

          {/* City grid by county */}
          {countyGroups.map((group) => (
            <section key={group.county}>
              <h2 className="text-2xl font-bold mb-4">
                {group.county} County
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.cities.map((city) => {
                  const slug = toCitySlug(city.name)
                  const data = cityMarketData[city.name]
                  return (
                    <Card key={city.name} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center justify-between">
                          {city.name}
                          <Badge variant="outline" className="text-xs">
                            {group.county} Co.
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {data && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs text-muted-foreground">Population</p>
                              <p className="text-sm font-semibold">{fmt(data.population)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Median Price</p>
                              <p className="text-sm font-semibold">${fmt(data.medianHomePrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Median Rent</p>
                              <p className="text-sm font-semibold">${fmt(data.medianRent)}/mo</p>
                            </div>
                          </div>
                        )}
                        {data?.schoolDistrict && (
                          <p className="text-xs text-muted-foreground">
                            🏫 {data.schoolDistrict}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5">
                          <Link href={`/locations/${slug}/`}>
                            <Button variant="default" size="sm" className="text-xs h-7">
                              City Guide
                            </Button>
                          </Link>
                          <Link href={`/property-management/${slug}/`}>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Property Mgmt
                            </Button>
                          </Link>
                          <Link href={`/loans/${slug}/`}>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Loans
                            </Button>
                          </Link>
                          <Link href={`/buy-sell/${slug}/`}>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Buy & Sell
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}

          <ConsultationCTA variant="default" />
        </div>
      </main>
    </>
  )
}
