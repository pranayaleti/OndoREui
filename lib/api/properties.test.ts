import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const idb = new Map<string, unknown>()
vi.mock("@/lib/cache/idb-cache", () => ({
  TTL: { SHORT: 1, MEDIUM: 2, LONG: 3, DAY: 4 },
  cacheGet: vi.fn(async (key: string) => (idb.has(key) ? idb.get(key) : null)),
  cacheSet: vi.fn(async (key: string, value: unknown) => {
    idb.set(key, value)
  }),
}))
vi.mock("@/lib/api/http", () => ({ networkFirstGet: vi.fn() }))

import {
  addLastViewedProperty,
  getFavoritePropertyIds,
  getLastViewedProperties,
  toggleFavoriteProperty,
} from "./properties"
import type { PropertySummary } from "@/lib/api/types"

const home = (id: string) => ({ id, title: `Home ${id}` }) as unknown as PropertySummary
const TWO_HOURS = 2 * 60 * 60 * 1000

beforeEach(() => {
  idb.clear()
  window.localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date("2026-09-30T12:00:00Z"))
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("saved homes persistence", () => {
  it("keeps favorites after two hours", async () => {
    await toggleFavoriteProperty("a")
    await toggleFavoriteProperty("b")
    vi.setSystemTime(Date.now() + TWO_HOURS)
    expect(await getFavoritePropertyIds()).toEqual(["a", "b"])
  })

  it("keeps last-viewed homes after two hours, newest first", async () => {
    await addLastViewedProperty(home("a"))
    await addLastViewedProperty(home("b"))
    vi.setSystemTime(Date.now() + TWO_HOURS)
    expect((await getLastViewedProperties()).map((p) => p.id)).toEqual(["b", "a"])
  })

  it("removes a favorite when toggled twice", async () => {
    await toggleFavoriteProperty("a")
    expect(await toggleFavoriteProperty("a")).toEqual([])
    expect(await getFavoritePropertyIds()).toEqual([])
  })

  it("migrates a list saved by the old IndexedDB cache", async () => {
    idb.set("ondo:favorites", ["legacy"])
    expect(await getFavoritePropertyIds()).toEqual(["legacy"])
    expect(window.localStorage.getItem("ondo:favorites")).toBe('["legacy"]')
    expect(await toggleFavoriteProperty("new")).toEqual(["legacy", "new"])
  })

  it("falls back to IndexedDB when localStorage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    expect(await toggleFavoriteProperty("a")).toEqual(["a"])
    expect(await getFavoritePropertyIds()).toEqual(["a"])
  })
})
