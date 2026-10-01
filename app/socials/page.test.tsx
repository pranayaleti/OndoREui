import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SocialsPage from "./page"

describe("/socials", () => {
  it("sends visitors to /links/ for every Ondo link", () => {
    render(<SocialsPage />)
    expect(screen.getByRole("link", { name: /see every ondo link/i })).toHaveAttribute("href", "/links/")
  })

  it("reports taps on each followed profile as social_click", () => {
    render(<SocialsPage />)
    const instagram = screen.getByRole("link", { name: /^instagram/i })
    expect(instagram).toHaveAttribute("data-analytics-event", "social_click")
    expect(instagram).toHaveAttribute("data-analytics-category", "socials_page")
    expect(instagram).toHaveAttribute("data-analytics-label", "instagram")
  })

  it("does not present Ondo site pages as social posts", () => {
    render(<SocialsPage />)
    expect(screen.queryByRole("link", { name: /view post/i })).toBeNull()
    expect(screen.queryByRole("heading", { name: /social posts/i })).toBeNull()
  })

  it("labels the news cards as outside sources without freshness claims", () => {
    const { container } = render(<SocialsPage />)
    expect(screen.getByRole("heading", { name: /news sources we follow/i })).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/updated (daily|weekly|monthly|regularly)/i)
  })
})
