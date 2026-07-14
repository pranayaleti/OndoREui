import type { Metadata } from "next"
import {
  SITE_NAME,
  SITE_URL,
  SITE_PHONE,
  SITE_HOURS,
  SITE_SOCIALS,
  SITE_ADDRESS_OBJ,
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_REGION,
  SITE_EMAILS,
  SITE_BRAND_SHORT,
  SITE_GEO,
} from "./site"
import { testimonials } from "./testimonials"

const baseSiteUrl = SITE_URL.replace(/\/$/, "")

const toAbsoluteUrl = (value?: string) => {
  if (!value) return undefined
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  return `${baseSiteUrl}${value.startsWith("/") ? value : `/${value}`}`
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ServiceData {
  name: string
  description: string
  serviceType: string
  areaServed?: string
  offers?: {
    description: string
  }
}

/** Schema.org Place / area served (state, county, or string label). */
export type SchemaAreaServed =
  | string
  | Array<
      | { "@type": "State"; name: string }
      | { "@type": "AdministrativeArea"; name: string }
    >

export interface LocalBusinessData {
  name: string
  alternateName?: string | string[]
  url: string
  telephone?: string
  image?: string
  logo?: string
  areaServed?: SchemaAreaServed
  openingHours?: string
  sameAs?: string[]
  address?: {
    addressRegion: string
    addressCountry: string
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
  }
  makesOffer?: Array<{
    itemOffered: {
      name: string
    }
  }>
  contactPoint?: Array<{
    contactType: string
    telephone?: string
    email?: string
    areaServed?: string
    availableLanguage?: string[]
  }>
  geo?: {
    latitude: number
    longitude: number
  }
}

/**
 * Generate JSON-LD for a Service
 */
export function generateServiceJsonLd(service: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: [SITE_BRAND_SHORT, "OnDo"],
      url: SITE_URL,
    },
    areaServed: service.areaServed ? {
      '@type': 'State',
      name: service.areaServed,
    } : undefined,
    serviceType: service.serviceType,
    offers: service.offers ? {
      '@type': 'Offer',
      description: service.offers.description,
    } : undefined,
  }
}

/**
 * Generate JSON-LD for FAQPage
 */
export function generateFAQJsonLd(faqs: FAQItem[]) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate JSON-LD for LocalBusiness/RealEstateAgent
 */
export function generateLocalBusinessJsonLd(business: LocalBusinessData) {
  const absoluteUrl = toAbsoluteUrl(business.url)
  if (!business.name || !absoluteUrl) return null

  const absoluteImage = toAbsoluteUrl(business.image)
  const absoluteLogo = toAbsoluteUrl(business.logo)

  const alternateName = business.alternateName
    ? Array.isArray(business.alternateName)
      ? business.alternateName
      : [business.alternateName]
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'RealEstateAgent'],
    name: business.name,
    ...(alternateName?.length ? { alternateName } : {}),
    url: absoluteUrl,
    telephone: business.telephone,
    image: absoluteImage,
    logo: absoluteLogo,
    areaServed: business.areaServed,
    openingHours: business.openingHours,
    address: business.address,
    sameAs: business.sameAs,
    makesOffer: business.makesOffer,
    contactPoint: business.contactPoint,
    ...(business.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
          },
        }
      : {}),
  }
}

export function generateOrganizationJsonLd() {
  return generateLocalBusinessJsonLd({
    name: SITE_NAME,
    alternateName: [SITE_BRAND_SHORT, "OnDo"],
    url: SITE_URL,
    telephone: SITE_PHONE,
    image: `${SITE_URL}/logo-favicon.png`,
    logo: `${SITE_URL}/logo-favicon.png`,
    areaServed: [
      { "@type": "State", name: "Utah" },
      { "@type": "AdministrativeArea", name: "Salt Lake County" },
      { "@type": "AdministrativeArea", name: "Utah County" },
    ],
    openingHours: SITE_HOURS,
    sameAs: [...SITE_SOCIALS],
    address: {
      ...SITE_ADDRESS_OBJ,
    },
    geo: { ...SITE_GEO },
    contactPoint: [
      {
        contactType: "customer support",
        telephone: SITE_PHONE,
        email: SITE_EMAILS?.primary,
        areaServed: "Utah",
        availableLanguage: ["en-US"],
      },
    ],
    makesOffer: [
      { itemOffered: { name: "Property Management" } },
      { itemOffered: { name: "Home Buying" } },
      { itemOffered: { name: "Home Selling" } },
      { itemOffered: { name: "Home Loans" } },
      { itemOffered: { name: "Mobile Notary" } },
    ],
  })
}

/**
 * Generate RealEstateBusiness JSON-LD (richer than Organization — includes
 * foundingDate, founder, openingHoursSpecification, and hasOfferCatalog).
 */
/**
 * Build AggregateRating + Review nodes from the testimonials library.
 *
 * Only "Owner" and "Investor" testimonials are surfaced as Reviews here so the
 * schema is unambiguously about the *business* (B2C tenant reviews are fine
 * for the LocalBusiness but Google tends to prefer service-provider reviews
 * for the local pack). All testimonials still feed the AggregateRating count
 * since rating averages are about the entity as a whole.
 *
 * Returns `undefined` when no rated testimonials exist so callers can spread
 * the result without leaving stub fields in the JSON-LD output.
 */
function buildBusinessRatingAndReviews() {
  const rated = testimonials.filter((t) => typeof t.rating === "number" && t.rating > 0)
  if (rated.length === 0) return undefined

  const ratingValue = (rated.reduce((sum, t) => sum + t.rating, 0) / rated.length).toFixed(2)

  // Limit the embedded Review list — Google prefers a small curated set; the
  // AggregateRating count carries the full social proof.
  const REVIEW_LIMIT = 6
  const featuredReviews = rated
    .filter((t) => t.role === "Owner" || t.role === "Investor")
    .slice(0, REVIEW_LIMIT)
    .map((t) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: t.name,
      },
      reviewBody: t.quote,
      itemReviewed: {
        '@type': 'LocalBusiness',
        name: SITE_NAME,
      },
    }))

  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    },
    ...(featuredReviews.length > 0 ? { review: featuredReviews } : {}),
  }
}

export function generateRealEstateBusinessJsonLd() {
  const ratingAndReviews = buildBusinessRatingAndReviews()
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateBusiness', 'RealEstateAgent'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: [SITE_BRAND_SHORT, "OnDo", "Ondo RE"],
    url: SITE_URL,
    telephone: SITE_PHONE,
    image: `${SITE_URL}/logo-favicon.png`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo-favicon.png`,
      width: 512,
      height: 512,
    },
    description:
      'Full-service Utah real estate company offering property management, mortgage lending, home buying and selling, and notary services across the Wasatch Front.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Pranay Reddy Aleti',
    },
    areaServed: [
      { '@type': 'State', name: 'Utah' },
      { '@type': 'AdministrativeArea', name: 'Salt Lake County' },
      { '@type': 'AdministrativeArea', name: 'Utah County' },
      { '@type': 'AdministrativeArea', name: 'Davis County' },
      { '@type': 'AdministrativeArea', name: 'Weber County' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE_ADDRESS_OBJ,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    sameAs: [...SITE_SOCIALS],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Real Estate Services',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Property Management' },
        { '@type': 'OfferCatalog', name: 'Mortgage Lending' },
        { '@type': 'OfferCatalog', name: 'Home Buying & Selling' },
        { '@type': 'OfferCatalog', name: 'Mobile Notary' },
        { '@type': 'OfferCatalog', name: 'Investment Services' },
      ],
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: SITE_PHONE,
        email: SITE_EMAILS?.primary,
        areaServed: 'US',
        availableLanguage: ['en'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: SITE_PHONE,
        email: SITE_EMAILS?.realEstate,
        areaServed: 'Utah',
      },
    ],
    // AggregateRating + Review nodes unlock the gold-star rich snippet in
    // Google SERPs for branded + local-pack queries. Sourced from the
    // testimonials library so adding/removing testimonials updates schema
    // automatically.
    ...(ratingAndReviews ?? {}),
  }
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** ItemList for HTML sitemap / discovery (search engines and structured-data consumers). */
export function generateSitemapItemListJsonLd(
  items: Array<{ name: string; url: string; description?: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  }
}

/**
 * Generate WebSite JSON-LD with search action
 */
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate RealEstateAgent JSON-LD
 */
export function generateRealEstateAgentJsonLd(agent: {
  name: string
  url?: string
  telephone?: string
  email?: string
  image?: string
  worksFor?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.name,
    url: agent.url || SITE_URL,
    telephone: agent.telephone,
    email: agent.email,
    image: agent.image,
    worksFor: agent.worksFor ? {
      '@type': 'RealEstateAgent',
      name: agent.worksFor,
    } : undefined,
  }
}

/**
 * Generate Property JSON-LD
 */
export function generatePropertyJsonLd(property: {
  name: string
  description: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  numberOfRooms?: number
  floorSize?: {
    value: number
    unitCode: string
  }
  image?: string[]
  offers?: {
    price: number
    priceCurrency: string
    availability: string
  }
}) {
  const absoluteImages = property.image?.map(toAbsoluteUrl).filter(Boolean)
  const hasAddress =
    property.address?.streetAddress &&
    property.address?.addressLocality &&
    property.address?.addressRegion &&
    property.address?.postalCode &&
    property.address?.addressCountry

  if (!property.name || !property.description || !hasAddress) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: property.description,
    address: {
      '@type': 'PostalAddress',
      ...property.address,
    },
    geo: property.geo ? {
      '@type': 'GeoCoordinates',
      latitude: property.geo.latitude,
      longitude: property.geo.longitude,
    } : undefined,
    numberOfRooms: property.numberOfRooms,
    floorSize: property.floorSize ? {
      '@type': 'QuantitativeValue',
      value: property.floorSize.value,
      unitCode: property.floorSize.unitCode,
    } : undefined,
    image: absoluteImages && absoluteImages.length ? absoluteImages : undefined,
    offers: property.offers ? {
      '@type': 'Offer',
      price: property.offers.price,
      priceCurrency: property.offers.priceCurrency,
      availability: property.offers.availability,
    } : undefined,
  }
}

export function generateWebPageJsonLd(params: {
  name: string
  url: string
  description?: string
}) {
  const { name, url, description } = params
  const absoluteUrl = toAbsoluteUrl(url)
  if (!name || !absoluteUrl) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: absoluteUrl,
    description,
  }
}

export function generateBlogPostingJsonLd(params: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName?: string
  publisherName?: string
  publisherLogo?: string
  keywords?: string[]
  articleSection?: string
}) {
  const { title, description, url, image, datePublished, dateModified, authorName, publisherName, publisherLogo, keywords, articleSection } = params

  if (!title || !description || !url || !datePublished) return null

  const absoluteUrl = toAbsoluteUrl(url)
  if (!absoluteUrl) return null

  const absoluteImage = toAbsoluteUrl(image)
  const absolutePublisherLogo = toAbsoluteUrl(publisherLogo)

  const keywordList = keywords?.filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    ...(absoluteImage ? { image: [absoluteImage] } : {}),
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: absoluteUrl,
    author: {
      '@type': 'Person',
      name: authorName || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName || SITE_NAME,
      ...(absolutePublisherLogo
        ? {
            logo: {
              '@type': 'ImageObject',
              url: absolutePublisherLogo,
            },
          }
        : {}),
    },
    ...(keywordList && keywordList.length ? { keywords: keywordList } : {}),
    ...(articleSection ? { articleSection } : {}),
  }
}

export function generateWebApplicationJsonLd(params: {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem?: string
  image?: string
  priceCurrency?: string
  providerName?: string
}) {
  const { name, description, url, applicationCategory, operatingSystem = "Web", image, priceCurrency = "USD", providerName } = params

  if (!name || !description || !url || !applicationCategory) return null

  const absoluteUrl = toAbsoluteUrl(url)
  if (!absoluteUrl) return null

  const absoluteImage = toAbsoluteUrl(image)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: absoluteUrl,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency,
    },
    ...(absoluteImage ? { image: absoluteImage } : {}),
    ...(providerName
      ? {
          provider: {
            '@type': 'Organization',
            name: providerName,
            url: SITE_URL,
          },
        }
      : {}),
  }
}

/** Classic HTML geo meta tags (HQ placeholder — from SITE_GEO / address constants). */
export function getSiteGeoMetaOther(): Record<string, string> {
  const { latitude, longitude } = SITE_GEO
  return {
    "geo.region": `US-${SITE_ADDRESS_REGION}`,
    "geo.placename": SITE_ADDRESS_CITY,
    "geo.position": `${latitude};${longitude}`,
    ICBM: `${latitude}, ${longitude}`,
  }
}

export type BuildPageMetadataInput = {
  title: string
  description: string
  /** Pathname like `/buy` or absolute URL; used for canonical + OG url. */
  pathname: string
  image?: string
  type?: "website" | "article"
  keywords?: string[]
  robots?: Metadata["robots"]
  other?: Record<string, string | number | (string | number)[]>
}

/**
 * Thin shared Metadata builder for public pages.
 * Always includes HQ geo meta from SITE_GEO (placeholder until real address).
 */
export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const {
    title,
    description,
    pathname,
    image,
    type = "website",
    keywords,
    robots,
    other,
  } = input

  const canonical =
    pathname.startsWith("http://") || pathname.startsWith("https://")
      ? pathname
      : `${baseSiteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`

  const ogImage = toAbsoluteUrl(image) ?? `${baseSiteUrl}/modern-office-building.webp`

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(robots !== undefined ? { robots } : {}),
    other: {
      ...getSiteGeoMetaOther(),
      ...(other ?? {}),
    },
  }
}
