import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

const { start } = vi.hoisted(() => ({ start: vi.fn() }))
vi.mock("next/navigation", () => ({ useParams: () => ({ propertyId: "home-1" }) }))
vi.mock("@/lib/api/rental", () => ({ startRentalApplication: start }))
vi.mock("@/lib/rental-application", () => ({ rememberRentalApplication: vi.fn() }))
vi.mock("@/components/rental/rental-application-wizard", () => ({
  RentalApplicationWizard: () => <p>Wizard</p>,
}))
vi.mock("@/components/rental/fair-housing-notice", () => ({ FairHousingNotice: () => null }))
vi.mock("@/lib/analytics", () => ({ analytics: { trackEvent: vi.fn() } }))
vi.mock("@/lib/rental-analytics", () => ({ trackRentalFunnel: vi.fn() }))

import { RentalStartClient } from "./rental-start-client"
import { rememberReferralCode } from "@/lib/referral-code"

function fill() {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Sam" } })
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Ortiz" } })
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "sam@example.com" } })
}

describe("RentalStartClient referral code", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    window.history.replaceState(null, "", "/apply/home-1/")
    start.mockResolvedValue({ id: "app-1", resumeToken: "rt", propertyId: "home-1" })
  })

  it("fills in a code remembered from the friend's invite link and sends it", async () => {
    rememberReferralCode("K7QH3WMP")
    render(<RentalStartClient />)
    await waitFor(() => expect(screen.getByLabelText("Referral code (optional)")).toHaveValue("K7QH3WMP"))
    fill()
    fireEvent.click(screen.getByRole("button", { name: "Continue" }))
    await waitFor(() =>
      expect(start).toHaveBeenCalledWith(expect.objectContaining({ propertyId: "home-1", referralCode: "K7QH3WMP" })),
    )
  })

  it("takes ?ref= from the URL", async () => {
    window.history.replaceState(null, "", "/apply/home-1/?ref=abcd2345")
    render(<RentalStartClient />)
    await waitFor(() => expect(screen.getByLabelText("Referral code (optional)")).toHaveValue("ABCD2345"))
  })

  it("leaves the code out when there is none", async () => {
    render(<RentalStartClient />)
    expect(screen.getByText(/You get a welcome bonus in Ondo Rewards if you sign a lease/)).toBeInTheDocument()
    fill()
    fireEvent.click(screen.getByRole("button", { name: "Continue" }))
    await waitFor(() => expect(start).toHaveBeenCalled())
    expect(start.mock.calls[0][0].referralCode).toBeUndefined()
  })
})
