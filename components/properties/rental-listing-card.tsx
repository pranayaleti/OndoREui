"use client"

import Image from "next/image"
import Link from "next/link"
import { Building, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { listingDetailPath } from "@/lib/public-property"
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
  const bedsLabel = property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Beds`

  return (
    <Card
      id={`listing-${property.id}`}
      className={cn(
        "h-full overflow-hidden card-hover hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        highlighted && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="relative aspect-video">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover"
          loading="lazy"
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 rounded-md bg-primary px-3 py-1 font-medium text-primary-foreground">
          ${property.price.toLocaleString("en-US")}/mo
        </div>
      </div>
      <CardContent className="p-4">
        <button
          type="button"
          className="mb-2 w-full text-left"
          aria-label={`Highlight ${property.title} on map`}
          onClick={() => onHighlight?.(property.id)}
        >
          <h3 className="text-lg font-semibold">{property.title}</h3>
          <p className="text-sm text-foreground/80">{property.address}</p>
        </button>
        <div className="flex items-center gap-4 text-sm" role="list" aria-label="Property specifications">
          <span className="flex items-center gap-1" role="listitem">
            <Home className="h-4 w-4" aria-hidden="true" /> {bedsLabel}
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <Building className="h-4 w-4" aria-hidden="true" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1" role="listitem">
            <Search className="h-4 w-4" aria-hidden="true" /> {property.sqft} sqft
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild className="min-h-[44px] w-full text-base">
            <Link
              href={listingDetailPath(property.id)}
              aria-label={`View details for ${property.title} at ${property.address}, priced at ${property.price} per month`}
            >
              View details
            </Link>
          </Button>
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
