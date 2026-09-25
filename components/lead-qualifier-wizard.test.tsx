import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { LeadQualifierWizard } from "./lead-qualifier-wizard"

function choose(name: string) {
  fireEvent.click(screen.getByRole("radio", { name }))
}

function enterCity(city: string) {
  fireEvent.change(screen.getByLabelText(/city or zip/i), { target: { value: city } })
  fireEvent.click(screen.getByRole("button", { name: /next/i }))
}

function fillContactAndSend() {
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Ada Lovelace" } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "ada@example.com" } })
  fireEvent.click(screen.getByRole("checkbox", { name: /text me/i }))
  fireEvent.click(screen.getByRole("button", { name: /get my match/i }))
}

describe("LeadQualifierWizard", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })

  it("skips the rental-units question for buyers", () => {
    render(<LeadQualifierWizard />)
    choose("Buy a home")
    expect(screen.getByLabelText(/city or zip/i)).toBeInTheDocument()
    expect(screen.queryByRole("radio", { name: "2 to 4" })).not.toBeInTheDocument()
  })

  it("asks rental owners how many units they have", () => {
    render(<LeadQualifierWizard />)
    choose("Manage my rental property")
    expect(screen.getByRole("heading", { name: /how many rental units/i })).toBeInTheDocument()
  })

  it("sends the full qualification trail with the lead", async () => {
    render(<LeadQualifierWizard />)
    choose("Manage my rental property")
    choose("2 to 4")
    enterCity("Lehi")
    choose("This week")
    fillContactAndSend()

    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const payload = submitContactLead.mock.calls[0]![0]
    expect(payload).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", inquiryType: "owner" })
    expect(payload.message).toContain("classification: HOT")
    expect(payload.message).toContain("Role: owner")
    expect(payload.message).toContain("Intent: manage_rental")
    expect(payload.message).toContain("Location: Lehi")
    expect(payload.message).toContain("Units: 2 to 4")
    expect(payload.message).toContain("Urgency: now")
    expect(payload.message).toContain("OK to text: Yes")
  })

  it("offers a rental owner who is ready now a call right away", async () => {
    render(<LeadQualifierWizard />)
    choose("Manage my rental property")
    choose("1")
    enterCity("Provo")
    choose("Within 30 days")
    fillContactAndSend()
    expect(await screen.findByRole("link", { name: /book a 30-minute call/i })).toBeInTheDocument()
  })

  it("points a buyer to the affordability quiz, not landlord tools, after sending", async () => {
    render(<LeadQualifierWizard />)
    choose("Buy a home")
    enterCity("Sandy")
    choose("Just exploring")
    fillContactAndSend()
    const next = await screen.findByRole("link", { name: /how much home you can afford/i })
    expect(next).toHaveAttribute("href", "/buy/quiz/")
    expect(screen.queryByRole("link", { name: /self-manage/i })).not.toBeInTheDocument()
  })

  it("keeps an earlier answer when the visitor goes back", () => {
    render(<LeadQualifierWizard />)
    choose("Sell a home")
    fireEvent.click(screen.getByRole("button", { name: /back/i }))
    expect(screen.getByRole("radio", { name: "Sell a home" })).toHaveAttribute("aria-checked", "true")
  })
})
