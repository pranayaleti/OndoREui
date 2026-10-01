import { afterEach, describe, expect, it, vi } from "vitest"
import type { ApiProperty } from "@/app/types/property"
import {
  checkListingAvailability,
  fetchAllPublicListingRows,
  fetchPublicListingRowsForBuild,
  fetchPublicPropertyByPublicId,
  fetchPublicPropertyList,
  PublicListingsHttpError,
  fetchPublicPropertyListOrThrow,
  findPublicProperty,
  listingDetailPath,
  listingWorksheetPath,
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

describe("listingWorksheetPath", () => {
  it("points at the listing worksheet hash, not a second investor funnel", () => {
    expect(listingWorksheetPath("pub-lehi-1")).toBe("/properties/pub-lehi-1#underwrite")
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
      if (url.includes("/api/properties/public?")) {
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

describe("fetchPublicPropertyListOrThrow", () => {
  it("rejects on a 503 so callers can tell an outage from an empty market", async () => {
    global.fetch = vi.fn(async () => ({ ok: false, status: 503, json: async () => ({}) })) as unknown as typeof fetch
    await expect(fetchPublicPropertyListOrThrow()).rejects.toThrow(/503/)
    expect(await fetchPublicPropertyList()).toEqual([])
  })

  it("rejects on a network error", async () => {
    global.fetch = vi.fn(async () => {
      throw new TypeError("Failed to fetch")
    }) as unknown as typeof fetch
    await expect(fetchPublicPropertyListOrThrow()).rejects.toThrow()
  })

  it("resolves an empty list when the market really is empty", async () => {
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ data: [] }) })) as unknown as typeof fetch
    await expect(fetchPublicPropertyListOrThrow()).resolves.toEqual([])
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

describe("fetchAllPublicListingRows", () => {
  function pagedFetch(pages: unknown[]) {
    return vi.fn(async (input: RequestInfo | URL) => {
      const page = Number(new URL(String(input)).searchParams.get("page") ?? "1")
      return { ok: true, json: async () => pages[page - 1] ?? { data: [], pagination: { hasMore: false } } } as Response
    }) as unknown as typeof fetch
  }

  it("asks for the maximum page size so the default 20-row cap does not apply", async () => {
    const fetchImpl = pagedFetch([{ data: [listing()], pagination: { page: 1, limit: 100, total: 1, hasMore: false } }])
    await fetchAllPublicListingRows(fetchImpl)
    const url = new URL(String((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]))
    expect(url.searchParams.get("limit")).toBe("100")
    expect(url.searchParams.get("page")).toBe("1")
  })

  it("follows hasMore until the last page and keeps every row", async () => {
    const a = listing({ publicId: "a", id: "ia" })
    const b = listing({ publicId: "b", id: "ib" })
    const c = listing({ publicId: "c", id: "ic" })
    const fetchImpl = pagedFetch([
      { data: [a, b], pagination: { hasMore: true } },
      { data: [c], pagination: { hasMore: false } },
    ])
    const rows = await fetchAllPublicListingRows(fetchImpl)
    expect(rows.map((r) => (r as ApiProperty).publicId)).toEqual(["a", "b", "c"])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it("stops after one request for a plain array or an envelope without pagination", async () => {
    const fetchArray = pagedFetch([[listing()]])
    expect(await fetchAllPublicListingRows(fetchArray)).toHaveLength(1)
    expect(fetchArray).toHaveBeenCalledTimes(1)
    const fetchEnvelope = pagedFetch([{ data: [listing()] }])
    expect(await fetchAllPublicListingRows(fetchEnvelope)).toHaveLength(1)
    expect(fetchEnvelope).toHaveBeenCalledTimes(1)
  })

  it("does not loop forever when hasMore stays true on empty pages", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: [], pagination: { hasMore: true } }),
    })) as unknown as typeof fetch
    await fetchAllPublicListingRows(fetchImpl)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it("rejects with the HTTP status so callers can pick a message", async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 429, json: async () => ({}) })) as unknown as typeof fetch
    const err = await fetchAllPublicListingRows(fetchImpl).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(PublicListingsHttpError)
    expect((err as PublicListingsHttpError).status).toBe(429)
  })

  it("rejects when the body is not a list", async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ message: "nope" }) })) as unknown as typeof fetch
    await expect(fetchAllPublicListingRows(fetchImpl)).rejects.toThrow(/Invalid response/)
  })
})

describe("checkListingAvailability", () => {
  const row = listing()

  function route(byId: { ok: boolean; status: number } | Error, list: unknown | Error) {
    return vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      const isList = url.includes("/api/properties/public?")
      const result = isList ? list : byId
      if (result instanceof Error) throw result
      if (isList) return { ok: true, json: async () => result } as Response
      return { ...(result as object), json: async () => ({}) } as Response
    }) as unknown as typeof fetch
  }

  it("is available when the by-id endpoint answers", async () => {
    const fetchImpl = route({ ok: true, status: 200 }, { data: [] })
    expect(await checkListingAvailability(row.publicId!, fetchImpl)).toBe("available")
  })

  it("is unavailable only when by-id 404s and the list loads without the listing", async () => {
    const fetchImpl = route({ ok: false, status: 404 }, { data: [] })
    expect(await checkListingAvailability(row.publicId!, fetchImpl)).toBe("unavailable")
  })

  it("stays available when by-id 404s on an older Edge but the list still has the listing", async () => {
    const fetchImpl = route({ ok: false, status: 404 }, { data: [row] })
    expect(await checkListingAvailability(row.publicId!, fetchImpl)).toBe("available")
  })

  it("is unknown on a 5xx, a network error, or a list that fails to load", async () => {
    expect(await checkListingAvailability(row.publicId!, route({ ok: false, status: 503 }, { data: [] }))).toBe("unknown")
    expect(await checkListingAvailability(row.publicId!, route(new TypeError("offline"), { data: [] }))).toBe("unknown")
    expect(await checkListingAvailability(row.publicId!, route({ ok: false, status: 404 }, new TypeError("offline")))).toBe("unknown")
  })

  it("does not check the export placeholder id", async () => {
    const spy = vi.fn()
    expect(await checkListingAvailability("_placeholder", spy as unknown as typeof fetch)).toBe("unknown")
    expect(spy).not.toHaveBeenCalled()
  })
})

describe("sale rows are not shown as rentals", () => {
  it("drops sale rows from the list, the lookup and the static params", async () => {
    const sale = listing({ publicId: "sale-1", listingKind: "sale" })
    const lease = listing({ publicId: "lease-1", listingKind: "lease" })
    const legacy = listing({ publicId: "legacy-1", listingKind: null })
    const body = { data: [sale, lease, legacy] }
    expect(publicIdsFromListBody(body)).toEqual(["lease-1", "legacy-1"])
    expect(findPublicProperty(body, "sale-1")).toBeNull()
    expect(findPublicProperty(body, "lease-1")?.publicId).toBe("lease-1")
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => body }) as unknown as typeof fetch
    expect((await fetchPublicPropertyListOrThrow()).map((r) => r.publicId)).toEqual(["lease-1", "legacy-1"])
  })
})

describe("fetchPublicListingRowsForBuild", () => {
  const okPage = { ok: true, json: async () => ({ data: [listing()], pagination: { hasMore: false } }) } as Response

  it("returns the rows on the first success without retrying", async () => {
    const fetchImpl = vi.fn(async () => okPage) as unknown as typeof fetch
    const rows = await fetchPublicListingRowsForBuild(fetchImpl, { retryDelayMs: 0 })
    expect(rows).toHaveLength(1)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it("retries after a failure and recovers", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce({ ok: false, status: 503 } as Response)
      .mockResolvedValue(okPage) as unknown as typeof fetch
    const rows = await fetchPublicListingRowsForBuild(fetchImpl, { attempts: 3, retryDelayMs: 0 })
    expect(rows).toHaveLength(1)
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it("rejects with the last error once every attempt has failed", async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 502 }) as Response) as unknown as typeof fetch
    await expect(
      fetchPublicListingRowsForBuild(fetchImpl, { attempts: 3, retryDelayMs: 0 }),
    ).rejects.toBeInstanceOf(PublicListingsHttpError)
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it("gives every request an abort signal", async () => {
    const fetchImpl = vi.fn(async () => okPage) as unknown as typeof fetch
    await fetchPublicListingRowsForBuild(fetchImpl, { retryDelayMs: 0 })
    const init = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0]?.[1] as RequestInit
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })
})
