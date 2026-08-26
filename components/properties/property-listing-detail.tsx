import Link from "next/link"
import type { ApiProperty } from "@/app/types/property"
import { GetScreenedCta } from "@/components/properties/get-screened-cta"
import { RenterAvailabilityNote } from "@/components/properties/renter-availability-note"
import PropertyMap from "@/components/map/property-map"
import { generateBreadcrumbJsonLd, generatePropertyJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { buildRenterSearchPrefill } from "@/lib/renter-search-prefill"

function formatPrice(p: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(p)
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
  const galleryImages = (property.photos?.slice(1, 5) ?? []).map((p, i) => ({
    ...p,
    _altText: p.caption ?? `${property.title} — photo ${i + 2}`,
  }))

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

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-muted-foreground">{fullAddress}</p>
      </header>

      {heroImage ? (
        <div className="mb-6 grid grid-cols-1 gap-2 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={property.title}
            className="h-96 w-full rounded-lg object-cover"
          />
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.url}
                alt={p._altText}
                className="h-44 w-full rounded-md object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      ) : null}

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <div className="text-2xl font-semibold">{formatPrice(property.price)}/mo</div>
          <div className="text-xs text-muted-foreground">Rent</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{property.bedrooms}</div>
          <div className="text-xs text-muted-foreground">Bedrooms</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{property.bathrooms}</div>
          <div className="text-xs text-muted-foreground">Bathrooms</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{property.sqft || "Not available"}</div>
          <div className="text-xs text-muted-foreground">Sq Ft</div>
        </div>
      </section>

      <section className="mb-8 flex flex-wrap items-start gap-3">
        <a
          href="#ask-leasing"
          className="inline-flex min-h-[44px] items-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
        >
          Request a showing
        </a>
        {property.id ? <GetScreenedCta propertyId={property.id} /> : null}
        <Link
          href="/contact"
          className="inline-flex min-h-[44px] items-center rounded-md border px-5 font-medium hover:bg-muted"
        >
          Contact
        </Link>
      </section>

      {property.lat != null && property.lng != null ? (
        <section className="mb-8" aria-label="Listing location">
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

      {property.description ? (
        <section className="prose mb-8 max-w-none">
          <h2 className="text-xl font-semibold">About this property</h2>
          <p>{property.description}</p>
        </section>
      ) : null}

      {property.amenities?.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Amenities</h2>
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {property.amenities.map((a) => (
              <li key={a} className="rounded-md bg-muted px-3 py-1.5 text-sm">
                {a}
              </li>
            ))}
          </ul>
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
