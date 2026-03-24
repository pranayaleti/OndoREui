import {
  SITE_NAME,
  SITE_URL,
  SITE_PHONE,
  SITE_HOURS,
  SITE_SOCIALS,
  SITE_ADDRESS_OBJ,
  SITE_EMAILS,
  SITE_BRAND_SHORT,
} from "./site"

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
    sameAs: SITE_SOCIALS,
    address: {
      ...SITE_ADDRESS_OBJ,
    },
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
