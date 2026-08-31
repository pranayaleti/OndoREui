import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { RentalApplyPanel } from "./rental-apply-panel"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("@/lib/analytics", () => ({
  analytics: { trackEvent: vi.fn() },
}))

vi.mock("@/lib/api/rental", () => ({
  fetchRentalProfile: vi.fn().mockRejectedValue(new Error("profile 500")),
  requestRentalTour: vi.fn(),
  submitRentalLead: vi.fn(),
}))

describe("RentalApplyPanel", () => {
  it("keeps #listing-apply and a start fallback when the profile request fails", async () => {
    render(
      <RentalApplyPanel
        propertyId="f1557561-8b1e-4351-9054-3ebd5d2d4385"
        publicId="c2e653bf-1b6a-4f0c-9654-82a4896cb137"
      />,
    )
    await waitFor(() => {
      expect(screen.getByText(/application details are not available yet/i)).toBeInTheDocument()
    })
    const panel = document.getElementById("listing-apply")
    expect(panel).toBeTruthy()
    expect(panel?.className).toContain("scroll-mt-[5.5rem]")
    expect(panel?.className).toContain("md:scroll-mt-[8.5rem]")
    expect(screen.getByRole("link", { name: /apply now/i })).toHaveAttribute(
      "href",
      "/apply/start/c2e653bf-1b6a-4f0c-9654-82a4896cb137",
    )
    expect(screen.queryByRole("button", { name: /check your application requirements/i })).not.toBeInTheDocument()
    expect(screen.getByRole("complementary", { name: /equal housing opportunity/i })).toBeInTheDocument()
  })
})
