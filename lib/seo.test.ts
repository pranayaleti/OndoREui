import { describe, it, expect } from "vitest"
import {
  generateServiceJsonLd,
  generateFAQJsonLd,
  generateLocalBusinessJsonLd,
  generateOrganizationJsonLd,
  generateBreadcrumbJsonLd,
  generateWebsiteJsonLd,
  generateRealEstateAgentJsonLd,
  generatePropertyJsonLd,
  generateWebPageJsonLd,
  generateBlogPostingJsonLd,
  generateDefinedTermJsonLd,
  generateDefinedTermSetJsonLd,
  generateSitemapItemListJsonLd,
  NOTARY_SERVICE_ID,
  SITE_ORGANIZATION_ID,
  generateWebApplicationJsonLd,
  generateRealEstateBusinessJsonLd,
  getSiteGeoMetaOther,
  buildPageMetadata,
} from "./seo"
import { SITE_ADDRESS_CITY, SITE_ADDRESS_REGION, SITE_GEO, SITE_URL } from "./site"

describe("seo", () => {
  describe("generateServiceJsonLd", () => {
    it("returns Service schema with required fields", () => {
      const out = generateServiceJsonLd({
        name: "Property Management",
        description: "Full-service management",
        serviceType: "PropertyManagement",
      })
      expect(out["@type"]).toBe("Service")
      expect(out.name).toBe("Property Management")
      expect(out.areaServed).toBeUndefined()
    })
    it("can point its provider at the one site-wide Organization and nest a city in the state", () => {
      const out = generateServiceJsonLd({
        name: "RON in Provo",
        description: "RON",
        serviceType: "Remote Online Notarization",
        areaServed: "Utah",
        areaServedCity: "Provo",
        providerIsSiteOrganization: true,
      })
      expect(out.provider).toEqual({ "@id": SITE_ORGANIZATION_ID })
      expect(out.areaServed).toEqual({
        "@type": "City",
        name: "Provo",
        containedInPlace: { "@type": "State", name: "Utah" },
      })
    })
    it("emits a stable @id, hours, a Country area and a pointer to a related Service", () => {
      const out = generateServiceJsonLd({
        id: NOTARY_SERVICE_ID,
        name: "RON",
        description: "RON",
        serviceType: "Remote Online Notarization",
        areaServed: "United States",
        areaServedType: "Country",
        hoursAvailable: { dayOfWeek: ["Monday"], opens: "09:00", closes: "19:00" },
        relatedToServiceId: NOTARY_SERVICE_ID,
      })
      expect(out["@id"]).toBe(`${SITE_URL}/notary/#service`)
      expect(out.areaServed).toEqual({ "@type": "Country", name: "United States" })
      expect(out.hoursAvailable).toEqual({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday"],
        opens: "09:00",
        closes: "19:00",
      })
      expect(out.isRelatedTo).toEqual({ "@id": NOTARY_SERVICE_ID })
    })
    it("includes areaServed when provided", () => {
      const out = generateServiceJsonLd({
        name: "Loans",
        description: "Mortgage",
        serviceType: "Mortgage",
        areaServed: "Utah",
      })
      expect(out.areaServed).toEqual({ "@type": "State", name: "Utah" })
    })
  })

  describe("generateFAQJsonLd", () => {
    it("returns FAQPage with mainEntity", () => {
      const out = generateFAQJsonLd([
        { question: "Q1?", answer: "A1" },
        { question: "Q2?", answer: "A2" },
      ])
      expect(out).not.toBeNull()
      expect(out!["@type"]).toBe("FAQPage")
      expect(out!.mainEntity).toHaveLength(2)
    })
  })

  describe("generateLocalBusinessJsonLd", () => {
    it("returns null when name missing", () => {
      expect(
        generateLocalBusinessJsonLd({ name: "", url: "https://example.com" })
      ).toBeNull()
    })
    it("returns null when url missing", () => {
      expect(
        generateLocalBusinessJsonLd({ name: "Co", url: "" })
      ).toBeNull()
    })
    it("types the address as a PostalAddress so schema.org does not ignore it", () => {
      const out = generateLocalBusinessJsonLd({
        name: "Test Co",
        url: "https://example.com",
        address: { addressRegion: "UT", addressCountry: "US", addressLocality: "Lehi" },
      })
      expect(out?.address).toMatchObject({ "@type": "PostalAddress", addressLocality: "Lehi" })
    })
    it("returns schema when name and url provided", () => {
      const out = generateLocalBusinessJsonLd({
        name: "Test Co",
        url: "https://example.com",
      })
      expect(out?.["@type"]).toContain("LocalBusiness")
      expect(out?.name).toBe("Test Co")
    })
  })

  describe("generateOrganizationJsonLd", () => {
    it("returns organization schema", () => {
      const out = generateOrganizationJsonLd()
      expect(out).toBeDefined()
      expect(out?.["@type"]).toContain("Organization")
    })
    it("includes GeoCoordinates from SITE_GEO", () => {
      const out = generateOrganizationJsonLd()
      expect(out?.geo).toEqual({
        "@type": "GeoCoordinates",
        latitude: SITE_GEO.latitude,
        longitude: SITE_GEO.longitude,
      })
    })
  })

  describe("generateRealEstateBusinessJsonLd", () => {
    it("includes GeoCoordinates from SITE_GEO", () => {
      const out = generateRealEstateBusinessJsonLd()
      expect(out.geo).toEqual({
        "@type": "GeoCoordinates",
        latitude: SITE_GEO.latitude,
        longitude: SITE_GEO.longitude,
      })
    })
    it("exposes contact and schedule potentialAction entry points", () => {
      const out = generateRealEstateBusinessJsonLd()
      const actions = out.potentialAction as Array<{ "@type": string; target: { urlTemplate: string } }>
      expect(actions.map((a) => a["@type"])).toEqual(["CommunicateAction", "ReserveAction"])
      expect(actions[0].target.urlTemplate).toMatch(/\/contact\/$/)
      expect(actions[1].target.urlTemplate).toMatch(/calendly\.com/)
    })
  })

  describe("getSiteGeoMetaOther", () => {
    it("returns classic geo meta from site constants", () => {
      const other = getSiteGeoMetaOther()
      expect(other["geo.region"]).toBe(`US-${SITE_ADDRESS_REGION}`)
      expect(other["geo.placename"]).toBe(SITE_ADDRESS_CITY)
      expect(other["geo.position"]).toBe(`${SITE_GEO.latitude};${SITE_GEO.longitude}`)
      expect(other.ICBM).toBe(`${SITE_GEO.latitude}, ${SITE_GEO.longitude}`)
    })
  })

  describe("buildPageMetadata", () => {
    it("sets canonical, OG, and HQ geo meta", () => {
      const meta = buildPageMetadata({
        title: "Buy a Home",
        description: "Utah home buying",
        pathname: "/buy",
      })
      expect(meta.title).toBe("Buy a Home")
      expect(meta.alternates?.canonical).toMatch(/\/buy\/$/)
      expect(meta.openGraph?.title).toBe("Buy a Home")
      const ogImages = meta.openGraph?.images
      const ogImage = Array.isArray(ogImages) ? ogImages[0] : ogImages
      expect(ogImage).toMatchObject({ alt: "Ondo Real Estate: Buy a Home" })
      expect(meta.other).toMatchObject(getSiteGeoMetaOther())
    })

    it("defaults to a sibling Markdown alternate", () => {
      const meta = buildPageMetadata({
        title: "Buy a Home",
        description: "Utah home buying",
        pathname: "/buy",
      })
      expect(meta.alternates?.types).toMatchObject({
        "text/markdown": expect.stringMatching(/\/buy\.md$/),
      })
    })
  })

  describe("generateBreadcrumbJsonLd", () => {
    it("returns BreadcrumbList", () => {
      const out = generateBreadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ])
      expect(out["@type"]).toBe("BreadcrumbList")
      expect(out.itemListElement).toHaveLength(2)
      expect(out.itemListElement[0].position).toBe(1)
    })

    it("points every site crumb at the canonical trailing-slash URL, not a 301", () => {
      const out = generateBreadcrumbJsonLd([
        { name: "Home", url: SITE_URL },
        { name: "Notary", url: `${SITE_URL}/notary` },
        { name: "Blog", url: "/blog?category=Selling" },
        { name: "Already canonical", url: `${SITE_URL}/buy/` },
        { name: "Card", url: `${SITE_URL}/ondo-real-estate.vcf` },
        { name: "Elsewhere", url: "https://example.com/page" },
      ])
      expect(out.itemListElement.map((element) => element.item)).toEqual([
        `${SITE_URL}/`,
        `${SITE_URL}/notary/`,
        "/blog/?category=Selling",
        `${SITE_URL}/buy/`,
        `${SITE_URL}/ondo-real-estate.vcf`,
        "https://example.com/page",
      ])
    })
  })

  describe("generateWebsiteJsonLd", () => {
    it("returns WebSite without a SearchAction that would 404 or drop the query", () => {
      const out = generateWebsiteJsonLd()
      expect(out["@type"]).toBe("WebSite")
      expect("potentialAction" in out).toBe(false)
    })
  })

  describe("generateRealEstateAgentJsonLd", () => {
    it("returns RealEstateAgent schema", () => {
      const out = generateRealEstateAgentJsonLd({
        name: "Jane Doe",
        email: "jane@example.com",
      })
      expect(out["@type"]).toBe("RealEstateAgent")
      expect(out.name).toBe("Jane Doe")
    })
  })

  describe("generatePropertyJsonLd", () => {
    it("returns null when required fields missing", () => {
      expect(
        generatePropertyJsonLd({
          name: "",
          description: "d",
          address: {
            streetAddress: "s",
            addressLocality: "c",
            addressRegion: "r",
            postalCode: "z",
            addressCountry: "US",
          },
        })
      ).toBeNull()
    })
    it("returns RealEstateListing when valid", () => {
      const out = generatePropertyJsonLd({
        name: "House",
        description: "Nice house",
        address: {
          streetAddress: "123 Main",
          addressLocality: "Lehi",
          addressRegion: "UT",
          postalCode: "84043",
          addressCountry: "US",
        },
      })
      expect(out?.["@type"]).toBe("RealEstateListing")
    })
    it("publishes rent as a monthly UnitPriceSpecification and omits unknown availability", () => {
      const out = generatePropertyJsonLd({
        name: "House",
        description: "Nice house",
        address: {
          streetAddress: "123 Main",
          addressLocality: "Lehi",
          addressRegion: "UT",
          postalCode: "84043",
          addressCountry: "US",
        },
        offers: { price: 4200, priceCurrency: "USD", pricePeriod: "month" },
      })
      const offer = out?.offers as Record<string, unknown>
      expect(offer.availability).toBeUndefined()
      expect(offer.priceSpecification).toEqual({
        "@type": "UnitPriceSpecification",
        price: 4200,
        priceCurrency: "USD",
        unitCode: "MON",
      })
    })
    it("leaves a plain price alone when no period is given", () => {
      const out = generatePropertyJsonLd({
        name: "House",
        description: "Nice house",
        address: {
          streetAddress: "123 Main",
          addressLocality: "Lehi",
          addressRegion: "UT",
          postalCode: "84043",
          addressCountry: "US",
        },
        offers: { price: 500000, priceCurrency: "USD", availability: "https://schema.org/InStock" },
      })
      expect((out?.offers as Record<string, unknown>).priceSpecification).toBeUndefined()
    })
  })

  describe("generateWebPageJsonLd", () => {
    it("returns WebPage schema", () => {
      const out = generateWebPageJsonLd({
        name: "About",
        url: "/about",
        description: "About us",
      })
      expect(out?.["@type"]).toBe("WebPage")
    })
  })

  describe("generateBlogPostingJsonLd", () => {
    it("returns BlogPosting schema", () => {
      const out = generateBlogPostingJsonLd({
        title: "Post",
        description: "Desc",
        url: "/blog/post",
        datePublished: "2024-01-01",
      })
      expect(out?.["@type"]).toBe("BlogPosting")
    })

    it("credits the author as an Organization, not a Person", () => {
      const out = generateBlogPostingJsonLd({
        title: "Post",
        description: "Desc",
        url: "/blog/post",
        datePublished: "2024-01-01",
        authorName: "Ondo Real Estate",
      })
      expect(out?.author).toEqual({ "@type": "Organization", name: "Ondo Real Estate" })
    })
  })

  describe("blog structured data", () => {
    const base = {
      title: "Post",
      description: "Desc",
      url: "/blog/post",
      datePublished: "2024-01-01",
    }
    it("names a publisher with a logo", () => {
      const out = generateBlogPostingJsonLd(base) as { publisher: { logo: { url: string } } }
      expect(out.publisher.logo.url).toMatch(/\/logo-favicon\.png$/)
    })
    it("types a listed team member as a Person with a page, and the company as an Organization", () => {
      const person = generateBlogPostingJsonLd({ ...base, authorName: "Pranay Reddy Aleti" })
      expect(person?.author).toEqual({
        "@type": "Person",
        name: "Pranay Reddy Aleti",
        url: `${SITE_URL.replace(/\/$/, "")}/about/team/`,
      })
      expect(generateBlogPostingJsonLd({ ...base, authorName: "Ondo RE Team" })?.author).toMatchObject({
        "@type": "Organization",
      })
    })
  })

  describe("JSON-LD page URLs match the canonical (trailing slash)", () => {
    const origin = SITE_URL.replace(/\/$/, "")
    it("normalises every generator that emits a page url", () => {
      const urls: string[] = []
      const webPage = generateWebPageJsonLd({ name: "About", url: "/about", description: "d" })
      urls.push(webPage!.url)
      const post = generateBlogPostingJsonLd({
        title: "Post",
        description: "Desc",
        url: `${origin}/blog/post`,
        datePublished: "2024-01-01",
      })
      urls.push(post!.mainEntityOfPage)
      const term = generateDefinedTermJsonLd({
        name: "Escrow",
        description: "d",
        url: "/glossary/escrow",
        termSetName: "Glossary",
        termSetUrl: "/glossary",
      })
      urls.push(term!.url, term!.inDefinedTermSet.url)
      const termSet = generateDefinedTermSetJsonLd({
        name: "Glossary",
        description: "d",
        url: "/glossary",
        terms: [{ name: "Escrow", description: "d", url: "/glossary/escrow" }],
      })
      urls.push(termSet!.url, ...(termSet!.hasDefinedTerm as Array<{ url: string }>).map((t) => t.url))
      urls.push(
        generateWebApplicationJsonLd({
          name: "App",
          description: "d",
          url: "/calculators/mortgage-payment",
          applicationCategory: "FinanceApplication",
        })!.url,
      )
      urls.push(
        generateLocalBusinessJsonLd({ name: "Co", url: `${origin}/notary` })!.url,
        ...(generateSitemapItemListJsonLd([{ name: "A", url: `${origin}/a` }]).itemListElement.map((i) => i.url)),
      )
      for (const url of urls) {
        expect(url, url).toMatch(/^https?:\/\/[^/]+\/(.*\/)?$/)
      }
    })
    it("leaves files and other hosts alone", () => {
      expect(
        generateWebPageJsonLd({ name: "Feed", url: `${origin}/feed.xml` })!.url,
      ).toBe(`${origin}/feed.xml`)
    })
    it("keeps the Calendly template exactly as configured", () => {
      const out = generateRealEstateBusinessJsonLd()
      const actions = out.potentialAction as Array<{ target: { urlTemplate: string } }>
      expect(actions[1].target.urlTemplate).toMatch(/^https:\/\/calendly\.com\/[^/]+\/[^/]+$/)
    })
  })

  describe("generateWebApplicationJsonLd", () => {
    it("returns WebApplication schema", () => {
      const out = generateWebApplicationJsonLd({
        name: "App",
        description: "Desc",
        url: "/app",
        applicationCategory: "RealEstateApplication",
      })
      expect(out?.["@type"]).toBe("WebApplication")
    })
  })
})
