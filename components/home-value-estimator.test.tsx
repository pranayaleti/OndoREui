import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", () => ({ submitContactLead: (...args: unknown[]) => submitContactLead(...args) }))
vi.mock("@/lib/attribution", () => ({ getAttributionPayloadForApi: () => ({}) }))
vi.mock("@/lib/analytics", () => ({
  analytics: { trackEvent: vi.fn(), trackFormSubmission: vi.fn(), trackLeadGeneration: vi.fn() },
}))
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

import { HomeValueEstimator } from "@/components/home-value-estimator"

function pickLehiAndCalculate() {
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Lehi" } })
  fireEvent.click(screen.getByRole("button", { name: /get my estimate/i }))
}

function saleRange(): string {
  return screen.getByText(/estimated sale price/i).parentElement!.querySelector("p:nth-of-type(2)")!.textContent ?? ""
}

describe("HomeValueEstimator", () => {
  beforeEach(() => {
    submitContactLead.mockReset()
    submitContactLead.mockResolvedValue({ ok: true })
  })

  it("exposes bedroom choices as pressed buttons outside a label, so the caption does not click one", () => {
    render(<HomeValueEstimator />)
    const group = screen.getByRole("group", { name: "Bedrooms" })
    expect(group.closest("label")).toBeNull()
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "4" }))
    expect(screen.getByRole("button", { name: "4" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-pressed", "false")
  })

  it("keeps the last valid estimate when the square-feet field is cleared", () => {
    render(<HomeValueEstimator />)
    pickLehiAndCalculate()
    const before = saleRange()
    expect(before).toMatch(/\$/)
    const input = screen.getByRole("spinbutton")
    fireEvent.change(input, { target: { value: "" } })
    expect(saleRange()).toBe(before)
    fireEvent.change(input, { target: { value: "12" } })
    expect(saleRange()).toBe(before)
    fireEvent.blur(input)
    expect(input).toHaveValue(1800)
  })

  it("caps very large square footage at 10,000", () => {
    render(<HomeValueEstimator />)
    pickLehiAndCalculate()
    const input = screen.getByRole("spinbutton")
    fireEvent.change(input, { target: { value: "10000" } })
    const atMax = saleRange()
    fireEvent.change(input, { target: { value: "99999" } })
    expect(saleRange()).toBe(atMax)
    fireEvent.blur(input)
    expect(input).toHaveValue(10000)
  })

  async function submitLead(intentLabel?: string) {
    render(<HomeValueEstimator />)
    pickLehiAndCalculate()
    if (intentLabel) fireEvent.click(screen.getByRole("button", { name: intentLabel }))
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "a@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /send me the report/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    return submitContactLead.mock.calls[0][0] as { inquiryType: string; message: string }
  }

  it("routes sellers as seller leads by default", async () => {
    const lead = await submitLead()
    expect(lead.inquiryType).toBe("seller")
    expect(lead.message).toContain("Looking to: sell the property")
  })

  it("routes rental owners as owner leads", async () => {
    const lead = await submitLead("Renting it out")
    expect(lead.inquiryType).toBe("owner")
    expect(lead.message).toContain("Looking to: rent out the property")
  })

  it("promises a follow-up, not an emailed report, after submitting", async () => {
    await submitLead()
    expect(await screen.findByText(/we got your request/i)).toBeInTheDocument()
    expect(screen.queryByText(/check your inbox/i)).toBeNull()
  })
})
