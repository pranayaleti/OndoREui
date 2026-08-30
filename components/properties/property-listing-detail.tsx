import Link from "next/link"
import type { ApiProperty } from "@/app/types/property"
import { Badge } from "@/components/ui/badge"
import { RenterAvailabilityNote } from "@/components/properties/renter-availability-note"
import { RenterPath } from "@/components/properties/renter-path"
import { ListingGallery, ListingGalleryEmptyNotice } from "@/components/properties/listing-gallery"
import { ListingInquiryCard } from "@/components/properties/listing-inquiry-card"
import { ListingSaveShare } from "@/components/properties/listing-save-share"
import PropertyMap from "@/components/map/property-map"
import { generateBreadcrumbJsonLd, generatePropertyJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { buildRenterSearchPrefill } from "@/lib/renter-search-prefill"
import {
  availabilityBadge,
  bathsLabel,
  bedsLabel,
  formatMonthlyRent,
  formatPropertyType,
  formatSqft,
  groupAmenities,
  listingCostRows,
  listingHighlights,
  petNotesFromAmenities,
  type AvailabilityTone,
} from "@/lib/listing-presentation"
import { cn } from "@/lib/utils"

function availabilityBadgeClass(tone: AvailabilityTone): string {
  switch (tone) {
    case "now":
      return "border-transparent bg-primary text-primary-foreground"
    case "upcoming":
      return "border-transparent bg-secondary text-secondary-foreground"
    case "listed":
      return "border-border bg-background text-foreground"
    case "ask":
      return "border-border bg-muted text-muted-foreground"
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

export function PropertyUnavailable() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-3 text-2xl font-bold">This listing isn&apos;t available</h1>
      <p className="mb-8 text-muted-foreground">
        The property you&apos;re looking for may have been rented or removed. Browse our current listings instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/properties"
          className="inline-flex min-h-[44px] items-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
        >
          Browse properties
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] items-center rounded-md border px-5 font-medium hover:bg-muted"
        >
          Contact us
        </Link>
      </div>
    </main>
  )
}

export function PropertyListingDetail({
  property,
  publicId,
}: {
  property: ApiProperty
  publicId: string
}) {
  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const fullAddress = [property.addressLine1, cityState, property.zipcode].filter(Boolean).join(", ")
  const heroImage = property.photos?.[0]?.url
  const typeLabel = formatPropertyType(property.type)
  const sqftLabel = formatSqft(property.sqft)
  const moveIn = availabilityBadge(property.availability)
  const highlights = listingHighlights({
    amenities: property.amenities,
    type: property.type,
    sqft: property.sqft,
    leaseTerms: property.leaseTerms,
  })
  const petNotes = petNotesFromAmenities(property.amenities)
  const amenityGroups = groupAmenities(property.amenities).filter(
    (group) => petNotes.length === 0 || group.id !== "pets",
  )
  const costRows = listingCostRows({
    price: property.price,
    fees: property.fees,
    leaseTerms: property.leaseTerms,
  })

  const propertyJsonLd = generatePropertyJsonLd({
    name: property.title,
    description: property.description ?? "",
    address: {
      streetAddress: property.addressLine1 ?? "",
      addressLocality: property.city ?? "",
      addressRegion: property.state ?? "",
      postalCode: property.zipcode ?? "",
      addressCountry: property.country ?? "US",
    },
    geo: property.lat != null && property.lng != null ? { latitude: property.lat, longitude: property.lng } : undefined,
    numberOfRooms: property.bedrooms,
    floorSize: property.sqft ? { value: property.sqft, unitCode: "FTK" } : undefined,
    image: property.photos?.map((p) => p.url),
    offers: {
      price: property.price,
      priceCurrency: "USD",
      availability: property.availability ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Properties", url: `${SITE_URL}/properties` },
    { name: property.title, url: `${SITE_URL}/properties/${publicId}` },
  ])

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {propertyJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/properties" className="hover:underline">
          Properties
        </Link>{" "}
        / <span aria-current="page">{property.title}</span>
      </nav>

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={cn("font-medium", availabilityBadgeClass(moveIn.tone))}>
              {moveIn.label}
            </Badge>
            {typeLabel ? (
              <Badge variant="outline" className="font-medium">
                {typeLabel}
              </Badge>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
          <p className="text-muted-foreground">{fullAddress}</p>
        </div>
        <ListingSaveShare publicId={publicId} title={property.title} />
      </header>

      {property.photos?.length ? (
        <ListingGallery title={property.title} photos={property.photos} />
      ) : (
        <ListingGalleryEmptyNotice />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <section
            aria-label="Listing facts"
            className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="h-1 bg-primary" aria-hidden="true" />
            <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p>
                <span className="block text-3xl font-bold tracking-tight">
                  {formatMonthlyRent(property.price)}
                  <span className="text-lg font-medium text-muted-foreground">/mo</span>
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Listed monthly rent
                </span>
              </p>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Beds</dt>
                <dd className="text-xl font-semibold">{bedsLabel(property.bedrooms)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Baths</dt>
                <dd className="text-xl font-semibold">{bathsLabel(property.bathrooms)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Size</dt>
                <dd className="text-xl font-semibold">{sqftLabel ?? "Not listed"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Home type</dt>
                <dd className="text-xl font-semibold">{typeLabel ?? "Not listed"}</dd>
              </div>
            </dl>
            </div>
          </section>

          <div className="mb-8 lg:hidden">
            <ListingInquiryCard costRows={costRows} propertyId={property.id} />
          </div>

          {highlights.length > 0 ? (
            <section className="mb-8" aria-labelledby="listing-highlights-heading">
              <h2 id="listing-highlights-heading" className="mb-3 text-xl font-semibold">
                What this listing includes
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {property.description ? (
            <section className="prose mb-8 max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold">About this property</h2>
              <p>{property.description}</p>
            </section>
          ) : null}

          {petNotes.length > 0 ? (
            <section className="mb-8 rounded-xl border border-border bg-card p-5" aria-labelledby="listing-pets-heading">
              <h2 id="listing-pets-heading" className="text-xl font-semibold">
                Pets
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {petNotes.map((note) => (
                  <li key={note.raw} className="rounded-full bg-muted px-3 py-1.5 text-sm">
                    {note.label}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Pet deposits and monthly pet rent, if any, are confirmed with leasing. They are not
                estimated here.
              </p>
            </section>
          ) : null}

          {amenityGroups.length > 0 ? (
            <section className="mb-8" aria-labelledby="listing-amenities-heading">
              <h2 id="listing-amenities-heading" className="mb-4 text-xl font-semibold">
                Amenities
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {amenityGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
                      {group.label}
                    </h3>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item.raw} className="rounded-md bg-muted px-3 py-1.5 text-sm">
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mb-8">
            <RenterPath variant="listing-detail" />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ListingInquiryCard costRows={costRows} propertyId={property.id} />
          </div>
        </div>
      </div>

      {property.lat != null && property.lng != null ? (
        <section className="mb-8" aria-label="Listing location">
          <h2 className="mb-3 text-xl font-semibold">Location</h2>
          <p className="mb-3 text-sm text-muted-foreground">{fullAddress}</p>
          <PropertyMap
            className="h-[280px]"
            selectedPropertyId={publicId}
            properties={[
              {
                id: publicId,
                title: property.title,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                lat: property.lat,
                lng: property.lng,
                image: heroImage,
                type: property.type,
              },
            ]}
          />
        </section>
      ) : null}

      <RenterAvailabilityNote
        prefillMessage={buildRenterSearchPrefill({
          listingTitle: property.title,
          listingAddress: fullAddress,
        })}
      />
    </main>
  )
}
