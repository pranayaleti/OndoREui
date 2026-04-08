import { MarketReportPage } from "@/components/market-report-page"
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
  const title = `${cityName}, Utah Real Estate Market Report | ${SITE_BRAND_SHORT}`
  const description = `${cityName} market data: median home prices, rent, population growth, employment, schools, and investment metrics. Compare with nearby Utah cities.`
  const canonical = `${SITE_URL}/market-reports/${citySlug}/`
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
        title={`${city.name}, Utah Real Estate Market Report | ${SITE_BRAND_SHORT}`}
        description={`Comprehensive market data for ${city.name}, UT — prices, rent, growth, employment, and schools.`}
        pathname={`/market-reports/${citySlug}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Market Reports", url: `${SITE_URL}/market-reports/` },
          { name: city.name, url: `${SITE_URL}/market-reports/${citySlug}/` },
        ])}
      />
      <MarketReportPage city={city} />
    </>
  )
}
