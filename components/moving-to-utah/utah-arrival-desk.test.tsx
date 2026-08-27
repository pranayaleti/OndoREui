import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CITY_MARKET_AS_OF } from "@/lib/city-market-data"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { UtahArrivalDesk } from "./utah-arrival-desk"

vi.mock("@/components/contact/contact-lead-form", () => ({
  ContactLeadForm: (props: { defaultInquiryType?: string; prefillMessage?: string }) => (
    <div data-testid="lead-form">
      <p>{props.defaultInquiryType}</p>
      <p>{props.prefillMessage}</p>
    </div>
  ),
}))

describe("UtahArrivalDesk", () => {
  it("defaults to Lehi commute rows and a renter lead", () => {
    render(<UtahArrivalDesk />)
    expect(screen.getByRole("button", { name: /^lehi$/i })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("link", { name: /city guide for american fork/i })).toBeInTheDocument()
    expect(screen.getByTestId("lead-form")).toHaveTextContent("renter")
    expect(screen.getByRole("link", { name: /open rentals in lehi/i })).toHaveAttribute(
      "href",
      "/properties/?query=Lehi",
    )
  })

  it("switches the workplace ledger from chips", () => {
    render(<UtahArrivalDesk />)
    fireEvent.click(screen.getByRole("button", { name: /hill afb/i }))
    expect(screen.queryByRole("link", { name: /open rentals in lehi/i })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /open rentals in clearfield/i })).toBeInTheDocument()
    expect(screen.getByTestId("lead-form")).toHaveTextContent(/Hill Air Force Base/)
    expect(screen.getByTestId("lead-form")).not.toHaveTextContent(/Weekday workplace: Lehi/)
  })

  it("routes the leftover-home path to owner inquiry and the estimate tool", () => {
    render(<UtahArrivalDesk />)
    fireEvent.click(screen.getByLabelText(/a home is staying behind/i))
    expect(screen.getByTestId("lead-form")).toHaveTextContent("owner")
    expect(screen.getByRole("link", { name: /estimate rent and sale/i })).toHaveAttribute(
      "href",
      "/whats-my-home-worth/",
    )
  })

  it("shows an empty state for a workplace we do not cover", () => {
    render(<UtahArrivalDesk />)
    fireEvent.change(screen.getByLabelText(/type a workplace/i), { target: { value: "Moab" } })
    expect(screen.getByText(/no commute minutes for that workplace yet/i)).toBeInTheDocument()
  })

  it("shows a touring window when a start date is far enough out", () => {
    render(<UtahArrivalDesk />)
    fireEvent.change(screen.getByLabelText(/^start date \(optional\)$/i), {
      target: { value: "2026-12-01" },
    })
    expect(screen.getByText(/begin touring between/i)).toBeInTheDocument()
  })

  it("does not copy Woodley relocation product language", () => {
    render(<UtahArrivalDesk />)
    expect(document.body.textContent).not.toMatch(
      /welcoming you home|area tour|settling in|pitch deck|key hires|white glove/i,
    )
  })

  it("shows the Ondo city-median as-of stamp on the desk", () => {
    render(<UtahArrivalDesk />)
    expect(screen.getByText(new RegExp(CITY_MARKET_AS_OF))).toBeInTheDocument()
    expect(screen.getByText(/as of .+ — verify/i)).toBeInTheDocument()
  })

  it("gives path radios, city radios, and workplace chips the homepage sticky-bar scroll margin", () => {
    render(<UtahArrivalDesk />)
    const pathRadio = screen.getByRole("radio", { name: /rent before the start date/i })
    expect(pathRadio.className).toContain(STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)
    const cityRadio = screen.getByRole("radio", { name: /at workplace, lehi/i })
    expect(cityRadio.className).toContain(STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)
    const chip = screen.getByRole("button", { name: /^lehi$/i })
    expect(chip.className).toContain(STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)
  })
})
