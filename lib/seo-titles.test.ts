import { describe, expect, it } from "vitest"
import { utahCitiesFromNorthOgdenToNephi } from "@/lib/utah-cities"
import { SITE_TITLE_MAX, fitTitle, pageTitle, pageTitleText, stripBrand } from "@/lib/site"
import {
  cityGuideDescription,
  cityGuideTitle,
  marketReportDescription,
  marketReportTitle,
  pmCityDescription,
  pmCityTitle,
} from "@/lib/seo-titles"
import { subServiceDefinitions } from "@/lib/sub-service-content"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"

const cities = utahCitiesFromNorthOgdenToNephi.map((c) => c.name)

/** Google shows one brand at most; two means the differentiator got truncated. */
function brandCount(title: string): number {
  return (title.match(/Ondo RE|Ondo Real Estate/g) ?? []).length
}

describe("stripBrand", () => {
  it("removes a single appended brand", () => {
    expect(stripBrand("Contact Us | Ondo Real Estate")).toBe("Contact Us")
  })

  it("removes a doubled brand, which is what shipped", () => {
    expect(stripBrand("Property Management Fees in Utah | Ondo RE | Ondo RE")).toBe(
      "Property Management Fees in Utah",
    )
    expect(stripBrand("VA Home Loans in Utah | Ondo Real Estate | Ondo RE")).toBe(
      "VA Home Loans in Utah",
    )
  })

  it("leaves a title that is only the brand alone", () => {
    expect(stripBrand("Ondo RE")).toBe("Ondo RE")
  })
})

describe("pageTitle", () => {
  it("appends the brand exactly once when it fits", () => {
    expect(pageTitleText("Utah Tenant Screening")).toBe("Utah Tenant Screening | Ondo RE")
  })

  it("drops the brand rather than truncating the head term", () => {
    const long = "Washington Terrace, UT: Cost of Living and Home Prices"
    expect(pageTitleText(long)).toBe(long)
    expect(brandCount(pageTitleText(long))).toBe(0)
  })

  it("is idempotent, so a second pass cannot double the brand", () => {
    const once = pageTitleText("Contact Us | Ondo Real Estate")
    expect(pageTitleText(once)).toBe(once)
    expect(brandCount(once)).toBe(1)
  })

  it("returns an absolute title so the layout template cannot append again", () => {
    expect(pageTitle("Utah Home Loans")).toEqual({ absolute: "Utah Home Loans | Ondo RE" })
  })
})

describe("fitTitle", () => {
  it("takes the first candidate inside the budget", () => {
    expect(fitTitle("x".repeat(70), "short")).toBe("short")
  })

  it("falls back to the shortest when none fit", () => {
    expect(fitTitle("x".repeat(70), "y".repeat(65))).toBe("y".repeat(65))
  })
})

describe.each([
  ["city guide", cityGuideTitle, cityGuideDescription],
  ["property management city", pmCityTitle, pmCityDescription],
  ["market report", marketReportTitle, marketReportDescription],
] as const)("%s template", (_label, title, description) => {
  it("fits the SERP budget for every Utah city", () => {
    const over = cities.filter((c) => pageTitleText(title(c)).length > SITE_TITLE_MAX)
    expect(over).toEqual([])
  })

  it("never renders the brand twice", () => {
    for (const c of cities) expect(brandCount(pageTitleText(title(c)))).toBeLessThanOrEqual(1)
  })

  it("leads with the city, which is how the query is typed", () => {
    for (const c of cities) expect(title(c).startsWith(c)).toBe(true)
  })

  it("produces a distinct title per city", () => {
    expect(new Set(cities.map(title)).size).toBe(cities.length)
  })

  it("produces a distinct description per city", () => {
    expect(new Set(cities.map(description)).size).toBe(cities.length)
  })

  it("keeps descriptions inside the snippet window", () => {
    for (const c of cities) {
      const d = description(c)
      expect(d.length).toBeGreaterThanOrEqual(110)
      expect(d.length).toBeLessThanOrEqual(165)
    }
  })
})

describe("sub-service templates", () => {
  const defs = Object.values(subServiceDefinitions)

  it("fits the budget for every service and city combination", () => {
    const over: string[] = []
    for (const def of defs) {
      for (const c of cities) {
        const rendered = pageTitleText(def.metaTitle(c))
        if (rendered.length > SITE_TITLE_MAX) over.push(`${def.slug}/${c}: ${rendered.length}`)
      }
    }
    expect(over).toEqual([])
  })

  it("never renders the brand twice", () => {
    for (const def of defs) {
      for (const c of cities) expect(brandCount(pageTitleText(def.metaTitle(c)))).toBeLessThanOrEqual(1)
    }
  })

  it("keeps the lender compliance disclaimer on VA and jumbo", () => {
    for (const slug of ["va", "jumbo"]) {
      const def = subServiceDefinitions[slug]
      expect(def).toBeDefined()
      expect(def!.metaDescription("Provo")).toContain("This is not a quote.")
    }
  })
})

describe("calculator catalog", () => {
  it("geo-qualifies every calculator title", () => {
    for (const [slug, detail] of Object.entries(CALCULATOR_CATALOG)) {
      const seoTitle = detail.seoTitle ?? `Utah ${detail.name}`
      expect(seoTitle, `${slug} must name the market it competes in`).toMatch(/Utah|Property Manager/)
    }
  })

  it("keeps overridden titles inside the budget", () => {
    for (const [slug, detail] of Object.entries(CALCULATOR_CATALOG)) {
      if (!detail.seoTitle) continue
      expect(pageTitleText(detail.seoTitle).length, slug).toBeLessThanOrEqual(SITE_TITLE_MAX)
    }
  })
})
