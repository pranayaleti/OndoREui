import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageBanner } from "./page-banner"

describe("PageBanner", () => {
  it("sets the title and subtitle in white on a theme-independent scrim", () => {
    const { container } = render(<PageBanner title="Sell your home" subtitle="A plain plan" backgroundImage="/hero.webp" />)
    expect(screen.getByRole("heading", { level: 1, name: "Sell your home" })).toHaveClass("text-white")
    expect(screen.getByText("A plain plan")).toHaveClass("text-white")
    expect(container.querySelector(".bg-black\\/60")).not.toBeNull()
    // No theme tokens behind the text: the scrim cannot turn light when the page theme does.
    expect(container.innerHTML).not.toMatch(/from-background|to-foreground|text-foreground/)
  })

  it("renders the photo as decorative, without repeating the title in its alt text", () => {
    const { container } = render(<PageBanner title="Sell your home" subtitle="A plain plan" backgroundImage="/hero.webp" />)
    const img = container.querySelector("img")!
    expect(img).toHaveAttribute("alt", "")
    expect(img).not.toHaveAttribute("aria-label")
    expect(img).not.toHaveAttribute("title")
  })

  it("renders no buttons when no call to action is given", () => {
    render(<PageBanner title="Sell your home" subtitle="A plain plan" />)
    expect(screen.queryByRole("link")).toBeNull()
  })

  it("renders primary and secondary calls to action with click tracking", () => {
    render(
      <PageBanner
        title="Sell your home"
        subtitle="A plain plan"
        primaryCta={{ label: "Get my home value", href: "/whats-my-home-worth/", event: "page_banner_home_value", analyticsLabel: "sell" }}
        secondaryCta={{ label: "Request listing packet", href: "#listing-packet-heading" }}
      />,
    )
    const primary = screen.getByRole("link", { name: "Get my home value" })
    expect(primary).toHaveAttribute("href", "/whats-my-home-worth/")
    expect(primary).toHaveAttribute("data-analytics-event", "page_banner_home_value")
    expect(primary).toHaveAttribute("data-analytics-category", "page_banner")
    expect(primary).toHaveAttribute("data-analytics-label", "sell")

    const secondary = screen.getByRole("link", { name: "Request listing packet" })
    expect(secondary).toHaveAttribute("href", "#listing-packet-heading")
    expect(secondary).toHaveAttribute("data-analytics-event", "page_banner_cta")
    expect(secondary).toHaveAttribute("data-analytics-label", "secondary:#listing-packet-heading")
  })

  it("supports a tel: link as a call to action", () => {
    render(<PageBanner title="T" subtitle="S" primaryCta={{ label: "Call us", href: "tel:+14085380420" }} />)
    expect(screen.getByRole("link", { name: "Call us" })).toHaveAttribute("href", "tel:+14085380420")
  })
})
