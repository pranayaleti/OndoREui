import { CityServicePage } from "@/components/city-service-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { pmCityDescription, pmCityTitle } from "@/lib/seo-titles"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

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
  return { title: pageTitle(title), description, alternates: { canonical }, openGraph: { type: "website", title, description, url: canonical, images: OG_IMAGES.manage },
  twitter: { card: "summary_large_image", images: [OG_IMAGE_URLS.manage] }, }
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
        image={`${SITE_URL}/og/manage.jpg`}
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
