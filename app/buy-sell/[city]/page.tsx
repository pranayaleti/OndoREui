import { CityServicePage } from "@/components/city-service-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"
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
  const title = `Buy & Sell Homes in ${cityName}, Utah | ${SITE_NAME}`
  const description = `Top local agents in ${cityName}. Expert pricing, marketing, and smooth closings for buyers and sellers.`
  const canonical = `${SITE_URL}/buy-sell/${citySlug}/`
  return { title: { absolute: title }, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug } = await params
  const city = findCityBySlug(citySlug)
  if (!city) {
    notFound() // Triggers the not-found.tsx page, which will redirect to /buy-sell
  }
  return (
    <>
      <SEO
        title={`Buy & Sell Homes in ${city.name}, Utah | ${SITE_NAME}`}
        description={`Top local agents in ${city.name}. Expert pricing, marketing, and smooth closings for buyers and sellers.`}
        pathname={`/buy-sell/${citySlug}/`}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy & Sell", url: `${SITE_URL}/buy-sell/` },
          { name: city.name, url: `${SITE_URL}/buy-sell/${citySlug}/` },
        ])}
      />
      <CityServicePage city={city} service="buy-sell" />
    </>
  )
}


