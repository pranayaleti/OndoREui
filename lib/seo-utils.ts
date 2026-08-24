import { Metadata } from "next"
import { SITE_NAME, SITE_URL, SITE_PHONE, SITE_EMAILS, SITE_SOCIALS, SITE_ADDRESS_OBJ, SITE_HOURS } from "./site"

// Generate structured data for different page types
export const generateStructuredData = {
  // Organization schema
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-favicon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE,
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: SITE_SOCIALS,
    openingHours: SITE_HOURS,
  }),

  // Real Estate Agent schema
  realEstateAgent: () => ({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: SITE_PHONE,
    email: SITE_EMAILS.primary,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS_OBJ.streetAddress,
      addressLocality: SITE_ADDRESS_OBJ.addressLocality,
      addressRegion: SITE_ADDRESS_OBJ.addressRegion,
      postalCode: SITE_ADDRESS_OBJ.postalCode,
      addressCountry: SITE_ADDRESS_OBJ.addressCountry,
    },
    areaServed: {
      "@type": "State",
      name: "Utah",
    },
    serviceType: [
      "Property Management",
      "Real Estate Sales",
      "Home Buying",
      "Home Selling",
      "Mortgage Services",
    ],
    openingHours: SITE_HOURS,
  }),

  // Property listing schema
  propertyListing: (property: {
    name: string
    description: string
    address: string
    city: string
    state: string
    zipCode: string
    price?: number
    bedrooms?: number
    bathrooms?: number
    squareFeet?: number
    images?: string[]
  }) => ({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.name,
    description: property.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode,
      addressCountry: "US",
    },
    ...(property.price && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
    ...(property.squareFeet && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.squareFeet,
        unitCode: "SQF",
      },
    }),
    ...(property.images && { image: property.images }),
  }),

  // Service schema
  service: (serviceName: string, description: string, areaServed: string = "Utah") => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "State",
      name: areaServed,
    },
  }),

  // FAQ schema
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  // Breadcrumb schema
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // Website schema with search action
  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }),
}

// Generate metadata for different page types
export const generateMetadata = {
  // Homepage metadata
  homepage: (): Metadata => ({
    title: `${SITE_NAME}: Utah Property Management, Buying, Selling, Loans`,
    description: "Utah real estate experts for property management, home buying, and selling services across Utah. Explore listings, loans, and expert guidance.",
    keywords: [
      // Core market/service
      "Utah real estate",
      "real estate Utah",
      "Utah real estate listings",
      "homes for sale Utah",
      "houses for sale Utah",
      "property management Utah",
      "rental property management",
      "tenant screening Utah",
      "home buying Utah",
      "first-time home buyer Utah",
      "home selling Utah",
      "sell my house Utah",
      "Utah home loans",
      "mortgage lender Utah",
      "mortgage pre-approval Utah",
      "refinance Utah",
      // Geos
      "Wasatch Front",
      "Salt Lake City real estate",
      "Lehi real estate",
      "Provo real estate",
      "Orem real estate",
      "Sandy real estate",
      "Draper real estate",
      "American Fork real estate",
      "Pleasant Grove real estate",
      "Utah County real estate",
      "Salt Lake County real estate",
      "Davis County real estate",
      // Topics
      "Utah housing market",
      "MLS listings Utah",
    ],
    openGraph: {
      type: "website",
      title: `${SITE_NAME}: Utah Property Management, Buying, Selling, Loans`,
      description: "Utah real estate services: property management, buying, selling, refinancing, and mortgages.",
      images: [
        {
          url: `${SITE_URL}/modern-office-building.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} office building`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME}: Utah Property Management, Buying, Selling, Loans`,
      description: "Utah real estate services: property management, buying, selling, refinancing, and mortgages.",
      images: [`${SITE_URL}/modern-office-building.png`],
    },
  }),

  // Property page metadata
  property: (property: {
    name: string
    description: string
    address: string
    city: string
    price?: number
    bedrooms?: number
    bathrooms?: number
  }): Metadata => ({
    title: `${property.name} | ${property.city} Real Estate | ${SITE_NAME}`,
    description: `${property.description} Located in ${property.address}, ${property.city}. ${property.bedrooms && property.bathrooms ? `${property.bedrooms} bed, ${property.bathrooms} bath` : ""} ${property.price ? `$${property.price.toLocaleString()}` : ""}`,
    keywords: [
      `${property.city} real estate`,
      `${property.city} homes for sale`,
      `${property.address}`,
      "Utah real estate",
      "property management",
    ],
    openGraph: {
      type: "website",
      title: `${property.name} | ${property.city} Real Estate`,
      description: property.description,
      images: [
        {
          url: `${SITE_URL}/placeholder.jpg`,
          width: 1200,
          height: 630,
          alt: property.name,
        },
      ],
    },
  }),

  // Service page metadata
  service: (serviceName: string, description: string, city?: string): Metadata => ({
    title: `${serviceName}${city ? ` in ${city}` : ""} | ${SITE_NAME}`,
    description,
    keywords: [
      `${serviceName.toLowerCase()} Utah`,
      `${serviceName.toLowerCase()} ${city || ""}`,
      "real estate services",
      "property management",
    ],
    openGraph: {
      type: "website",
      title: `${serviceName}${city ? ` in ${city}` : ""} | ${SITE_NAME}`,
      description,
    },
  }),

  // Calculator page metadata
  calculator: (calculatorName: string, description: string): Metadata => ({
    title: `${calculatorName} Calculator | ${SITE_NAME}`,
    description,
    keywords: [
      `${calculatorName.toLowerCase()} calculator`,
      "real estate calculator",
      "mortgage calculator",
      "Utah real estate tools",
    ],
    openGraph: {
      type: "website",
      title: `${calculatorName} Calculator | ${SITE_NAME}`,
      description,
    },
  }),
}

// Generate sitemap data
export const generateSitemapData = () => {
  const baseUrl = SITE_URL.replace(/\/$/, "")
  
  return {
    static: [
      { url: `${baseUrl}/`, priority: 1.0, changefreq: "daily" },
      { url: `${baseUrl}/properties`, priority: 0.9, changefreq: "daily" },
      { url: `${baseUrl}/buy`, priority: 0.9, changefreq: "weekly" },
      { url: `${baseUrl}/sell`, priority: 0.9, changefreq: "weekly" },
      { url: `${baseUrl}/loans`, priority: 0.9, changefreq: "weekly" },
      { url: `${baseUrl}/calculators`, priority: 0.8, changefreq: "monthly" },
      { url: `${baseUrl}/about`, priority: 0.7, changefreq: "monthly" },
      { url: `${baseUrl}/contact`, priority: 0.7, changefreq: "monthly" },
      { url: `${baseUrl}/faq`, priority: 0.6, changefreq: "monthly" },
    ],
    calculators: [
      "mortgage-payment",
      "affordability",
      "income",
      "closing-cost",
      "refinance",
      "home-sale",
      "buying-power",
      "temporary-buydown",
      "rent-vs-own",
      "retirement",
    ].map(slug => ({
      url: `${baseUrl}/calculators/${slug}`,
      priority: 0.7,
      changefreq: "monthly",
    })),
  }
}

// Generate robots.txt content
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin and private areas
Disallow: /dashboard/
Disallow: /owner/
Disallow: /tenant/
Disallow: /auth/
Disallow: /admin/
Disallow: /api/
`
}

const seoUtils = {
  generateStructuredData,
  generateMetadata,
  generateSitemapData,
  generateRobotsTxt,
}

export default seoUtils
