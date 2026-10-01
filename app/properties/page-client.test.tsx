import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import PropertiesClient from "./page-client"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}))

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}))

vi.mock("@/components/seo", () => ({
  default: () => null,
}))

vi.mock("@/components/properties/webmcp-property-search-tool", () => ({
  WebMCPPropertySearchTool: () => null,
}))

vi.mock("@/components/properties/renter-availability-note", () => ({
  RenterAvailabilityNote: (props: { variant?: string }) => (
    <div data-testid="ask-leasing">{props.variant}</div>
  ),
}))

vi.mock("@/components/properties/rental-listing-card", () => ({
  RentalListingCard: ({ property }: { property: { title: string } }) => (
    <div>{property.title}</div>
  ),
}))

vi.mock("@/components/properties/listing-compare-bar", () => ({
  ListingCompareBar: () => null,
}))

vi.mock("@/lib/backend", () => ({
  backendUrl: (path: string) => `http://localhost:3030${path}`,
}))

vi.mock("@/lib/cache", () => ({
  caches: { properties: { get: () => null, set: () => undefined } },
  cacheKeys: { api: { properties: () => "properties" } },
}))

vi.mock("@/lib/bfcache-optimization", () => ({
  registerBfcacheRestoreCallback: () => () => undefined,
}))

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

describe("PropertiesClient", () => {
  it("renders the map-first hero and the leasing note after a successful empty fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    }) as unknown as typeof fetch

    render(<PropertiesClient />)

    expect(screen.getByRole("heading", { name: /utah rentals on the map/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /how to rent with ondo/i })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId("ask-leasing")).toHaveTextContent("empty"))
  })

  it("still offers the leasing form when live listings fail to load", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network")) as unknown as typeof fetch

    render(<PropertiesClient />)

    await waitFor(() => expect(screen.getByTestId("ask-leasing")).toHaveTextContent("empty"))
    expect(screen.getByRole("heading", { name: /how to rent with ondo/i })).toBeInTheDocument()
  })

  it("shows a fixed friendly error and no '0 homes' count when listings fail to load", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch")) as unknown as typeof fetch

    render(<PropertiesClient />)

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument())
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load listings. Check your connection and try again.",
    )
    expect(screen.queryByText(/failed to fetch/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/homes? on the market/i)).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /contact leasing/i })).toBeInTheDocument()
  })

  it("keeps the renter explainer out of the hero so the first listings sit in the first screen", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    }) as unknown as typeof fetch

    render(<PropertiesClient />)

    const hero = screen.getByRole("heading", { name: /utah rentals on the map/i }).closest("section")
    const explainer = screen.getByRole("heading", { name: /how to rent with ondo/i })
    const results = screen.getByRole("heading", { name: /available rentals/i })
    expect(hero).not.toContainElement(explainer)
    expect(results.compareDocumentPosition(explainer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
