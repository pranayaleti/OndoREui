import { act, render, renderHook, screen, fireEvent } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { useFinancialVisibility } from "./financial-visibility"

const KEY = "ondo-financial-visibility"

function Amount({ label }: { label: string }) {
  const { showValues, toggle } = useFinancialVisibility()
  return (
    <div>
      <button type="button" onClick={toggle}>
        toggle {label}
      </button>
      <span data-testid={label}>{showValues ? "$1,000" : "••••"}</span>
    </div>
  )
}

describe("useFinancialVisibility", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("shows values by default and does not write storage until the visitor toggles", () => {
    const { result } = renderHook(() => useFinancialVisibility())
    expect(result.current.showValues).toBe(true)
    expect(window.localStorage.getItem(KEY)).toBeNull()
  })

  it("hides every consumer on the page when one toggle is clicked", () => {
    render(
      <>
        <Amount label="a" />
        <Amount label="b" />
        <Amount label="c" />
      </>,
    )
    fireEvent.click(screen.getByRole("button", { name: "toggle a" }))
    expect(screen.getByTestId("a")).toHaveTextContent("••••")
    expect(screen.getByTestId("b")).toHaveTextContent("••••")
    expect(screen.getByTestId("c")).toHaveTextContent("••••")
    expect(window.localStorage.getItem(KEY)).toBe("false")

    fireEvent.click(screen.getByRole("button", { name: "toggle c" }))
    expect(screen.getByTestId("a")).toHaveTextContent("$1,000")
    expect(window.localStorage.getItem(KEY)).toBe("true")
  })

  it("starts hidden for every consumer when the stored preference is hidden", () => {
    window.localStorage.setItem(KEY, "false")
    render(
      <>
        <Amount label="a" />
        <Amount label="b" />
      </>,
    )
    expect(screen.getByTestId("a")).toHaveTextContent("••••")
    expect(screen.getByTestId("b")).toHaveTextContent("••••")
    // Reading the preference must not overwrite it.
    expect(window.localStorage.getItem(KEY)).toBe("false")
  })

  it("follows a change made in another tab", () => {
    const { result } = renderHook(() => useFinancialVisibility())
    expect(result.current.showValues).toBe(true)
    act(() => {
      window.localStorage.setItem(KEY, "false")
      window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: "false" }))
    })
    expect(result.current.showValues).toBe(false)
  })
})
