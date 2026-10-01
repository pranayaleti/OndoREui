import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { CurrencyInput, PercentInput } from "./fields"

function CurrencyHarness({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial)
  return <CurrencyInput label="Home price" value={value} onChange={setValue} />
}

function PercentHarness({ initial }: { initial: number }) {
  const [value, setValue] = useState(initial)
  return <PercentInput label="Rate" value={value} onChange={setValue} />
}

describe("cost-of-living inputs select the whole value on focus", () => {
  it("selects the full draft after focus so typing replaces it", () => {
    render(<CurrencyHarness initial={450000} />)
    const input = screen.getByLabelText(/home price/i) as HTMLInputElement
    expect(input.value).toBe("450,000")
    fireEvent.focus(input)
    // The draft swaps "450,000" for "450000"; the selection must cover the new text.
    expect(input.value).toBe("450000")
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(input.value.length)
  })

  it("replaces instead of appending when a value is retyped", () => {
    render(<CurrencyHarness initial={450000} />)
    const input = screen.getByLabelText(/home price/i) as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "500000" } })
    fireEvent.blur(input)
    expect(input.value).toBe("500,000")
  })

  it("selects the percent value on focus too", () => {
    render(<PercentHarness initial={6.5} />)
    const input = screen.getByLabelText(/rate/i) as HTMLInputElement
    fireEvent.focus(input)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(input.value.length)
  })
})
