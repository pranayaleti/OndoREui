import type { Metadata } from "next"
import { listingSegmentsFromListBody } from "@/lib/public-property"
import { ListingPage, listingMetadata, listingStaticSegments } from "@/components/properties/listing-page"

/**
 * Canonical listing URL: /{address-slug}/ (e.g. /4323-west-11475-south/).
 *
 * Metadata comes from listingMetadata, which sets the self-canonical
 * (https://…/{address-slug}/). Static routes win over this dynamic segment, so only listing slugs are
 * emitted (RESERVED_ROOT_SEGMENTS keeps them off route names). A listing added
 * after the build has no HTML file: `app/not-found.tsx` recovers a digit-first
 * root path from the 404 shell and mounts the same client fetch, and the
 * Cloudflare snippet turns that 404 into a 200.
 */
interface PageProps {
  params: Promise<{ listing: string }>
}

export async function generateStaticParams(): Promise<Array<{ listing: string }>> {
  const segments = await listingStaticSegments("[listing]", listingSegmentsFromListBody)
  return segments.map((listing) => ({ listing }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listing } = await params
  return listingMetadata(listing)
}

export default async function RootListingPage({ params }: PageProps) {
  const { listing } = await params
  return <ListingPage segment={listing} />
}
