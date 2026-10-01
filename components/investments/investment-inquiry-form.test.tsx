import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { InvestmentInquiryForm } from "./investment-inquiry-form"
import { backendUrl } from "@/lib/backend"

afterEach(() => {
  vi.unstubAllGlobals()
})

function submit() {
  fireEvent.change(screen.getByLabelText("First Name *"), { target: { value: "Jane" } })
  fireEvent.change(screen.getByLabelText("Last Name *"), { target: { value: "Doe" } })
  fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "jane@example.com" } })
  fireEvent.submit(screen.getByLabelText("Email *").closest("form")!)
}

describe("InvestmentInquiryForm", () => {
  it("posts to /api/leads/contact with the investment named in the message, not a placeholder property", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<InvestmentInquiryForm investmentTitle="Sample duplex" />)

    submit()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(backendUrl("/api/leads/contact"))
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({ name: "Jane Doe", email: "jane@example.com", source: "website", inquiryType: "other" })
    expect(body.message).toContain("Investment inquiry: Sample duplex")
    for (const key of ["publicId", "tenantPhone", "monthlyBudget"]) expect(body).not.toHaveProperty(key)
    expect(await screen.findByText("Inquiry submitted!")).toBeInTheDocument()
  })

  it("shows the phone fallback when the API rejects the lead", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Validation failed" }) }))
    render(<InvestmentInquiryForm investmentTitle="Sample duplex" />)

    submit()

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByText("Inquiry submitted!")).not.toBeInTheDocument()
  })
})
