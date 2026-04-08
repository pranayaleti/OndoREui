import Link from "next/link"
import { findCityBySlug, toCitySlug } from "@/lib/utah-cities"
import { findNeighborhood, allNeighborhoodParams } from "@/lib/neighborhood-content"
import { cityMarketData } from "@/lib/city-market-data"
import type { Metadata } from "next"
import { SITE_BRAND_SHORT, SITE_URL, SITE_PHONE } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CrossLinkSection } from "@/components/cross-link-section"
import { MapPin, Home, School, TreePine, Users, Phone, ArrowRight, CheckCircle2 } from "lucide-react"

type Params = Promise<{ city: string; neighborhood: string }>

export function generateStaticParams() {
  return allNeighborhoodParams()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug, neighborhood: neighborhoodSlug } = await params
  const city = findCityBySlug(citySlug)
  const hood = city ? findNeighborhood(city.name, neighborhoodSlug) : undefined
  const title = hood
    ? `Living in ${hood.name}, ${city!.name} | Neighborhood Guide | ${SITE_BRAND_SHORT}`
    : `Neighborhood Guide | ${SITE_BRAND_SHORT}`
  const description = hood
    ? `${hood.name} in ${city!.name}, UT — ${hood.character} Typical homes: ${hood.typicalHomes}. Price range: ${hood.priceRange}.`
    : ""
  const canonical = `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug, neighborhood: neighborhoodSlug } = await params
  const city = findCityBySlug(citySlug)
  if (!city) notFound()
  const hood = findNeighborhood(city.name, neighborhoodSlug)
  if (!hood) notFound()
  const market = cityMarketData[city.name]

  return (
    <>
      <SEO
        title={`Living in ${hood.name}, ${city.name} | Neighborhood Guide | ${SITE_BRAND_SHORT}`}
        description={`${hood.name} in ${city.name}, UT — ${hood.character}`}
        pathname={`/neighborhoods/${citySlug}/${neighborhoodSlug}/`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Neighborhoods", url: `${SITE_URL}/neighborhoods/` },
          { name: city.name, url: `${SITE_URL}/locations/${citySlug}/` },
          { name: hood.name, url: `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/` },
        ])}
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-background py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-primary mb-2 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4" />
              {city.name}, {city.county} County
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Living in {hood.name}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-foreground/70 italic">
              {hood.character}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">

          {/* Description */}
          <section>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{hood.description}</p>
            </div>
          </section>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Home className="h-4 w-4 text-primary" />
                  Typical Homes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/70">{hood.typicalHomes}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Home className="h-4 w-4 text-primary" />
                  Price Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-primary">{hood.priceRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  Walkability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{hood.walkability}</p>
              </CardContent>
            </Card>
          </div>

          {/* Best For */}
          <section>
            <h2 className="text-xl font-bold mb-4">{hood.name} Is Best For</h2>
            <div className="flex flex-wrap gap-2">
              {hood.bestFor.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  {b}
                </span>
              ))}
            </div>
          </section>

          {/* Schools */}
          {hood.nearbySchools && hood.nearbySchools.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Nearby Schools
              </h2>
              {market?.schoolDistrict && (
                <p className="text-sm text-foreground/60 mb-3">District: {market.schoolDistrict}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {hood.nearbySchools.map((s) => (
                  <span key={s} className="inline-flex items-center rounded-full border px-3 py-1 text-sm">{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Parks & Recreation */}
          {hood.nearbyParks && hood.nearbyParks.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TreePine className="h-5 w-5 text-primary" />
                Parks &amp; Recreation
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hood.nearbyParks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-foreground/80">
                    <TreePine className="h-4 w-4 text-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* CTA */}
          <section className="text-center py-8 rounded-xl bg-muted/50 px-6">
            <h2 className="text-xl font-bold mb-3">Interested in {hood.name}?</h2>
            <p className="text-foreground/70 mb-6">
              Whether you&apos;re buying, renting, or investing in {hood.name} — we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={`/property-management/${citySlug}/`}>
                  Property Management
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {SITE_PHONE}
                </a>
              </Button>
            </div>
          </section>

          <CrossLinkSection
            title={`Explore ${city.name}`}
            variant="pills"
            links={[
              { label: `${city.name} City Guide`, href: `/locations/${citySlug}/` },
              { label: `${city.name} Market Report`, href: `/market-reports/${citySlug}/` },
              { label: `${city.name} Pricing Guide`, href: `/pricing/${citySlug}/` },
              { label: `${city.name} Property Management`, href: `/property-management/${citySlug}/` },
            ]}
          />
        </div>
      </main>
    </>
  )
}
