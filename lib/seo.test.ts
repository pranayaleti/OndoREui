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
  generateWebApplicationJsonLd,
} from "./seo"

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
  })

  describe("generateWebsiteJsonLd", () => {
    it("returns WebSite with SearchAction", () => {
      const out = generateWebsiteJsonLd()
      expect(out["@type"]).toBe("WebSite")
      expect(out.potentialAction["@type"]).toBe("SearchAction")
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
