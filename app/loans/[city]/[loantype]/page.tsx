import { CitySubServicePage } from "@/components/city-sub-service-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import { subServiceDefinitions, getSubServiceSlugsForParent } from "@/lib/sub-service-content"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Params = Promise<{ city: string; loantype: string }>

const validSlugs = getSubServiceSlugsForParent("loans")

export function generateStaticParams(): { city: string; loantype: string }[] {
  return allCitySlugs.flatMap((city) =>
    validSlugs.map((loantype) => ({ city, loantype })),
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug, loantype } = await params
  const city = findCityBySlug(citySlug)
  const def = subServiceDefinitions[loantype]
  if (!city || !def) return {}
  const title = `${def.metaTitle(city.name)} | ${SITE_BRAND_SHORT}`
  const description = def.metaDescription(city.name)
  const canonical = `${SITE_URL}/loans/${citySlug}/${loantype}/`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}

export default async function Page({ params }: { params: Params }) {
  const { city: citySlug, loantype } = await params
  const city = findCityBySlug(citySlug)
  const def = subServiceDefinitions[loantype]
  if (!city || !def || def.parentService !== "loans") {
    notFound()
  }
  return (
    <>
      <SEO
        title={`${def.metaTitle(city.name)} | ${SITE_BRAND_SHORT}`}
        description={def.metaDescription(city.name)}
        pathname={`/loans/${citySlug}/${loantype}/`}
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans/` },
          { name: city.name, url: `${SITE_URL}/loans/${citySlug}/` },
          { name: def.name, url: `${SITE_URL}/loans/${citySlug}/${loantype}/` },
        ])}
      />
      <CitySubServicePage city={city} subService={def} />
    </>
  )
}
