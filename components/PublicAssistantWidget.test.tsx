/**
 * The public assistant is the only chat surface an anonymous visitor meets on most of the
 * site, so these cover the two things that break quietly: the accessibility contract (a
 * housing site with an unreachable widget is an ADA problem, not a polish problem) and the
 * handoff states, which are the only signal a visitor gets that a human is now involved.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import PublicAssistantWidget from "./PublicAssistantWidget"

let mockPathname = "/property-management/"
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

vi.mock("@/lib/api/public-assistant", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/public-assistant")>(
    "@/lib/api/public-assistant",
  )
  return { ...actual, sendPublicAssistantMessage: vi.fn() }
})

import { sendPublicAssistantMessage } from "@/lib/api/public-assistant"

const mockSend = vi.mocked(sendPublicAssistantMessage)

const okReply = (
  over: Partial<{ reply: string | null; escalated: boolean; leadCaptured: boolean }> = {},
) =>
  ({
    ok: true as const,
    data: {
      reply: "Our management plans start at 8% of collected rent.",
      escalated: false,
      leadCaptured: false,
      ...over,
    },
  })

function openWidget() {
  render(<PublicAssistantWidget />)
  fireEvent.click(screen.getByRole("button", { name: /open the ondo assistant/i }))
}

function type(value: string) {
  fireEvent.change(screen.getByLabelText(/your message to the ondo assistant/i), {
    target: { value },
  })
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /send message/i }))
}

beforeEach(() => {
  mockPathname = "/property-management/"
  mockSend.mockReset()
  mockSend.mockResolvedValue(okReply())
})

describe("PublicAssistantWidget", () => {
  it("gives the launcher an accessible name that says what it does", () => {
    render(<PublicAssistantWidget />)
    expect(
      screen.getByRole("button", {
        name: /open the ondo assistant to ask about property management/i,
      }),
    ).toBeInTheDocument()
  })

  it("moves focus into the input when opened", async () => {
    openWidget()
    await waitFor(() =>
      expect(screen.getByLabelText(/your message to the ondo assistant/i)).toHaveFocus(),
    )
  })

  it("exposes the transcript as a live region so replies are announced", () => {
    openWidget()
    expect(screen.getByRole("log", { name: /conversation transcript/i })).toHaveAttribute(
      "aria-live",
      "polite",
    )
  })

  it("sends a suggested question without the visitor typing", async () => {
    openWidget()
    fireEvent.click(screen.getByRole("button", { name: /what do you charge to manage a rental\?/i }))

    await waitFor(() => expect(mockSend).toHaveBeenCalledTimes(1))
    expect(mockSend.mock.calls[0][0].messages).toEqual([
      { role: "user", content: "What do you charge to manage a rental?" },
    ])
    expect(await screen.findByText(/8% of collected rent/i)).toBeInTheDocument()
  })

  it("passes the current path so leads can be attributed to the page that produced them", async () => {
    mockPathname = "/locations/provo/"
    openWidget()
    type("Do you cover Provo?")
    submit()

    await waitFor(() => expect(mockSend).toHaveBeenCalled())
    expect(mockSend.mock.calls[0][0].sourcePath).toBe("/locations/provo/")
  })

  it("tells the visitor a person is taking over, and stops accepting messages", async () => {
    mockSend.mockResolvedValue(okReply({ reply: null, escalated: true }))
    openWidget()
    type("I want to dispute a fee")
    submit()

    expect(await screen.findByText(/picking this up and will be in touch/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your message to the ondo assistant/i)).toBeDisabled()
  })

  it("confirms when contact details were saved", async () => {
    mockSend.mockResolvedValue(okReply({ reply: "Got it.", leadCaptured: true }))
    openWidget()
    type("I'm Dana, dana@example.com")
    submit()

    expect(await screen.findByText(/your details are with the team/i)).toBeInTheDocument()
  })

  it("surfaces a rate limit as an alert rather than a silent failure", async () => {
    mockSend.mockResolvedValue({
      ok: false,
      rateLimited: true,
      error: "That was a lot of messages at once, give it a moment and try again.",
    })
    openWidget()
    type("hello")
    submit()

    expect(await screen.findByRole("alert")).toHaveTextContent(/give it a moment/i)
  })

  it("stays out of the way on routes that run their own assistant", () => {
    mockPathname = "/chat/"
    const { container } = render(<PublicAssistantWidget />)
    expect(container).toBeEmptyDOMElement()
  })

  it("cannot send an empty or whitespace-only message", () => {
    openWidget()
    type("   ")
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled()
    expect(mockSend).not.toHaveBeenCalled()
  })

  it("trims the transcript it sends so a long session degrades instead of erroring", async () => {
    openWidget()
    // 20 turns in: the server rejects more than 20 messages, so the client must cap first.
    for (let i = 0; i < 12; i++) {
      type(`question ${i}`)
      submit()
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => expect(mockSend).toHaveBeenCalledTimes(i + 1))
    }
    const lastPayload = mockSend.mock.calls[mockSend.mock.calls.length - 1][0].messages
    expect(lastPayload.length).toBeLessThanOrEqual(18)
  })
})
