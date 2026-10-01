import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k, i18n: {} }) }))
vi.mock("@/components/seo", () => ({ default: () => null }))
vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => path }))

import FeedbackPage from "./page"
import { metadata } from "./layout"

describe("/feedback phone field", () => {
  it("has a pattern that is a valid regular expression in unicode-sets mode (Chrome)", () => {
    render(<FeedbackPage />)
    const pattern = screen.getByLabelText(/phone/i).getAttribute("pattern") as string
    expect(() => new RegExp(`^(?:${pattern})$`, "v")).not.toThrow()
    const re = new RegExp(`^(?:${pattern})$`, "v")
    expect(re.test("(801) 555-0100 ext 5".replace(/[a-z]/g, ""))).toBe(true)
    expect(re.test("abc")).toBe(false)
  })

  it("keeps spaces and punctuation while typing, and drops letters", () => {
    render(<FeedbackPage />)
    const input = screen.getByLabelText(/phone/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: "+1 (801) 555-0100 ext 5" } })
    expect(input.value).toBe("+1 (801) 555-0100  5")
  })
})

describe("/feedback copy", () => {
  it("does not promise gift cards, a suggestion tracker or a sweepstakes", () => {
    const { container } = render(<FeedbackPage />)
    expect(container.textContent).not.toMatch(/gift card/i)
    expect(container.textContent).not.toMatch(/suggestion tracker/i)
    expect(container.textContent).not.toMatch(/sweepstakes/i)
    expect(container.textContent).not.toMatch(/suggestions from this browser/i)
    expect(String(metadata.description)).not.toMatch(/gift card|tracker/i)
  })
})
