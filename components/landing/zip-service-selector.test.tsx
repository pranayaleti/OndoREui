import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

const push = vi.fn()
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))

// The limiter is module-level state (5 lookups per 30s) and would trip across tests.
vi.mock("@/lib/security", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/security")>()
  class AllowAll {
    isAllowed() {
      return true
    }
  }
  return { ...actual, RateLimiter: AllowAll }
})

import { ZipServiceSelector } from "./zip-service-selector"

function submitZip(zip: string) {
  fireEvent.change(screen.getByPlaceholderText("Enter your ZIP code"), { target: { value: zip } })
  fireEvent.click(screen.getByRole("button", { name: "Get Started" }))
}

describe("ZipServiceSelector", () => {
  beforeEach(() => {
    push.mockClear()
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it("goes straight to services for a ZIP that belongs to one city", () => {
    render(<ZipServiceSelector />)
    submitZip("84043")
    expect(screen.getByText("Lehi")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Home Loans"))
    expect(push).toHaveBeenCalledWith("/loans/lehi/")
  })

  it("asks which city when a ZIP is shared, so West Point is not sent to Clinton", () => {
    render(<ZipServiceSelector />)
    submitZip("84015")
    expect(screen.getByText(/covers more than one city/)).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: /West Point/ }))
    expect(screen.getByText(/What can we help with in/)).toHaveTextContent("West Point")
    fireEvent.click(screen.getByText("Property Management"))
    expect(push).toHaveBeenCalledWith("/property-management/west-point/")
  })

  it("lists both cities for 84070 and lets the visitor go back to the ZIP", () => {
    render(<ZipServiceSelector />)
    submitZip("84070")
    expect(screen.getByRole("button", { name: /Midvale/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Sandy/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Change ZIP code" }))
    expect(screen.getByPlaceholderText("Enter your ZIP code")).toBeInTheDocument()
  })

  it("still routes when sessionStorage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<ZipServiceSelector />)
    submitZip("84043")
    expect(screen.getByText("Lehi")).toBeInTheDocument()
  })

  it("moves focus to the new heading when the step changes", () => {
    render(<ZipServiceSelector />)
    submitZip("84043")
    expect(screen.getByText(/What can we help with in/)).toHaveFocus()
  })

  it("shows the error in flow under the input and marks the input invalid", () => {
    render(<ZipServiceSelector />)
    submitZip("00000")
    const input = screen.getByPlaceholderText("Enter your ZIP code")
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("isn't in our service area")
    expect(alert.className).not.toMatch(/absolute/)
    expect(alert.className).toMatch(/w-full/)
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", alert.id)
    expect(input.closest("form")?.className).toMatch(/flex-wrap/)
  })
})
