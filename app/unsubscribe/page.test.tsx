import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import UnsubscribePage from "./page"
import { SITE_EMAILS, SITE_PHONE_TEL } from "@/lib/site"

describe("/unsubscribe", () => {
  it("never claims the visitor was removed", () => {
    const { container } = render(<UnsubscribePage />)
    expect(container.textContent).not.toMatch(/you.?ve been unsubscribed/i)
    expect(container.textContent).not.toMatch(/we.?ve removed/i)
    expect(container.querySelector("form")).toBeNull()
  })

  it("gives a prefilled mailto to the info address and a phone number", () => {
    render(<UnsubscribePage />)
    const mailLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("mailto:"))
    expect(mailLinks.length).toBeGreaterThan(0)
    for (const a of mailLinks) {
      const href = a.getAttribute("href")!
      expect(href.startsWith(`mailto:${SITE_EMAILS.info}?`)).toBe(true)
      expect(decodeURIComponent(href)).toMatch(/subject=Unsubscribe me/i)
    }
    const tel = screen.getAllByRole("link").filter((a) => a.getAttribute("href") === `tel:${SITE_PHONE_TEL}`)
    expect(tel.length).toBeGreaterThan(0)
  })
})
