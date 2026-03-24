export type UtahCity = {
  name: string
  county?: string
  zips: string[]
  lat?: number
  lng?: number
}

export const utahCitiesFromNorthOgdenToNephi: UtahCity[] = [
  { name: "North Ogden", zips: ["84414"] },
  { name: "Ogden", zips: ["84401", "84403", "84404"] },
  { name: "South Ogden", zips: ["84403", "84405"] },
  { name: "Washington Terrace", zips: ["84405"] },
  { name: "Riverdale", zips: ["84405"] },
  { name: "Roy", zips: ["84067"] },
  { name: "Hooper", zips: ["84315"] },
  { name: "Clinton", zips: ["84015"] },
  { name: "West Point", zips: ["84015"] },
  { name: "Sunset", zips: ["84015"] },
  { name: "Syracuse", zips: ["84075"] },
  { name: "Clearfield", zips: ["84015"] },
  { name: "Layton", zips: ["84040", "84041"] },
  { name: "Kaysville", zips: ["84037"] },
  { name: "Farmington", zips: ["84025"] },
  { name: "Centerville", zips: ["84014"] },
  { name: "Bountiful", zips: ["84010", "84011"] },
  { name: "Woods Cross", zips: ["84087"] },
  { name: "North Salt Lake", zips: ["84054"] },
  { name: "Salt Lake City", zips: ["84101", "84102", "84103", "84104", "84105", "84106", "84107", "84108", "84109", "84111", "84112", "84113", "84115", "84116", "84117", "84119", "84121", "84123", "84124", "84129", "84158"], lat: 40.7608, lng: -111.8910 },
  { name: "West Valley City", zips: ["84119", "84120", "84128"] },
  { name: "Magna", zips: ["84044"] },
  { name: "Kearns", zips: ["84118"] },
  { name: "Taylorsville", zips: ["84123", "84129"] },
  { name: "Murray", zips: ["84107", "84123"] },
  { name: "South Salt Lake", zips: ["84115", "84119"] },
  { name: "Millcreek", zips: ["84106", "84109", "84124"] },
  { name: "Holladay", zips: ["84117", "84124"] },
  { name: "Cottonwood Heights", zips: ["84121"] },
  { name: "Midvale", zips: ["84047", "84070"] },
  { name: "Sandy", zips: ["84070", "84090", "84091", "84092", "84093", "84094"], lat: 40.5649, lng: -111.8389 },
  { name: "West Jordan", zips: ["84084", "84088"] },
  { name: "South Jordan", zips: ["84009", "84095"] },
  { name: "Riverton", zips: ["84065"] },
  { name: "Herriman", zips: ["84096"] },
  { name: "Bluffdale", zips: ["84065"] },
  { name: "Draper", zips: ["84020"], lat: 40.5246, lng: -111.8638 },
  { name: "Lehi", zips: ["84043"] },
  { name: "Saratoga Springs", zips: ["84045"] },
  { name: "Eagle Mountain", zips: ["84005"] },
  { name: "Alpine", zips: ["84004"] },
  { name: "Highland", zips: ["84003"] },
  { name: "American Fork", zips: ["84003"] },
  { name: "Pleasant Grove", zips: ["84062"] },
  { name: "Lindon", zips: ["84042"] },
  { name: "Vineyard", zips: ["84059"] },
  { name: "Orem", zips: ["84057", "84058", "84097"], lat: 40.2969, lng: -111.6946 },
  { name: "Provo", zips: ["84601", "84604", "84606"], lat: 40.2338, lng: -111.6585 },
  { name: "Springville", zips: ["84663"] },
  { name: "Mapleton", zips: ["84664"] },
  { name: "Spanish Fork", zips: ["84660"] },
  { name: "Salem", zips: ["84653"] },
  { name: "Payson", zips: ["84651"], lat: 40.0444, lng: -111.7324 },
  { name: "Santaquin", zips: ["84655"] },
  { name: "Nephi", zips: ["84648"] },
]

export function toCitySlug(cityName: string): string {
  return cityName
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function findCityBySlug(slug: string): UtahCity | undefined {
  const normalized = slug.toLowerCase()
  return utahCitiesFromNorthOgdenToNephi.find(
    (c) => toCitySlug(c.name) === normalized,
  )
}

export function findCityByZip(zip: string): UtahCity | undefined {
  const digits = zip.trim()
  return utahCitiesFromNorthOgdenToNephi.find((c) => c.zips.includes(digits))
}

export const allCitySlugs = utahCitiesFromNorthOgdenToNephi.map((c) => toCitySlug(c.name))
export const allZips = utahCitiesFromNorthOgdenToNephi.flatMap((c) => c.zips)


