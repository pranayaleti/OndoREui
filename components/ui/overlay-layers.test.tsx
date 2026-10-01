import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet"
import { Toast, ToastProvider, ToastViewport } from "./toast"
import { cn } from "@/lib/utils"
import tailwindConfig from "../../tailwind.config"

const zScale = (tailwindConfig.theme?.extend as { zIndex: Record<string, string> }).zIndex

describe("overlay z-index scale", () => {
  it("orders overlay < modal < popover < toast", () => {
    const n = (k: string) => Number(zScale[k])
    expect(n("overlay")).toBeLessThan(n("modal"))
    expect(n("modal")).toBeLessThan(n("popover"))
    expect(n("popover")).toBeLessThan(n("toast"))
  })

  it("puts the toast viewport above dialog and sheet layers", () => {
    render(
      <ToastProvider>
        <Toast open>
          <span>hi</span>
        </Toast>
        <ToastViewport data-testid="viewport" />
      </ToastProvider>,
    )
    const viewport = screen.getByTestId("viewport")
    expect(viewport.className).toContain("z-toast")
    expect(viewport.className).not.toMatch(/z-\[/)
  })

  it("uses the shared layers on Dialog and caps its height", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>t</DialogTitle>
          <DialogDescription>d</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    const dialog = screen.getByRole("dialog")
    expect(dialog.className).toContain("z-modal")
    expect(dialog.className).toContain("max-h-[calc(100dvh-2rem)]")
    expect(dialog.className).toContain("overflow-y-auto")
    expect(document.querySelector(".z-overlay")).not.toBeNull()
  })

  it("uses the shared layers on a bottom Sheet and caps its height", () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>s</SheetTitle>
          <SheetDescription>d</SheetDescription>
        </SheetContent>
      </Sheet>,
    )
    const sheet = screen.getByRole("dialog")
    expect(sheet.className).toContain("z-modal")
    expect(sheet.className).toContain("max-h-dvh")
    expect(sheet.className).toContain("overflow-y-auto")
    expect(document.querySelector(".z-overlay")).not.toBeNull()
  })

  it("cn lets a call-site z class replace a named layer", () => {
    expect(cn("z-modal", "z-50")).toBe("z-50")
    expect(cn("z-50", "z-toast")).toBe("z-toast")
    expect(cn("z-modal", "p-4")).toBe("z-modal p-4")
  })
})
