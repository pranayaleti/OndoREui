import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { HowItWorksSection } from "./how-it-works-section"

describe("HowItWorksSection", () => {
  it("tells owners already with a manager the documented onboarding terms", () => {
    render(<HowItWorksSection />)
    expect(screen.getByText(/already working with another manager/i)).toBeInTheDocument()
    expect(screen.getByText(/48–72 hours/i)).toBeInTheDocument()
    expect(screen.getByText(/no setup fee/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /talk with the team/i })).toHaveAttribute("href", "/contact/")
  })
})
