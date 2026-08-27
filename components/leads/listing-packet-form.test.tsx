import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import enCommon from "@/public/locales/en/common.json"
import { ListingPacketForm } from "./listing-packet-form"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ success: true, message: "ok", leadId: "1" })) }
})

vi.mock("react-i18next", () => {
  function translate(key: string): string {
    const path = key.split(".")
    let node: unknown = enCommon
    for (const segment of path) {
      if (node && typeof node === "object" && segment in (node as object)) {
        node = (node as Record<string, unknown>)[segment]
      } else {
        return key
      }
    }
    return typeof node === "string" ? node : key
  }
  return { useTranslation: () => ({ t: translate, i18n: {} }) }
})

import { submitContactLead } from "@/lib/leads-api"

describe("ListingPacketForm", () => {
  beforeEach(() => {
    vi.mocked(submitContactLead).mockClear()
  })

  afterEach(() => {
    vi.mocked(submitContactLead).mockClear()
  })

  it("requires contact info, address, and timing before submit", async () => {
    render(<ListingPacketForm />)
    fireEvent.click(screen.getByRole("button", { name: /request listing packet/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/name/i)
    expect(submitContactLead).not.toHaveBeenCalled()
  })

  it("submits as a seller lead with a listing-packet message, not a signup", async () => {
    render(<ListingPacketForm />)
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Alex Seller" } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "alex@example.com" } })
    fireEvent.change(screen.getByLabelText(/property address/i), {
      target: { value: "123 State St, Lehi, UT" },
    })
    fireEvent.change(screen.getByLabelText(/when are you thinking of listing/i), {
      target: { value: "1_to_3" },
    })
    fireEvent.click(screen.getByRole("button", { name: /request listing packet/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(
      expect.objectContaining({
        inquiryType: "seller",
        name: "Alex Seller",
        email: "alex@example.com",
        message: expect.stringContaining("Listing packet request"),
      }),
    )
    expect(await screen.findByRole("status")).toHaveTextContent(/invite-only/i)
  })
})
