import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import type { Property } from "@/app/types/property"

const push = vi.fn()
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))
vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))
vi.mock("@/components/map/property-search-map", () => ({
  default: ({ properties, onPropertyClick }: { properties: { id: string }[]; onPropertyClick?: (id: string) => void }) => (
    <div data-testid="map">
      {properties.map((p) => (
        <button key={p.id} onClick={() => onPropertyClick?.(p.id)}>{`pin ${p.id}`}</button>
      ))}
    </div>
  ),
}))
const fetchList = vi.fn()
vi.mock("@/lib/public-property", async (orig) => ({
  ...(await orig<typeof import("@/lib/public-property")>()),
  fetchPublicPropertyListOrThrow: (...args: unknown[]) => fetchList(...args),
}))

import ExploreMapClient, { listingsToPins } from "./explore-map-client"

function listing(over: Partial<Property> = {}): Property {
  return {
    id: "pub-123",
    title: "Lehi Townhome",
    type: "townhouse",
    price: 2100,
    bedrooms: 3,
    bathrooms: 2.5,
    image: "/img.webp",
    addressParts: { city: "Lehi" },
    lat: 40.39,
    lng: -111.85,
    ...over,
  } as Property
}

describe("listingsToPins", () => {
  it("maps publicId, bathrooms, city and type, and skips rows without coordinates", () => {
    const { pins, skipped } = listingsToPins([
      listing(),
      listing({ id: "no-coords", lat: null, lng: null }),
      listing({ id: "zero", lat: 0, lng: 0 }),
    ])
    expect(pins).toEqual([
      {
        id: "pub-123",
        title: "Lehi Townhome",
        price: 2100,
        bedrooms: 3,
        bathrooms: 2.5,
        lat: 40.39,
        lng: -111.85,
        image: "/img.webp",
        type: "townhouse",
        city: "Lehi",
      },
    ])
    expect(skipped).toEqual(["no-coords", "zero"])
  })
})

describe("ExploreMapClient", () => {
  beforeEach(() => {
    push.mockReset()
    fetchList.mockReset()
  })
  afterEach(() => vi.restoreAllMocks())

  it("shows build-time listings and routes pin clicks by publicId", async () => {
    fetchList.mockRejectedValue(new Error("offline"))
    render(<ExploreMapClient initialProperties={[listing()]} />)
    expect(screen.getByText("1 property on the map.")).toBeInTheDocument()
    screen.getByRole("button", { name: "pin pub-123" }).click()
    expect(push).toHaveBeenCalledWith("/properties/pub-123")
    await waitFor(() => expect(fetchList).toHaveBeenCalled())
  })

  it("fills the map from the client refresh when the build-time list was empty", async () => {
    fetchList.mockResolvedValue([
      {
        publicId: "pub-9",
        title: "Provo Duplex",
        type: "duplex",
        price: 1800,
        bedrooms: 2,
        bathrooms: 1,
        city: "Provo",
        state: "UT",
        lat: 40.23,
        lng: -111.66,
        photos: [],
        createdAt: "2026-09-01T00:00:00Z",
      },
    ])
    render(<ExploreMapClient initialProperties={[]} />)
    expect(screen.queryByText(/No listings are on the map/)).toBeNull()
    expect(await screen.findByRole("button", { name: "pin pub-9" })).toBeInTheDocument()
    expect(screen.getByText("1 property on the map.")).toBeInTheDocument()
  })

  it("shows the empty state with underlined links once the refresh finds nothing", async () => {
    fetchList.mockResolvedValue([])
    render(<ExploreMapClient initialProperties={[]} />)
    expect(await screen.findByText(/No listings are on the map right now/)).toBeInTheDocument()
    const link = screen.getByRole("link", { name: "properties page" })
    expect(link).toHaveAttribute("href", "/properties/")
    expect(link.className).toContain("underline")
  })
})
