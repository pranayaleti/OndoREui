import { CityServicePage } from "@/components/city-service-page"
import { findCityByZip, allZips } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"

type Params = Promise<{ zip: string }>

export function generateStaticParams(): { zip: string }[] {
  return allZips.map((zip) => ({ zip }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { zip } = await params
  const city = findCityByZip(zip)
  const cityName = city?.name ?? "Utah"
  const title = `Real Estate Agents ${zip} (${cityName}) | ${SITE_NAME}`
  const description = `Buy or sell a home in ${cityName} ${zip}. Local expertise and full-service support.`
  const canonical = `${SITE_URL}/buy-sell/zip/${zip}/`
  return { title: { absolute: title }, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { zip } = await params
  const city = findCityByZip(zip)
  if (!city) return <div className="container mx-auto px-4 py-10">Service area not found.</div>
  return (
    <>
      <SEO
        title={`Real Estate Agents ${zip} (${city.name}) | ${SITE_NAME}`}
        description={`Buy or sell a home in ${city.name} ${zip}. Local expertise and full-service support.`}
        pathname={`/buy-sell/zip/${zip}/`}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy & Sell", url: `${SITE_URL}/buy-sell/` },
          { name: `${zip} (${city.name})`, url: `${SITE_URL}/buy-sell/zip/${zip}/` },
        ])}
      />
      <CityServicePage city={city} service="buy-sell" />
    </>
  )
}


