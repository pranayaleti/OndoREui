import type { Metadata } from "next"
import { notFound } from "next/navigation"

import SEO from "@/components/seo"
import { NotaryStatePage } from "@/components/notary-state-page"
import {
  getRonStateBySlug,
  isReservedNotarySegment,
} from "@/lib/notary-ron-states"
import {
  getAllNotaryStateParams,
  getNotaryCitiesByStateSlug,
} from "@/lib/notary-cities"
import { buildStateRonFaqs } from "@/lib/notary-location-copy"
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateServiceJsonLd,
} from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

type Params = Promise<{ state: string }>

/** Static export cannot render unknown state slugs on demand. */
export const dynamicParams = false

export function generateStaticParams() {
  return getAllNotaryStateParams()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { state: stateSlug } = await params
  if (isReservedNotarySegment(stateSlug)) return {}
  const state = getRonStateBySlug(stateSlug)
  if (!state || state.ronServingStatus !== "serves") return {}
  return buildPageMetadata({
    title: `Remote Online Notary in ${state.name} | ONDO Notary`,
    description: `Secure remote online notarization (RON) for clients in ${state.name}. Identity-verified sessions for real estate, loan signings, and estate documents.`,
    pathname: `/notary/${state.slug}/`,
    keywords: [
      `remote online notary ${state.name}`,
      `online notary ${state.name}`,
      `RON ${state.name}`,
    ],
  })
}

export default async function NotaryStateRoute({ params }: { params: Params }) {
  const { state: stateSlug } = await params
  if (isReservedNotarySegment(stateSlug)) notFound()
  const state = getRonStateBySlug(stateSlug)
  if (!state || state.ronServingStatus !== "serves") notFound()

  const cities = getNotaryCitiesByStateSlug(state.slug)
  const faqs = buildStateRonFaqs(state)
  const base = SITE_URL.replace(/\/$/, "")

  return (
    <>
      <SEO
        title={`Remote Online Notary in ${state.name} | ONDO Notary`}
        description={`Secure remote online notarization (RON) for clients in ${state.name}.`}
        pathname={`/notary/${state.slug}/`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Notary", url: `${base}/notary/` },
            { name: state.name, url: `${base}/notary/${state.slug}/` },
          ]),
          generateServiceJsonLd({
            name: `Remote Online Notarization in ${state.name}`,
            description: `RON for clients in ${state.name}`,
            serviceType: "Remote Online Notarization",
            areaServed: state.name,
          }),
          generateFAQJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]}
      />
      <NotaryStatePage state={state} cities={cities} />
    </>
  )
}
