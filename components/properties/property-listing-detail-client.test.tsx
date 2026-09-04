import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import type { ApiProperty } from "@/app/types/property"
import { PropertyListingDetailClient } from "./property-listing-detail-client"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("@/components/map/property-map", () => ({
  default: () => <div data-testid="listing-map" />,
}))

vi.mock("@/components/rental/rental-apply-panel", () => ({
  RentalApplyPanel: () => <div>Application requirements</div>,
}))

vi.mock("@/components/properties/renter-availability-note", () => ({
  RenterAvailabilityNote: () => <div id="ask-leasing">Ask leasing</div>,
}))

vi.mock("@/lib/public-property", async () => {
  const actual = await vi.importActual<typeof import("@/lib/public-property")>("@/lib/public-property")
  return {
    ...actual,
    fetchPublicPropertyByPublicId: vi.fn(),
    fetchPublicPropertyList: vi.fn().mockResolvedValue([]),
  }
})

vi.mock("@/lib/api/properties", () => ({
  getFavoritePropertyIds: vi.fn().mockResolvedValue([]),
  toggleFavoriteProperty: vi.fn(),
}))

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackEvent: vi.fn(),
  },
}))

import { fetchPublicPropertyByPublicId } from "@/lib/public-property"

const fetchById = vi.mocked(fetchPublicPropertyByPublicId)

afterEach(() => {
  fetchById.mockReset()
})

const listing: ApiProperty = {
  id: "f1557561-8b1e-4351-9054-3ebd5d2d4385",
  publicId: "c2e653bf-1b6a-4f0c-9654-82a4896cb137",
  title: "Avenues Victorian Duplex",
  type: "house",
  addressLine1: "123 E St",
  addressLine2: null,
  city: "Salt Lake City",
  state: "UT",
  country: "US",
  zipcode: "84103",
  description: "A Wasatch Front rental.",
  price: 2195,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1600,
  phone: null,
  website: null,
  leaseTerms: null,
  fees: null,
  availability: null,
  rating: null,
  reviewCount: 0,
  amenities: ["laundry"],
  specialties: [],
  services: [],
  valueRanges: [],
  status: "approved",
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
  photos: [],
  lat: 40.77,
  lng: -111.88,
}

describe("PropertyListingDetailClient", () => {
  it("loads a live-API listing by publicId instead of depending on prerendered HTML", async () => {
    fetchById.mockResolvedValue(listing)
    render(<PropertyListingDetailClient publicId={listing.publicId} />)

    expect(await screen.findByRole("heading", { name: /avenues victorian duplex/i })).toBeInTheDocument()
    expect(fetchById).toHaveBeenCalledWith(listing.publicId)
    const inquireLinks = screen.getAllByRole("link", { name: /apply now/i })
    expect(inquireLinks.length).toBeGreaterThan(0)
    inquireLinks.forEach((link) => expect(link).toHaveAttribute("href", "#listing-apply"))
    expect(screen.getAllByRole("link", { name: /schedule a tour/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole("heading", { name: /how to rent with ondo/i })).toBeInTheDocument()
    expect(screen.getAllByText(/listed monthly rent/i).length).toBeGreaterThan(0)
    expect(screen.getByRole("heading", { name: /^highlights$/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /illustrative investor worksheet/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /^worksheet$/i })).toHaveAttribute("href", "#underwrite")
    expect(screen.getByRole("heading", { name: /^ondo manages this$/i })).toBeInTheDocument()
    expect(screen.getByText(/leasing and maintenance/i)).toBeInTheDocument()
    expect(screen.queryByText(/set it and forget it|guaranteed income|high-yield|safe neighborhood|good schools/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/great for families/i)).not.toBeInTheDocument()
  })

  it("shows listed fees, move-in, and pet notes only when the payload has them", async () => {
    fetchById.mockResolvedValue({
      ...listing,
      availability: "2026-10-15",
      fees: "Trash $25/mo, listed by the manager",
      leaseTerms: "12 months",
      amenities: ["laundry", "pet_friendly", "parking"],
    })
    render(<PropertyListingDetailClient publicId={listing.publicId} />)

    expect(await screen.findByText(/available oct 15, 2026/i)).toBeInTheDocument()
    expect(screen.getAllByText(/trash \$25\/mo, listed by the manager/i).length).toBeGreaterThan(0)
    expect(screen.getByRole("heading", { level: 2, name: /^pets$/i })).toBeInTheDocument()
    expect(screen.getAllByText(/pets allowed/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/application fee \$50/i)).not.toBeInTheDocument()
  })

  it("shows listed pet rent and deposit from the public pet policy payload", async () => {
    fetchById.mockResolvedValue({
      ...listing,
      amenities: ["laundry"],
      petPolicy: {
        petsAllowed: true,
        allowedSpecies: ["dog", "cat"],
        maxPets: 2,
        maxWeightLbs: 40,
        monthlyPetRentCents: 2500,
        petDepositCents: 30000,
      },
    })
    render(<PropertyListingDetailClient publicId={listing.publicId} />)

    expect(await screen.findByRole("heading", { level: 2, name: /^pets$/i })).toBeInTheDocument()
    expect(screen.getByText("Listed monthly pet rent")).toBeInTheDocument()
    expect(screen.getByText("$25.00")).toBeInTheDocument()
    expect(screen.getByText("Listed pet deposit")).toBeInTheDocument()
    expect(screen.getByText("$300.00")).toBeInTheDocument()
    expect(screen.queryByText(/great for families|school rating of/i)).not.toBeInTheDocument()
  })

  it("shows the unavailable state when the public list does not contain that id", async () => {
    fetchById.mockResolvedValue(null)
    render(<PropertyListingDetailClient publicId="missing-id" />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /this listing isn't available/i })).toBeInTheDocument()
    })
    expect(screen.getByRole("link", { name: /browse properties/i })).toHaveAttribute("href", "/properties")
  })
})
