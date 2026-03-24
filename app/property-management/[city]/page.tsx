import { CityServicePage } from "@/components/city-service-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"

type Params = Promise<{ city: string }>

export function generateStaticParams(): { city: string }[] {
  return allCitySlugs.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = findCityBySlug(citySlug)
  const cityName = city?.name ?? citySlug
  const title = `Property Management in ${cityName}, Utah | ${SITE_BRAND_SHORT}`
  const description = `${SITE_BRAND_SHORT} manages rentals in ${cityName}, UT — tenant screening, rent collection, maintenance, and owner reporting. Get a free rental analysis.`
  const canonical = `${SITE_URL}/property-management/${citySlug}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug } = await params
  const city = findCityBySlug(citySlug)
  if (!city) {
    notFound()
  }
  return (
    <>
      <SEO
        title={`Property Management in ${city.name}, Utah | ${SITE_BRAND_SHORT}`}
        description={`${SITE_BRAND_SHORT} manages rentals in ${city.name}, UT — tenant screening, rent collection, maintenance, and owner reporting.`}
        pathname={`/property-management/${citySlug}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management/` },
          { name: city.name, url: `${SITE_URL}/property-management/${citySlug}/` },
        ])}
      />
      <CityServicePage city={city} service="property-management" />
    </>
  )
}
