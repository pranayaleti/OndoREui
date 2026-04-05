import { CitySubServicePage } from "@/components/city-sub-service-page"
import { findCityBySlug, allCitySlugs, toCitySlug } from "@/lib/utah-cities"
import { subServiceDefinitions, getSubServiceSlugsForParent } from "@/lib/sub-service-content"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Params = Promise<{ city: string; subservice: string }>

const validSlugs = getSubServiceSlugsForParent("property-management")

export function generateStaticParams(): { city: string; subservice: string }[] {
  return allCitySlugs.flatMap((city) =>
    validSlugs.map((subservice) => ({ city, subservice })),
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug, subservice } = await params
  const city = findCityBySlug(citySlug)
  const def = subServiceDefinitions[subservice]
  if (!city || !def) return {}
  const title = `${def.metaTitle(city.name)} | ${SITE_BRAND_SHORT}`
  const description = def.metaDescription(city.name)
  const canonical = `${SITE_URL}/property-management/${citySlug}/${subservice}/`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug, subservice } = await params
  const city = findCityBySlug(citySlug)
  const def = subServiceDefinitions[subservice]
  if (!city || !def || def.parentService !== "property-management") {
    notFound()
  }
  return (
    <>
      <SEO
        title={`${def.metaTitle(city.name)} | ${SITE_BRAND_SHORT}`}
        description={def.metaDescription(city.name)}
        pathname={`/property-management/${citySlug}/${subservice}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management/` },
          { name: city.name, url: `${SITE_URL}/property-management/${citySlug}/` },
          { name: def.name, url: `${SITE_URL}/property-management/${citySlug}/${subservice}/` },
        ])}
      />
      <CitySubServicePage city={city} subService={def} />
    </>
  )
}
