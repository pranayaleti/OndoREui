import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityTeamSection } from "./city-team-section"

describe("CityTeamSection", () => {
  it("shows only the founder and a contact link, with no fictional staff", () => {
    const { container } = render(<CityTeamSection cityName="Lehi" />)
    expect(screen.getByRole("heading", { name: /Questions about Lehi\? Talk to the founder/i })).toBeInTheDocument()
    expect(screen.getByText("Pranay Reddy Aleti")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Contact Ondo/i }).getAttribute("href")).toBe("/contact/")
    expect(container.textContent).not.toMatch(/Marcus|Jennifer|Sarah Kim|David Patel|Mortgage Advisor|years experience/i)
    expect(container.querySelector("a[href^='mailto:']")).toBeNull()
    expect(container.querySelector("img")).toBeNull()
  })
})
