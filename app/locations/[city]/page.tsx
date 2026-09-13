import { CityGuidePage } from "@/components/city-guide-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { cityGuideDescription, cityGuideTitle } from "@/lib/seo-titles"
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
  const title = pageTitleText(cityGuideTitle(cityName))
  const description = cityGuideDescription(cityName)
  const canonical = `${SITE_URL}/locations/${citySlug}/`
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
        title={cityGuideTitle(city.name)}
        description={cityGuideDescription(city.name)}
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
