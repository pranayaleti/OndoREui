import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import TourPage from "./page"

describe("Tour page", () => {
  it("replaces screenshot placeholders with product screens for each step", () => {
    render(<TourPage />)

    expect(screen.getByRole("heading", { name: /owner dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /tenant portal/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /ai assistant/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /vendor tools/i })).toBeInTheDocument()

    expect(screen.queryByText(/screenshot coming soon/i)).not.toBeInTheDocument()
    expect(screen.getAllByText(/sample product view/i).length).toBeGreaterThanOrEqual(4)
  })

  it("states that portal access is invitation-only", () => {
    render(<TourPage />)
    expect(screen.getByText(/invitation-only/i)).toBeInTheDocument()
  })

  it("links both CTAs to the demo page", () => {
    render(<TourPage />)
    const tryIt = screen.getByRole("link", { name: /try it yourself/i })
    const book = screen.getByRole("link", { name: /book a demo/i })
    expect(tryIt.getAttribute("href")).toMatch(/^\/demo/)
    expect(book.getAttribute("href")).toMatch(/^\/demo/)
  })
})
