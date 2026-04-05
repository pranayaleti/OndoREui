"use client"

import Link from "next/link"
import { useMemo } from "react"
import Script from "next/script"
import { SITE_NAME, SITE_URL, SITE_PHONE, SITE_HOURS, SITE_SOCIALS } from "@/lib/site"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cityContentByName } from "@/lib/city-content"
import { getServiceFaqBank } from "@/lib/service-faq"
import { cityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import { CommuteBadges } from "@/components/commute-badges"
import { MarketDataCard } from "@/components/market-data-card"
import { CrossLinkSection } from "@/components/cross-link-section"
import { LocalProofCTA } from "@/components/local-proof-cta"
import { getSubServicesForParent } from "@/lib/sub-service-content"
import { School, TreePine } from "lucide-react"

type CityServicePageProps = {
  city: UtahCity
  service: "property-management" | "buy-sell" | "loans"
}

export function CityServicePage({ city, service }: CityServicePageProps) {
  const citySlug = toCitySlug(city.name)
  const marketData = cityMarketData[city.name]
  const cityContent = cityContentByName[city.name]
  const subServices = useMemo(() => getSubServicesForParent(service), [service])
  const nearbyCities = useMemo(() => getNearbyCities(city.name, 6), [city.name])

  const headline = useMemo(() => {
    if (service === "property-management") return `#1 Choice for ${city.name} Property Management`
    if (service === "buy-sell") return `Buy or Sell Property in ${city.name}, Utah`
    return `Home Loans and Mortgage Options in ${city.name}, Utah`
  }, [city.name, service])

  const faqHref = useMemo(() => {
    if (service === "property-management") return "/faq/owner-faqs"
    if (service === "buy-sell") return "/faq/buying-selling-faqs"
    return "/faq/loans-faqs"
  }, [service])

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "RealEstateAgent"],
    name: SITE_NAME,
    areaServed: city.name + ", UT",
    url: typeof window === "undefined" ? SITE_URL : window.location.href,
    telephone: SITE_PHONE,
    openingHours: SITE_HOURS,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "UT",
      addressCountry: "US",
    },
    sameAs: SITE_SOCIALS,
    ...(city.lat && city.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
        }
      : {}),
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Property Management" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Buying" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Selling" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Loans" } },
    ],
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name:
      service === "property-management"
        ? `Property Management in ${city.name}, UT`
        : service === "buy-sell"
        ? `Home Buying & Selling in ${city.name}, UT`
        : `Home Loans & Mortgages in ${city.name}, UT`,
    serviceType:
      service === "property-management"
        ? "Property Management"
        : service === "buy-sell"
        ? "Real Estate Agent Services"
        : "Mortgage Lending",
    areaServed: city.name + ", UT",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const baseFaqs = getServiceFaqBank(service)
  const localizedBaseFaqs = baseFaqs.map((item) => ({
    q: item.q,
    a: item.a
      .replace(/Utah(?!\w)/g, `${city.name}, Utah`)
      .replace(/Wasatch Front/g, `${city.name} area`),
  }))
  const citySpecificFaqs = cityContent?.faq || []
  const faqList = [...localizedBaseFaqs, ...citySpecificFaqs]

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <Script id="city-business-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <Script id="city-service-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Script id="city-faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LocalProofCTA city={city} service={service} marketData={marketData} />

      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold leading-none tracking-tight sm:text-2xl md:text-3xl">
            {headline}
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          {cityContent?.overview && <p>{cityContent.overview}</p>}
          <p>
            {service === "property-management" && (
              <>
                Our full-service property management in {city.name}, Utah covers marketing,
                tenant screening, rent collection, maintenance coordination, owner reporting,
                and legal compliance. We tailor plans for single-family homes, townhomes,
                condos, and small multi-family units across ZIP codes {city.zips.join(", ")}.
              </>
            )}
            {service === "buy-sell" && (
              <>
                Work with experienced agents who know the {city.name} neighborhoods and
                schools. We provide data-driven pricing, professional marketing, and smooth
                contract-to-close coordination for buyers and sellers.
              </>
            )}
            {service === "loans" && (
              <>
                Explore competitive mortgage programs for {city.name}: conventional, FHA,
                VA, USDA, jumbo, and temporary buydowns. Get rate options and payment
                scenarios aligned to your goals.
              </>
            )}
          </p>

          {/* Commute badges */}
          {marketData?.commuteTimes && (
            <CommuteBadges commuteTimes={marketData.commuteTimes} />
          )}
        </CardContent>
      </Card>

      {/* Market data snapshot */}
      {marketData && (
        <MarketDataCard cityName={city.name} data={marketData} variant="compact" />
      )}

      {cityContent?.lifestyleDescription && (
        <Card>
          <CardHeader>
            <CardTitle>What Living in {city.name} Feels Like</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>{cityContent.lifestyleDescription}</p>
            {marketData?.localLandmarks.length ? (
              <p className="text-sm text-muted-foreground">
                Notable local spots: {marketData.localLandmarks.join(", ")}.
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us in {city.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc pl-6">
              <li>Local market expertise across ZIPs {city.zips.join(", ")}</li>
              <li>Transparent pricing and detailed owner/borrower dashboards</li>
              <li>Fast communication and proactive support</li>
              <li>Modern marketing, screening, and analytics</li>
              {cityContent?.highlights?.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We serve the entire {city.name} area and surrounding communities in {city.county || "Utah"} County, including all listed ZIP codes.
            </p>
            {cityContent?.neighborhoods && (
              <>
                <p className="mt-2 font-medium">Key Neighborhoods</p>
                <ul className="list-disc pl-6">
                  {cityContent.neighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schools & recreation */}
      {marketData && (
        <div className="grid gap-6 md:grid-cols-2">
          {marketData.notableSchools.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" /> Schools & Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-1">
                  <span className="font-medium">District:</span> {marketData.schoolDistrict}
                </p>
                <p className="text-sm text-muted-foreground">
                  {marketData.notableSchools.join(", ")}
                </p>
              </CardContent>
            </Card>
          )}
          {(marketData.outdoorRec.length > 0 || marketData.localLandmarks.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5" /> Lifestyle & Recreation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {marketData.geographyNote && (
                  <p className="text-sm text-foreground/80">{marketData.geographyNote}</p>
                )}
                {marketData.outdoorRec.length > 0 && (
                  <ul className="list-disc pl-5 text-sm text-foreground/70">
                    {marketData.outdoorRec.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                )}
                {marketData.localLandmarks.length > 0 && (
                  <>
                    <p className="font-medium text-sm pt-2">Local Landmarks</p>
                    <ul className="list-disc pl-5 text-sm text-foreground/70">
                      {marketData.localLandmarks.map((landmark) => (
                        <li key={landmark}>{landmark}</li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Separator />

      {/* Specialized sub-service cross-links */}
      {subServices.length > 0 && (
        <CrossLinkSection
          title={`Specialized Services in ${city.name}`}
          variant="grid"
          links={subServices.map((s) => ({
            label: `${s.name} in ${city.name}`,
            href: `/${service}/${citySlug}/${s.slug}/`,
          }))}
        />
      )}

      <CrossLinkSection
        title={`Nearby Cities We Serve Around ${city.name}`}
        variant="pills"
        links={nearbyCities.map((nearbyCity) => ({
          label: nearbyCity.name,
          href: `/${service}/${toCitySlug(nearbyCity.name)}/`,
        }))}
      />

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Have more questions?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            For detailed FAQs on buying, selling, property management, payments, Notary, and more, visit our centralized Help Center.
          </p>
          <Link href={faqHref}>
            <Button size="lg">View FAQs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default CityServicePage
