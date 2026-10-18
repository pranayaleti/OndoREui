import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import { YourContactCard } from "./your-contact-card"

describe("YourContactCard", () => {
  it("names the founder with a profile link and no license title while licensing is off", () => {
    render(<YourContactCard kind="loan" live={false} />)
    expect(screen.getByRole("heading", { name: "Your contact" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Pranay Reddy Aleti" })).toHaveAttribute("href", "/about/team/pranay-reddy-aleti/")
    expect(screen.getByText("Founder, Ondo Real Estate")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS|loan officer|real estate agent|brokered by/i)
  })

  it("offers a call and a booking link", () => {
    render(<YourContactCard kind="agent" live={false} />)
    expect(screen.getByRole("link", { name: /^call$/i }).getAttribute("href")).toMatch(/^tel:\+?\d{10,}$/)
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute("target", "_blank")
  })

  it("shows the brokerage on agent pages once live", () => {
    render(<YourContactCard kind="agent" live />)
    expect(screen.getByText("Brokered by Test Realty")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS/)
  })

  it("shows the loan officer line once, with the lender, on loan pages once live", () => {
    render(<YourContactCard kind="loan" live />)
    expect(screen.getAllByText(/NMLS #2699085/)).toHaveLength(1)
    expect(screen.getByText("with Test Lending")).toBeInTheDocument()
  })
})
