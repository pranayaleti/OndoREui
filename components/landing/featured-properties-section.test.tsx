import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { FeaturedPropertiesSection } from "./featured-properties-section"

vi.mock("@/lib/backend", () => ({
  backendUrl: (path: string) => `http://localhost:3030${path}`,
}))

vi.mock("@/components/lazy-image", () => ({
  // Tests only need to see the alt/src for a11y and empty-state assertions.
  // Rendering a plain <div> instead of <img> keeps the next/no-img-element
  // lint rule quiet without pulling in next/image's config machinery.
  LazyImage: (props: { alt: string; src: string }) => (
    <div role="img" aria-label={props.alt} data-src={props.src} />
  ),
}))

vi.mock("@/lib/financial-visibility", () => ({
  useFinancialVisibility: () => ({ showValues: true, toggle: () => {} }),
}))

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  vi.restoreAllMocks()
})

describe("FeaturedPropertiesSection", () => {
  it("renders real listings from /api/properties/public and links to their detail pages", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            publicId: "pub-1",
            title: "Real Downtown Loft",
            type: "apartment",
            addressLine1: "12 Real St",
            addressLine2: null,
            city: "Salt Lake City",
            state: "UT",
            country: "USA",
            zipcode: "84101",
            description: "An honest listing that actually exists in Ondo's portfolio.",
            price: 1975,
            bedrooms: 2,
            bathrooms: 2,
            sqft: 850,
            phone: null,
            website: null,
            leaseTerms: null,
            fees: null,
            availability: "Immediate",
            rating: null,
            reviewCount: null,
            amenities: [],
            specialties: [],
            services: [],
            valueRanges: [],
            status: "approved",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            photos: [
              { id: "ph-1", propertyId: "pub-1", url: "/real.jpg", caption: null, orderIndex: 0, createdAt: "" },
            ],
          },
        ],
      }),
    }) as unknown as typeof global.fetch

    render(<FeaturedPropertiesSection />)

    expect(await screen.findByText("Real Downtown Loft")).toBeInTheDocument()
    const detailsLink = screen.getByRole("link", { name: /view details/i })
    expect((detailsLink.getAttribute("href") ?? "").replace(/\/$/, "")).toBe(
      "/properties/pub-1",
    )
    // Zero tolerance for fabricated inventory — a 555 number is the tell.
    expect(screen.queryByText(/555-/)).not.toBeInTheDocument()
  })

  it("shows the honest empty state (never fabricated listings) when the API returns nothing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    }) as unknown as typeof global.fetch

    render(<FeaturedPropertiesSection />)

    await waitFor(() => {
      expect(
        screen.getByText(/New listings post regularly/i),
      ).toBeInTheDocument()
    })
    const rentalLink = screen.getAllByRole("link", { name: /see current rentals/i })[0]
    expect((rentalLink.getAttribute("href") ?? "").replace(/\/$/, "")).toBe(
      "/properties",
    )
  })

  it("shows the empty state on network failure — never renders mock inventory", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof global.fetch

    render(<FeaturedPropertiesSection />)

    await waitFor(() => {
      expect(
        screen.getByText(/New listings post regularly/i),
      ).toBeInTheDocument()
    })
    expect(screen.queryByText(/555-/)).not.toBeInTheDocument()
  })
})
