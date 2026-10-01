import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { portalGateMetadata } from "./portal-gate"
import BlockedPlatformPage, { metadata as platformMetadata } from "./blocked-platform-page"
import { metadata as ownerMetadata } from "./blocked-owner-page"
import { metadata as tenantMetadata } from "./blocked-tenant-page"
import { metadata as dashboardMetadata } from "./blocked-dashboard-page"
import { metadata as platformLayoutMetadata } from "@/app/platform/layout"

const gates = { platformMetadata, ownerMetadata, tenantMetadata, dashboardMetadata, platformLayoutMetadata }

describe("portal gate pages", () => {
  it.each(Object.entries(gates))("%s has one brand in the title, is noindexed and has no /auth canonical", (_n, m) => {
    const title = (m.title as { absolute: string }).absolute
    expect(title).toMatch(/\| Ondo RE$/)
    expect(title.match(/Ondo/g)?.length).toBe(1)
    expect(m.robots).toMatchObject({ index: false, follow: false })
    expect(m.alternates).toBeUndefined()
  })

  it("strips a brand the caller already added", () => {
    expect((portalGateMetadata("Secure thing | Ondo Real Estate", "d").title as { absolute: string }).absolute).toBe(
      "Secure thing | Ondo RE",
    )
  })

  it("platform gate points visitors at the public demo hub instead of calling the platform not public", () => {
    render(<BlockedPlatformPage />)
    expect(screen.getByRole("link", { name: /open the demo hub/i })).toHaveAttribute("href", "/demo/")
    expect(screen.getByRole("link", { name: /property management portal/i })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/no longer exposed|prototype/i)
  })
})
