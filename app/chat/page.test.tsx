import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("./chat-session-client", () => ({ default: () => null }))

import ChatPage from "./page"

describe("/chat page", () => {
  // The site defaults to dark: fixed neutral-900 text on the dark background measured 1.06:1.
  it("renders the heading and subtitle with theme tokens", () => {
    const { container } = render(<ChatPage />)
    expect(screen.getByRole("heading", { level: 1, name: "Your conversation" })).toHaveClass("text-foreground")
    expect(container.innerHTML).not.toMatch(/neutral-\d/)
  })
})
