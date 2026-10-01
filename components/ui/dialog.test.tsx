import { describe, expect, it } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog"

function Harness({ closeLabel }: { closeLabel?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open it</DialogTrigger>
      <DialogContent closeLabel={closeLabel}>
        <DialogTitle>Book a call</DialogTitle>
        <DialogDescription>Pick a time.</DialogDescription>
        <input aria-label="Name" />
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("opens as a named, described dialog and closes with the default Close label", () => {
    render(<Harness />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Open it" }))
    const dialog = screen.getByRole("dialog", { name: "Book a call" })
    expect(dialog).toHaveAccessibleDescription("Pick a time.")
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("lets a caller name the close button for its own language or context", () => {
    render(<Harness closeLabel="Dismiss booking" />)
    fireEvent.click(screen.getByRole("button", { name: "Open it" }))
    expect(screen.getByRole("button", { name: "Dismiss booking" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument()
  })

  it("moves focus into the dialog when it opens and closes on Escape", () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole("button", { name: "Open it" }))
    const dialog = screen.getByRole("dialog")
    expect(dialog.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(dialog, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
