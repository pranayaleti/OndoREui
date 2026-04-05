import { utahCitiesFromNorthOgdenToNephi, type UtahCity } from "./utah-cities"

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3959 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getNearbyCities(
  cityName: string,
  count = 5,
): UtahCity[] {
  const target = utahCitiesFromNorthOgdenToNephi.find(
    (c) => c.name === cityName,
  )
  if (!target) return []

  const others = utahCitiesFromNorthOgdenToNephi.filter(
    (c) => c.name !== cityName,
  )

  if (target.lat && target.lng) {
    return others
      .filter((c) => c.lat && c.lng)
      .map((c) => ({
        city: c,
        dist: haversineDistance(target.lat!, target.lng!, c.lat!, c.lng!),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, count)
      .map((x) => x.city)
  }

  // Fallback: use array-index proximity (cities are ordered geographically)
  const idx = utahCitiesFromNorthOgdenToNephi.indexOf(target)
  const neighbors: UtahCity[] = []
  for (let offset = 1; neighbors.length < count; offset++) {
    if (idx - offset >= 0) neighbors.push(utahCitiesFromNorthOgdenToNephi[idx - offset])
    if (idx + offset < utahCitiesFromNorthOgdenToNephi.length)
      neighbors.push(utahCitiesFromNorthOgdenToNephi[idx + offset])
    if (idx - offset < 0 && idx + offset >= utahCitiesFromNorthOgdenToNephi.length) break
  }
  return neighbors.slice(0, count)
}
