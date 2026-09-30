import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { LinksQuickMessage } from "./links-quick-message"

const ATTRIBUTION_KEY = "ondo.marketing_attribution.v1"

function openAndFill({ need = "Sell a home", note = "Selling a 3 bed in Lehi next spring" } = {}) {
  fireEvent.click(screen.getByRole("button", { name: /send me a quick message/i }))
  fireEvent.click(screen.getByRole("radio", { name: need }))
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Grace Hopper" } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "grace@example.com" } })
  if (note) fireEvent.change(screen.getByLabelText(/anything we should know/i), { target: { value: note } })
}

describe("LinksQuickMessage", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })
  afterEach(() => {
    sessionStorage.clear()
  })

  it("stays collapsed until the visitor asks for it", () => {
    render(<LinksQuickMessage />)
    const toggle = screen.getByRole("button", { name: /send me a quick message/i })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByLabelText(/^email/i)).not.toBeInTheDocument()
  })

  it("sends what they need and their note as a lead routed by need", async () => {
    render(<LinksQuickMessage />)
    openAndFill()
    fireEvent.click(screen.getByRole("button", { name: /^send$/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const payload = submitContactLead.mock.calls[0]![0]
    expect(payload).toMatchObject({ name: "Grace Hopper", email: "grace@example.com", inquiryType: "seller" })
    expect(payload.message).toContain("Need: Sell a home")
    expect(payload.message).toContain("Note: Selling a 3 bed in Lehi next spring")
    expect(await screen.findByRole("status")).toHaveTextContent("Got it, Grace. I'll reach out within one business day.")
  })

  it("tags the lead as social when the visit came through a social link", async () => {
    sessionStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify({ first: { utm_source: "instagram", utm_medium: "social" }, last: { utm_source: "instagram", utm_medium: "social" } }),
    )
    render(<LinksQuickMessage />)
    openAndFill({ need: "Buy a home", note: "" })
    fireEvent.click(screen.getByRole("button", { name: /^send$/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    expect(submitContactLead.mock.calls[0]![0]).toMatchObject({ source: "social", inquiryType: "buyer" })
  })

  it("tags the lead as website traffic otherwise, such as a QR scan", async () => {
    render(<LinksQuickMessage />)
    openAndFill({ need: "Home loan or refinance", note: "" })
    fireEvent.click(screen.getByRole("button", { name: /^send$/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    expect(submitContactLead.mock.calls[0]![0]).toMatchObject({ source: "website", inquiryType: "other" })
    expect(submitContactLead.mock.calls[0]![0].message).toContain("Need: Home loan or refinance")
  })

  it("waits for what they need, a name and a valid email before sending", () => {
    render(<LinksQuickMessage />)
    fireEvent.click(screen.getByRole("button", { name: /send me a quick message/i }))
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Grace" } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "grace@example.com" } })
    expect(screen.getByRole("button", { name: /^send$/i })).toBeDisabled()
  })
})
