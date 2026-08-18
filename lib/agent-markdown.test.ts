import { describe, expect, it } from "vitest"
import {
  buildCalculatorMarkdown,
  buildContactMarkdown,
  buildHomepageMarkdown,
  buildPropertiesMarkdown,
  getCalculatorDetail,
  getCalculatorMarkdownSlugs,
} from "./agent-markdown"
import { CALCULATOR_CATALOG } from "./calculator-catalog"
import { LLMS_DISCLOSURES_BLOCK } from "./site-index"

describe("first-party Markdown twins", () => {
  it("homepage brief has YAML frontmatter, H1, and disclosures", () => {
    const md = buildHomepageMarkdown()
    expect(md.startsWith("---\n")).toBe(true)
    expect(md).toMatch(/^# Ondo Real Estate/m)
    expect(md).toContain(LLMS_DISCLOSURES_BLOCK)
    expect(md).toMatch(/## Sitemap/)
  })

  it("properties brief lists WebMCP tool and how-to-filter fields", () => {
    const md = buildPropertiesMarkdown()
    expect(md).toContain("search_available_properties")
    expect(md).toContain("search_listings_by_text")
    expect(md).toContain("Minimum bedrooms")
    expect(md).toContain("Maximum monthly rent")
    expect(md).toContain(LLMS_DISCLOSURES_BLOCK)
  })

  it("contact brief lists channels and both WebMCP tools", () => {
    const md = buildContactMarkdown()
    expect(md).toContain("get_company_contact_info")
    expect(md).toContain("submit_contact_lead")
    expect(md).toContain("info@ondorealestate.com")
    expect(md).toContain(LLMS_DISCLOSURES_BLOCK)
  })

  it("does not invent NMLS numbers on any twin", () => {
    const combined = [
      buildHomepageMarkdown(),
      buildPropertiesMarkdown(),
      buildContactMarkdown(),
    ].join("\n")
    expect(combined).toContain("NMLS ID on file")
    expect(combined).not.toMatch(/NMLS\s*#?\s*\d{3,}/i)
    expect(combined).not.toMatch(/pre-?approved/i)
  })
})

describe("calculator Markdown twins", () => {
  const slugs = getCalculatorMarkdownSlugs()

  it("covers every slug in the calculator catalog", () => {
    for (const slug of Object.keys(CALCULATOR_CATALOG)) {
      expect(getCalculatorDetail(slug)).not.toBeNull()
    }
    expect(slugs.sort()).toEqual(Object.keys(CALCULATOR_CATALOG).sort())
  })

  it("renders formula, inputs, canonical URL, and disclosures for every slug", () => {
    for (const slug of slugs) {
      const md = buildCalculatorMarkdown(slug)
      expect(md).toMatch(/^---\n/)
      expect(md).toMatch(new RegExp(`canonical:.+/calculators/${slug}/`))
      expect(md).toMatch(/## Formula/)
      expect(md).toMatch(/## Inputs/)
      expect(md).toContain(LLMS_DISCLOSURES_BLOCK)
      expect(md).toMatch(/## Sitemap/)
    }
  })

  it("mortgage-payment worked example uses the shared PI calculator", () => {
    const md = buildCalculatorMarkdown("mortgage-payment")
    expect(md).toMatch(/Monthly principal \+ interest: \*\*\$1,516\.\d{2}\*\*/)
  })

  it("throws on unknown slug so the generator fails loudly", () => {
    expect(() => buildCalculatorMarkdown("not-a-real-slug")).toThrow(/unknown calculator slug/i)
  })
})
