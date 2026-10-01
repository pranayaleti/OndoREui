import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FoundersLetterPage from "./page"

describe("/founders-letter page", () => {
  it("renders one main landmark labelled by the h1 and no banner landmarks", () => {
    const { container } = render(<FoundersLetterPage />)
    const mains = screen.getAllByRole("main")
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAccessibleName("A Letter From the Founder")
    expect(container.querySelector("header")).toBeNull()
    expect(screen.queryByRole("banner")).toBeNull()
  })

  it("leaves the skip-link target id to the layout", () => {
    const { container } = render(<FoundersLetterPage />)
    expect(container.querySelector("#main-content")).toBeNull()
  })

  it("exposes the founder photo to screen readers", () => {
    render(<FoundersLetterPage />)
    const photo = screen.getByRole("img", { name: /Pranay Reddy Aleti/ })
    expect(photo.closest("[aria-hidden='true']")).toBeNull()
  })

  it("tints the stat cards instead of filling them solid orange", () => {
    const { container } = render(<FoundersLetterPage />)
    const cards = Array.from(container.querySelectorAll("div.bg-primary\\/20"))
    expect(cards).toHaveLength(4)
    expect(container.querySelector(".bg-opacity-20")).toBeNull()
  })
})
