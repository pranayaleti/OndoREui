import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import LeasingChatWidget from "./LeasingChatWidget"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

const SESSION = "11111111-2222-3333-4444-555555555555"

describe("LeasingChatWidget resume mode", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads the session from the /api path", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { messages: [{ role: "prospect", content: "Hello there", sentAt: "" }] } }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<LeasingChatWidget propertyId="" initialSessionId={SESSION} inline />)
    expect(await screen.findByText("Hello there")).toBeInTheDocument()
    expect(String(fetchMock.mock.calls[0]![0])).toContain(`/api/leasing-agent/sessions/${SESSION}`)
    expect(screen.getByLabelText(/your message to the leasing assistant/i)).toBeInTheDocument()
    expect(screen.getByText(/not legal, tax or lending advice, or a rate quote/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy-policy/")
    expect(screen.queryByText(/take over anytime/i)).not.toBeInTheDocument()
  })

  it("offers contact options instead of the message box when the conversation is not found", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    render(<LeasingChatWidget propertyId="" initialSessionId={SESSION} inline />)
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not find that conversation/i)
    expect(screen.queryByText(/start a new one below/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/your message to the leasing assistant/i)).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /browse listings/i })).toHaveAttribute("href", "/properties/")
    expect(screen.getByRole("link", { name: /contact the team/i })).toHaveAttribute("href", "/contact/")
    expect(screen.getByRole("link", { name: /^call/i }).getAttribute("href")).toMatch(/^tel:/)
    expect(screen.getByRole("link", { name: /text us/i }).getAttribute("href")).toMatch(/^sms:/)
  })

  it("offers the same options when the request itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")))
    render(<LeasingChatWidget propertyId="" initialSessionId={SESSION} inline />)
    await waitFor(() => expect(screen.getByRole("link", { name: /contact the team/i })).toBeInTheDocument())
    expect(screen.queryByLabelText(/your message to the leasing assistant/i)).not.toBeInTheDocument()
  })
})

describe("LeasingChatWidget focus management", () => {
  it("moves focus into the input on open and back to the launcher on Escape", async () => {
    render(<LeasingChatWidget propertyId="p1" />)
    const launcher = screen.getByRole("button", { name: /open the leasing assistant/i })
    fireEvent.click(launcher)
    expect(screen.getByLabelText(/your message to the leasing assistant/i)).toHaveFocus()

    fireEvent.keyDown(window, { key: "Escape" })
    const relaunched = await screen.findByRole("button", { name: /open the leasing assistant/i })
    expect(relaunched).toHaveFocus()
  })

  it("moves focus back to the launcher when the close button is used", async () => {
    render(<LeasingChatWidget propertyId="p1" />)
    fireEvent.click(screen.getByRole("button", { name: /open the leasing assistant/i }))
    fireEvent.click(screen.getByRole("button", { name: /close the leasing assistant/i }))
    const relaunched = await screen.findByRole("button", { name: /open the leasing assistant/i })
    expect(relaunched).toHaveFocus()
  })
})
