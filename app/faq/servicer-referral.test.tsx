import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import LoanPayoffsFAQPage from "@/app/faq/loan-payoffs-faqs/page"
import HardshipFAQPage from "@/app/faq/hardship-faqs/page"
import DisasterFAQPage from "@/app/faq/disaster-faqs/page"
import PaymentsFAQPage from "@/app/faq/payments-faqs/page"
import { NOT_A_SERVICER } from "@/lib/content/mortgage-referral"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

const pages = {
  "loan payoffs": LoanPayoffsFAQPage,
  hardship: HardshipFAQPage,
  disaster: DisasterFAQPage,
  payments: PaymentsFAQPage,
}

describe("loan FAQ pages do not present Ondo as a servicer", () => {
  it.each(Object.entries(pages))("%s page", (_name, Page) => {
    const { container } = render(<Page />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/loan servicing department/i)
    expect(text).not.toMatch(/we offer disaster-related mortgage assistance/i)
    expect(text).not.toMatch(/we'll process the payoff|release the lien on your property/i)
    expect(text).not.toMatch(/online portal.*(payments|payoff)/i)
    expect(text).not.toMatch(/24\/7/)
  })

  it("payoffs, hardship and disaster pages send people to their servicer and HUD counseling", () => {
    for (const Page of [LoanPayoffsFAQPage, HardshipFAQPage, DisasterFAQPage]) {
      const text = render(<Page />).container.textContent ?? ""
      expect(text).toContain(NOT_A_SERVICER)
      expect(text).toMatch(/1-800-569-4287/)
      expect(text).toMatch(/servicer/)
    }
  })

  it("payments page is about rent and gives no grace-period or late-fee numbers", () => {
    const text = render(<PaymentsFAQPage />).container.textContent ?? ""
    expect(text).not.toMatch(/15-day|grace period before/i)
    expect(text).not.toMatch(/\$25/)
    expect(text).not.toMatch(/pay off your loan/i)
    expect(text).toMatch(/lease/i)
  })

  it("the FAQ hub tiles no longer promise payoff quotes or 24/7 help", () => {
    const src = read("app/faq/page.tsx")
    expect(src).not.toMatch(/Requesting payoff quotes/)
    expect(src).not.toMatch(/supports you 24\/7/)
  })
})
