import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  ListingAvailabilityProvider,
  ListingUnavailableNotice,
} from "@/components/properties/listing-availability"
import { RentalApplyHashLink } from "@/components/rental/rental-listing-funnel"

const checkListingAvailability = vi.fn()
vi.mock("@/lib/public-property", () => ({
  checkListingAvailability: (...args: unknown[]) => checkListingAvailability(...args),
}))
vi.mock("@/lib/rental-analytics", () => ({ trackRentalFunnel: vi.fn() }))

afterEach(() => checkListingAvailability.mockReset())

function Page() {
  return (
    <ListingAvailabilityProvider publicId="pub-1">
      <ListingUnavailableNotice />
      <RentalApplyHashLink propertyRef="pub-1">Apply now</RentalApplyHashLink>
    </ListingAvailabilityProvider>
  )
}

describe("listing availability re-check", () => {
  it("swaps Apply now for a notice when the listing is definitely gone", async () => {
    checkListingAvailability.mockResolvedValue("unavailable")
    render(<Page />)
    await waitFor(() => expect(screen.getByText(/no longer available/i)).toBeTruthy())
    expect(screen.queryByText("Apply now")).toBeNull()
  })

  it("leaves the page unchanged when the listing is available", async () => {
    checkListingAvailability.mockResolvedValue("available")
    render(<Page />)
    await waitFor(() => expect(checkListingAvailability).toHaveBeenCalledWith("pub-1"))
    expect(screen.getByText("Apply now")).toBeTruthy()
    expect(screen.queryByText(/no longer available/i)).toBeNull()
  })

  it("leaves the page unchanged when the check is inconclusive (network error)", async () => {
    checkListingAvailability.mockResolvedValue("unknown")
    render(<Page />)
    await waitFor(() => expect(checkListingAvailability).toHaveBeenCalled())
    expect(screen.getByText("Apply now")).toBeTruthy()
    expect(screen.queryByText(/no longer available/i)).toBeNull()
  })
})
