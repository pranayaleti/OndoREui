import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { LeadCaptureModal } from "./lead-capture-modal"
import { hasLeadBeenCaptured } from "@/lib/api/leads"

// The anti-spam gate rejects a submit that arrives within 2.5s of mounting, so tests move the
// clock forward before sending, like a person who took a few seconds to type.
const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  localStorage.clear()
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
})

afterEach(() => {
  nowSpy.mockRestore()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function submit(email = "a@b.co") {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: email } })
  nowSpy.mockReturnValue(NOW_BASE + 3_000)
  fireEvent.click(screen.getByRole("button", { name: "Send my email" }))
}

describe("LeadCaptureModal", () => {
  it("promises a follow-up, not emailed results", () => {
    render(<LeadCaptureModal calculatorSlug="roi" calculatorName="ROI" hasCalculated />)
    expect(screen.getByText(/the Ondo team will follow up/i)).toBeInTheDocument()
    expect(screen.getByText(/we do not email the results/i)).toBeInTheDocument()
    expect(screen.queryByText(/email yourself/i)).not.toBeInTheDocument()
  })

  it("confirms and remembers the capture only after the lead is saved", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "1" }) }),
    )
    render(<LeadCaptureModal calculatorSlug="roi" calculatorName="ROI" hasCalculated />)

    submit()

    expect(await screen.findByRole("status")).toHaveTextContent("We will follow up by email")
    expect(hasLeadBeenCaptured()).toBe(true)
  })

  it("keeps the card, shows an error and does not mark the lead captured when saving fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ message: "Not found" }) }))
    render(<LeadCaptureModal calculatorSlug="roi" calculatorName="ROI" hasCalculated />)

    submit()

    expect(await screen.findByRole("alert")).toHaveTextContent(/did not go through/i)
    await waitFor(() => expect(screen.getByRole("button", { name: "Send my email" })).toBeEnabled())
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(hasLeadBeenCaptured()).toBe(false)
  })

  it("sends nothing and remembers nothing when a bot fills the honeypot or submits instantly", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    render(<LeadCaptureModal calculatorSlug="roi" calculatorName="ROI" hasCalculated />)

    // Instant submit: no time has passed since mount.
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "bot@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Send my email" }))

    expect(await screen.findByRole("status")).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(hasLeadBeenCaptured()).toBe(false)
  })

  it("still renders the card when the browser blocks storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    render(<LeadCaptureModal calculatorSlug="roi" calculatorName="ROI" hasCalculated />)
    expect(screen.getByLabelText("Email address")).toBeInTheDocument()
    expect(hasLeadBeenCaptured()).toBe(false)
  })
})
