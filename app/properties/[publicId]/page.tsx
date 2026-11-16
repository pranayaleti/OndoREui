import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import {
  fetchPublicPropertyByPublicId,
  legacyListingSegmentsFromListBody,
  listingDetailPath,
  rootListingSlug,
} from "@/lib/public-property"
import { ListingRedirect } from "@/components/properties/listing-redirect"
import { ListingPage, listingMetadata, listingStaticSegments } from "@/components/properties/listing-page"

/**
 * Legacy listing URL. A listing with an address now lives at /{address-slug}/;
 * this page is its redirect stub (noindex, canonical to the new URL) so links
 * already shared keep working on GitHub Pages, which has no server redirects.
 * A listing with no usable address still renders here, canonical.
 *
 * Unknown ids cannot get a unique HTML file on a static host. In `next dev`
 * we omit `dynamicParams = false` so those ids still render this page (client
 * fetch). On GitHub Pages, `app/not-found.tsx` recovers `/properties/{id}`
 * from the 404 shell and mounts the same client fetch.
 */
interface PageProps {
  params: Promise<{ publicId: string }>
}

export async function generateStaticParams(): Promise<Array<{ publicId: string }>> {
  const segments = await listingStaticSegments("properties/[publicId]", legacyListingSegmentsFromListBody)
  return segments.map((publicId) => ({ publicId }))
}

async function movedTo(segment: string) {
  const property = await fetchPublicPropertyByPublicId(segment)
  return property && rootListingSlug(property) ? listingDetailPath(property) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const to = await movedTo(publicId)
  if (to) {
    return {
      title: "Listing moved",
      alternates: { canonical: `${SITE_URL}${to}/` },
      robots: { index: false, follow: true },
    }
  }
  return listingMetadata(publicId)
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { publicId } = await params
  const to = await movedTo(publicId)
  if (to) return <ListingRedirect to={`${to}/`} />
  return <ListingPage segment={publicId} />
}
