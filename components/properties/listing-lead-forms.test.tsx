import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ListingLeadForms } from "./listing-lead-forms"

vi.mock("@/lib/leads-api", () => ({
  submitContactLead: vi.fn(),
}))

vi.mock("@/lib/attribution", () => ({
  getAttributionPayloadForApi: () => undefined,
}))

vi.mock("@/lib/anti-spam", () => ({
  useAntiSpam: () => ({
    honeypotProps: {
      type: "text",
      name: "company_url",
      autoComplete: "off",
      tabIndex: -1,
      "aria-hidden": true,
      value: "",
      onChange: () => undefined,
      style: { display: "none" },
    },
    gate: { isLikelyBot: () => false, recordAttempt: () => undefined },
  }),
}))

import { submitContactLead } from "@/lib/leads-api"

const submit = vi.mocked(submitContactLead)

describe("ListingLeadForms", () => {
  beforeEach(() => {
    submit.mockReset()
  })

  it("sends a property-scoped information request to the live lead API", async () => {
    submit.mockResolvedValue({ success: true, message: "ok", leadId: "lead-1" })
    render(
      <ListingLeadForms
        title="Cedar Hollow"
        address="1 Main St, Lehi, UT"
        propertyId="f1557561-8b1e-4351-9054-3ebd5d2d4385"
      />,
    )

    expect(document.getElementById("listing-inquire")).toBeTruthy()
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("I'm interested in 1 Main St, Lehi, UT.")

    fireEvent.change(screen.getAllByLabelText(/^name$/i)[0]!, { target: { value: "Alex Rivera" } })
    fireEvent.change(screen.getAllByLabelText(/^email$/i)[0]!, { target: { value: "alex@example.com" } })
    const submitButtons = screen.getAllByRole("button", { name: /^request information$/i })
    fireEvent.click(submitButtons[submitButtons.length - 1]!)

    await waitFor(() => {
      expect(submit).toHaveBeenCalled()
    })
    const payload = submit.mock.calls[0]?.[0]
    expect(payload?.propertyId).toBe("f1557561-8b1e-4351-9054-3ebd5d2d4385")
    expect(payload?.inquiryType).toBe("renter")
    expect(payload?.message).toMatch(/Cedar Hollow/)
    expect(payload?.message).toMatch(/1 Main St/)
    expect(payload?.message).not.toMatch(/evaluating as an investor/i)
    expect(await screen.findByRole("status")).toHaveTextContent(/we received your request/i)
  })

  it("keeps the leasing funnel and records the investor evaluation checkbox on the same lead", async () => {
    submit.mockResolvedValue({ success: true, message: "ok", leadId: "lead-2" })
    render(
      <ListingLeadForms
        title="Cedar Hollow"
        address="1 Main St, Lehi, UT"
        propertyId="f1557561-8b1e-4351-9054-3ebd5d2d4385"
      />,
    )

    const investorBox = screen.getByRole("checkbox", { name: /i.m evaluating as an investor/i })
    fireEvent.click(investorBox)
    fireEvent.change(screen.getAllByLabelText(/^name$/i)[0]!, { target: { value: "Alex Rivera" } })
    fireEvent.change(screen.getAllByLabelText(/^email$/i)[0]!, { target: { value: "alex@example.com" } })
    const submitButtons = screen.getAllByRole("button", { name: /^request information$/i })
    fireEvent.click(submitButtons[submitButtons.length - 1]!)

    await waitFor(() => {
      expect(submit).toHaveBeenCalled()
    })
    const payload = submit.mock.calls[0]?.[0]
    expect(payload?.inquiryType).toBe("renter")
    expect(payload?.source).toBe("website")
    expect(payload?.message).toMatch(/I'm evaluating as an investor/)
    expect(payload?.message).not.toMatch(/high-yield|loan offer|you qualify|cap rate/i)
    expect(screen.queryByText(/high-yield|set it and forget it/i)).not.toBeInTheDocument()
  })
})
