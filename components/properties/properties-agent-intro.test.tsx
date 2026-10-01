import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PropertiesAgentIntro } from "./properties-agent-intro"

describe("PropertiesAgentIntro", () => {
  it("describes the real apply flow, not an invitation-only process", () => {
    const { container } = render(<PropertiesAgentIntro />)
    const text = container.textContent ?? ""
    expect(text).toContain("Apply from a listing page when applications are open")
    expect(text).not.toMatch(/invitation/i)
    expect(screen.getByRole("link", { name: /info@/i })).toBeTruthy()
  })
})
