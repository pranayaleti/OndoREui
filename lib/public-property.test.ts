import { afterEach, describe, expect, it, vi } from "vitest"
import type { ApiProperty } from "@/app/types/property"
import {
  fetchPublicPropertyByPublicId,
  fetchPublicPropertyList,
  findPublicProperty,
  listingDetailPath,
  publicIdFromPathname,
  publicIdsFromListBody,
} from "./public-property"

vi.mock("@/lib/backend", () => ({
  backendUrl: (path: string) => `http://backend.test${path}`,
}))

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

function listing(overrides: Partial<ApiProperty> = {}): ApiProperty {
  return {
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
    ...overrides,
  }
}

describe("listingDetailPath", () => {
  it("keeps the public pretty URL that cards and map pins already use", () => {
    expect(listingDetailPath("c2e653bf-1b6a-4f0c-9654-82a4896cb137")).toBe(
      "/properties/c2e653bf-1b6a-4f0c-9654-82a4896cb137",
    )
  })
})

describe("publicIdFromPathname", () => {
  it("reads the publicId from a trailing-slash static-export path", () => {
    expect(publicIdFromPathname("/properties/c2e653bf-1b6a-4f0c-9654-82a4896cb137/")).toBe(
      "c2e653bf-1b6a-4f0c-9654-82a4896cb137",
    )
  })

  it("does not treat the browse page, compare page, or the build placeholder as a listing", () => {
    expect(publicIdFromPathname("/properties")).toBeNull()
    expect(publicIdFromPathname("/properties/")).toBeNull()
    expect(publicIdFromPathname("/properties/_placeholder/")).toBeNull()
    expect(publicIdFromPathname("/properties/compare")).toBeNull()
    expect(publicIdFromPathname("/properties/compare/")).toBeNull()
    expect(publicIdFromPathname("/properties/abc/extra")).toBeNull()
  })
})

describe("findPublicProperty", () => {
  it("matches a UUID publicId even when it differs from the internal id", () => {
    const row = listing()
    expect(findPublicProperty({ data: [row] }, row.publicId!)?.title).toBe(row.title)
    expect(findPublicProperty([row], row.id!)?.title).toBe(row.title)
  })
})

describe("fetchPublicPropertyByPublicId", () => {
  it("uses the by-id endpoint when it resolves a UUID publicId", async () => {
    const row = listing()
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes(`/api/properties/public/${row.publicId}`)) {
        return { ok: true, json: async () => row } as Response
      }
      throw new Error(`unexpected url ${url}`)
    }) as unknown as typeof fetch

    const result = await fetchPublicPropertyByPublicId(row.publicId)
    expect(result?.publicId).toBe(row.publicId)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it("falls back to the public list when by-id is missing (rollout / outage)", async () => {
    const row = listing()
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes(`/api/properties/public/${row.publicId}`)) {
        return { ok: false, status: 404, json: async () => ({ message: "Property not found" }) } as Response
      }
      if (url.endsWith("/api/properties/public")) {
        return { ok: true, json: async () => ({ data: [row] }) } as Response
      }
      throw new Error(`unexpected url ${url}`)
    }) as unknown as typeof fetch

    const result = await fetchPublicPropertyByPublicId(row.publicId)
    expect(result?.publicId).toBe(row.publicId)
    expect(result?.id).toBe(row.id)
    expect(result?.title).toBe("Avenues Victorian Duplex")
  })

  it("does not invent a listing for the export placeholder id", async () => {
    const spy = vi.fn()
    global.fetch = spy as unknown as typeof fetch
    expect(await fetchPublicPropertyByPublicId("_placeholder")).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })
})

describe("fetchPublicPropertyList", () => {
  it("returns approved listings from the public list envelope", async () => {
    const row = listing()
    global.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: [row] }),
    })) as unknown as typeof fetch

    const result = await fetchPublicPropertyList()
    expect(result).toHaveLength(1)
    expect(result[0]?.publicId).toBe(row.publicId)
  })
})

describe("publicIdsFromListBody", () => {
  it("prefers publicId and still accepts snake_case or internal id", () => {
    expect(
      publicIdsFromListBody({
        data: [
          listing(),
          { public_id: "slug-home", title: "Slug Home" },
          { id: "internal-only" },
        ],
      }),
    ).toEqual(["c2e653bf-1b6a-4f0c-9654-82a4896cb137", "slug-home", "internal-only"])
  })
})
