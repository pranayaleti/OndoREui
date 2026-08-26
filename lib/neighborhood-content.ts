export type NeighborhoodInfo = {
  name: string
  slug: string
  city: string
  description: string
  character: string
  typicalHomes: string
  priceRange: string
  /**
   * Housing-stock, amenities, transit, and market facts only.
   * Never household type, occupation, religion, or “who should live here”
   * (Fair Housing).
   */
  highlights: string[]
  nearbySchools?: string[]
  nearbyParks?: string[]
  walkability: "High" | "Moderate" | "Low"
  /**
   * Approximate neighborhood-center coordinates, for map display only ,
   * not surveyed boundaries. Good-faith estimates from each neighborhood's
   * description; refine if precision ever matters for a future feature.
   */
  centerLat: number
  centerLng: number
}

/**
 * Neighborhood data for top cities. Each entry maps city name → array of neighborhoods.
 * Start with the cities that already have named neighborhoods in city-content.ts.
 */
export const neighborhoodsByCity: Record<string, NeighborhoodInfo[]> = {
  "Salt Lake City": [
    {
      name: "The Avenues",
      slug: "the-avenues",
      city: "Salt Lake City",
      description: "One of SLC's oldest and most walkable neighborhoods, stretching up the hillside north of downtown. Tree-lined streets, Victorian and Craftsman homes, and a tight-knit community feel.",
      character: "Historic hillside streets, high walkability, valley views, and proximity to hospitals and the University of Utah.",
      typicalHomes: "Victorian, Craftsman, and mid-century homes; some modern infill townhomes",
      priceRange: "$450K–$900K",
      highlights: ["Victorian and Craftsman housing", "High walkability", "Near City Creek Canyon and Memory Grove"],
      nearbySchools: ["Ensign Elementary", "West High School"],
      nearbyParks: ["City Creek Canyon", "Memory Grove Park", "Lindsey Gardens"],
      walkability: "High",
      centerLat: 40.7794,
      centerLng: -111.8788,
    },
    {
      name: "Sugar House",
      slug: "sugar-house",
      city: "Salt Lake City",
      description: "A revitalized neighborhood centered around Sugar House Park and the 2100 South commercial strip. Mix of restaurants, boutiques, and growing density with TRAX access.",
      character: "East Salt Lake hub on 2100 South with TRAX, dining, and Sugar House Park.",
      typicalHomes: "Bungalows, ramblers, and new-construction condos/townhomes",
      priceRange: "$400K–$750K",
      highlights: ["TRAX on 2100 South", "Bungalows and new townhomes", "Sugar House Park"],
      nearbySchools: ["Hawthorne Elementary", "Highland High School"],
      nearbyParks: ["Sugar House Park", "Hidden Hollow Nature Preserve", "Fairmont Park"],
      walkability: "High",
      centerLat: 40.7217,
      centerLng: -111.8496,
    },
    {
      name: "Liberty Wells",
      slug: "liberty-wells",
      city: "Salt Lake City",
      description: "A neighborhood south of Liberty Park with access to downtown, 9th & 9th, and the freeway. Mix of pre-war bungalows, duplexes, and newer townhomes.",
      character: "Pre-war bungalows and duplexes south of Liberty Park, with downtown and 9th & 9th access.",
      typicalHomes: "Pre-war bungalows, duplexes, and some new townhome developments",
      priceRange: "$350K–$600K",
      highlights: ["Pre-war bungalows and duplexes", "Near Liberty Park", "I-15 and downtown access"],
      nearbySchools: ["Emerson Elementary", "Nibley Park Elementary"],
      nearbyParks: ["Liberty Park", "Gilgal Sculpture Garden"],
      walkability: "Moderate",
      centerLat: 40.7280,
      centerLng: -111.8730,
    },
    {
      name: "Downtown",
      slug: "downtown",
      city: "Salt Lake City",
      description: "The urban core with high-rise condos, lofts, and walkable access to dining, entertainment, Temple Square, and TRAX/FrontRunner transit hubs.",
      character: "Urban, car-optional core with TRAX and FrontRunner hubs, high-rises, and lofts.",
      typicalHomes: "High-rise condos, converted lofts, luxury apartments",
      priceRange: "$250K–$700K",
      highlights: ["TRAX and FrontRunner hubs", "High-rise condos and lofts", "Walkable downtown core"],
      nearbySchools: ["Open Classroom", "West High School"],
      nearbyParks: ["Pioneer Park", "Gateway Discovery Park"],
      walkability: "High",
      centerLat: 40.7670,
      centerLng: -111.8910,
    },
  ],
  Draper: [
    {
      name: "South Mountain",
      slug: "south-mountain",
      city: "Draper",
      description: "Hillside estates with panoramic valley views stretching from Point of the Mountain to the Wasatch peaks. Large lots, custom builds, and direct access to Corner Canyon trails.",
      character: "Hillside lots, custom homes, valley views, and direct Corner Canyon trail access.",
      typicalHomes: "Custom-built 4,000+ sqft homes on large lots",
      priceRange: "$800K–$1.5M+",
      highlights: ["Custom 4,000+ sqft homes", "Large hillside lots", "Corner Canyon trail access"],
      nearbySchools: ["Corner Canyon High School", "Draper Elementary"],
      nearbyParks: ["Corner Canyon Regional Park", "Potato Hill Trail"],
      walkability: "Low",
      centerLat: 40.4850,
      centerLng: -111.8600,
    },
    {
      name: "Suncrest",
      slug: "suncrest",
      city: "Draper",
      description: "A master-planned mountain community perched above Draper with 360-degree views. Modern homes and HOA-maintained common areas.",
      character: "Master-planned mountain community with newer construction, HOA commons, and wide views.",
      typicalHomes: "Modern 3,000–5,000 sqft homes, newer construction (2005–present)",
      priceRange: "$650K–$1.2M",
      highlights: ["2005–present construction", "HOA-maintained commons", "Mountain and valley views"],
      nearbySchools: ["Summit Academy", "Corner Canyon High School"],
      nearbyParks: ["Suncrest Park", "BST Trail Access"],
      walkability: "Low",
      centerLat: 40.4950,
      centerLng: -111.8300,
    },
    {
      name: "Draper Peaks",
      slug: "draper-peaks",
      city: "Draper",
      description: "Newer construction neighborhood near retail and dining along 12300 South. Convenient access to I-15, Silicon Slopes offices, and Cowabunga Bay.",
      character: "Newer construction near 12300 South retail, I-15, and Silicon Slopes offices.",
      typicalHomes: "Newer single-family homes, townhomes, and paired homes",
      priceRange: "$500K–$800K",
      highlights: ["Newer single-family and townhomes", "12300 South retail", "I-15 / Silicon Slopes commute"],
      nearbySchools: ["Draper Park Middle School", "Draper Elementary"],
      nearbyParks: ["Draper City Park", "Galena Park"],
      walkability: "Moderate",
      centerLat: 40.5230,
      centerLng: -111.8630,
    },
  ],
  Lehi: [
    {
      name: "Traverse Mountain",
      slug: "traverse-mountain",
      city: "Lehi",
      description: "A sprawling master-planned community on the Point of the Mountain with retail village, trails, and quick I-15 access. Near Adobe, Vivint, and other Silicon Slopes campuses.",
      character: "Master-planned Point of the Mountain community with retail village, trails, and I-15 access.",
      typicalHomes: "Townhomes, single-family homes, and luxury builds (2010–present)",
      priceRange: "$450K–$900K",
      highlights: ["Townhomes and 2010s builds", "Retail village and trails", "Point of the Mountain / I-15"],
      nearbySchools: ["Traverse Mountain Elementary", "Vista Heights Middle"],
      nearbyParks: ["Traverse Mountain Park", "Murdock Canal Trail"],
      walkability: "Moderate",
      centerLat: 40.4630,
      centerLng: -111.8850,
    },
    {
      name: "Thanksgiving Point",
      slug: "thanksgiving-point",
      city: "Lehi",
      description: "Area surrounding the Thanksgiving Point campus, museums, gardens, golf, and restaurants. Established neighborhoods with tree-lined streets.",
      character: "Established streets by Thanksgiving Point museums, gardens, golf, and restaurants.",
      typicalHomes: "Single-family ramblers and two-stories on medium lots",
      priceRange: "$500K–$800K",
      highlights: ["Ramblers and two-stories", "Museums, gardens, and golf nearby", "Tree-lined established streets"],
      nearbySchools: ["Dry Creek Elementary", "Willowcreek Middle"],
      nearbyParks: ["Ashton Gardens", "Museum of Natural Curiosity", "Thanksgiving Point Golf Club"],
      walkability: "Moderate",
      centerLat: 40.4180,
      centerLng: -111.8460,
    },
    {
      name: "Lehi Old Town",
      slug: "lehi-old-town",
      city: "Lehi",
      description: "Lehi's historic core along Main Street with older homes, renovation potential, and small-town character. Home to the annual Lehi Round-Up Days rodeo.",
      character: "Historic Main Street core with pre-1970s housing and renovation inventory.",
      typicalHomes: "Pre-1970s ramblers, bungalows, and farmhouse conversions",
      priceRange: "$350K–$550K",
      highlights: ["Pre-1970s housing stock", "Walkable Main Street", "Renovation inventory"],
      nearbySchools: ["Lehi Elementary", "Lehi Junior High"],
      nearbyParks: ["Wines Park", "Lehi Legacy Center"],
      walkability: "High",
      centerLat: 40.3916,
      centerLng: -111.8508,
    },
  ],
  Provo: [
    {
      name: "Downtown Provo",
      slug: "downtown-provo",
      city: "Provo",
      description: "Walkable arts district with independent shops, restaurants, and nightlife along Center Street. Close to the Covey Center for the Arts and Provo City Library.",
      character: "Walkable Center Street district with historic homes, condos, and mixed-use buildings.",
      typicalHomes: "Historic homes, condos, and new mixed-use developments",
      priceRange: "$300K–$600K",
      highlights: ["Historic homes and mixed-use", "Walkable Center Street", "Near Covey Center and library"],
      nearbySchools: ["Provo High School", "Dixon Middle School"],
      nearbyParks: ["Pioneer Park", "North Park"],
      walkability: "High",
      centerLat: 40.2338,
      centerLng: -111.6585,
    },
    {
      name: "Edgemont / Oak Hills",
      slug: "edgemont-oak-hills",
      city: "Provo",
      description: "Residential neighborhoods on Provo's northeast bench with views of Utah Lake and the valley. Tree-canopied streets, large lots, and proximity to Rock Canyon.",
      character: "Northeast bench lots with Utah Lake views, tree canopy, and Rock Canyon trail access.",
      typicalHomes: "Large single-family homes on half-acre+ lots",
      priceRange: "$500K–$1M+",
      highlights: ["Half-acre+ lots", "Rock Canyon trail access", "Utah Lake and valley views"],
      nearbySchools: ["Edgemont Elementary", "Rock Canyon Elementary", "Timpview High School"],
      nearbyParks: ["Rock Canyon Park", "Edgemont Park"],
      walkability: "Low",
      centerLat: 40.2650,
      centerLng: -111.6280,
    },
  ],
  Ogden: [
    {
      name: "East Bench",
      slug: "east-bench",
      city: "Ogden",
      description: "Hillside homes, established trees, and canyon views. Quick access to Snowbasin and Ogden Canyon.",
      character: "Hillside lots with canyon access, established trees, and Snowbasin / Ogden Canyon proximity.",
      typicalHomes: "Mid-century to modern single-family homes on larger lots",
      priceRange: "$400K–$750K",
      highlights: ["Larger hillside lots", "Snowbasin and Ogden Canyon access", "Mid-century to modern housing"],
      nearbySchools: ["Bonneville Elementary", "Ogden High School"],
      nearbyParks: ["Ogden Nature Center", "MTC Park", "22nd Street trailhead"],
      walkability: "Moderate",
      centerLat: 41.2200,
      centerLng: -111.9450,
    },
    {
      name: "Downtown / 25th Street",
      slug: "downtown-25th-street",
      city: "Ogden",
      description: "Ogden's historic district centered around 25th Street's restaurants, breweries, and galleries. Mix of loft apartments, restored homes, and new infill.",
      character: "Walkable historic district with lofts, restored Victorians, and 25th Street dining.",
      typicalHomes: "Loft apartments, townhomes, and restored Victorian homes",
      priceRange: "$250K–$500K",
      highlights: ["Lofts and restored Victorians", "Walkable 25th Street", "Historic district infill"],
      nearbySchools: ["Ogden Preparatory Academy"],
      nearbyParks: ["Marshall White Center Park", "Municipal Gardens"],
      walkability: "High",
      centerLat: 41.2230,
      centerLng: -111.9738,
    },
  ],
}

export function getNeighborhoodsForCity(cityName: string): NeighborhoodInfo[] {
  return neighborhoodsByCity[cityName] || []
}

export function findNeighborhood(cityName: string, neighborhoodSlug: string): NeighborhoodInfo | undefined {
  return getNeighborhoodsForCity(cityName).find((n) => n.slug === neighborhoodSlug)
}

/** All city-neighborhood pairs for static generation */
export function allNeighborhoodParams(): { city: string; neighborhood: string }[] {
  const params: { city: string; neighborhood: string }[] = []
  for (const [, neighborhoods] of Object.entries(neighborhoodsByCity)) {
    for (const n of neighborhoods) {
      const citySlug = n.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      params.push({ city: citySlug, neighborhood: n.slug })
    }
  }
  return params
}
