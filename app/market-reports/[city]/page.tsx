import { MarketReportPage } from "@/components/market-report-page"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { marketReportDescription, marketReportTitle } from "@/lib/seo-titles"
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
  const title = pageTitleText(marketReportTitle(cityName))
  const description = marketReportDescription(cityName)
  const canonical = `${SITE_URL}/market-reports/${citySlug}/`
  return { title: pageTitle(title), description, alternates: { canonical }, openGraph: { type: "website", title, description, url: canonical, images: OG_IMAGES.guides },
  twitter: { card: "summary_large_image", images: [OG_IMAGE_URLS.guides] }, }
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
        title={marketReportTitle(city.name)}
        description={marketReportDescription(city.name)}
        pathname={`/market-reports/${citySlug}/`}
        image={`${SITE_URL}/og/guides.jpg`}
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
