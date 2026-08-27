// NOTE(i18n): server component, body copy (CTAs, breadcrumb, headers) is
// English for SEO under output: "export". Tracked as a Phase 1 follow-up:
// move client-only sections into a "use client" subtree wired to useTranslation.
import { Metadata } from "next"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { PropertyListingDetailClient } from "@/components/properties/property-listing-detail-client"
import { PropertyListingDetail } from "@/components/properties/property-listing-detail"
import {
  PROPERTY_DETAIL_PLACEHOLDER_ID,
  fetchPublicPropertyByPublicId,
  publicIdsFromListBody,
} from "@/lib/public-property"
import { backendUrl } from "@/lib/backend"

interface PageProps {
  params: Promise<{ publicId: string }>
}

/**
 * Required under `output: "export"` for any dynamic segment. We still emit one
 * HTML file per listing known at build time (SEO + GitHub Pages files).
 *
 * Unknown ids cannot get a unique HTML file on a static host. In `next dev`
 * we omit `dynamicParams = false` so those ids still render this page (client
 * fetch). On GitHub Pages, `app/not-found.tsx` recovers `/properties/{id}`
 * from the 404 shell and mounts the same client fetch.
 */
export async function generateStaticParams(): Promise<Array<{ publicId: string }>> {
  try {
    const res = await fetch(backendUrl("/api/properties/public"))
    if (!res.ok) {
      console.warn(
        `[properties/[publicId]] generateStaticParams: backend returned ${res.status}; emitting placeholder`
      )
      return [{ publicId: PROPERTY_DETAIL_PLACEHOLDER_ID }]
    }
    const params = publicIdsFromListBody(await res.json()).map((publicId) => ({ publicId }))
    return params.length > 0 ? params : [{ publicId: PROPERTY_DETAIL_PLACEHOLDER_ID }]
  } catch {
    console.warn(
      "[properties/[publicId]] generateStaticParams: backend unreachable; emitting placeholder"
    )
    return [{ publicId: PROPERTY_DETAIL_PLACEHOLDER_ID }]
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const property = await fetchPublicPropertyByPublicId(publicId)
  if (!property) return { title: "Property not found", robots: { index: false, follow: false } }

  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const title = `${property.title} – ${cityState} | ${SITE_NAME}`
  const description =
    property.description?.slice(0, 160) ??
    `${property.bedrooms} BR / ${property.bathrooms} BA in ${cityState}. $${property.price}/mo.`
  const canonicalPath = `/properties/${publicId}`
  const canonical = `${SITE_URL}${canonicalPath}/`
  const image = property.photos?.[0]?.url

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: buildMetadataLanguages(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { publicId } = await params
  const property = await fetchPublicPropertyByPublicId(publicId)
  if (property) {
    return <PropertyListingDetail property={property} publicId={publicId} />
  }
  // Build-time miss (placeholder, listing added after static export): still
  // ship a client fetch so live-API listings load in next dev and via the
  // static-export 404 recovery path.
  return <PropertyListingDetailClient publicId={publicId} />
}
