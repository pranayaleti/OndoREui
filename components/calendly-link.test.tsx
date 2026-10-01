import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { CalendlyLink } from "@/components/calendly-link"
import { SITE_CALENDLY_URL } from "@/lib/site"

describe("CalendlyLink", () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState({}, "", "/links/")
  })
  afterEach(() => {
    localStorage.clear()
    window.history.replaceState({}, "", "/")
  })

  it("keeps the plain Calendly link, opened safely in a new tab, when there is no campaign", () => {
    render(<CalendlyLink contentLabel="links_page">Book</CalendlyLink>)
    const link = screen.getByRole("link", { name: "Book" })
    expect(link).toHaveAttribute("href", SITE_CALENDLY_URL)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("adds the page campaign to the booking link", () => {
    window.history.replaceState({}, "", "/links/?utm_source=instagram&utm_medium=bio")
    render(<CalendlyLink contentLabel="links_page">Book</CalendlyLink>)
    const url = new URL(screen.getByRole("link", { name: "Book" }).getAttribute("href")!)
    expect(url.searchParams.get("utm_source")).toBe("instagram")
    expect(url.searchParams.get("utm_medium")).toBe("bio")
    expect(url.searchParams.get("utm_content")).toBe("links_page")
  })

  it("refreshes the campaign at click time and still calls the caller's onClick", () => {
    let clicked = false
    render(
      <CalendlyLink contentLabel="quiz" onClick={(e) => { e.preventDefault(); clicked = true }}>
        Book
      </CalendlyLink>,
    )
    window.history.replaceState({}, "", "/quiz/?utm_source=qr&utm_medium=print")
    const link = screen.getByRole("link", { name: "Book" })
    fireEvent.click(link)
    expect(clicked).toBe(true)
    expect(new URL(link.getAttribute("href")!).searchParams.get("utm_source")).toBe("qr")
  })
})
