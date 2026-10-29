import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ApiProperty } from "@/app/types/property"
import { PropertyListingDetailLive } from "./property-listing-detail-client"

// The wrapper's job is choosing which data to show, not the page markup —
// stub the heavy detail component and the network layer.
vi.mock("@/components/properties/property-listing-detail", () => ({
  PropertyListingDetail: ({ property, related }: { property: ApiProperty; related?: ApiProperty[] }) => (
    <div>
      <span data-testid="title">{property.title}</span>
      <span data-testid="related-count">{related?.length ?? 0}</span>
    </div>
  ),
  PropertyUnavailable: () => <div>unavailable</div>,
}))

const fetchPublicPropertyByPublicId = vi.fn()
const fetchPublicPropertyList = vi.fn()
vi.mock("@/lib/public-property", () => ({
  fetchPublicPropertyByPublicId: (...args: unknown[]) => fetchPublicPropertyByPublicId(...args),
  fetchPublicPropertyList: (...args: unknown[]) => fetchPublicPropertyList(...args),
}))

function makeProperty(title: string): ApiProperty {
  return { id: "p1", publicId: "pub-1", title } as ApiProperty
}

beforeEach(() => {
  fetchPublicPropertyByPublicId.mockReset()
  fetchPublicPropertyList.mockReset()
  fetchPublicPropertyList.mockResolvedValue([])
})

describe("PropertyListingDetailLive", () => {
  it("renders the build-time data immediately, then swaps in the live copy", async () => {
    fetchPublicPropertyByPublicId.mockResolvedValue(makeProperty("Live title"))

    render(
      <PropertyListingDetailLive
        publicId="pub-1"
        initialProperty={makeProperty("Baked title")}
      />,
    )

    expect(screen.getByTestId("title")).toHaveTextContent("Baked title")
    await waitFor(() => expect(screen.getByTestId("title")).toHaveTextContent("Live title"))
  })

  it("keeps the static content when the live fetch cannot resolve the listing", async () => {
    fetchPublicPropertyByPublicId.mockResolvedValue(null)

    render(
      <PropertyListingDetailLive
        publicId="pub-1"
        initialProperty={makeProperty("Baked title")}
      />,
    )

    await waitFor(() => expect(fetchPublicPropertyByPublicId).toHaveBeenCalled())
    expect(screen.getByTestId("title")).toHaveTextContent("Baked title")
  })

  it("keeps the build-time related listings when the live list is empty", async () => {
    fetchPublicPropertyByPublicId.mockResolvedValue(makeProperty("Live title"))
    fetchPublicPropertyList.mockResolvedValue([])

    render(
      <PropertyListingDetailLive
        publicId="pub-1"
        initialProperty={makeProperty("Baked title")}
        initialRelated={[makeProperty("Related A"), makeProperty("Related B")]}
      />,
    )

    await waitFor(() => expect(screen.getByTestId("title")).toHaveTextContent("Live title"))
    expect(screen.getByTestId("related-count")).toHaveTextContent("2")
  })
})
