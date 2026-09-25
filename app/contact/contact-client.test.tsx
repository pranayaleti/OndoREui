import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ContactPage from "./contact-client"

describe("contact page follow-us block", () => {
  it("points the QR code and its text link at /links/ on our own domain", () => {
    render(<ContactPage />)
    expect(screen.getByRole("link", { name: /all ondo links/i })).toHaveAttribute("href", "/links/")
    expect(screen.getByRole("link", { name: "ondorealestate.com/links" })).toHaveAttribute("href", "/links/")
  })

  it("reports taps on the QR code as links_hub_click", () => {
    render(<ContactPage />)
    const qr = screen.getByRole("link", { name: /all ondo links/i })
    expect(qr).toHaveAttribute("data-analytics-event", "links_hub_click")
    expect(qr).toHaveAttribute("data-analytics-category", "contact_page")
  })
})
