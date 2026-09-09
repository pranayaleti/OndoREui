import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useState } from "react"
import { NumberField, type NumberFieldKind } from "./number-field"

/** Wrapper that owns state the way a calculator does, so edits round-trip. */
function Harness({
  initial,
  kind = "currency",
  ...rest
}: {
  initial: number
  kind?: NumberFieldKind
  min?: number
  max?: number
  defaultValue?: number
  onChangeSpy?: (n: number) => void
}) {
  const [value, setValue] = useState(initial)
  const { onChangeSpy, ...props } = rest
  return (
    <NumberField
      id="f"
      label="Property tax"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChangeSpy?.(next)
      }}
      kind={kind}
      {...props}
    />
  )
}

const field = () => screen.getByLabelText(/property tax/i) as HTMLInputElement

describe("NumberField — the defects it exists to fix", () => {
  it("lets you type 0, which value={x || ''} made impossible", () => {
    // Reproduced in a browser: typing "0" into the old field left it empty,
    // so a $0 HOA or 0% down could not be expressed.
    render(<Harness initial={3000} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "0" } })
    expect(input.value).toBe("0")
    fireEvent.blur(input)
    expect(input.value).toBe("0")
  })

  it("replaces rather than appends when the value is retyped", () => {
    // The reported case: 3000 -> 2000. The old field produced "3000002" once the
    // caret had been placed by a second click.
    const spy = vi.fn()
    render(<Harness initial={3000} onChangeSpy={spy} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "2000" } })
    fireEvent.blur(input)
    expect(input.value).toBe("2,000")
    expect(spy).toHaveBeenLastCalledWith(2000)
  })

  it("keeps a partial decimal on screen while typing a rate", () => {
    // The draft must survive "4." — the number pushed up is 4, but the box keeps
    // what was typed so the next keystrokes land where the user expects.
    render(<Harness initial={6.5} kind="rate" />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "4" } })
    fireEvent.change(input, { target: { value: "4." } })
    expect(input.value).toBe("4.")
    fireEvent.change(input, { target: { value: "4.125" } })
    expect(input.value).toBe("4.125")
    fireEvent.blur(input)
    expect(input.value).toBe("4.125")
  })

  it("groups thousands at rest but not while editing", () => {
    render(<Harness initial={300000} />)
    const input = field()
    expect(input.value).toBe("300,000")
    fireEvent.focus(input)
    // Ungrouped while focused: no caret re-seating, so typing never fights back.
    expect(input.value).toBe("300000")
    fireEvent.blur(input)
    expect(input.value).toBe("300,000")
  })

  it("never emits NaN when the field is emptied", () => {
    const spy = vi.fn()
    render(<Harness initial={3000} onChangeSpy={spy} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "" } })
    fireEvent.blur(input)
    for (const call of spy.mock.calls) expect(Number.isFinite(call[0])).toBe(true)
    // Reverts to the last good value rather than sitting empty.
    expect(input.value).toBe("3,000")
  })

  it("strips characters that cannot appear in a number", () => {
    render(<Harness initial={100} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "12ab3" } })
    expect(input.value).toBe("123")
  })

  it("keeps only the first decimal point", () => {
    render(<Harness initial={6.5} kind="rate" />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "4.1.2" } })
    expect(input.value).toBe("4.12")
  })
})

describe("NumberField — arrow-key nudging", () => {
  it("steps a rate by an eighth, the way rate sheets are priced", () => {
    const spy = vi.fn()
    render(<Harness initial={6.5} kind="rate" onChangeSpy={spy} />)
    const input = field()
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(spy).toHaveBeenLastCalledWith(6.375)
  })

  it("nudges correctly when the field is already focused (a draft is present)", () => {
    // The browser fires focus before the arrow key, which installs a draft. An
    // earlier version read the draft with the wrong guard and drove the value to 0.
    const spy = vi.fn()
    render(<Harness initial={3000} onChangeSpy={spy} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(spy).toHaveBeenLastCalledWith(2900)
    expect(input.value).toBe("2,900")
  })

  it("makes 3000 -> 2000 a single Shift+ArrowDown on a currency field", () => {
    const spy = vi.fn()
    render(<Harness initial={3000} onChangeSpy={spy} />)
    fireEvent.keyDown(field(), { key: "ArrowDown", shiftKey: true })
    expect(spy).toHaveBeenLastCalledWith(2000)
  })

  it("snaps to the step grid instead of adding to an off-grid value", () => {
    // From 6.13, up should land on 6.25 — not 6.255.
    const spy = vi.fn()
    render(<Harness initial={6.13} kind="rate" onChangeSpy={spy} />)
    fireEvent.keyDown(field(), { key: "ArrowUp" })
    expect(spy).toHaveBeenLastCalledWith(6.25)
  })

  it("respects min and max when nudging", () => {
    const spy = vi.fn()
    render(<Harness initial={0} min={0} max={100} kind="percent" onChangeSpy={spy} />)
    fireEvent.keyDown(field(), { key: "ArrowDown" })
    // Already at the floor: clamped, never negative.
    for (const call of spy.mock.calls) expect(call[0]).toBeGreaterThanOrEqual(0)
  })
})

describe("NumberField — commit behaviour", () => {
  it("clamps an out-of-range entry on blur and announces the correction", () => {
    render(<Harness initial={740} kind="count" min={300} max={850} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "900" } })
    fireEvent.blur(input)
    expect(input.value).toBe("850")
    expect(screen.getByRole("status")).toHaveTextContent(/adjusted to 850/i)
  })

  it("does not clamp mid-typing, so a prefix of a valid number survives", () => {
    // Hard-clamping while typing would rewrite "3" to "300" before the user
    // finished typing 740.
    render(<Harness initial={740} kind="count" min={300} max={850} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "3" } })
    expect(input.value).toBe("3")
  })

  it("abandons the edit on Escape and keeps the committed value", () => {
    render(<Harness initial={3000} />)
    const input = field()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "99" } })
    fireEvent.keyDown(input, { key: "Escape" })
    expect(input.value).toBe("3,000")
  })
})

describe("NumberField — provenance", () => {
  it("marks a value still at its default and offers no reset yet", () => {
    render(<Harness initial={3000} defaultValue={3000} />)
    expect(screen.getByText("Est.")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /reset/i })).not.toBeInTheDocument()
  })

  it("drops the default badge and offers a reset once the value is yours", () => {
    render(<Harness initial={2000} defaultValue={3000} />)
    expect(screen.queryByText("Est.")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument()
  })

  it("restores the default when reset is pressed", () => {
    const spy = vi.fn()
    render(<Harness initial={2000} defaultValue={3000} onChangeSpy={spy} />)
    fireEvent.click(screen.getByRole("button", { name: /reset/i }))
    expect(spy).toHaveBeenLastCalledWith(3000)
  })
})

describe("NumberField — accessibility", () => {
  it("associates the visible label with the input", () => {
    render(<Harness initial={100} />)
    expect(field()).toHaveAttribute("id", "f")
  })

  it("uses a decimal keypad hint for money and a numeric one for whole counts", () => {
    const { unmount } = render(<Harness initial={100} kind="currency" />)
    expect(field()).toHaveAttribute("inputMode", "decimal")
    unmount()
    render(<Harness initial={30} kind="years" />)
    expect(field()).toHaveAttribute("inputMode", "numeric")
  })

  it("keeps the redundant steppers out of the tab order", () => {
    // Arrow keys on the input already do this and are announced in the hint;
    // two extra tab stops per field across ~161 fields would be hostile.
    render(<Harness initial={100} />)
    for (const button of screen.getAllByRole("button", { hidden: true })) {
      if (button.getAttribute("aria-hidden") === "true") {
        expect(button).toHaveAttribute("tabIndex", "-1")
      }
    }
  })
})
