import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { OperatorsSection } from "./operators-section"

describe("OperatorsSection", () => {
  it("uses theme tokens for text so it stays readable on the light theme", () => {
    const { container } = render(<OperatorsSection />)
    const section = container.querySelector("section")!
    expect(section.className).toContain("text-foreground")
    expect(container.innerHTML).not.toMatch(/text-white|text-slate-/)
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
  })
})
