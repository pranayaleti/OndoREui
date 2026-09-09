import { describe, it, expect } from "vitest"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_BLURBS,
  GLOSSARY_CATEGORY_LABELS,
  GLOSSARY_SLUGS,
  GLOSSARY_TERMS,
  getGlossaryTerm,
  glossaryHref,
  glossaryInitial,
  glossaryInitials,
  glossaryTermsByCategory,
  glossaryTermsForCalculator,
  relatedGlossaryTerms,
  searchGlossary,
  sortedGlossaryTerms,
} from "./glossary"

describe("glossary data integrity", () => {
  it("has a unique slug per entry", () => {
    const slugs = GLOSSARY_TERMS.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("uses URL-safe slugs", () => {
    for (const entry of GLOSSARY_TERMS) {
      expect(entry.slug, entry.slug).toMatch(/^[a-z0-9][a-z0-9-]*$/)
    }
  })

  it("has a unique display term per entry", () => {
    const terms = GLOSSARY_TERMS.map((entry) => entry.term)
    expect(new Set(terms).size).toBe(terms.length)
  })

  it("resolves every seeAlso reference to a real entry", () => {
    const slugs = new Set(GLOSSARY_SLUGS)
    const broken = GLOSSARY_TERMS.flatMap((entry) =>
      (entry.seeAlso ?? []).filter((slug) => !slugs.has(slug)).map((slug) => `${entry.slug} -> ${slug}`),
    )
    expect(broken).toEqual([])
  })

  it("never lists itself in seeAlso", () => {
    const selfRefs = GLOSSARY_TERMS.filter((entry) => (entry.seeAlso ?? []).includes(entry.slug))
    expect(selfRefs.map((entry) => entry.slug)).toEqual([])
  })

  it("points every calculator reference at a calculator that exists", () => {
    const known = new Set(Object.keys(CALCULATOR_CATALOG))
    const broken = GLOSSARY_TERMS.flatMap((entry) =>
      (entry.calculators ?? [])
        .filter((slug) => !known.has(slug))
        .map((slug) => `${entry.slug} -> ${slug}`),
    )
    expect(broken).toEqual([])
  })

  it("uses root-relative hrefs with a trailing slash for related reading", () => {
    // The site is a static export with trailingSlash: true. A related link without
    // the slash would resolve through a redirect instead of landing directly.
    for (const entry of GLOSSARY_TERMS) {
      for (const link of entry.related ?? []) {
        expect(link.href, `${entry.slug} -> ${link.href}`).toMatch(/^\/.*\/$/)
        expect(link.label.length, `${entry.slug} -> ${link.href}`).toBeGreaterThan(0)
      }
    }
  })

  it("keeps the one-line summary short enough to survive a search snippet", () => {
    // `short` doubles as the meta description; past ~155 characters it is truncated.
    const tooLong = GLOSSARY_TERMS.filter((entry) => entry.short.length > 155).map(
      (entry) => `${entry.slug} (${entry.short.length})`,
    )
    expect(tooLong).toEqual([])
  })

  it("gives every entry at least one definition paragraph", () => {
    for (const entry of GLOSSARY_TERMS) {
      expect(entry.definition.length, entry.slug).toBeGreaterThan(0)
      for (const paragraph of entry.definition) {
        expect(paragraph.trim().length, entry.slug).toBeGreaterThan(40)
      }
    }
  })

  it("assigns every entry a known category", () => {
    for (const entry of GLOSSARY_TERMS) {
      expect(GLOSSARY_CATEGORIES).toContain(entry.category)
    }
  })

  it("labels and blurbs every category", () => {
    for (const category of GLOSSARY_CATEGORIES) {
      expect(GLOSSARY_CATEGORY_LABELS[category]).toBeTruthy()
      expect(GLOSSARY_CATEGORY_BLURBS[category]).toBeTruthy()
      expect(glossaryTermsByCategory(category).length).toBeGreaterThan(0)
    }
  })

  it("flags credit, rate, and payment entries for the lending disclosure", () => {
    // Disclosure is a template property. Anything whose definition talks about
    // rates, credit, or loan payments must carry the flag so the term page
    // appends it automatically rather than relying on an author remembering.
    const mustDisclose = GLOSSARY_TERMS.filter((entry) => {
      if (entry.lending) return false
      const body = [entry.short, ...entry.definition].join(" ").toLowerCase()
      return /\b(interest rate|note rate|mortgage insurance|credit score|underwrit)\b/.test(body)
    })
    expect(mustDisclose.map((entry) => entry.slug)).toEqual([])
  })
})

describe("glossary lookup helpers", () => {
  it("returns an entry by slug and undefined for an unknown one", () => {
    expect(getGlossaryTerm("escrow-account")?.term).toContain("Escrow")
    expect(getGlossaryTerm("not-a-real-term")).toBeUndefined()
  })

  it("builds a trailing-slash href", () => {
    expect(glossaryHref("cap-rate")).toBe("/glossary/cap-rate/")
  })

  it("sorts alphabetically, case-insensitively", () => {
    const sorted = sortedGlossaryTerms().map((entry) => entry.term.toLowerCase())
    expect(sorted).toEqual([...sorted].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })))
  })

  it("groups a numeric-leading term under #", () => {
    const numeric = GLOSSARY_TERMS.find((entry) => /^[0-9]/.test(entry.term))
    expect(numeric, "expected at least one numeric term such as the 1% rule").toBeDefined()
    expect(glossaryInitial(numeric!)).toBe("#")
    expect(glossaryInitials()).toContain("#")
  })

  it("resolves seeAlso slugs to entries", () => {
    const apr = getGlossaryTerm("apr")!
    const related = relatedGlossaryTerms(apr)
    expect(related.length).toBe((apr.seeAlso ?? []).length)
    expect(related.every((entry) => Boolean(entry.term))).toBe(true)
  })
})

describe("searchGlossary", () => {
  it("returns everything for an empty query", () => {
    expect(searchGlossary("").length).toBe(GLOSSARY_TERMS.length)
    expect(searchGlossary("   ").length).toBe(GLOSSARY_TERMS.length)
  })

  it("matches on the display term, case-insensitively", () => {
    expect(searchGlossary("CAP RATE").map((entry) => entry.slug)).toContain("cap-rate")
  })

  it("matches on an alias, so an abbreviation finds the spelled-out term", () => {
    // Someone types "loan to value"; the entry is titled "LTV (Loan-to-Value Ratio)".
    expect(searchGlossary("loan to value").map((entry) => entry.slug)).toContain("loan-to-value")
    expect(searchGlossary("debt to income").map((entry) => entry.slug)).toContain("dti")
  })

  it("matches on the summary text", () => {
    expect(searchGlossary("appraiser").length).toBeGreaterThan(0)
  })

  it("returns nothing for a term that is not in the glossary", () => {
    expect(searchGlossary("zzzzznotaterm")).toEqual([])
  })
})

describe("glossaryTermsForCalculator", () => {
  it("returns the terms wired to a calculator", () => {
    const terms = glossaryTermsForCalculator("cap-rate").map((entry) => entry.slug)
    expect(terms).toContain("cap-rate")
    expect(terms).toContain("noi")
  })

  it("covers every calculator in the catalog", () => {
    // A calculator with no terms renders no strip, which is a silent gap rather
    // than a visible one — so assert coverage instead of trusting a spot check.
    const bare = Object.keys(CALCULATOR_CATALOG).filter(
      (slug) => glossaryTermsForCalculator(slug).length === 0,
    )
    expect(bare).toEqual([])
  })

  it("returns an empty list for an unknown calculator", () => {
    expect(glossaryTermsForCalculator("not-a-calculator")).toEqual([])
  })
})
