import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { QualificationChat } from "./qualification-chat"
import { SITE_PHONE } from "@/lib/site"

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function reply(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })
}

function openChat() {
  fireEvent.click(screen.getByRole("button", { name: "Open qualification chat" }))
}

describe("QualificationChat", () => {
  it("shows the first question and never calls the retired capture-from-chat route", async () => {
    const fetchMock = reply(200, { reply: "Are you looking to buy, rent, or invest?", completed: false })
    vi.stubGlobal("fetch", fetchMock)
    render(<QualificationChat sessionToken="tok" leadType="website" />)

    openChat()

    expect(await screen.findByText("Are you looking to buy, rent, or invest?")).toBeInTheDocument()
    expect(screen.queryByText(/we.ll be in touch/i)).not.toBeInTheDocument()
    expect(fetchMock.mock.calls.map(([url]) => String(url)).some((url) => url.includes("capture-from-chat"))).toBe(false)
  })

  it("does not claim the chat is done when the request fails with a plain 404", async () => {
    vi.stubGlobal("fetch", reply(404, {}))
    render(<QualificationChat sessionToken="tok" leadType="website" />)

    openChat()

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent(SITE_PHONE)
    expect(screen.queryByText(/we.ll be in touch/i)).not.toBeInTheDocument()
    // The visitor can still type and try again.
    expect(screen.getByPlaceholderText("Type your answer...")).toBeInTheDocument()
  })

  it("thanks the visitor when the API says the session is already completed", async () => {
    vi.stubGlobal("fetch", reply(400, { error: "Session already completed" }))
    render(<QualificationChat sessionToken="tok" leadType="website" />)

    openChat()

    expect(await screen.findByText(/we.ll be in touch within 24 hours/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByPlaceholderText("Type your answer...")).not.toBeInTheDocument())
  })

  it("tells the visitor the link expired when the API says so", async () => {
    vi.stubGlobal("fetch", reply(404, { error: "Session expired" }))
    render(<QualificationChat sessionToken="tok" leadType="website" />)

    openChat()

    expect(await screen.findByText(/this link has expired/i)).toBeInTheDocument()
    expect(screen.queryByText(/we.ll be in touch/i)).not.toBeInTheDocument()
  })

  it("thanks the visitor when the final answer completes the chat", async () => {
    vi.stubGlobal("fetch", reply(200, { reply: "All set.", completed: true, temperature: "WARM" }))
    render(<QualificationChat sessionToken="tok" leadType="website" />)

    openChat()

    expect(await screen.findByText("All set.")).toBeInTheDocument()
    expect(screen.getByText(/we.ll be in touch within 24 hours/i)).toBeInTheDocument()
  })
})
