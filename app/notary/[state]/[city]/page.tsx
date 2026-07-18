import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SEO from "@/components/seo"
import { NotaryCityPage } from "@/components/notary-city-page"
import {
  getAllNotaryCityParams,
  getNotaryCitiesByStateSlug,
  getNotaryCity,
} from "@/lib/notary-cities"
import { getRonStateBySlug, isReservedNotarySegment } from "@/lib/notary-ron-states"
import { buildCityRonFaqs } from "@/lib/notary-location-copy"
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateLocalBusinessJsonLd,
  generateServiceJsonLd,
} from "@/lib/seo"
import {
  SITE_ADDRESS_OBJ,
  SITE_GEO,
  SITE_HOURS,
  SITE_PHONE,
  SITE_URL,
} from "@/lib/site"

type Params = Promise<{ state: string; city: string }>

/** Static export cannot render unknown city slugs on demand. */
export const dynamicParams = false

export function generateStaticParams() {
  return getAllNotaryCityParams()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  if (isReservedNotarySegment(stateSlug)) return {}

  const state = getRonStateBySlug(stateSlug)
  const city = getNotaryCity(stateSlug, citySlug)
  if (!state || !city || state.ronServingStatus !== "serves") return {}

  return buildPageMetadata({
    title: `Remote Online Notary in ${city.name}, ${state.code} | ONDO Notary`,
    description: `Secure remote online notarization in ${city.name}, ${state.name}. Identity-verified RON sessions for real estate, loans, and estate documents.`,
    pathname: `/notary/${state.slug}/${city.slug}/`,
    keywords: [
      `remote online notary ${city.name}`,
      `online notary ${city.name} ${state.code}`,
      `RON ${city.name}`,
    ],
  })
}

export default async function NotaryCityRoute({ params }: { params: Params }) {
  const { state: stateSlug, city: citySlug } = await params
  if (isReservedNotarySegment(stateSlug)) notFound()

  const state = getRonStateBySlug(stateSlug)
  const city = getNotaryCity(stateSlug, citySlug)
  if (!state || !city || state.ronServingStatus !== "serves") notFound()

  const nearby = getNotaryCitiesByStateSlug(state.slug).filter(
    (candidate) => city.nearbyCitySlugs?.includes(candidate.slug)
  )
  const faqs = buildCityRonFaqs(city, state)
  const base = SITE_URL.replace(/\/$/, "")
  const pageUrl = `${base}/notary/${state.slug}/${city.slug}/`

  const serviceLd = generateServiceJsonLd({
    name: `Remote Online Notarization in ${city.name}, ${state.code}`,
    description: `RON for clients in ${city.name}, ${state.name}`,
    serviceType: "Remote Online Notarization",
    areaServed: state.name,
  })

  // HQ NAP + SITE_GEO only — never pair HQ address with city coordinates (fake NAP).
  const businessLd = generateLocalBusinessJsonLd({
    name: "ONDO Notary Services",
    url: pageUrl,
    telephone: SITE_PHONE,
    openingHours: SITE_HOURS,
    areaServed: `${city.name}, ${state.name}`,
    address: {
      streetAddress: SITE_ADDRESS_OBJ.streetAddress,
      addressLocality: SITE_ADDRESS_OBJ.addressLocality,
      addressRegion: SITE_ADDRESS_OBJ.addressRegion,
      postalCode: SITE_ADDRESS_OBJ.postalCode,
      addressCountry: SITE_ADDRESS_OBJ.addressCountry,
    },
    geo: { latitude: SITE_GEO.latitude, longitude: SITE_GEO.longitude },
  })

  return (
    <>
      <SEO
        title={`Remote Online Notary in ${city.name}, ${state.code} | ONDO Notary`}
        description={`Secure remote online notarization in ${city.name}, ${state.name}.`}
        pathname={`/notary/${state.slug}/${city.slug}/`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Notary", url: `${base}/notary/` },
            { name: state.name, url: `${base}/notary/${state.slug}/` },
            { name: city.name, url: pageUrl },
          ]),
          serviceLd,
          businessLd,
          generateFAQJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]}
      />
      <NotaryCityPage city={city} state={state} nearby={nearby} />
    </>
  )
}
