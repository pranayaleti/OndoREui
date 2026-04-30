"use client"

import Link from "next/link"
import { useMemo } from "react"
import Script from "next/script"
import { SITE_PHONE } from "@/lib/site"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cityContentByName } from "@/lib/city-content"
import { cityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import { CommuteBadges } from "@/components/commute-badges"
import { CrossLinkSection } from "@/components/cross-link-section"
import { CityTeamSection } from "@/components/city-team-section"
import {
  MapPin,
  School,
  TreePine,
  Landmark,
  Users,
  TrendingUp,
  Home,
  DollarSign,
  Briefcase,
  Mountain,
  Phone,
  Building2,
  ArrowRight,
} from "lucide-react"

type CityGuidePageProps = {
  city: UtahCity
}

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString("en-US")
}

export function CityGuidePage({ city }: CityGuidePageProps) {
  const citySlug = toCitySlug(city.name)
  const content = cityContentByName[city.name]
  const market = cityMarketData[city.name]
  const nearbyCities = useMemo(() => getNearbyCities(city.name, 6), [city.name])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${city.name}, Utah`,
    description: content?.overview,
    geo: city.lat && city.lng ? { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng } : undefined,
    containedInPlace: { "@type": "AdministrativeArea", name: `${city.county} County, Utah` },
  }

  return (
    <>
      <Script
        id="city-guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-primary mb-2">{city.county} County, Utah</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Why {city.name} Is a Great Place to Live &amp; Invest
          </h1>
          {content?.overview && (
            <p className="max-w-3xl mx-auto text-lg text-foreground/70">{content.overview}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/property-management/${citySlug}/`}>Property Management</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/buy-sell/${citySlug}/`}>Buy or Sell</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/loans/${citySlug}/`}>Home Loans</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* Market Snapshot */}
        {market && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              {city.name} Market Snapshot
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Home className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{fmtUsd(market.medianHomePrice)}</p>
                  <p className="text-sm text-foreground/60">Median Home Price</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{fmtUsd(market.medianRent)}/mo</p>
                  <p className="text-sm text-foreground/60">Median Rent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{market.population.toLocaleString()}</p>
                  <p className="text-sm text-foreground/60">Population</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{market.growthRate}</p>
                  <p className="text-sm text-foreground/60">Growth Rate</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">Avg Days on Market</p>
                <p className="text-lg font-semibold">{market.avgDaysOnMarket} days</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">Median Household Income</p>
                <p className="text-lg font-semibold">{fmtUsd(market.medianHouseholdIncome)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">Owner-Occupied</p>
                <p className="text-lg font-semibold">{market.ownerOccupiedPct}%</p>
              </div>
            </div>
          </section>
        )}

        {/* Lifestyle */}
        {content?.lifestyleDescription && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Living in {city.name}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{content.lifestyleDescription}</p>
            </div>
            {market?.geographyNote && (
              <p className="mt-4 text-sm text-foreground/60 italic flex items-center gap-1.5">
                <Mountain className="h-4 w-4 shrink-0" />
                {market.geographyNote}
              </p>
            )}
          </section>
        )}

        {/* Neighborhoods */}
        {content?.neighborhoods && content.neighborhoods.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Neighborhoods in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.neighborhoods.map((hood) => {
                const [name, desc] = hood.includes(" — ") ? hood.split(" — ") : [hood, null]
                return (
                  <Card key={hood}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{name}</CardTitle>
                    </CardHeader>
                    {desc && (
                      <CardContent>
                        <p className="text-sm text-foreground/70">{desc}</p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* Commute */}
        {market?.commuteTimes && market.commuteTimes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Commute Times from {city.name}
            </h2>
            <CommuteBadges commuteTimes={market.commuteTimes} />
          </section>
        )}

        {/* Top Employers */}
        {market?.topEmployers && market.topEmployers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Top Employers Near {city.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {market.topEmployers.map((emp) => (
                <span key={emp} className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
                  {emp}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Schools */}
        {market?.schoolDistrict && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <School className="h-6 w-6 text-primary" />
              Schools in {city.name}
            </h2>
            <p className="text-foreground/70 mb-3">
              {city.name} is served by <strong>{market.schoolDistrict}</strong>.
            </p>
            {market.notableSchools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {market.notableSchools.map((s) => (
                  <span key={s} className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Outdoor Recreation */}
        {market?.outdoorRec && market.outdoorRec.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TreePine className="h-6 w-6 text-primary" />
              Outdoor Recreation
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {market.outdoorRec.map((rec) => (
                <li key={rec} className="flex items-center gap-2 text-foreground/80">
                  <TreePine className="h-4 w-4 text-primary shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Local Landmarks */}
        {market?.localLandmarks && market.localLandmarks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Landmark className="h-6 w-6 text-primary" />
              Local Landmarks &amp; Points of Interest
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {market.localLandmarks.map((lm) => (
                <li key={lm} className="flex items-center gap-2 text-foreground/80">
                  <Landmark className="h-4 w-4 text-primary shrink-0" />
                  {lm}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Highlights */}
        {content?.highlights && content.highlights.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Why Invest in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {content.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 rounded-lg border p-4">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground/80">{h}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {content?.faq && content.faq.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">{city.name} Real Estate FAQ</h2>
            <div className="space-y-4">
              {content.faq.map((item) => (
                <details key={item.q} className="group rounded-lg border p-4 cursor-pointer">
                  <summary className="font-medium text-foreground group-open:mb-2">{item.q}</summary>
                  <p className="text-sm text-foreground/70">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started in {city.name}?</h2>
          <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
            Whether you&apos;re buying, selling, investing, or need property management — our local team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/property-management/${citySlug}/`}>
                <Building2 className="mr-2 h-4 w-4" />
                Property Management
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {SITE_PHONE}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact/">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Explore Nearby Cities</h2>
            <div className="flex flex-wrap gap-2">
              {nearbyCities.map((nc) => (
                <Link
                  key={nc.name}
                  href={`/locations/${toCitySlug(nc.name)}/`}
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  {nc.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Team section */}
        <CityTeamSection cityName={city.name} />

        {/* Cross-links to services */}
        <CrossLinkSection
          title={`${city.name} Real Estate Services`}
          variant="grid"
          links={[
            { label: `${city.name} Property Management`, href: `/property-management/${citySlug}/` },
            { label: `Buy or Sell in ${city.name}`, href: `/buy-sell/${citySlug}/` },
            { label: `${city.name} Home Loans`, href: `/loans/${citySlug}/` },
            { label: "Investment Opportunities", href: "/investments/opportunities/" },
            { label: "Calculators", href: "/calculators/" },
            { label: "Blog", href: "/blog/" },
          ]}
        />
      </div>
    </>
  )
}
