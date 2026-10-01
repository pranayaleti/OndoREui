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
      name: "fax_alt_info",
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

  function openTourTab() {
    fireEvent.mouseDown(screen.getByRole("tab", { name: /schedule a tour/i }), { button: 0, ctrlKey: false })
  }

  it("sends the tour tab through the lead API with the property id, attribution and only name and email required", async () => {
    submit.mockResolvedValue({ success: true, message: "ok", leadId: "lead-2" })
    render(<ListingLeadForms title="Cedar Hollow" address="1 Main St, Lehi, UT" propertyId="prop-1" />)
    openTourTab()

    fireEvent.change(await screen.findByLabelText(/^name$/i), { target: { value: "Alex Rivera" } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "alex@example.com" } })
    fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: "2026-10-05" } })
    fireEvent.change(screen.getByLabelText(/preferred time/i), { target: { value: "2:00 PM" } })
    fireEvent.click(screen.getByRole("button", { name: /^schedule a tour$/i }))

    await waitFor(() => expect(submit).toHaveBeenCalled())
    const [payload, options] = submit.mock.calls[0] ?? []
    expect(options).toEqual({ formName: "listing_tour_request" })
    expect(payload).toMatchObject({
      name: "Alex Rivera",
      email: "alex@example.com",
      propertyId: "prop-1",
      inquiryType: "renter",
      source: "website",
    })
    expect(payload).toHaveProperty("attribution")
    expect(payload).not.toHaveProperty("phone")
    expect(payload?.message).toMatch(/Preferred date: 2026-10-05/)
    expect(payload?.message).toMatch(/Preferred time: 2:00 PM/)
    expect(await screen.findByRole("status")).toHaveTextContent(/tour request sent/i)
  })

  it("accepts a tour request with no phone and no preferred time", async () => {
    submit.mockResolvedValue({ success: true, message: "ok", leadId: "lead-3" })
    render(<ListingLeadForms title="Cedar Hollow" address="1 Main St" propertyId="prop-1" />)
    openTourTab()
    fireEvent.change(await screen.findByLabelText(/^name$/i), { target: { value: "Alex Rivera" } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "alex@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /^schedule a tour$/i }))
    await waitFor(() => expect(submit).toHaveBeenCalled())
    expect(submit.mock.calls[0]?.[0]?.message).not.toMatch(/Preferred (date|time)/)
  })

  it("asks for a time when only a date is chosen and shows a failed send", async () => {
    submit.mockResolvedValue({ error: "Tour service is down" } as never)
    render(<ListingLeadForms title="Cedar Hollow" address="1 Main St" propertyId="prop-1" />)
    openTourTab()
    fireEvent.change(await screen.findByLabelText(/^name$/i), { target: { value: "Alex Rivera" } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "alex@example.com" } })
    fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: "2026-10-05" } })
    fireEvent.click(screen.getByRole("button", { name: /^schedule a tour$/i }))
    expect(await screen.findByText(/choose a time, or clear the date/i)).toBeInTheDocument()
    expect(submit).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText(/preferred time/i), { target: { value: "9:00 AM" } })
    fireEvent.click(screen.getByRole("button", { name: /^schedule a tour$/i }))
    expect(await screen.findByText("Tour service is down")).toBeInTheDocument()
  })
})
