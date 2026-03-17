import { networkFirstGet } from "@/lib/api/http"
import { cacheGet, cacheSet, TTL } from "@/lib/cache/idb-cache"
import type { PropertyFilters, PropertySummary } from "@/lib/api/types"

const LAST_VIEWED_KEY = "ondo:last-viewed-properties"
const FAVORITES_KEY = "ondo:favorites"

async function readJsonList<T>(key: string): Promise<T[]> {
  const cached = await cacheGet<T[]>(key)
  return cached ?? []
}

async function writeJsonList<T>(key: string, value: T[]): Promise<void> {
  // User preference lists use LONG TTL (30 min) — they are small and mutation-driven,
  // not network responses, so we keep them alive between page loads.
  await cacheSet(key, value, TTL.LONG)
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
