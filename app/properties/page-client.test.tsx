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
    await waitFor(() => expect(screen.getByTestId("ask-leasing")).toHaveTextContent("empty"))
  })
})
