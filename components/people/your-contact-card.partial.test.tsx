import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

// Only the real estate license live: agent pages get their title, loan pages stay unlicensed.
vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  LICENSING: { re: true, mlo: false, notary: false },
  SITE_BROKERAGE_NAME: "Test Realty",
}))

import { YourContactCard } from "./your-contact-card"

describe("YourContactCard with only the real estate license live", () => {
  it("titles agent pages from the real estate switch", () => {
    render(<YourContactCard kind="agent" />)
    expect(screen.getByText("Utah real estate agent with Test Realty")).toBeInTheDocument()
  })

  it("keeps loan pages unlicensed because the mortgage switch is off", () => {
    const { container } = render(<YourContactCard kind="loan" />)
    expect(screen.getByText("Founder, Ondo Real Estate")).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/NMLS|loan officer/i)
  })
})
