import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import LoansFAQPage from "@/app/faq/loans-faqs/page"
import TenantFAQPage from "@/app/faq/tenant-faqs/page"
import { NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("loan FAQ page does not present Ondo as a servicer", () => {
  it("never claims servicing, payoffs or lien releases", () => {
    const { container } = render(<LoansFAQPage />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/loan servicing department/i)
    expect(text).not.toMatch(/we offer disaster-related mortgage assistance/i)
    expect(text).not.toMatch(/we'll process the payoff|release the lien on your property/i)
    expect(text).not.toMatch(/online portal.*(payments|payoff)/i)
    expect(text).not.toMatch(/24\/7/)
  })

  it("sends people with a current loan to their servicer and HUD counseling", () => {
    const text = render(<LoansFAQPage />).container.textContent ?? ""
    expect(text).toContain(NOT_A_SERVICER)
    expect(text).toMatch(/1-800-569-4287/)
    expect(text).toMatch(/servicer/)
    expect(text).toMatch(/disaster/i)
  })

  it("the renting page covers rent payments without grace-period or late-fee numbers", () => {
    const text = render(<TenantFAQPage />).container.textContent ?? ""
    expect(text).not.toMatch(/15-day|grace period before/i)
    expect(text).not.toMatch(/\$25/)
    expect(text).not.toMatch(/pay off your loan/i)
    expect(text).toMatch(/lease/i)
    expect(text).toMatch(/autopay/i)
  })

  it("the FAQ hub tiles no longer promise payoff quotes or 24/7 help", () => {
    const src = read("app/faq/page.tsx")
    expect(src).not.toMatch(/Requesting payoff quotes/)
    expect(src).not.toMatch(/supports you 24\/7/)
  })
})
