export type UtahCity = {
  name: string
  county?: string
  zips: string[]
  lat?: number
  lng?: number
}

export const utahCitiesFromNorthOgdenToNephi: UtahCity[] = [
  { name: "North Ogden", county: "Weber", zips: ["84414"], lat: 41.3072, lng: -111.9602 },
  { name: "Ogden", county: "Weber", zips: ["84401", "84403", "84404"], lat: 41.2230, lng: -111.9738 },
  { name: "South Ogden", county: "Weber", zips: ["84403", "84405"], lat: 41.1919, lng: -111.9713 },
  { name: "Washington Terrace", county: "Weber", zips: ["84405"], lat: 41.1766, lng: -111.9630 },
  { name: "Riverdale", county: "Weber", zips: ["84405"], lat: 41.1766, lng: -112.0038 },
  { name: "Roy", county: "Weber", zips: ["84067"], lat: 41.1616, lng: -112.0263 },
  { name: "Hooper", county: "Weber", zips: ["84315"], lat: 41.1633, lng: -112.1224 },
  { name: "Clinton", county: "Davis", zips: ["84015"], lat: 41.1394, lng: -112.0502 },
  { name: "West Point", county: "Davis", zips: ["84015"], lat: 41.1183, lng: -112.0841 },
  { name: "Sunset", county: "Davis", zips: ["84015"], lat: 41.1363, lng: -112.0308 },
  { name: "Syracuse", county: "Davis", zips: ["84075"], lat: 41.0894, lng: -112.0647 },
  { name: "Clearfield", county: "Davis", zips: ["84015"], lat: 41.1105, lng: -112.0260 },
  { name: "Layton", county: "Davis", zips: ["84040", "84041"], lat: 41.0602, lng: -111.9711 },
  { name: "Kaysville", county: "Davis", zips: ["84037"], lat: 41.0352, lng: -111.9385 },
  { name: "Farmington", county: "Davis", zips: ["84025"], lat: 40.9805, lng: -111.8874 },
  { name: "Centerville", county: "Davis", zips: ["84014"], lat: 40.9180, lng: -111.8722 },
  { name: "Bountiful", county: "Davis", zips: ["84010", "84011"], lat: 40.8894, lng: -111.8808 },
  { name: "Woods Cross", county: "Davis", zips: ["84087"], lat: 40.8716, lng: -111.8922 },
  { name: "North Salt Lake", county: "Davis", zips: ["84054"], lat: 40.8486, lng: -111.9066 },
  { name: "Salt Lake City", county: "Salt Lake", zips: ["84101", "84102", "84103", "84104", "84105", "84106", "84107", "84108", "84109", "84111", "84112", "84113", "84115", "84116", "84117", "84119", "84121", "84123", "84124", "84129", "84158"], lat: 40.7608, lng: -111.8910 },
  { name: "West Valley City", county: "Salt Lake", zips: ["84119", "84120", "84128"], lat: 40.6916, lng: -111.9391 },
  { name: "Magna", county: "Salt Lake", zips: ["84044"], lat: 40.7091, lng: -112.1016 },
  { name: "Kearns", county: "Salt Lake", zips: ["84118"], lat: 40.6519, lng: -111.9963 },
  { name: "Taylorsville", county: "Salt Lake", zips: ["84123", "84129"], lat: 40.6677, lng: -111.9388 },
  { name: "Murray", county: "Salt Lake", zips: ["84107", "84123"], lat: 40.6669, lng: -111.8880 },
  { name: "South Salt Lake", county: "Salt Lake", zips: ["84115", "84119"], lat: 40.7188, lng: -111.8883 },
  { name: "Millcreek", county: "Salt Lake", zips: ["84106", "84109", "84124"], lat: 40.6866, lng: -111.8755 },
  { name: "Holladay", county: "Salt Lake", zips: ["84117", "84124"], lat: 40.6688, lng: -111.8247 },
  { name: "Cottonwood Heights", county: "Salt Lake", zips: ["84121"], lat: 40.6194, lng: -111.8102 },
  { name: "Midvale", county: "Salt Lake", zips: ["84047", "84070"], lat: 40.6111, lng: -111.8999 },
  { name: "Sandy", county: "Salt Lake", zips: ["84070", "84090", "84091", "84092", "84093", "84094"], lat: 40.5649, lng: -111.8389 },
  { name: "West Jordan", county: "Salt Lake", zips: ["84084", "84088"], lat: 40.6097, lng: -111.9391 },
  { name: "South Jordan", county: "Salt Lake", zips: ["84009", "84095"], lat: 40.5622, lng: -111.9297 },
  { name: "Riverton", county: "Salt Lake", zips: ["84065"], lat: 40.5219, lng: -111.9391 },
  { name: "Herriman", county: "Salt Lake", zips: ["84096"], lat: 40.5141, lng: -112.0330 },
  { name: "Bluffdale", county: "Salt Lake", zips: ["84065"], lat: 40.4897, lng: -111.9380 },
  { name: "Draper", county: "Salt Lake", zips: ["84020"], lat: 40.5246, lng: -111.8638 },
  { name: "Lehi", county: "Utah", zips: ["84043"], lat: 40.3916, lng: -111.8508 },
  { name: "Saratoga Springs", county: "Utah", zips: ["84045"], lat: 40.3494, lng: -111.9046 },
  { name: "Eagle Mountain", county: "Utah", zips: ["84005"], lat: 40.3141, lng: -112.0097 },
  { name: "Alpine", county: "Utah", zips: ["84004"], lat: 40.4533, lng: -111.7777 },
  { name: "Highland", county: "Utah", zips: ["84003"], lat: 40.4272, lng: -111.7952 },
  { name: "American Fork", county: "Utah", zips: ["84003"], lat: 40.3769, lng: -111.7952 },
  { name: "Pleasant Grove", county: "Utah", zips: ["84062"], lat: 40.3641, lng: -111.7385 },
  { name: "Lindon", county: "Utah", zips: ["84042"], lat: 40.3430, lng: -111.7213 },
  { name: "Vineyard", county: "Utah", zips: ["84059"], lat: 40.3047, lng: -111.7474 },
  { name: "Orem", county: "Utah", zips: ["84057", "84058", "84097"], lat: 40.2969, lng: -111.6946 },
  { name: "Provo", county: "Utah", zips: ["84601", "84604", "84606"], lat: 40.2338, lng: -111.6585 },
  { name: "Springville", county: "Utah", zips: ["84663"], lat: 40.1652, lng: -111.6107 },
  { name: "Mapleton", county: "Utah", zips: ["84664"], lat: 40.1316, lng: -111.5785 },
  { name: "Spanish Fork", county: "Utah", zips: ["84660"], lat: 40.1150, lng: -111.6549 },
  { name: "Salem", county: "Utah", zips: ["84653"], lat: 40.0530, lng: -111.6735 },
  { name: "Payson", county: "Utah", zips: ["84651"], lat: 40.0444, lng: -111.7324 },
  { name: "Santaquin", county: "Utah", zips: ["84655"], lat: 39.9755, lng: -111.7852 },
  { name: "Nephi", county: "Juab", zips: ["84648"], lat: 39.7105, lng: -111.8363 },
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
