import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import LandlordsPage from "./landlords/page"
import TenantsPage from "./tenants/page"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

vi.mock("@/components/seo", () => ({ default: () => null }))

describe("solutions pages portal links", () => {
  it("sends landlords straight to the portal login", () => {
    render(<LandlordsPage />)
    expect(screen.getByRole("link", { name: /go to owner portal/i })).toHaveAttribute("href", APP_PORTAL_LOGIN_URL)
  })

  it("sends tenants straight to the portal login", () => {
    render(<TenantsPage />)
    expect(screen.getByRole("link", { name: /log in to your portal/i })).toHaveAttribute("href", APP_PORTAL_LOGIN_URL)
  })
})
