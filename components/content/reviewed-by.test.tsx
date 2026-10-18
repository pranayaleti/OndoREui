import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ReviewedBy } from "./reviewed-by"

describe("ReviewedBy", () => {
  it("credits the founder as reviewer with a profile link and the review date", () => {
    render(<ReviewedBy date="2026-03-04" />)
    expect(screen.getByRole("link", { name: "Pranay Reddy Aleti" })).toHaveAttribute("href", "/about/team/pranay-reddy-aleti/")
    expect(screen.getByText(/reviewed by/i)).toBeInTheDocument()
    expect(screen.getByText("March 4, 2026")).toHaveAttribute("dateTime", "2026-03-04")
    expect(document.body.textContent).not.toMatch(/written by/i)
  })
})
