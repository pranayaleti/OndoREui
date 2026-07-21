import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "../[district]/page"

describe("school district page tap targets", () => {
  it("both the website link and every city-served link independently meet the 44px minimum", async () => {
    render(await Page({ params: Promise.resolve({ district: "weber-school-district" }) }))
    const pillLinks = screen.getAllByRole("link").filter((l) => l.className.includes("rounded-full"))

    // The external "Official Website" link and the internal city-served
    // links both use rounded-full pills but are distinguishable by target
    // vs. href — assert on each kind separately so a regression in either
    // one (not just whichever Array.find() happens to return first) fails.
    const websiteLink = pillLinks.find((l) => l.getAttribute("target") === "_blank")
    const cityLinks = pillLinks.filter((l) => l.getAttribute("href")?.startsWith("/locations/"))

    expect(websiteLink).toBeDefined()
    expect(websiteLink?.className).toMatch(/min-h-11/)

    expect(cityLinks.length).toBeGreaterThan(0)
    cityLinks.forEach((l) => expect(l.className).toMatch(/min-h-11/))
  })
})
