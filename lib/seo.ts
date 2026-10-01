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
  SITE_CALENDLY_URL,
} from "./site"
import { getTestimonialKind, testimonials } from "./testimonials"
import { toAbsoluteSiteUrl } from "./url"
import { htmlPathToMarkdownPath } from "./html-to-agent-markdown"
import { teamMembers } from "./team-data"

const baseSiteUrl = SITE_URL.replace(/\/$/, "")

/** Organization / publisher logo used in JSON-LD. */
const SITE_LOGO_URL = `${baseSiteUrl}/logo-favicon.png`

const toAbsoluteUrl = (value?: string) => {
  if (!value) return undefined
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  return `${baseSiteUrl}${value.startsWith("/") ? value : `/${value}`}`
}

/** Absolute, canonical (trailing-slash) URL of a page; the form JSON-LD `url` fields must use. */
const pageUrl = (value?: string) => {
  const absolute = toAbsoluteUrl(value)
  return absolute ? canonicalCrumbUrl(absolute) : undefined
}

export interface FAQItem {
  question: string
  answer: string
}

/** Stable @id of the single Organization entity (emitted once by generateRealEstateBusinessJsonLd). */
export const SITE_ORGANIZATION_ID = `${SITE_URL.replace(/\/$/, "")}/#organization`

/** Stable @id of the one notary Service entity (emitted on /notary/, referenced from state and city pages). */
export const NOTARY_SERVICE_ID = `${SITE_URL.replace(/\/$/, "")}/notary/#service`

export interface ServiceData {
  name: string
  description: string
  serviceType: string
  /** Stable @id so other pages can reference this Service instead of describing it again. */
  id?: string
  areaServed?: string
  /** Schema type of `areaServed`; defaults to "State". Use "Country" for nationwide services. */
  areaServedType?: "State" | "Country"
  /** Weekly availability, emitted as hoursAvailable. */
  hoursAvailable?: { dayOfWeek: string[]; opens: string; closes: string }
  /** @id of a Service defined elsewhere that this one belongs to; emitted as isRelatedTo. */
  relatedToServiceId?: string
  /** City inside `areaServed` (a state name); emitted as a City nested in that State. */
  areaServedCity?: string
  /** When true the provider is a reference to the site-wide #organization entity, not a new one. */
  providerIsSiteOrganization?: boolean
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
    ...(service.id ? { '@id': service.id } : {}),
    name: service.name,
    description: service.description,
    provider: service.providerIsSiteOrganization
      ? { '@id': SITE_ORGANIZATION_ID }
      : {
          '@type': 'Organization',
          name: SITE_NAME,
          alternateName: [SITE_BRAND_SHORT, "OnDo"],
          url: SITE_URL,
        },
    areaServed: service.areaServed
      ? service.areaServedCity
        ? {
            '@type': 'City',
            name: service.areaServedCity,
            containedInPlace: { '@type': 'State', name: service.areaServed },
          }
        : {
            '@type': service.areaServedType ?? 'State',
            name: service.areaServed,
          }
      : undefined,
    ...(service.hoursAvailable
      ? { hoursAvailable: { '@type': 'OpeningHoursSpecification', ...service.hoursAvailable } }
      : {}),
    ...(service.relatedToServiceId ? { isRelatedTo: { '@id': service.relatedToServiceId } } : {}),
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
  const absoluteUrl = pageUrl(business.url)
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
    // schema.org ignores an address without its type.
    address: business.address ? { '@type': 'PostalAddress', ...business.address } : undefined,
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
    image: SITE_LOGO_URL,
    logo: SITE_LOGO_URL,
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
      { itemOffered: { name: "Remote Online Notary" } },
    ],
  })
}

/**
 * Generate RealEstateBusiness JSON-LD (richer than Organization, includes
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
  // Only genuine, permissioned, dated reviews may become Review/AggregateRating.
  //
  // testimonials.ts defines `composite` as illustrative copy and says outright:
  // "Do not present composites as Google reviews." The visible UI honours that --
  // testimonial cards render a composite badge and /about/testimonials states the
  // stories are not Google reviews. JSON-LD carries no such badge, so emitting
  // composites here published an undisclosed claim that the visible page never
  // made: a 5.00 aggregate over 15 "reviews" with named authors.
  //
  // That is three separate problems. Google requires structured data to represent
  // the visible content of the page; review markup about your own business on your
  // own site is self-serving and ineligible for review rich results; and invented
  // reviews risk a spammy-structured-markup manual action. Filtering by kind fixes
  // all three, and the markup returns automatically once real reviews are added
  // with `kind: "review"` and a reviewDate.
  const rated = testimonials.filter(
    (t) => typeof t.rating === "number" && t.rating > 0 && getTestimonialKind(t) === "review",
  )
  if (rated.length === 0) return undefined

  const ratingValue = (rated.reduce((sum, t) => sum + t.rating, 0) / rated.length).toFixed(2)

  // Limit the embedded Review list, Google prefers a small curated set; the
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
    '@id': SITE_ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: [SITE_BRAND_SHORT, "OnDo", "Ondo RE"],
    url: SITE_URL,
    telephone: SITE_PHONE,
    image: SITE_LOGO_URL,
    logo: {
      '@type': 'ImageObject',
      url: SITE_LOGO_URL,
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
        { '@type': 'OfferCatalog', name: 'Remote Online Notary' },
        { '@type': 'OfferCatalog', name: 'Investment Services' },
      ],
    },
    potentialAction: [
      {
        '@type': 'CommunicateAction',
        name: 'Contact Ondo Real Estate',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL.replace(/\/$/, "")}/contact/`,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
      },
      {
        '@type': 'ReserveAction',
        name: 'Schedule a call',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: SITE_CALENDLY_URL,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
      },
    ],
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
/**
 * Site page URLs end with "/" (trailingSlash: true). Crumbs written as `${SITE_URL}/notary`
 * point at a 301 instead of the canonical page, so add the slash here once for every caller.
 * Files, other hosts, and anything already canonical pass through untouched.
 */
export function canonicalCrumbUrl(url: string): string {
  const siteOrigin = SITE_URL.replace(/\/+$/, "")
  if (!url.startsWith("/") && !url.startsWith(`${siteOrigin}/`) && url !== siteOrigin) return url
  const [base = "", ...rest] = url.split(/(?=[?#])/)
  const suffix = rest.join("")
  const path = base.startsWith(siteOrigin) ? base.slice(siteOrigin.length) : base
  const lastSegment = path.slice(path.lastIndexOf("/") + 1)
  if (path.endsWith("/") || /\.[a-z0-9]{2,5}$/i.test(lastSegment)) return url
  return `${base}/${suffix}`
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalCrumbUrl(item.url),
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
      url: canonicalCrumbUrl(item.url),
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
    // /search redirects to /properties and drops q=. Do not advertise a SearchAction
    // until a URL actually consumes {search_term_string}.
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
    /** schema.org availability URL; omitted from the markup when unknown. */
    availability?: string
    /** Set for rentals so the price is read as monthly rent, not a sale price. */
    pricePeriod?: 'month'
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
      priceSpecification: property.offers.pricePeriod === 'month' ? {
        '@type': 'UnitPriceSpecification',
        price: property.offers.price,
        priceCurrency: property.offers.priceCurrency,
        unitCode: 'MON',
      } : undefined,
    } : undefined,
  }
}

export function generateWebPageJsonLd(params: {
  name: string
  url: string
  description?: string
}) {
  const { name, url, description } = params
  const absoluteUrl = pageUrl(url)
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

  const absoluteUrl = pageUrl(url)
  if (!absoluteUrl) return null

  const absoluteImage = toAbsoluteUrl(image)
  const absolutePublisherLogo = toAbsoluteUrl(publisherLogo ?? SITE_LOGO_URL)

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
    // Blog authors are the company unless the byline names a real, listed team member
    // (lib/team-data.ts), who is then typed as a Person with a page to link to.
    author: teamMembers.some((member) => member.name === authorName)
      ? { '@type': 'Person', name: authorName, url: pageUrl('/about/team/') }
      : {
          '@type': 'Organization',
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

/**
 * `DefinedTerm` for a single glossary entry.
 *
 * Google does not render a rich result for DefinedTerm today, but it is the
 * schema.org type that actually describes the page, and `inDefinedTermSet` ties
 * each entry back to the glossary so the set is understood as one work rather
 * than ~100 unrelated pages.
 */
export function generateDefinedTermJsonLd(params: {
  name: string
  description: string
  url: string
  termSetName: string
  termSetUrl: string
  inCategory?: string
}) {
  const { name, description, url, termSetName, termSetUrl, inCategory } = params
  if (!name || !description || !url) return null

  const absoluteUrl = pageUrl(url)
  const absoluteSetUrl = pageUrl(termSetUrl)
  if (!absoluteUrl || !absoluteSetUrl) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url: absoluteUrl,
    ...(inCategory ? { inDefinedTermSet: { '@type': 'DefinedTermSet', name: termSetName, url: absoluteSetUrl }, termCode: inCategory } : {
      inDefinedTermSet: { '@type': 'DefinedTermSet', name: termSetName, url: absoluteSetUrl },
    }),
  }
}

/**
 * `DefinedTermSet` for the glossary index, listing its entries by URL.
 *
 * Kept to name/description/url per member — repeating each full definition here
 * would duplicate every term page's own markup for no gain.
 */
export function generateDefinedTermSetJsonLd(params: {
  name: string
  description: string
  url: string
  terms: ReadonlyArray<{ name: string; description: string; url: string }>
}) {
  const { name, description, url, terms } = params
  if (!name || !url || terms.length === 0) return null

  const absoluteUrl = pageUrl(url)
  if (!absoluteUrl) return null

  const members = terms
    .map((term) => {
      const absoluteTermUrl = pageUrl(term.url)
      if (!absoluteTermUrl || !term.name) return null
      return {
        '@type': 'DefinedTerm',
        name: term.name,
        description: term.description,
        url: absoluteTermUrl,
      }
    })
    .filter(Boolean)

  if (members.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name,
    description,
    url: absoluteUrl,
    hasDefinedTerm: members,
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

  const absoluteUrl = pageUrl(url)
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

/** Classic HTML geo meta tags (HQ placeholder, from SITE_GEO / address constants). */
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
  /**
   * Optional sibling Markdown URL for AI agents. When set, emits
   * `<link rel="alternate" type="text/markdown">` via Next `alternates.types`.
   * Use for pages that have a first-party `.md` twin (calculators, properties,
   * contact), see `lib/agent-markdown.ts`. Absolute or root-relative.
   */
  markdownAlternate?: string
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
    markdownAlternate,
  } = input

  const canonical =
    pathname.startsWith("http://") || pathname.startsWith("https://")
      ? pathname
      : toAbsoluteSiteUrl(pathname)

  const ogImage = toAbsoluteUrl(image) ?? `${baseSiteUrl}/modern-office-building.webp`

  const markdownUrl = (() => {
    if (markdownAlternate) {
      return markdownAlternate.startsWith("http://") || markdownAlternate.startsWith("https://")
        ? markdownAlternate
        : `${baseSiteUrl}${markdownAlternate.startsWith("/") ? markdownAlternate : `/${markdownAlternate}`}`
    }
    const sibling = htmlPathToMarkdownPath(pathname)
    return sibling ? toAbsoluteSiteUrl(sibling) : undefined
  })()

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical,
      ...(markdownUrl ? { types: { "text/markdown": markdownUrl } } : {}),
    },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, alt: `${SITE_NAME}: ${title}` }],
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
