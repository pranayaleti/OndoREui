import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import enCommon from "@/public/locales/en/common.json"

let mockRef: string | null = null
vi.mock("next/navigation", () => ({ useSearchParams: () => ({ get: () => mockRef }) }))
vi.mock("@/components/seo", () => ({ default: () => null }))
vi.mock("react-i18next", () => {
  function translate(key: string, vars?: Record<string, string>): string {
    let node: unknown = enCommon
    for (const segment of key.split(".")) {
      if (node && typeof node === "object" && segment in (node as object)) {
        node = (node as Record<string, unknown>)[segment]
      } else {
        return key
      }
    }
    if (typeof node !== "string") return key
    return node.replace(/\{\{(\w+)\}\}/g, (_, name: string) => vars?.[name] ?? "")
  }
  return { useTranslation: () => ({ t: translate, i18n: {} }) }
})

import { ReferralContent } from "./referral-content"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

describe("/referral/", () => {
  beforeEach(() => {
    mockRef = null
  })

  it("invites a renter to Ondo homes, with the neighbors mural and no platform pitch", () => {
    const { container } = render(<ReferralContent />)
    expect(screen.getByRole("heading", { level: 1, name: "A friend invited you to rent with Ondo" })).toBeInTheDocument()
    expect(screen.getByTestId("mural-neighbors")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByRole("link", { name: "See homes for rent" })).toHaveAttribute("href", "/properties/")
    expect(screen.getByRole("link", { name: "Contact Ondo" })).toHaveAttribute("href", "/contact/")
    expect(container.textContent).not.toMatch(/property managers|free month|trusted by/i)
  })

  it("carries the referral code into account creation and explains the friend's credit", () => {
    mockRef = "K7QH3WMP"
    render(<ReferralContent />)
    expect(screen.getByRole("link", { name: "Create your account" })).toHaveAttribute(
      "href",
      `${APP_PORTAL_LOGIN_URL}?ref=K7QH3WMP`,
    )
    expect(screen.getByText(/invited with code K7QH3WMP/)).toBeInTheDocument()
    expect(screen.getByText(/250-point welcome bonus, worth \$25 off rent, and your friend earns points too/)).toBeInTheDocument()
    // Remembered so a rental application started later fills the code in.
    expect(JSON.parse(window.localStorage.getItem("ondo_referral_code") ?? "{}").code).toBe("K7QH3WMP")
  })

  it("links to account creation without a code when there is none", () => {
    render(<ReferralContent />)
    expect(screen.getByRole("link", { name: "Create your account" })).toHaveAttribute("href", APP_PORTAL_LOGIN_URL)
    expect(screen.queryByText(/How your friend gets credit/)).toBeNull()
  })
})
