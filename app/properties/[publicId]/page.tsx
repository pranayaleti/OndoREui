// NOTE(i18n): server component — body copy (CTAs, breadcrumb, headers) is
// English for SEO under output: "export". Tracked as a Phase 1 follow-up:
// move client-only sections into a "use client" subtree wired to useTranslation.
import { Metadata } from "next"
import Link from "next/link"
import { backendUrl } from "@/lib/backend"
import { generatePropertyJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import type { ApiProperty } from "@/app/types/property"

/**
 * The site is statically exported (output: "export" in next.config.mjs).
 * `revalidate` is a no-op there, so we drop it to avoid implying a behavior
 * we don't actually deliver. fetchProperty is invoked at build time from
 * generateStaticParams + generateMetadata + the page render.
 */
/**
 * Sentinel emitted by generateStaticParams when the backend is unreachable at
 * build time (e.g. deploy job without NEXT_PUBLIC_BACKEND_BASE_URL). It must
 * never hit the network and must never call notFound() — see PLACEHOLDER_ID
 * handling in the page/metadata below.
 */
const PLACEHOLDER_ID = "_placeholder"

async function fetchProperty(publicId: string): Promise<ApiProperty | null> {
  if (publicId === PLACEHOLDER_ID) return null
  try {
    const res = await fetch(backendUrl(`/api/properties/public/${encodeURIComponent(publicId)}`))
    if (!res.ok) return null
    return (await res.json()) as ApiProperty
  } catch {
    return null
  }
}

interface PageProps {
  params: Promise<{ publicId: string }>
}

/**
 * Required under `output: "export"` for any dynamic segment. We fetch the
 * public listings at build time and emit one static page per publicId.
 *
 * Graceful fallback: when the backend is unreachable during the build (CI
 * without a configured BACKEND_URL, offline dev, etc.) we emit a single
 * stub entry so Next.js has something concrete to prerender. The page
 * handler calls notFound() if the publicId doesn't resolve, so the stub
 * path becomes a 404 at runtime instead of a 200 with empty content.
 *
 * Pair this with `dynamicParams = false` — under output: "export" we cannot
 * server-render unknown ids on demand, so any request outside the prebuilt
 * set must 404 statically.
 */
export const dynamicParams = false

export async function generateStaticParams(): Promise<Array<{ publicId: string }>> {
  try {
    const res = await fetch(backendUrl("/api/properties/public"))
    if (!res.ok) {
      console.warn(
        `[properties/[publicId]] generateStaticParams: backend returned ${res.status}; emitting placeholder`
      )
      return [{ publicId: PLACEHOLDER_ID }]
    }
    const body = await res.json()
    // Backend may return an array or { data: [...] }; tolerate both.
    const list: Array<{ publicId?: string; public_id?: string; id?: string }> = Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
        ? body.data
        : []
    const params = list
      .map((p) => p.publicId ?? p.public_id ?? p.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0)
      .map((publicId) => ({ publicId }))
    return params.length > 0 ? params : [{ publicId: PLACEHOLDER_ID }]
  } catch {
    console.warn(
      "[properties/[publicId]] generateStaticParams: backend unreachable; emitting placeholder"
    )
    return [{ publicId: PLACEHOLDER_ID }]
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { publicId } = await params
  const property = await fetchProperty(publicId)
  if (!property) return { title: "Property not found", robots: { index: false, follow: false } }

  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const title = `${property.title} – ${cityState} | ${SITE_NAME}`
  const description =
    property.description?.slice(0, 160) ??
    `${property.bedrooms} BR / ${property.bathrooms} BA in ${cityState}. $${property.price}/mo.`
  // trailingSlash: true in next.config.mjs — the canonical needs to match.
  const canonicalPath = `/properties/${publicId}`
  const canonical = `${SITE_URL}${canonicalPath}/`
  const image = property.photos?.[0]?.url

  return {
    title,
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

function formatPrice(p: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p)
}

/**
 * Rendered for the build-time placeholder and for listings that no longer
 * resolve. A lightweight, no-index 200 page — deliberately NOT notFound(),
 * which hangs the static export worker (see fetchProperty note above).
 */
function PropertyUnavailable() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-3 text-2xl font-bold">This listing isn&apos;t available</h1>
      <p className="mb-8 text-muted-foreground">
        The property you&apos;re looking for may have been rented or removed. Browse our current listings instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/properties"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
        >
          Browse properties
        </Link>
        <Link href="/contact" className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted">
          Contact us
        </Link>
      </div>
    </main>
  )
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { publicId } = await params
  const property = await fetchProperty(publicId)
  // Under `output: export` we cannot call notFound() here: for a param that was
  // emitted by generateStaticParams (the _placeholder sentinel, or a listing
  // that has since been removed), notFound() hangs the export worker until the
  // per-page timeout and fails the whole build. `dynamicParams = false` already
  // makes Next serve a real 404 for any publicId NOT in generateStaticParams, so
  // unknown URLs still 404 correctly — we only need a graceful, no-index stub for
  // the build-time placeholder / stale-listing case.
  if (!property) return <PropertyUnavailable />

  const cityState = [property.city, property.state].filter(Boolean).join(", ")
  const fullAddress = [property.addressLine1, cityState, property.zipcode].filter(Boolean).join(", ")
  const heroImage = property.photos?.[0]?.url
  const galleryImages = property.photos?.slice(1, 5) ?? []

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
                alt={p.caption ?? property.title}
                className="h-44 w-full rounded-md object-cover"
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
          <div className="text-2xl font-semibold">{property.sqft || "—"}</div>
          <div className="text-xs text-muted-foreground">Sq Ft</div>
        </div>
      </section>

      <section className="mb-8 flex flex-wrap gap-3">
        <Link
          href={`/visit/confirm?propertyId=${publicId}`}
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90"
        >
          Schedule a tour
        </Link>
        <Link
          href={`/apply?propertyId=${publicId}`}
          className="rounded-md border border-primary px-5 py-2.5 font-medium text-primary hover:bg-primary/5"
        >
          Apply now
        </Link>
        <Link
          href="/contact"
          className="rounded-md border px-5 py-2.5 font-medium hover:bg-muted"
        >
          Contact
        </Link>
      </section>

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
    </main>
  )
}
