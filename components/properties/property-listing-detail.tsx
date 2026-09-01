import Link from "next/link"
import type { ApiProperty } from "@/app/types/property"
import { Badge } from "@/components/ui/badge"
import { RenterAvailabilityNote } from "@/components/properties/renter-availability-note"
import { RenterPath } from "@/components/properties/renter-path"
import { ListingGallery, ListingGalleryEmptyNotice } from "@/components/properties/listing-gallery"
import { ListingInquiryCard } from "@/components/properties/listing-inquiry-card"
import { ListingSaveShare } from "@/components/properties/listing-save-share"
import { ListingCompareToggle } from "@/components/properties/listing-compare-toggle"
import { ListingAgentCard } from "@/components/properties/listing-agent-card"
import { ListingRelated } from "@/components/properties/listing-related"
import { RentalApplyPanel } from "@/components/rental/rental-apply-panel"
import { RentalApplyHashLink, RentalPropertyViewTracker } from "@/components/rental/rental-listing-funnel"
import { ListingMediaEmbed } from "@/components/properties/listing-media-embed"
import { ListingDocuments } from "@/components/properties/listing-documents"
import { ListingMetrics } from "@/components/properties/listing-metrics"
import PropertyMap from "@/components/map/property-map"
import { generateBreadcrumbJsonLd, generatePropertyJsonLd, generateRealEstateAgentJsonLd } from "@/lib/seo"
import { SITE_EMAILS, SITE_NAME, SITE_PHONE, SITE_URL } from "@/lib/site"
import { buildRenterSearchPrefill } from "@/lib/renter-search-prefill"
import {
  availabilityBadge,
  availabilityBadgeClass,
  groupAmenities,
  listingAgents,
  listingCityGuideHref,
  listingCostRows,
  listingDescriptionSections,
  listingHighlights,
  listingLocationFacts,
  listingMarketStatus,
  listingMediaEmbeds,
  listingMetricRows,
  listingPetPolicyRows,
  listingPublicDocuments,
  listingSpecRows,
  ASSISTANCE_ANIMALS_NOTE,
  marketStatusBadgeClass,
  petNotesFromAmenities,
} from "@/lib/listing-presentation"
import { cn } from "@/lib/utils"

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
  related = [],
}: {
  property: ApiProperty
  publicId: string
  related?: ApiProperty[]
}) {
  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const fullAddress = [property.addressLine1, cityState, property.zipcode].filter(Boolean).join(", ")
  const heroImage = property.photos?.[0]?.url
  const moveIn = availabilityBadge(property.availability)
  const market = listingMarketStatus({
    status: property.status,
    listingKind: property.listingKind,
  })
  const highlights = listingHighlights({
    amenities: property.amenities,
    type: property.type,
    sqft: property.sqft,
    leaseTerms: property.leaseTerms,
  })
  const petNotes = petNotesFromAmenities(property.amenities)
  const petPolicyRows = listingPetPolicyRows(property.petPolicy)
  const extraPetNotes =
    petPolicyRows.length > 0
      ? petNotes.filter((note) => note.label !== "Pets allowed")
      : petNotes
  const showPets = petPolicyRows.length > 0 || extraPetNotes.length > 0
  const amenityGroups = groupAmenities(property.amenities).filter(
    (group) => !showPets || group.id !== "pets",
  )
  const locationFacts = listingLocationFacts({
    addressLine1: property.addressLine1,
    addressLine2: property.addressLine2,
    city: property.city,
    state: property.state,
    zipcode: property.zipcode,
  })
  const cityGuideHref = listingCityGuideHref(property.city)
  const costRows = listingCostRows({
    price: property.price,
    fees: property.fees,
    leaseTerms: property.leaseTerms,
  })
  const specRows = listingSpecRows({
    price: property.price,
    listingKind: property.listingKind,
    type: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.sqft,
    leaseTerms: property.leaseTerms,
    fees: property.fees,
    availability: property.availability,
    yearBuilt: property.yearBuilt,
    lotSqft: property.lotSqft,
    parking: property.parking,
    stories: property.stories,
    units: property.units,
    occupancy: property.occupancy,
    zoning: property.zoning,
    yearRenovated: property.yearRenovated,
    hoa: property.hoa,
    taxes: property.taxes,
    availableSqft: property.availableSqft,
    amenities: property.amenities,
  })
  const metricRows = listingMetricRows({
    price: property.price,
    sqft: property.sqft,
    listingKind: property.listingKind,
    capRate: property.capRate,
    noi: property.noi,
    occupancy: property.occupancy,
    leaseTerms: property.leaseTerms,
  })
  const descriptionSections = listingDescriptionSections({
    description: property.description,
    highlights,
    address: fullAddress,
    city: property.city,
    state: property.state,
    costRows,
    type: property.type,
    sqft: property.sqft,
    amenities: property.amenities,
    fees: property.fees,
    leaseTerms: property.leaseTerms,
    website: property.website,
  })
  const agents = listingAgents({
    manager: property.manager,
    owner: property.owner,
    propertyPhone: property.phone,
    companyPhone: SITE_PHONE,
    companyEmail: SITE_EMAILS.primary,
  })
  const embeds = listingMediaEmbeds({
    virtualTourUrl: property.virtualTourUrl,
    videoUrl: property.videoUrl,
    website: property.website,
  })
  const documents = listingPublicDocuments(property.documents)
  const showMap = property.lat != null && property.lng != null

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

  const agentJsonLd = generateRealEstateAgentJsonLd({
    name: agents[0]?.name || SITE_NAME,
    telephone: agents[0]?.phone || SITE_PHONE,
    email: agents[0]?.email || SITE_EMAILS.primary,
    url: SITE_URL,
    worksFor: SITE_NAME,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Properties", url: `${SITE_URL}/properties` },
    { name: property.title, url: `${SITE_URL}/properties/${publicId}` },
  ])

  const navItems = [
    { href: "#listing-photos", label: "Photos", show: true },
    { href: "#listing-highlights", label: "Highlights", show: specRows.length > 0 },
    { href: "#listing-overview", label: "Overview", show: Boolean(property.description) },
    { href: "#listing-location", label: "Location", show: showMap || Boolean(fullAddress) },
    { href: "#listing-inquire", label: "Inquire", show: true },
  ].filter((item) => item.show)

  return (
    <main className="bg-background">
      <RentalPropertyViewTracker propertyRef={publicId} />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentJsonLd) }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link href="/properties" className="hover:underline">
            Properties
          </Link>{" "}
          / <span aria-current="page">{property.title}</span>
        </nav>

        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {market ? (
                <Badge className={cn("font-medium", marketStatusBadgeClass(market.tone))}>
                  {market.label}
                </Badge>
              ) : null}
              <Badge className={cn("font-medium", availabilityBadgeClass(moveIn.tone))}>
                {moveIn.label}
              </Badge>
            </div>
            <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">{property.title}</h1>
            <p className="mt-1 text-muted-foreground">{fullAddress}</p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <ListingSaveShare publicId={publicId} title={property.title} />
            <ListingCompareToggle publicId={publicId} title={property.title} />
          </div>
        </header>

        <nav
          aria-label="Listing sections"
          className="mb-4 flex gap-2 overflow-x-auto border-b border-border pb-2 text-sm"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-md px-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div id="listing-photos">
          {property.photos?.length ? (
            <ListingGallery title={property.title} photos={property.photos} />
          ) : (
            <ListingGalleryEmptyNotice />
          )}
        </div>

        <div
          id="listing-highlights"
          className="relative z-10 mb-8 -mt-2 scroll-mt-24 rounded-xl border border-border bg-card shadow-md md:-mt-10"
        >
          <div className="h-1 rounded-t-xl bg-gradient-to-r from-orange-500 to-red-800" aria-hidden="true" />
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <p>
                <span className="block font-outfit text-3xl font-bold tracking-tight md:text-4xl">
                  {costRows[0]?.value}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {costRows[0]?.label ?? "Listed monthly rent"}
                </span>
              </p>
            <div className="flex flex-wrap gap-2">
                <RentalApplyHashLink
                  propertyRef={publicId}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
                >
                  Apply now
                </RentalApplyHashLink>
                <a
                  href="#listing-inquire"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-input px-5 font-medium hover:bg-muted"
                >
                  Schedule a tour
                </a>
                <a
                  href="#listing-inquire"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-input px-5 font-medium hover:bg-muted"
                >
                  Ask a question
                </a>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {specRows
                .filter((row) => row.id !== "price")
                .slice(0, 8)
                .map((row) => (
                  <div key={row.id}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-lg font-semibold">{row.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="lg:col-start-2 lg:row-start-1">
            <div className="mb-8 lg:sticky lg:top-24 lg:mb-0">
              <ListingInquiryCard
                costRows={costRows}
                propertyId={property.id}
                title={property.title}
                address={fullAddress}
              />
            </div>
          </div>
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">

            {descriptionSections
              .filter((section) => section.id !== "location")
              .map((section) => (
              <section
                key={section.id}
                id={section.id === "overview" ? "listing-overview" : undefined}
                className="mb-8"
                aria-labelledby={`listing-section-${section.id}`}
              >
                <h2 id={`listing-section-${section.id}`} className="mb-3 text-xl font-semibold">
                  {section.title}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 24)} className="mb-2 text-foreground/80">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {section.bullets.map((item) => (
                      <li key={item} className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {showPets ? (
              <section className="mb-8 rounded-xl border border-border bg-card p-5" aria-labelledby="listing-pets-heading">
                <h2 id="listing-pets-heading" className="text-xl font-semibold">
                  Pets
                </h2>
                {petPolicyRows.length > 0 ? (
                  <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {petPolicyRows.map((row) => (
                      <div key={row.id}>
                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {row.label}
                        </dt>
                        <dd className="font-medium">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {extraPetNotes.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {extraPetNotes.map((note) => (
                      <li key={note.raw} className="rounded-full bg-muted px-3 py-1.5 text-sm">
                        {note.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-xs text-muted-foreground">{ASSISTANCE_ANIMALS_NOTE}</p>
                {petPolicyRows.every((row) => row.id !== "rent" && row.id !== "deposit") ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Pet deposits and monthly pet rent, if any, are confirmed with leasing. They are
                    not estimated here.
                  </p>
                ) : null}
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

            <ListingMetrics rows={metricRows} />
            <ListingDocuments documents={documents} />
            <ListingMediaEmbed embeds={embeds} />
            <ListingAgentCard agents={agents} />

            {property.id ? (
              <RentalApplyPanel propertyId={property.id} publicId={publicId} />
            ) : null}

            <div className="mb-8">
              <RenterPath variant="listing-detail" />
            </div>
          </div>
        </div>

        {locationFacts.length > 0 || showMap ? (
          <section id="listing-location" className="mb-8 scroll-mt-24" aria-labelledby="listing-location-heading">
            <h2 id="listing-location-heading" className="mb-3 text-xl font-semibold">
              Location
            </h2>
            {locationFacts.length > 0 ? (
              <dl className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {locationFacts.map((fact) => (
                  <div key={fact.id}>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <p className="mb-3 text-sm text-muted-foreground">
              Map pin and address come from this listing. We do not add walk scores, school ratings,
              or travel times.
            </p>
            {cityGuideHref ? (
              <p className="mb-3 text-sm">
                <Link href={cityGuideHref} className="font-medium underline-offset-2 hover:underline">
                  Ondo city guide for {property.city}
                </Link>
              </p>
            ) : null}
            {showMap ? (
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
                    lat: property.lat!,
                    lng: property.lng!,
                    image: heroImage,
                    type: property.type,
                  },
                ]}
              />
            ) : null}
            <a
              href="#listing-inquire"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline"
            >
              Ask leasing about this address
            </a>
          </section>
        ) : null}

        <ListingRelated listings={related} />

        <RenterAvailabilityNote
          prefillMessage={buildRenterSearchPrefill({
            listingTitle: property.title,
            listingAddress: fullAddress,
          })}
        />
      </div>
    </main>
  )
}
