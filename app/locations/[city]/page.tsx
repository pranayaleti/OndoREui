import { CityGuidePage } from "@/components/city-guide-page"
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
  const title = `Why ${cityName}, Utah Is a Great Place to Live & Invest | ${SITE_BRAND_SHORT}`
  const description = `Discover ${cityName}, UT — neighborhoods, schools, commute times, market stats, outdoor recreation, and why it's a top choice for homeowners and investors.`
  const canonical = `${SITE_URL}/locations/${citySlug}/`
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
        title={`Why ${city.name}, Utah Is a Great Place to Live & Invest | ${SITE_BRAND_SHORT}`}
        description={`Discover ${city.name}, UT — neighborhoods, schools, commute times, market stats, outdoor recreation, and real estate opportunities.`}
        pathname={`/locations/${citySlug}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Locations", url: `${SITE_URL}/locations/` },
          { name: city.name, url: `${SITE_URL}/locations/${citySlug}/` },
        ])}
      />
      <CityGuidePage city={city} />
    </>
  )
}
