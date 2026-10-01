import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import InsightsPage from "./page"

describe("/insights", () => {
  it("links the Events card to /events/", () => {
    render(<InsightsPage />)
    expect(screen.getByRole("link", { name: /see events/i })).toHaveAttribute("href", "/events/")
  })

  it("does not offer reports or webinars that do not exist", () => {
    const { container } = render(<InsightsPage />)
    expect(container.textContent).not.toMatch(/webinar/i)
    expect(container.textContent).not.toMatch(/request a report/i)
  })
})
