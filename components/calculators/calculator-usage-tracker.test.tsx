import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

const trackCalculatorUsage = vi.fn()
vi.mock("@/lib/analytics", () => ({ analytics: { trackCalculatorUsage: (...args: unknown[]) => trackCalculatorUsage(...args) } }))

import { CalculatorUsageTracker } from "./calculator-usage-tracker"

describe("CalculatorUsageTracker", () => {
  beforeEach(() => trackCalculatorUsage.mockReset())
  afterEach(() => vi.restoreAllMocks())

  function setup() {
    return render(
      <div>
        <header>
          <input aria-label="site search" />
        </header>
        <main>
          <CalculatorUsageTracker slug="cap-rate" />
          <input aria-label="price" />
        </main>
      </div>,
    )
  }

  it("fires use_calculator once, on the first edit inside main", () => {
    const { getByLabelText } = setup()
    expect(trackCalculatorUsage).not.toHaveBeenCalled()
    fireEvent.input(getByLabelText("price"), { target: { value: "300000" } })
    fireEvent.input(getByLabelText("price"), { target: { value: "310000" } })
    expect(trackCalculatorUsage).toHaveBeenCalledTimes(1)
    expect(trackCalculatorUsage).toHaveBeenCalledWith("cap-rate", {})
  })

  it("ignores edits outside main", () => {
    const { getByLabelText } = setup()
    fireEvent.input(getByLabelText("site search"), { target: { value: "x" } })
    expect(trackCalculatorUsage).not.toHaveBeenCalled()
  })

  it("stops listening after unmount", () => {
    const { getByLabelText, unmount } = setup()
    const input = getByLabelText("price")
    unmount()
    fireEvent.input(input, { target: { value: "1" } })
    expect(trackCalculatorUsage).not.toHaveBeenCalled()
  })
})
