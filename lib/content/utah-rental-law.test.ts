import { describe, it, expect } from "vitest"
import {
  UTAH_RENTAL_LAW_DISCLAIMER,
  UTAH_RENTAL_LAW_RULES,
  UTAH_RENTAL_LAW_UNVERIFIED,
  utahRulesAsFaqs,
  utahRulesForAudience,
} from "./utah-rental-law"

describe("Utah rental law facts", () => {
  it("cites a statute for every published rule", () => {
    // An uncited legal claim on a property-management site is the thing an owner
    // acts on and cannot check. Every rule must be traceable.
    for (const rule of UTAH_RENTAL_LAW_RULES) {
      expect(rule.citation, rule.id).toMatch(/(Utah Code|U\.S\.C\.)/)
    }
  })

  it("has a unique id per rule", () => {
    const ids = UTAH_RENTAL_LAW_RULES.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("phrases each question the way someone would actually search", () => {
    for (const rule of UTAH_RENTAL_LAW_RULES) {
      expect(rule.question.endsWith("?"), rule.id).toBe(true)
      expect(rule.question.toLowerCase(), rule.id).toContain("utah")
    }
  })

  it("never publishes a figure the sources disagreed on", () => {
    // The two supplied sources conflict on the rent grace period, and the
    // late-fee cap could not be corroborated. Neither may appear as fact.
    const published = UTAH_RENTAL_LAW_RULES.map((r) => `${r.question} ${r.answer}`).join(" ").toLowerCase()
    expect(published).not.toContain("grace period")
    expect(published).not.toMatch(/10% of (the )?monthly rent/)
    expect(published).not.toContain("$75")
  })

  it("keeps the unverified claims recorded rather than silently dropped", () => {
    // Deleting them would lose the fact that a question was asked and left open.
    expect(UTAH_RENTAL_LAW_UNVERIFIED.length).toBeGreaterThan(0)
    for (const item of UTAH_RENTAL_LAW_UNVERIFIED) {
      expect(item.claim.length).toBeGreaterThan(20)
      expect(item.conflict.length).toBeGreaterThan(20)
    }
  })

  it("states plainly that it is not legal advice", () => {
    expect(UTAH_RENTAL_LAW_DISCLAIMER.toLowerCase()).toContain("not legal advice")
    expect(UTAH_RENTAL_LAW_DISCLAIMER.toLowerCase()).toContain("fair housing")
  })

  it("gives both audiences a non-empty set", () => {
    expect(utahRulesForAudience("tenant").length).toBeGreaterThan(0)
    expect(utahRulesForAudience("owner").length).toBeGreaterThan(0)
  })

  it("carries the citation into the FAQ answer a reader sees", () => {
    for (const faq of utahRulesAsFaqs("tenant")) {
      expect(faq.answer, faq.question).toMatch(/(Utah Code|U\.S\.C\.)/)
    }
  })
})
