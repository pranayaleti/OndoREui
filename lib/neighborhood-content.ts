export type NeighborhoodInfo = {
  name: string
  slug: string
  city: string
  description: string
  character: string
  typicalHomes: string
  priceRange: string
  bestFor: string[]
  nearbySchools?: string[]
  nearbyParks?: string[]
  walkability: "High" | "Moderate" | "Low"
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
      character: "Historic, walkable, artsy — close to hospitals and the university with incredible valley views.",
      typicalHomes: "Victorian, Craftsman, and mid-century homes; some modern infill townhomes",
      priceRange: "$450K–$900K",
      bestFor: ["Young professionals", "Healthcare workers", "Walkability seekers"],
      nearbySchools: ["Ensign Elementary", "West High School"],
      nearbyParks: ["City Creek Canyon", "Memory Grove Park", "Lindsey Gardens"],
      walkability: "High",
    },
    {
      name: "Sugar House",
      slug: "sugar-house",
      city: "Salt Lake City",
      description: "A vibrant, revitalized neighborhood centered around Sugar House Park and the 2100 South commercial strip. Mix of trendy restaurants, boutiques, and growing density with TRAX access.",
      character: "Eclectic, trendy, family-friendly — the social hub of east Salt Lake with great dining and nightlife.",
      typicalHomes: "Bungalows, ramblers, and new-construction condos/townhomes",
      priceRange: "$400K–$750K",
      bestFor: ["Families", "Foodies", "TRAX commuters"],
      nearbySchools: ["Hawthorne Elementary", "Highland High School"],
      nearbyParks: ["Sugar House Park", "Hidden Hollow Nature Preserve", "Fairmont Park"],
      walkability: "High",
    },
    {
      name: "Liberty Wells",
      slug: "liberty-wells",
      city: "Salt Lake City",
      description: "An affordable, up-and-coming neighborhood south of Liberty Park. Diverse community with excellent access to downtown, 9th & 9th, and the freeway.",
      character: "Diverse, artsy, affordable — the neighborhood that feels like Salt Lake's creative soul.",
      typicalHomes: "Pre-war bungalows, duplexes, and some new townhome developments",
      priceRange: "$350K–$600K",
      bestFor: ["First-time buyers", "Artists", "Investors seeking value-add"],
      nearbySchools: ["Emerson Elementary", "Nibley Park Elementary"],
      nearbyParks: ["Liberty Park", "Gilgal Sculpture Garden"],
      walkability: "Moderate",
    },
    {
      name: "Downtown",
      slug: "downtown",
      city: "Salt Lake City",
      description: "The urban core with high-rise condos, lofts, and walkable access to dining, entertainment, Temple Square, and TRAX/FrontRunner transit hubs.",
      character: "Urban, convenient, car-optional — Salt Lake's densest and most connected neighborhood.",
      typicalHomes: "High-rise condos, converted lofts, luxury apartments",
      priceRange: "$250K–$700K",
      bestFor: ["Urban professionals", "Transit users", "Short-term rental investors"],
      nearbySchools: ["Open Classroom", "West High School"],
      nearbyParks: ["Pioneer Park", "Gateway Discovery Park"],
      walkability: "High",
    },
  ],
  Draper: [
    {
      name: "South Mountain",
      slug: "south-mountain",
      city: "Draper",
      description: "Hillside estates with panoramic valley views stretching from Point of the Mountain to the Wasatch peaks. Large lots, custom builds, and direct access to Corner Canyon trails.",
      character: "Affluent, spacious, nature-adjacent — Draper's premier address for families and executives.",
      typicalHomes: "Custom-built 4,000+ sqft homes on large lots",
      priceRange: "$800K–$1.5M+",
      bestFor: ["Executives", "Families wanting space", "Outdoor enthusiasts"],
      nearbySchools: ["Corner Canyon High School", "Draper Elementary"],
      nearbyParks: ["Corner Canyon Regional Park", "Potato Hill Trail"],
      walkability: "Low",
    },
    {
      name: "Suncrest",
      slug: "suncrest",
      city: "Draper",
      description: "A master-planned mountain community perched above Draper with stunning 360-degree views. Modern homes, HOA-maintained common areas, and a resort-like feel.",
      character: "Mountain luxury, quiet, family-oriented — living above it all with views from every window.",
      typicalHomes: "Modern 3,000–5,000 sqft homes, newer construction (2005–present)",
      priceRange: "$650K–$1.2M",
      bestFor: ["Tech professionals", "Families", "View seekers"],
      nearbySchools: ["Summit Academy", "Corner Canyon High School"],
      nearbyParks: ["Suncrest Park", "BST Trail Access"],
      walkability: "Low",
    },
    {
      name: "Draper Peaks",
      slug: "draper-peaks",
      city: "Draper",
      description: "Newer construction neighborhood near retail and dining along 12300 South. Convenient access to I-15, Silicon Slopes offices, and Cowabunga Bay.",
      character: "Convenient, modern, family-friendly — close to everything Draper has to offer.",
      typicalHomes: "Newer single-family homes, townhomes, and paired homes",
      priceRange: "$500K–$800K",
      bestFor: ["Young families", "Tech commuters", "First-time buyers in Draper"],
      nearbySchools: ["Draper Park Middle School", "Draper Elementary"],
      nearbyParks: ["Draper City Park", "Galena Park"],
      walkability: "Moderate",
    },
  ],
  Lehi: [
    {
      name: "Traverse Mountain",
      slug: "traverse-mountain",
      city: "Lehi",
      description: "A sprawling master-planned community on the Point of the Mountain with retail village, trails, and quick I-15 access. Popular with tech workers at nearby Adobe, Vivint, and startup campuses.",
      character: "Modern, connected, family-first — the beating heart of Silicon Slopes living.",
      typicalHomes: "Townhomes, single-family homes, and luxury builds (2010–present)",
      priceRange: "$450K–$900K",
      bestFor: ["Tech workers", "Young families", "HOA community lovers"],
      nearbySchools: ["Traverse Mountain Elementary", "Vista Heights Middle"],
      nearbyParks: ["Traverse Mountain Park", "Murdock Canal Trail"],
      walkability: "Moderate",
    },
    {
      name: "Thanksgiving Point",
      slug: "thanksgiving-point",
      city: "Lehi",
      description: "Family-oriented area surrounding the Thanksgiving Point campus — museums, gardens, golf, and restaurants. Established neighborhoods with tree-lined streets.",
      character: "Cultural, family-centric, green — weekends at the dinosaur museum and strolls through Ashton Gardens.",
      typicalHomes: "Single-family ramblers and two-stories on medium lots",
      priceRange: "$500K–$800K",
      bestFor: ["Families with kids", "Museum lovers", "Established-neighborhood feel"],
      nearbySchools: ["Dry Creek Elementary", "Willowcreek Middle"],
      nearbyParks: ["Ashton Gardens", "Museum of Natural Curiosity", "Thanksgiving Point Golf Club"],
      walkability: "Moderate",
    },
    {
      name: "Lehi Old Town",
      slug: "lehi-old-town",
      city: "Lehi",
      description: "Lehi's historic core along Main Street with charming older homes, renovation potential, and small-town character. Home to the annual Lehi Round-Up Days rodeo.",
      character: "Historic charm, renovation upside, authentic — Lehi before Silicon Slopes.",
      typicalHomes: "Pre-1970s ramblers, bungalows, and farmhouse conversions",
      priceRange: "$350K–$550K",
      bestFor: ["Value investors", "Renovation enthusiasts", "History buffs"],
      nearbySchools: ["Lehi Elementary", "Lehi Junior High"],
      nearbyParks: ["Wines Park", "Lehi Legacy Center"],
      walkability: "High",
    },
  ],
  Provo: [
    {
      name: "Downtown Provo",
      slug: "downtown-provo",
      city: "Provo",
      description: "Walkable arts district with independent shops, restaurants, and nightlife along Center Street. Close to the Covey Center for the Arts and Provo City Library.",
      character: "Vibrant, walkable, cultural — the social center of Utah Valley.",
      typicalHomes: "Historic homes, condos, and new mixed-use developments",
      priceRange: "$300K–$600K",
      bestFor: ["Young professionals", "Students", "Walkability lovers"],
      nearbySchools: ["Provo High School", "Dixon Middle School"],
      nearbyParks: ["Pioneer Park", "North Park"],
      walkability: "High",
    },
    {
      name: "Edgemont / Oak Hills",
      slug: "edgemont-oak-hills",
      city: "Provo",
      description: "Upscale residential neighborhoods on Provo's northeast bench with views of Utah Lake and the valley. Tree-canopied streets, large lots, and proximity to Rock Canyon.",
      character: "Quiet, established, scenic — Provo's premium family address near hiking and BYU.",
      typicalHomes: "Large single-family homes on half-acre+ lots",
      priceRange: "$500K–$1M+",
      bestFor: ["BYU families", "Outdoor lovers", "Space seekers"],
      nearbySchools: ["Edgemont Elementary", "Rock Canyon Elementary", "Timpview High School"],
      nearbyParks: ["Rock Canyon Park", "Edgemont Park"],
      walkability: "Low",
    },
  ],
  Ogden: [
    {
      name: "East Bench",
      slug: "east-bench",
      city: "Ogden",
      description: "Ogden's most desirable residential area with hillside homes, established trees, and stunning views. Quick access to Snowbasin and Ogden Canyon.",
      character: "Scenic, established, outdoorsy — the gateway to Ogden's canyons and ski resorts.",
      typicalHomes: "Mid-century to modern single-family homes on larger lots",
      priceRange: "$400K–$750K",
      bestFor: ["Outdoor enthusiasts", "Families", "Ski commuters"],
      nearbySchools: ["Bonneville Elementary", "Ogden High School"],
      nearbyParks: ["Ogden Nature Center", "MTC Park", "22nd Street trailhead"],
      walkability: "Moderate",
    },
    {
      name: "Downtown / 25th Street",
      slug: "downtown-25th-street",
      city: "Ogden",
      description: "Ogden's revitalized historic district centered around 25th Street's restaurants, breweries, and galleries. Mix of loft apartments, restored homes, and new infill.",
      character: "Hip, walkable, nightlife-rich — Ogden's craft beer and art walk capital.",
      typicalHomes: "Loft apartments, townhomes, and restored Victorian homes",
      priceRange: "$250K–$500K",
      bestFor: ["Young professionals", "Nightlife lovers", "Urban investors"],
      nearbySchools: ["Ogden Preparatory Academy"],
      nearbyParks: ["Marshall White Center Park", "Municipal Gardens"],
      walkability: "High",
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
