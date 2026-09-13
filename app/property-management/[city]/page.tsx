import { CityServicePage } from "@/components/city-service-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { pmCityDescription, pmCityTitle } from "@/lib/seo-titles"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

type Params = Promise<{ city: string }>

export function generateStaticParams(): { city: string }[] {
  return allCitySlugs.map((city) => ({ city }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = findCityBySlug(citySlug)
  const cityName = city?.name ?? citySlug
  const title = pageTitleText(pmCityTitle(cityName))
  const description = pmCityDescription(cityName)
  const canonical = `${SITE_URL}/property-management/${citySlug}/`
  return { title: pageTitle(title), description, alternates: { canonical }, openGraph: { title, description, url: canonical, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] }, }
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
        title={pmCityTitle(city.name)}
        description={pmCityDescription(city.name)}
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
