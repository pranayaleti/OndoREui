import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Progress } from "./progress"

describe("Progress", () => {
  it("exposes the value to assistive tech instead of an indeterminate bar", () => {
    render(<Progress value={40} aria-label="Calculator progress" />)
    const bar = screen.getByRole("progressbar")
    expect(bar.getAttribute("aria-valuenow")).toBe("40")
    expect(bar.getAttribute("aria-valuemax")).toBe("100")
    expect(bar.getAttribute("data-state")).toBe("loading")
  })

  it("moves the indicator by value relative to max", () => {
    const { container } = render(<Progress value={2} max={4} aria-label="Steps" />)
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("2")
    const indicator = container.querySelector("[data-state]:not([role])") as HTMLElement
    expect(indicator.style.transform).toBe("translateX(-50%)")
  })

  it("clamps the indicator when the value is out of range", () => {
    const { container, rerender } = render(<Progress value={250} aria-label="Over" />)
    const indicator = () => container.querySelector("[data-state]:not([role])") as HTMLElement
    expect(indicator().style.transform).toBe("translateX(-0%)")
    rerender(<Progress value={-10} aria-label="Under" />)
    expect(indicator().style.transform).toBe("translateX(-100%)")
  })
})
