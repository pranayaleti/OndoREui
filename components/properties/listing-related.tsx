import Link from "next/link"
import type { ApiProperty } from "@/app/types/property"
import { listingDetailPath } from "@/lib/public-property"
import {
  bedsLabel,
  formatMonthlyRent,
  formatPropertyType,
  formatSqft,
  listingMarketStatus,
  marketStatusBadgeClass,
} from "@/lib/listing-presentation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ListingRelatedProps = {
  listings: ApiProperty[]
}

export function ListingRelated({ listings }: ListingRelatedProps) {
  if (listings.length === 0) return null

  return (
    <section aria-labelledby="related-listings-heading" className="mb-8">
      <h2 id="related-listings-heading" className="mb-4 text-xl font-semibold">
        You may also like
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => {
          const photo = [...(listing.photos ?? [])].sort(
            (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
          )[0]
          const market = listingMarketStatus({
            status: listing.status,
            listingKind: listing.listingKind,
          })
          const typeLabel = formatPropertyType(listing.type)
          const size = formatSqft(listing.sqft)
          const cityState = [listing.city, listing.state].filter(Boolean).join(", ")
          return (
            <li key={listing.publicId}>
              <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="relative aspect-[4/3] bg-muted">
                  {photo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo.url}
                      alt={photo.caption?.trim() || listing.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {market ? (
                    <Badge className={cn("absolute left-2 top-2", marketStatusBadgeClass(market.tone))}>
                      {market.label}
                    </Badge>
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-lg font-semibold">{formatMonthlyRent(listing.price)}/mo</p>
                  <h3 className="mt-1 font-medium leading-snug">
                    <Link
                      href={listingDetailPath(listing.publicId)}
                      className="hover:underline"
                    >
                      {listing.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{cityState || listing.addressLine1}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {[bedsLabel(listing.bedrooms), typeLabel, size].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
