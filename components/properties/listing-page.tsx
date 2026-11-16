import type { Metadata } from "next"
import { SITE_URL, SITE_NAME, pageTitle, pageTitleText } from "@/lib/site"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import {
  PropertyListingDetailClient,
  PropertyListingDetailLive,
} from "@/components/properties/property-listing-detail-client"
import {
  PROPERTY_DETAIL_PLACEHOLDER_ID,
  fetchPublicListingRowsForBuild,
  fetchPublicPropertyByPublicId,
  fetchPublicPropertyList,
  listingDetailPath,
} from "@/lib/public-property"
import { pickRelatedListings } from "@/lib/listing-presentation"
import { screenListingDescription } from "@/lib/fair-housing-steering"

/**
 * Shared by the root listing page (`app/[listing]`, the canonical `/{address}/`
 * URL) and the legacy `app/properties/[publicId]` page.
 */

/** Build-time segments for generateStaticParams; throws on an API outage when the deploy requires listings. */
export async function listingStaticSegments(
  label: string,
  toSegments: (body: unknown) => string[],
): Promise<string[]> {
  try {
    const segments = toSegments(await fetchPublicListingRowsForBuild())
    return segments.length > 0 ? segments : [PROPERTY_DETAIL_PLACEHOLDER_ID]
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown"
    // The production deploy sets ONDO_REQUIRE_LISTINGS so an API outage fails the build
    // instead of publishing a site with no listing pages. Local and CI builds fall back.
    if (process.env.ONDO_REQUIRE_LISTINGS === "1") {
      throw new Error(`[${label}] generateStaticParams: listings API unavailable after retries (${reason})`)
    }
    console.warn(`[${label}] generateStaticParams: backend unavailable (${reason}); emitting placeholder`)
    return [PROPERTY_DETAIL_PLACEHOLDER_ID]
  }
}

export async function listingMetadata(segment: string): Promise<Metadata> {
  const property = await fetchPublicPropertyByPublicId(segment)
  if (!property) return { title: "Property not found", robots: { index: false, follow: false } }

  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const title = pageTitleText(`${property.title} – ${cityState} | ${SITE_NAME}`)
  const fallback = `${property.bedrooms} BR / ${property.bathrooms} BA in ${cityState}. Listed at $${property.price}/mo. Review written rental requirements, then tour or apply.`
  const description = screenListingDescription(property.description)?.slice(0, 160) ?? fallback
  const canonicalPath = listingDetailPath(property)
  const canonical = `${SITE_URL}${canonicalPath}/`
  const image = property.photos?.[0]?.url

  return {
    title: pageTitle(title),
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

export async function ListingPage({ segment }: { segment: string }) {
  const property = await fetchPublicPropertyByPublicId(segment)
  if (property) {
    const related = pickRelatedListings(property, await fetchPublicPropertyList())
    // Prerenders with the build-time data (SEO), then refreshes from the live
    // API on mount so dashboard edits show without waiting for a redeploy.
    return <PropertyListingDetailLive publicId={segment} initialProperty={property} initialRelated={related} />
  }
  // Build-time miss (placeholder, listing added after static export): still
  // ship a client fetch so live-API listings load in next dev and via the
  // static-export 404 recovery path.
  return <PropertyListingDetailClient publicId={segment} />
}
