import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))

import { ZipServiceSelector } from "./zip-service-selector"

// Uses the real RateLimiter (the sibling test replaces it), so this lives in its own file and
// module instance: the limiter is module-level state shared by every render.
describe("ZipServiceSelector rate limit", () => {
  it("stops lookups after five attempts and says so in the error alert", () => {
    render(<ZipServiceSelector />)
    const input = screen.getByPlaceholderText("Enter your ZIP code")
    const submit = () => fireEvent.click(screen.getByRole("button", { name: "Get Started" }))

    for (let attempt = 1; attempt <= 5; attempt++) {
      fireEvent.change(input, { target: { value: "00000" } })
      submit()
      expect(screen.getByRole("alert")).toHaveTextContent("isn't in our service area")
    }

    fireEvent.change(input, { target: { value: "84043" } })
    submit()
    expect(screen.getByRole("alert")).toHaveTextContent("Too many attempts")
    // A valid ZIP was refused, not looked up: the visitor is still on the ZIP step.
    expect(screen.queryByText(/What can we help with in/)).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter your ZIP code")).toBeInTheDocument()
  })
})
