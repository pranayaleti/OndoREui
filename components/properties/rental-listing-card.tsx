"use client"

import Image from "next/image"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { listingDetailPath } from "@/lib/public-property"
import { ListingFavoriteButton } from "@/components/properties/listing-favorite-button"
import {
  availabilityBadge,
  bedsLabel,
  bathsLabel,
  formatMonthlyRent,
  formatPropertyType,
  formatSqft,
  listingHighlights,
  listingMarketStatus,
  marketStatusBadgeClass,
} from "@/lib/listing-presentation"
import type { Property } from "@/app/types/property"

type RentalListingCardProps = {
  property: Property
  highlighted?: boolean
  onHighlight?: (id: string) => void
  onRequestShowing?: (id: string) => void
}

export function RentalListingCard({
  property,
  highlighted = false,
  onHighlight,
  onRequestShowing,
}: RentalListingCardProps) {
  const typeLabel = formatPropertyType(property.type)
  const size = formatSqft(property.sqft)
  const market = listingMarketStatus({
    status: property.status,
    listingKind: property.listingKind,
  })
  const moveIn = availabilityBadge(property.availability)
  const highlight = listingHighlights({
    amenities: property.amenities,
    type: property.type,
    sqft: property.sqft,
    leaseTerms: property.leaseTerms,
  })[0]
  const snippet = property.description?.trim()
    ? property.description.trim().slice(0, 90)
    : highlight?.label

  return (
    <Card
      id={`listing-${property.id}`}
      className={cn(
        "h-full overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        highlighted && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="relative aspect-[4/3]">
        <Link
          href={listingDetailPath(property.id)}
          className="absolute inset-0 z-0"
          aria-label={`View photos and details for ${property.title} at ${property.address}`}
        >
          <Image
            src={property.image || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover"
            loading="lazy"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-wrap gap-1">
          {market ? (
            <Badge className={cn("font-medium", marketStatusBadgeClass(market.tone))}>
              {market.label}
            </Badge>
          ) : null}
          {moveIn.tone === "now" || moveIn.tone === "upcoming" ? (
            <Badge variant="secondary" className="font-medium">
              {moveIn.label}
            </Badge>
          ) : null}
        </div>
        <div className="absolute right-2 top-2 z-10">
          <ListingFavoriteButton
            publicId={property.id}
            compact
            className="border-0 bg-background/90 shadow-sm"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <p className="font-outfit text-xl font-bold tracking-tight">
          {formatMonthlyRent(property.price)}
          <span className="text-sm font-medium text-muted-foreground">/mo</span>
        </p>
        <button
          type="button"
          className="mt-1 w-full text-left"
          aria-label={`Highlight ${property.title} on map`}
          onClick={() => onHighlight?.(property.id)}
        >
          <h3 className="text-lg font-semibold leading-snug">{property.title}</h3>
          <p className="text-sm text-foreground/80">{property.address}</p>
        </button>
        <p className="mt-2 text-sm text-muted-foreground">
          {[typeLabel, bedsLabel(property.bedrooms), bathsLabel(property.bathrooms), size]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {snippet ? (
          <p className="mt-2 line-clamp-2 text-sm text-foreground/70">
            {snippet}
            {property.description && property.description.trim().length > 90 ? "…" : null}
          </p>
        ) : null}
        <div className="relative z-10 mt-4 flex flex-col gap-2">
          <Link
            href={listingDetailPath(property.id)}
            className={cn(buttonVariants(), "min-h-[44px] w-full text-base")}
            aria-label={`View details for ${property.title} at ${property.address}, priced at ${property.price} per month`}
          >
            View property
          </Link>
          <Button asChild variant="outline" className="min-h-[44px] w-full text-base">
            <a
              href="#ask-leasing"
              aria-label={`Request a showing for ${property.title}`}
              onClick={() => onRequestShowing?.(property.id)}
            >
              Request a showing
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
