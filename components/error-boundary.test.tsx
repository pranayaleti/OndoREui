import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ErrorBoundary from "./error-boundary"

let mockPathname: string | null = "/a/"
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname }))

const Throw = () => {
  throw new Error("test error")
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <span>Child</span>
      </ErrorBoundary>
    )
    expect(screen.getByText("Child")).toBeInTheDocument()
  })
  it("renders fallback when child throws", () => {
    render(
      <ErrorBoundary
        fallback={({ resetError }) => (
          <div>
            <span>Fallback</span>
            <button onClick={resetError}>Reset</button>
          </div>
        )}
      >
        <Throw />
      </ErrorBoundary>
    )
    expect(screen.getByText("Fallback")).toBeInTheDocument()
  })
  it("resetError is callable from fallback", () => {
    const resetSpy = vi.fn()
    render(
      <ErrorBoundary
        fallback={({ resetError }) => (
          <button
            onClick={() => {
              resetSpy()
              resetError()
            }}
          >
            Reset
          </button>
        )}
      >
        <Throw />
      </ErrorBoundary>
    )
    fireEvent.click(screen.getByText("Reset"))
    expect(resetSpy).toHaveBeenCalledTimes(1)
  })
  it("renders default Card UI when no fallback provided", () => {
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/Try Again/)).toBeInTheDocument()
    expect(screen.getByText(/Go Home/)).toBeInTheDocument()
  })
  it("calls window.gtag in componentDidCatch when gtag exists", () => {
    const gtag = vi.fn()
    vi.stubGlobal("gtag", gtag)
    ;(window as { gtag?: typeof gtag }).gtag = gtag
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    )
    expect(gtag).toHaveBeenCalledWith("event", "exception", {
      description: "test error",
      fatal: false,
    })
    vi.unstubAllGlobals()
  })
  it("Try Again button resets state (child re-renders and may throw again)", () => {
    render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>
    )
    fireEvent.click(screen.getByText(/Try Again/))
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })
  it("clears the error UI when the pathname changes", () => {
    mockPathname = "/a/"
    let shouldThrow = true
    const Maybe = () => {
      if (shouldThrow) throw new Error("page a broke")
      return <span>Page B</span>
    }
    const { rerender } = render(
      <ErrorBoundary>
        <Maybe />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()

    shouldThrow = false
    mockPathname = "/b/"
    rerender(
      <ErrorBoundary>
        <Maybe />
      </ErrorBoundary>
    )
    expect(screen.getByText("Page B")).toBeInTheDocument()
    expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument()
  })
})
