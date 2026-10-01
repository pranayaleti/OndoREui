import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

const captureException = vi.fn()
vi.mock("@/lib/sentry", () => ({ captureException: (...a: unknown[]) => captureException(...a) }))

import ErrorPage from "./error"

describe("app/error.tsx", () => {
  beforeEach(() => {
    captureException.mockClear()
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("reports the error to Sentry and gtag", () => {
    const gtag = vi.fn()
    ;(window as { gtag?: typeof gtag }).gtag = gtag
    const err = Object.assign(new Error("boom"), { digest: "abc123" })
    render(<ErrorPage error={err} reset={() => {}} />)
    expect(captureException).toHaveBeenCalledWith(err, { digest: "abc123" })
    expect(gtag).toHaveBeenCalledWith("event", "exception", { description: "boom", fatal: true })
    delete (window as { gtag?: typeof gtag }).gtag
  })

  it("shows the error code only when a digest exists", () => {
    const { unmount } = render(<ErrorPage error={new Error("x")} reset={() => {}} />)
    expect(screen.queryByText(/Error code/)).not.toBeInTheDocument()
    unmount()
    render(<ErrorPage error={Object.assign(new Error("x"), { digest: "d1" })} reset={() => {}} />)
    expect(screen.getByText("Error code: d1")).toBeInTheDocument()
  })

  it("renders Return to Home as a single link and calls reset", () => {
    const reset = vi.fn()
    render(<ErrorPage error={new Error("x")} reset={reset} />)
    const home = screen.getByRole("link", { name: "Return to Home" })
    expect(home).toHaveAttribute("href", "/")
    expect(home.querySelector("button")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }))
    expect(reset).toHaveBeenCalled()
  })
})
