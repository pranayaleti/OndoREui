import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { FAIR_HOUSING_STATEMENT } from "@/lib/rental-application"
import LicensingPage from "@/app/licensing/page"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("licensing page", () => {
  it("uses the reviewed Fair Housing statement and the NMLS gate wording", () => {
    const { container } = render(<LicensingPage />)
    const text = container.textContent ?? ""
    expect(text).toContain(FAIR_HOUSING_STATEMENT)
    expect(text).toMatch(/sexual orientation/)
    expect(text).toMatch(/source of income/i)
    expect(text).toContain("NMLS ID on file")
  })
})

describe("FAQ copy", () => {
  it("pet answers say assistance animals are not pets and carry no fees", () => {
    for (const file of ["app/faq/page.tsx", "app/faq/tenant-faqs/page.tsx"]) {
      const src = read(file)
      expect(src).not.toMatch(/Service animals are accommodated/)
      expect(src).toMatch(/Assistance animals that provide disability-related assistance are not pets/)
    }
  })

  it("general FAQ does not claim a property manager license or E&O policy", () => {
    const src = read("app/faq/general-faqs/page.tsx")
    expect(src).not.toMatch(/fully licensed property managers/)
    expect(src).not.toMatch(/errors & omissions/i)
    expect(src).toMatch(/January 1, 2027/)
  })

  it("resources hub no longer promises a dollar savings from credit changes", () => {
    const src = read("app/resources/page.tsx")
    expect(src).not.toMatch(/tens of thousands/)
    expect(src).not.toMatch(/refinance later/)
  })

  it("loan FAQ and site index avoid down-payment percentages", () => {
    expect(read("app/faq/loans-faqs/page.tsx")).not.toMatch(/around 3% down|0% down if you qualify/)
    const idx = read("lib/site-index.ts")
    expect(idx).not.toMatch(/3\.5% down|Zero down for|Zero down in|zero-down\)|zero down for veterans/)
  })
})
