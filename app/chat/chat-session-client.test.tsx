import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

let mockSession: string | null = null
vi.mock("next/navigation", () => ({ useSearchParams: () => ({ get: () => mockSession }) }))
vi.mock("@/components/LeasingChatWidget", () => ({ default: () => <div data-testid="chat-widget" /> }))

import ChatSessionClient from "./chat-session-client"
import { SITE_PHONE_TEL } from "@/lib/site"

describe("ChatSessionClient", () => {
  it("gives an expired or missing link a way to listings, contact and phone", () => {
    mockSession = "not-a-uuid"
    render(<ChatSessionClient />)
    expect(screen.getByRole("link", { name: /browse listings/i })).toHaveAttribute("href", "/properties/")
    expect(screen.getByRole("link", { name: /contact the team/i })).toHaveAttribute("href", "/contact/")
    expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute("href", `tel:${SITE_PHONE_TEL}`)
  })

  it("uses theme tokens, not fixed light-theme colors", () => {
    mockSession = null
    const { container } = render(<ChatSessionClient />)
    expect(container.innerHTML).not.toMatch(/neutral-\d/)
  })

  it("mounts the chat for a valid session id", () => {
    mockSession = "0b9f3a52-6a1e-4f6e-9c43-2b8d7f0a1c11"
    render(<ChatSessionClient />)
    expect(screen.getByTestId("chat-widget")).toBeInTheDocument()
  })
})
