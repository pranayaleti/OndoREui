import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { RentalListingCard } from "./rental-listing-card"
import type { Property } from "@/app/types/property"

vi.mock("@/lib/api/properties", () => ({
  getFavoritePropertyIds: vi.fn().mockResolvedValue([]),
  toggleFavoriteProperty: vi.fn(),
}))

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock("next/image", () => ({
  default: (props: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} />
  ),
}))

const listing: Property = {
  id: "pub-lehi-1",
  title: "Cedar Hollow",
  type: "house",
  address: "Lehi, UT",
  price: 2195,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1600,
  phone: "",
  website: null,
  leaseTerms: null,
  fees: null,
  availability: null,
  rating: 0,
  reviewCount: 0,
  amenities: [],
  specialties: [],
  services: [],
  valueRanges: [],
  images: ["/placeholder.svg"],
  image: "/placeholder.svg",
  dateAdded: new Date("2026-08-01"),
  logo: "",
  description: "A Wasatch Front rental.",
  contact: { name: "Ondo Real Estate", phone: "", email: "", role: "property" },
}

describe("RentalListingCard", () => {
  it("sends people to the listing page, not a cloned Schedule/Apply pair", () => {
    render(<RentalListingCard property={listing} />)
    const details = screen.getByRole("link", { name: /view details for cedar hollow/i })
    expect((details.getAttribute("href") ?? "").replace(/\/$/, "")).toBe("/properties/pub-lehi-1")
    const showing = screen.getByRole("link", { name: /request a showing/i })
    expect(showing).toHaveAttribute("href", "#ask-leasing")
    expect(screen.queryByRole("link", { name: /^apply$/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/schedule a showing/i)).not.toBeInTheDocument()
    const photo = screen.getByRole("link", { name: /view photos and details for cedar hollow/i })
    expect((photo.getAttribute("href") ?? "").replace(/\/$/, "")).toBe("/properties/pub-lehi-1")
    expect(details.compareDocumentPosition(photo) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    const worksheet = screen.getByRole("link", { name: /^worksheet$/i })
    expect(worksheet.getAttribute("href") ?? "").toMatch(/#underwrite/)
    expect((worksheet.getAttribute("href") ?? "").replace(/\/(?=#)/, "").replace(/\/$/, "")).toBe(
      "/properties/pub-lehi-1#underwrite",
    )
    expect(screen.queryByText(/cap rate/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/5-year return/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/estimated rent/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/cash-on-cash/i)).not.toBeInTheDocument()
  })

  it("shows amenity chips and a pet-friendly mark only when the listing has those facts", () => {
    render(
      <RentalListingCard
        property={{
          ...listing,
          amenities: ["laundry", "pet_friendly", "parking"],
          availability: "now",
        }}
      />,
    )
    expect(screen.getByText(/house · 3 beds · 2 baths/i)).toBeInTheDocument()
    expect(screen.getByText("Pets allowed")).toBeInTheDocument()
    expect(screen.getByText("Laundry")).toBeInTheDocument()
    expect(screen.getByText("Parking")).toBeInTheDocument()
    expect(screen.getByText("Available now")).toBeInTheDocument()
    expect(screen.queryByText(/walk score|great schools|family-friendly/i)).not.toBeInTheDocument()
  })

  it("does not invent amenity chips when the listing has none", () => {
    render(<RentalListingCard property={listing} />)
    expect(screen.queryByLabelText(/listed highlights/i)).not.toBeInTheDocument()
    expect(screen.queryByText("Pets allowed")).not.toBeInTheDocument()
  })

  it("notifies the parent when someone asks to tour so the leasing note can prefill", () => {
    const onRequestShowing = vi.fn()
    render(<RentalListingCard property={listing} onRequestShowing={onRequestShowing} />)
    fireEvent.click(screen.getByRole("link", { name: /request a showing/i }))
    expect(onRequestShowing).toHaveBeenCalledWith("pub-lehi-1")
  })
})
