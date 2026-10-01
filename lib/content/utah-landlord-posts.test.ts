/// <reference types="vite/client" />
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"
import {
  UTAH_FAIR_HOUSING_PROTECTED_CLASSES,
  UTAH_RENTAL_LAW_RULES,
  UTAH_RENTAL_LAW_UNVERIFIED,
  utahFairHousingClassesText,
} from "./utah-rental-law"

/** Landlord and tenant posts that state Utah rules. Wrong notice counts and remedies live here. */
const POSTS = [
  "ultimate-guide-becoming-utah-landlord-2026",
  "property-management-tips-utah-landlords",
  "utah-landlord-tenant-law-guide",
  "property-management-guide-lehi-investors",
  "tenant-rights-checklist",
]

const pages = import.meta.glob("/app/blog/*/page.tsx")

/** The text a reader sees, so a rule stated in the page's own copy is checked as published. */
async function renderedText(slug: string): Promise<string> {
  const load = pages[`/app/blog/${slug}/page.tsx`]
  if (!load) throw new Error(`No page for ${slug}`)
  const mod = (await load()) as { default: (props: object) => ReactElement | Promise<ReactElement> }
  const { container, unmount } = render(await mod.default({}))
  container.querySelectorAll("script, style").forEach((el) => el.remove())
  const text = (container.textContent ?? "").replace(/[‘’]/g, "'").replace(/\s+/g, " ")
  unmount()
  return text
}

const rulesText = UTAH_RENTAL_LAW_RULES.map((r) => `${r.question} ${r.answer}`).join(" ")
const NOTICE_DAYS = /(\d+)(?:-day|[ -]days?'?)(?: written)? notice/gi

describe("Utah rental-law module", () => {
  it("cites 57-17-3 for deductions and 57-17-5 for the $100 penalty", () => {
    const byId = Object.fromEntries(UTAH_RENTAL_LAW_RULES.map((r) => [r.id, r]))
    expect(byId["deposit-deductions"]?.citation).toBe("Utah Code § 57-17-3")
    expect(byId["deposit-penalty"]?.citation).toBe("Utah Code § 57-17-5")
    expect(byId["deposit-penalty"]?.answer).toMatch(/written demand/i)
    expect(byId["deposit-penalty"]?.answer).toMatch(/5-business-day/i)
    for (const rule of UTAH_RENTAL_LAW_RULES) {
      expect(rule.citation, rule.id).not.toContain("57-17-2")
    }
  })

  it("has a fair-housing rule that lists every class in 57-21-5, including source of income", () => {
    const rule = UTAH_RENTAL_LAW_RULES.find((r) => r.id === "fair-housing-protected-classes")
    expect(rule?.citation).toContain("57-21-5")
    for (const cls of ["source of income", "sexual orientation", "gender identity", "familial status"]) {
      expect(UTAH_FAIR_HOUSING_PROTECTED_CLASSES).toContain(cls)
      expect(rule?.answer).toContain(cls)
    }
    expect(utahFairHousingClassesText()).toMatch(/, and gender identity$/)
  })
})

describe("Utah landlord posts", () => {
  it.each(POSTS)("%s does not repeat known wrong Utah rules", async (slug) => {
    const text = await renderedText(slug)
    expect(text, "rent withholding is not a Utah remedy").not.toMatch(/withhold(?:ing)? (?:the )?rent/i)
    expect(text, "lease-violation notice is 3 days").not.toMatch(/15-day notice for lease violations/i)
    expect(text, "Lehi is in the Fourth District").not.toMatch(/Third District/i)
    expect(text, "Utah has no mold disclosure rule").not.toMatch(/mold disclosure/i)
    expect(text, "wrong deposit section").not.toContain("57-17-2")
    expect(text, "voucher holders are protected statewide").not.toMatch(/local protection|statewide treatment is evolving/i)
    expect(text, "assistance animals are a Fair Housing Act issue, not the ADA").not.toMatch(/service-animal carve-out per ADA/i)
  })

  it.each(POSTS)("%s states no claim the module records as unverified (grace period, late fee cap)", async (slug) => {
    expect(UTAH_RENTAL_LAW_UNVERIFIED.length).toBeGreaterThan(0)
    const text = await renderedText(slug)
    expect(text).not.toMatch(/grace period/i)
    expect(text).not.toMatch(/late fees? (?:is |are )?(?:not )?capped|caps? (?:on )?late fees|does not cap late fees/i)
    expect(text).not.toMatch(/10% of (?:the )?monthly rent/i)
  })

  it.each(POSTS)("%s uses only notice periods and penalties that utah-rental-law.ts publishes", async (slug) => {
    const allowedNotice = new Set([...rulesText.matchAll(NOTICE_DAYS)].map((m) => m[1]))
    expect(allowedNotice.size).toBeGreaterThan(0)
    const text = await renderedText(slug)
    for (const m of text.matchAll(NOTICE_DAYS)) {
      expect(allowedNotice, `"${m[0]}" is not a notice period in utah-rental-law.ts`).toContain(m[1])
    }
    for (const m of text.matchAll(/(\$\d[\d,]*) penalty/gi)) {
      expect(rulesText, `"${m[0]}" is not a penalty in utah-rental-law.ts`).toContain(m[1]!)
    }
  })

  it("the landlord posts that list protected classes show them from the module", async () => {
    for (const slug of [
      "ultimate-guide-becoming-utah-landlord-2026",
      "property-management-tips-utah-landlords",
      "utah-landlord-tenant-law-guide",
    ]) {
      expect(await renderedText(slug), slug).toContain(utahFairHousingClassesText())
    }
  })

  it("the tenant checklist no longer promises a deposit amount limit", async () => {
    expect(await renderedText("tenant-rights-checklist")).not.toMatch(/limits on amount/i)
  })
})
