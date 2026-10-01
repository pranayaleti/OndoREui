import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { DemoForm } from "./demo-form"
import { BACKEND_BASE_URL, backendUrl } from "@/lib/backend"
import { analytics } from "@/lib/analytics"

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

// The anti-spam gate rejects a submit within 2.5s of mounting; fillAndSubmit moves the clock on.
const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({ success: true }),
    }),
  )
})

afterEach(() => {
  nowSpy.mockRestore()
  vi.unstubAllGlobals()
})

function fillAndSubmit(phone = "") {
  fireEvent.change(screen.getByLabelText("demo.form.firstNameLabel"), { target: { value: "Jane" } })
  fireEvent.change(screen.getByLabelText("demo.form.lastNameLabel"), { target: { value: "Smith" } })
  fireEvent.change(screen.getByLabelText("demo.form.emailLabel"), { target: { value: "jane@example.com" } })
  if (phone) fireEvent.change(screen.getByLabelText("demo.form.phoneLabel"), { target: { value: phone } })
  nowSpy.mockReturnValue(NOW_BASE + 3_000)
  fireEvent.click(screen.getByRole("button", { name: "demo.form.submit" }))
}

describe("DemoForm", () => {
  it("posts to the backend base URL, not a NEXT_PUBLIC_BACKEND_URL that is undefined in production", async () => {
    render(<DemoForm />)
    fillAndSubmit()

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe(backendUrl("/api/leads/contact"))
    expect(String(url).startsWith(BACKEND_BASE_URL)).toBe(true)
    expect(String(url)).not.toContain("undefined")
    expect(init?.method).toBe("POST")
  })

  it("sends a source and inquiryType the API accepts, with the demo details in the message", async () => {
    render(<DemoForm />)
    fillAndSubmit("(801) 555-0100")

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body))
    expect(body).toMatchObject({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(801) 555-0100",
      source: "website",
      inquiryType: "owner",
    })
    expect(body.message).toContain("Request: Guided demo")
    expect(body.message).toContain("Role: Owner")
    expect(await screen.findByText("demo.form.success")).toBeInTheDocument()
  })

  it("shows the error with the email fallback when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500, headers: new Headers() } as Response)
    render(<DemoForm />)
    fillAndSubmit()

    expect(await screen.findByRole("alert")).toHaveTextContent("demo.form.error")
  })

  it("sends nothing when a bot fills the hidden field, and shows success so it learns nothing", async () => {
    const { container } = render(<DemoForm />)
    fireEvent.change(container.querySelector('input[name="fax_alt"]')!, { target: { value: "spam" } })
    fillAndSubmit()
    expect(await screen.findByText("demo.form.success")).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it("fires one lead conversion when the demo request is saved", async () => {
    const lead = vi.spyOn(analytics, "trackLeadGeneration").mockImplementation(() => {})
    const form = vi.spyOn(analytics, "trackFormSubmission").mockImplementation(() => {})
    render(<DemoForm />)
    fillAndSubmit()
    expect(await screen.findByText("demo.form.success")).toBeInTheDocument()
    expect(lead).toHaveBeenCalledTimes(1)
    expect(lead).toHaveBeenCalledWith("demo_request")
    expect(form).toHaveBeenCalledWith("demo_request", true)
    lead.mockRestore()
    form.mockRestore()
  })

  it("fires a failed submit event and no conversion when the request fails", async () => {
    const lead = vi.spyOn(analytics, "trackLeadGeneration").mockImplementation(() => {})
    const form = vi.spyOn(analytics, "trackFormSubmission").mockImplementation(() => {})
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500, headers: new Headers() } as Response)
    render(<DemoForm />)
    fillAndSubmit()
    expect(await screen.findByRole("alert")).toHaveTextContent("demo.form.error")
    expect(lead).not.toHaveBeenCalled()
    expect(form).toHaveBeenCalledWith("demo_request", false)
    lead.mockRestore()
    form.mockRestore()
  })
})
