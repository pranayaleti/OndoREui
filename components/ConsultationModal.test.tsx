import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import ConsultationModal from "./ConsultationModal"
import { backendUrl } from "@/lib/backend"
import { SITE_PHONE } from "@/lib/site"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => (opts?.phone ? `${key} ${String(opts.phone)}` : key),
  }),
}))

const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
})

afterEach(() => {
  nowSpy.mockRestore()
  vi.unstubAllGlobals()
})

function fillAndSubmit(phone = "") {
  nowSpy.mockReturnValue(NOW_BASE + 3_000)
  fireEvent.change(screen.getByLabelText("consultationModal.fields.name"), { target: { value: "Jane Doe" } })
  fireEvent.change(screen.getByLabelText("consultationModal.fields.email"), { target: { value: "Jane@Example.com" } })
  if (phone) fireEvent.change(screen.getByLabelText("consultationModal.fields.phone"), { target: { value: phone } })
  fireEvent.change(screen.getByLabelText("consultationModal.fields.messageNotary"), {
    target: { value: "Loan signing for two people." },
  })
  fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))
}

describe("ConsultationModal submit", () => {
  it("posts a notary request to /api/leads/contact, not the rental-inquiry endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(backendUrl("/api/leads/contact"))
    expect(String(url)).not.toContain("/leads/submit")
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "Jane@Example.com",
      source: "website",
      inquiryType: "other",
    })
    expect(body.message).toContain("Request: Notary booking request")
    expect(body.message).toContain("Loan signing for two people.")
    // No placeholder property or fake tenant fields.
    for (const key of ["publicId", "tenantPhone", "tenantName", "monthlyBudget", "moveInDate"]) {
      expect(body).not.toHaveProperty(key)
    }
    // Phone is optional: a blank phone is omitted rather than sent as "".
    expect(body).not.toHaveProperty("phone")
    expect(await screen.findByText("consultationModal.successTitle")).toBeInTheDocument()
  })

  it("sends the phone when one is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit("(801) 555-0100")

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    expect(JSON.parse(String(fetchMock.mock.calls[0][1].body)).phone).toBe("(801) 555-0100")
  })

  it("shows the error with the phone number when the API rejects the lead", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Validation failed" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit()

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent(`consultationModal.errorMessage ${SITE_PHONE}`)
    expect(screen.queryByText("consultationModal.successTitle")).not.toBeInTheDocument()
  })
})
