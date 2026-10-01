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
  NOTARY_SERVICE_ID,
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateServiceJsonLd,
} from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
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

  const title = `Remote Online Notary in ${city.name}, ${state.code}`
  return {
    ...buildPageMetadata({
      title: pageTitleText(title),
      description: `Secure remote online notarization in ${city.name}, ${state.name}. Identity-verified RON sessions for real estate, loans, and estate documents.`,
      pathname: `/notary/${state.slug}/${city.slug}/`,
      keywords: [
        `remote online notary ${city.name}`,
        `online notary ${city.name} ${state.code}`,
        `RON ${city.name}`,
      ],
    }),
    title: pageTitle(title),
  }
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
    areaServedCity: city.name,
    // One Organization entity site-wide (#organization in the root layout). Per-city
    // LocalBusiness nodes all described the single Lehi office.
    providerIsSiteOrganization: true,
    relatedToServiceId: NOTARY_SERVICE_ID,
  })

  return (
    <>
      <SEO
        title={`Remote Online Notary in ${city.name}, ${state.code}`}
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
          generateFAQJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]}
      />
      <NotaryCityPage city={city} state={state} nearby={nearby} />
    </>
  )
}
