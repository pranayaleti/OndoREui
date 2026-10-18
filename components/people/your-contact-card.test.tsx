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

  // Each license is advertised with its own required identifier: brokerage for the agent title,
  // NMLS IDs for the loan officer title. A card never shows the other license's title.
  it("titles agent pages 'Utah real estate agent' with the brokerage, and no loan officer or NMLS, once live", () => {
    const { container } = render(<YourContactCard kind="agent" live />)
    expect(screen.getByText("Utah real estate agent with Test Realty")).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/loan officer|NMLS/i)
  })

  it("titles loan pages 'Loan officer' with both NMLS IDs and the lender, and no agent title, once live", () => {
    const { container } = render(<YourContactCard kind="loan" live />)
    expect(screen.getByText("Loan officer, NMLS #2699085")).toBeInTheDocument()
    expect(screen.getByText(/with Test Lending \(NMLS #123456\)/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /verify at nmls consumer access/i })).toHaveAttribute(
      "href",
      "https://www.nmlsconsumeraccess.org/",
    )
    expect(container.textContent).not.toMatch(/real estate agent/i)
    expect(container.textContent?.match(/Pranay Reddy Aleti/g)).toHaveLength(1)
  })
})
