import { CityPricingGuide } from "@/components/city-pricing-guide"
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
  const title = `Cost of Real Estate Services in ${cityName}, Utah | ${SITE_BRAND_SHORT}`
  const description = `Property management fees, home buying costs, mortgage estimates, and rental market data for ${cityName}, UT. Compare with nearby cities.`
  const canonical = `${SITE_URL}/pricing/${citySlug}/`
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
        title={`Cost of Real Estate Services in ${city.name}, Utah | ${SITE_BRAND_SHORT}`}
        description={`Property management fees, home buying costs, and rental market data for ${city.name}, UT.`}
        pathname={`/pricing/${citySlug}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Pricing", url: `${SITE_URL}/pricing/` },
          { name: city.name, url: `${SITE_URL}/pricing/${citySlug}/` },
        ])}
      />
      <CityPricingGuide city={city} />
    </>
  )
}
