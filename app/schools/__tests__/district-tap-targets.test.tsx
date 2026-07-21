import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "../[district]/page"

describe("school district page tap targets", () => {
  it("the city-served link and website link meet the 44px minimum", async () => {
    render(await Page({ params: Promise.resolve({ district: "weber-school-district" }) }))
    const links = screen.getAllByRole("link")
    const cityLink = links.find((l) => l.className.includes("rounded-full"))
    expect(cityLink?.className).toMatch(/min-h-11/)
  })
})
