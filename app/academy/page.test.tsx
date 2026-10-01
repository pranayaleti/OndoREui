import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/contact/calendly-inline-embed", () => ({ CalendlyBookSection: () => null }))

import AcademyPage, { metadata } from "./page"

describe("/academy", () => {
  it("does not promise videos that the video library does not have", () => {
    const { container } = render(<AcademyPage />)
    expect(screen.queryByRole("link", { name: /watch videos/i })).toBeNull()
    expect(screen.getByRole("link", { name: /open learning guides/i })).toHaveAttribute("href", expect.stringMatching(/^\/video-library\/?$/))
    expect(String(metadata.description)).not.toMatch(/videos/i)
    expect(container.textContent).not.toMatch(/templates, calculators, videos/i)
  })
})
