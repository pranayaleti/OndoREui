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
  const title = `Home Loans in ${cityName}, Utah | ${SITE_NAME}`
  const description = `Conventional, FHA, VA, USDA, and jumbo loans serving ${cityName}. Get pre-qualified.`
  const canonical = `${SITE_URL}/loans/${citySlug}/`
  return { title: { absolute: title }, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug } = await params
  const city = findCityBySlug(citySlug)
  if (!city) {
    notFound() // Triggers the not-found.tsx page, which will redirect to /loans
  }
  return (
    <>
      <SEO
        title={`Home Loans in ${city.name}, Utah | ${SITE_NAME}`}
        description={`Conventional, FHA, VA, USDA, and jumbo loans serving ${city.name}. Get pre-qualified.`}
        pathname={`/loans/${citySlug}/`}
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans/` },
          { name: city.name, url: `${SITE_URL}/loans/${citySlug}/` },
        ])}
      />
      <CityServicePage city={city} service="loans" />
    </>
  )
}
