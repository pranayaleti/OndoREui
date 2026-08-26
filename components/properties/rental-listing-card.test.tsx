import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { RentalListingCard } from "./rental-listing-card"
import type { Property } from "@/app/types/property"

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
  })

  it("notifies the parent when someone asks to tour so the leasing note can prefill", () => {
    const onRequestShowing = vi.fn()
    render(<RentalListingCard property={listing} onRequestShowing={onRequestShowing} />)
    fireEvent.click(screen.getByRole("link", { name: /request a showing/i }))
    expect(onRequestShowing).toHaveBeenCalledWith("pub-lehi-1")
  })
})
