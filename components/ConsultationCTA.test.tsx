import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import ConsultationCTA from "./ConsultationCTA"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

beforeEach(() => {
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
})

describe("ConsultationCTA", () => {
  it.each(["default", "card", "minimal"] as const)("renders the call, book and request actions in the %s variant", (variant) => {
    render(<ConsultationCTA variant={variant} />)
    expect(screen.getByRole("button", { name: /call now/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /notary & other services/i })).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens the request dialog from the button and returns focus to it on Escape", async () => {
    render(<ConsultationCTA />)
    const opener = screen.getByRole("button", { name: /notary & other services/i })
    opener.focus()
    fireEvent.click(opener)

    const dialog = screen.getByRole("dialog")
    expect(dialog).toContainElement(document.activeElement as HTMLElement)

    fireEvent.keyDown(dialog, { key: "Escape" })

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })

  it("uses the title and description it is given", () => {
    render(<ConsultationCTA title="Talk to us" description="Free call" />)
    expect(screen.getByRole("heading", { name: "Talk to us" })).toBeInTheDocument()
    expect(screen.getByText("Free call")).toBeInTheDocument()
  })
})
