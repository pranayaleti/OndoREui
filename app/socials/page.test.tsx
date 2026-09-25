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

  it("features the /links hub in the social posts grid", () => {
    render(<SocialsPage />)
    const posts = screen.getAllByRole("link", { name: /view post/i }).map((link) => link.getAttribute("href"))
    expect(posts).toContain("https://www.ondorealestate.com/links/")
  })
})
