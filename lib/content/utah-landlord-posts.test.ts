import { readFileSync } from "fs"
import { join } from "path"
import { describe, expect, it } from "vitest"
import {
  UTAH_FAIR_HOUSING_PROTECTED_CLASSES,
  UTAH_RENTAL_LAW_RULES,
  utahFairHousingClassesText,
} from "./utah-rental-law"

/** Landlord and tenant posts that state Utah rules. Wrong notice counts and remedies live here. */
const POSTS = [
  "app/blog/ultimate-guide-becoming-utah-landlord-2026/page.tsx",
  "app/blog/property-management-tips-utah-landlords/page.tsx",
  "app/blog/utah-landlord-tenant-law-guide/page.tsx",
  "app/blog/property-management-guide-lehi-investors/page.tsx",
  "app/blog/tenant-rights-checklist/page.tsx",
]

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

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
  it.each(POSTS)("%s does not repeat known wrong Utah rules", (rel) => {
    const text = read(rel)
    expect(text, "rent withholding is not a Utah remedy").not.toMatch(/withhold(?:ing)? (?:the )?rent/i)
    expect(text, "lease-violation notice is 3 days").not.toMatch(/15-day notice for lease violations/i)
    expect(text, "Lehi is in the Fourth District").not.toMatch(/Third District/i)
    expect(text, "Utah has no mold disclosure rule").not.toMatch(/mold disclosure/i)
    expect(text, "wrong deposit section").not.toContain("57-17-2")
    expect(text, "voucher holders are protected statewide").not.toMatch(/local protection|statewide treatment is evolving/i)
    expect(text, "assistance animals are a Fair Housing Act issue, not the ADA").not.toMatch(/service-animal carve-out per ADA/i)
  })

  it("the landlord posts that list protected classes render them from the module", () => {
    for (const rel of [
      "app/blog/ultimate-guide-becoming-utah-landlord-2026/page.tsx",
      "app/blog/property-management-tips-utah-landlords/page.tsx",
      "app/blog/utah-landlord-tenant-law-guide/page.tsx",
    ]) {
      expect(read(rel), rel).toContain("utahFairHousingClassesText()")
    }
  })

  it("the tenant checklist no longer promises a deposit amount limit", () => {
    expect(read("app/blog/tenant-rights-checklist/page.tsx")).not.toMatch(/limits on amount/i)
  })
})
