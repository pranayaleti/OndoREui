import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { NotaryBooking } from "./notary-booking"
import { SITE_PHONE_TEL } from "@/lib/site"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

beforeEach(() => {
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
})

describe("NotaryBooking", () => {
  it("offers a request, not a booking, and a phone link for urgent requests", () => {
    render(<NotaryBooking />)
    expect(screen.getByRole("button", { name: /request a notary session/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /\d/ })).toHaveAttribute("href", `tel:${SITE_PHONE_TEL}`)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens the notary request dialog and returns focus to the button when it closes", async () => {
    render(<NotaryBooking />)
    const opener = screen.getByRole("button", { name: /request a notary session/i })
    opener.focus()
    fireEvent.click(opener)

    const dialog = screen.getByRole("dialog", { name: "consultationModal.titleNotary" })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)

    fireEvent.keyDown(dialog, { key: "Escape" })

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })
})
