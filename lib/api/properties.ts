import { networkFirstGet } from "@/lib/api/http"
import { cacheGet, cacheSet, TTL } from "@/lib/cache/idb-cache"
import type { PropertyFilters, PropertySummary } from "@/lib/api/types"

const LAST_VIEWED_KEY = "ondo:last-viewed-properties"
const FAVORITES_KEY = "ondo:favorites"

// Favorites and last-viewed are user preferences, not cached network responses, so they must not
// expire. They live in localStorage. IndexedDB only serves as a one-time migration source for lists
// saved by earlier versions (which expired after 30 minutes) and as a fallback when localStorage is
// unavailable (blocked site data, some private windows).
async function readJsonList<T>(key: string): Promise<T[]> {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as T[]) : []
    }
  } catch {
    return (await cacheGet<T[]>(key)) ?? []
  }
  const legacy = (await cacheGet<T[]>(key)) ?? []
  if (legacy.length > 0) {
    try {
      window.localStorage.setItem(key, JSON.stringify(legacy))
    } catch {
      // Keep serving the legacy copy from IndexedDB.
    }
  }
  return legacy
}

async function writeJsonList<T>(key: string, value: T[]): Promise<void> {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    await cacheSet(key, value, TTL.LONG)
  }
}

function applyFilters(data: PropertySummary[], filters?: PropertyFilters): PropertySummary[] {
  if (!filters) return data

  return data.filter((property) => {
    const priceMatch =
      (filters.minPrice === undefined || property.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || property.price <= filters.maxPrice)
    const bedroomMatch = filters.bedrooms === undefined || property.bedrooms >= filters.bedrooms
    const typeMatch =
      !filters.propertyType || filters.propertyType === "any" || property.propertyType === filters.propertyType
    const locationMatch =
      !filters.location ||
      property.location.toLowerCase().includes(filters.location.toLowerCase().trim())

    return priceMatch && bedroomMatch && typeMatch && locationMatch
  })
}

export async function fetchProperties(filters?: PropertyFilters): Promise<PropertySummary[]> {
  try {
    const data = await networkFirstGet<PropertySummary[]>("/api/properties/public", "properties:list")
    return applyFilters(data, filters)
  } catch {
    return []
  }
}

export async function fetchPropertyById(propertyId: string): Promise<PropertySummary | null> {
  const properties = await fetchProperties()
  const property = properties.find((item) => item.id === propertyId) ?? null
  if (property) {
    await addLastViewedProperty(property)
  }
  return property
}

export async function addLastViewedProperty(property: PropertySummary): Promise<void> {
  const current = (await readJsonList<PropertySummary>(LAST_VIEWED_KEY)).filter((p) => p.id !== property.id)
  const updated = [property, ...current].slice(0, 10)
  await writeJsonList(LAST_VIEWED_KEY, updated)
}

export async function getLastViewedProperties(): Promise<PropertySummary[]> {
  return readJsonList<PropertySummary>(LAST_VIEWED_KEY)
}

export async function toggleFavoriteProperty(propertyId: string): Promise<string[]> {
  const favorites = new Set(await readJsonList<string>(FAVORITES_KEY))
  if (favorites.has(propertyId)) {
    favorites.delete(propertyId)
  } else {
    favorites.add(propertyId)
  }
  const next = Array.from(favorites)
  await writeJsonList(FAVORITES_KEY, next)
  return next
}

export async function getFavoritePropertyIds(): Promise<string[]> {
  return readJsonList<string>(FAVORITES_KEY)
}
