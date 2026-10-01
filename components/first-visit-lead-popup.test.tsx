import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => "/buy/" }))
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}))

import { FirstVisitLeadPopup, isEligiblePath } from "./first-visit-lead-popup"

describe("first-visit popup eligibility", () => {
  // A modal asking for an email would interrupt someone who is mid-form.
  it.each(["/contact/", "/qualify/", "/buy/quiz/", "/get-matched/", "/loans/second-look/", "/refinance/watch/"])(
    "stays out of form flows like %s",
    (pathname) => {
      expect(isEligiblePath(pathname)).toBe(false)
    },
  )

  it.each(["/", "/buy/", "/sell/"])("can greet first-time visitors on %s", (pathname) => {
    expect(isEligiblePath(pathname)).toBe(true)
  })
})

describe("first-visit popup validation", () => {
  beforeEach(() => {
    try {
      window.localStorage.clear()
    } catch {
      // storage is optional
    }
    // Scrolled past 60% of the page, which is what opens the popup.
    vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(1000)
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  async function openPopup() {
    render(<FirstVisitLeadPopup />)
    return screen.findByRole("dialog")
  }

  it("ties each error to its field, marks it invalid and focuses the first one", async () => {
    await openPopup()
    fireEvent.click(screen.getByRole("button", { name: "leadPopup.submitCta" }))

    const name = screen.getByLabelText("leadPopup.nameLabel")
    const email = screen.getByLabelText("leadPopup.emailLabel")
    expect(name).toHaveAttribute("aria-invalid", "true")
    expect(name).toHaveAccessibleDescription("leadPopup.validation.nameRequired")
    expect(email).toHaveAttribute("aria-invalid", "true")
    expect(email).toHaveAccessibleDescription("leadPopup.validation.emailRequired")
    await waitFor(() => expect(name).toHaveFocus())
    expect(fetch).not.toHaveBeenCalled()
  })

  it("focuses the email field when only the email is wrong, and clears its error on edit", async () => {
    await openPopup()
    const name = screen.getByLabelText("leadPopup.nameLabel")
    const email = screen.getByLabelText("leadPopup.emailLabel")
    fireEvent.change(name, { target: { value: "Jane Doe" } })
    fireEvent.change(email, { target: { value: "jane@" } })
    fireEvent.click(screen.getByRole("button", { name: "leadPopup.submitCta" }))

    expect(name).not.toHaveAttribute("aria-invalid")
    expect(email).toHaveAccessibleDescription("leadPopup.validation.emailInvalid")
    await waitFor(() => expect(email).toHaveFocus())

    fireEvent.change(email, { target: { value: "jane@example.com" } })
    expect(email).not.toHaveAttribute("aria-invalid")
  })
})
