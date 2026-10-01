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

  it("keeps Send enabled and says what is missing: what they need, a name and a valid email", () => {
    render(<LinksQuickMessage />)
    fireEvent.click(screen.getByRole("button", { name: /send me a quick message/i }))
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "review-test" } })
    const send = screen.getByRole("button", { name: /^send$/i })
    expect(send).toBeEnabled()
    fireEvent.click(send)

    expect(submitContactLead).not.toHaveBeenCalled()
    expect(screen.getByRole("radiogroup")).toHaveAccessibleDescription("Choose what you need.")
    expect(screen.getByLabelText(/^name/i)).toHaveAccessibleDescription("Enter your name.")
    expect(screen.getByLabelText(/^email/i)).toHaveAccessibleDescription(/valid email/i)

    // The messages follow the fields as they are fixed.
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Grace" } })
    expect(screen.getByLabelText(/^name/i)).not.toHaveAttribute("aria-invalid")
  })

  it("moves between needs with the arrow keys, selecting as it goes, with one tab stop", () => {
    render(<LinksQuickMessage />)
    fireEvent.click(screen.getByRole("button", { name: /send me a quick message/i }))
    const radios = screen.getAllByRole("radio")
    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1, -1, -1])

    radios[0]!.focus()
    fireEvent.keyDown(radios[0]!, { key: "ArrowRight" })
    expect(radios[1]).toHaveFocus()
    expect(radios[1]).toHaveAttribute("aria-checked", "true")
    expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, 0, -1, -1, -1])

    fireEvent.keyDown(radios[1]!, { key: "ArrowLeft" })
    fireEvent.keyDown(radios[0]!, { key: "ArrowLeft" })
    expect(radios[4]).toHaveFocus()
    expect(radios[4]).toHaveAttribute("aria-checked", "true")
  })
})
