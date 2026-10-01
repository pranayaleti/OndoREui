import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Checkbox } from "./checkbox"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { Toast, ToastClose, ToastProvider, ToastViewport } from "./toast"

describe("touch target sizes", () => {
  it("extends the Checkbox hit area to 24px without changing its visible size", () => {
    render(<Checkbox aria-label="agree" />)
    const box = screen.getByRole("checkbox")
    expect(box.className).toContain("h-4")
    expect(box.className).toContain("relative")
    expect(box.className).toContain("before:-inset-1")
  })

  it("extends the Radio hit area", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="a" />
      </RadioGroup>,
    )
    const radio = screen.getByRole("radio")
    expect(radio.className).toContain("relative")
    expect(radio.className).toContain("before:-inset-1")
  })

  it("extends the Dialog close button hit area", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>t</DialogTitle>
          <DialogDescription>d</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByRole("button", { name: "Close" }).className).toContain("before:-inset-2.5")
  })

  it("only hides the Toast close button on hover-capable devices", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    )
    const close = document.querySelector("[toast-close]")!
    expect(close.className).toContain("[@media(hover:hover)]:opacity-0")
    expect(close.className.split(/\s+/)).not.toContain("opacity-0")
    expect(close.className).toContain("before:-inset-2.5")
  })
})
