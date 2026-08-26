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
    {
      name: "Tree Streets",
      slug: "tree-streets",
      city: "Provo",
      description: "Historic grid west of downtown with named tree streets, older housing, and walkable access to Center Street and FrontRunner.",
      character: "Pre-war and mid-century homes on a walkable historic grid near downtown Provo.",
      typicalHomes: "Character bungalows, cottages, and small multi-family conversions",
      priceRange: "$350K–$650K",
      highlights: ["Historic bungalows and cottages", "Walkable to Center Street", "FrontRunner-adjacent housing"],
      nearbySchools: ["Provo High School", "Dixon Middle School"],
      nearbyParks: ["Pioneer Park", "North Park"],
      walkability: "High",
      centerLat: 40.2375,
      centerLng: -111.6680,
    },
    {
      name: "BYU Campus area",
      slug: "byu-campus-area",
      city: "Provo",
      description: "Multi-family and university-approved housing product within a short walk or bike of campus. Academic-year leases are common on approved inventory.",
      character: "Campus-adjacent apartments, condos, and approved-housing product with annual turn cycles.",
      typicalHomes: "Apartments, condos, and small multi-family near campus",
      priceRange: "$200K–$450K",
      highlights: ["Campus-adjacent multi-family", "BYU-approved housing product", "Annual lease-turn inventory"],
      nearbySchools: ["Provo High School"],
      nearbyParks: ["Campus trails", "Rock Canyon trailhead"],
      walkability: "High",
      centerLat: 40.2505,
      centerLng: -111.6490,
    },
    {
      name: "Southwest Provo",
      slug: "southwest-provo",
      city: "Provo",
      description: "Newer 3–4 bedroom subdivisions and attached product toward I-15 and Utah Lake, with shorter freeway access than the east bench.",
      character: "1990s–2010s single-family and townhome stock with I-15 access.",
      typicalHomes: "3–4 bedroom single-family homes and townhomes",
      priceRange: "$350K–$600K",
      highlights: ["3–4 bedroom subdivisions", "I-15 commute access", "1990s–2010s housing stock"],
      nearbySchools: ["Provo High School", "Dixon Middle School"],
      nearbyParks: ["Fort Utah Park", "Provo River Parkway"],
      walkability: "Low",
      centerLat: 40.2180,
      centerLng: -111.6800,
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
    {
      name: "West Ogden",
      slug: "west-ogden",
      city: "Ogden",
      description: "Valley-floor housing west of downtown with a mix of ramblers, small multi-family, and value-add inventory near I-15 and FrontRunner.",
      character: "Valley-floor ramblers, duplexes, and fourplexes with I-15 and FrontRunner access.",
      typicalHomes: "Ramblers, duplexes, and small multi-family (2–8 units)",
      priceRange: "$250K–$450K",
      highlights: ["Ramblers and small multi-family", "I-15 and FrontRunner access", "Value-add renovation inventory"],
      nearbySchools: ["Ben Lomond High School"],
      nearbyParks: ["Ogden River Parkway", "MTC Park"],
      walkability: "Moderate",
      centerLat: 41.2180,
      centerLng: -111.9950,
    },
    {
      name: "Shadow Valley",
      slug: "shadow-valley",
      city: "Ogden",
      description: "Established east-side streets below the bench with mid-century homes, mature trees, and canyon-road access toward Snowbasin.",
      character: "Mid-century single-family on established lots with canyon access and winter snow load.",
      typicalHomes: "Mid-century ramblers and split-levels on larger lots",
      priceRange: "$350K–$650K",
      highlights: ["Mid-century ramblers and split-levels", "Snow load and furnace checks", "Ogden Canyon access"],
      nearbySchools: ["Ogden High School", "Bonneville Elementary"],
      nearbyParks: ["22nd Street trailhead", "Ogden Nature Center"],
      walkability: "Low",
      centerLat: 41.2280,
      centerLng: -111.9520,
    },
  ],
  Sandy: [
    {
      name: "Alta View",
      slug: "alta-view",
      city: "Sandy",
      description: "East Sandy housing near Alta View Hospital and the Little Cottonwood approach, with split-levels, two-stories, and garages common on the inventory.",
      character: "Canyons School District east-side stock with canyon-access commute and winter snow load.",
      typicalHomes: "Split-level and two-story homes with garages",
      priceRange: "$500K–$850K",
      highlights: ["Split-levels and two-stories", "Little Cottonwood canyon access", "Snow load and furnace checks"],
      nearbySchools: ["Alta High School", "Quail Hollow Elementary"],
      nearbyParks: ["Bell Canyon Trail", "Dimple Dell Nature Park"],
      walkability: "Low",
      centerLat: 40.5770,
      centerLng: -111.8500,
    },
    {
      name: "East bench",
      slug: "east-bench",
      city: "Sandy",
      description: "Hillside lots toward the Wasatch with two-story homes, dens, and longer driveways. Snow load and pipe insulation are the usual winter ops items.",
      character: "East-bench two-stories on hillside lots with canyon views and winter snow load.",
      typicalHomes: "Two-story and split-level homes on hillside lots",
      priceRange: "$550K–$900K",
      highlights: ["Hillside two-stories", "Canyons School District zoning", "Snow load and pipe insulation"],
      nearbySchools: ["Alta High School", "Quail Hollow Elementary"],
      nearbyParks: ["Dimple Dell Nature Park", "Bell Canyon Trail"],
      walkability: "Low",
      centerLat: 40.5720,
      centerLng: -111.8220,
    },
    {
      name: "Sandy Village",
      slug: "sandy-village",
      city: "Sandy",
      description: "Valley-floor housing near State Street, South Town retail, and the TRAX Blue Line. Mix of ramblers, townhomes, and 1970s–1990s single-family.",
      character: "TRAX-adjacent valley-floor stock with ramblers, townhomes, and South Town retail.",
      typicalHomes: "Ramblers, townhomes, and 1970s–1990s single-family",
      priceRange: "$400K–$650K",
      highlights: ["Ramblers and townhomes", "TRAX Blue Line access", "South Town retail adjacency"],
      nearbySchools: ["Jordan High School"],
      nearbyParks: ["Sandy City parks", "Jordan River Parkway"],
      walkability: "Moderate",
      centerLat: 40.5910,
      centerLng: -111.8840,
    },
  ],
  Orem: [
    {
      name: "Northridge",
      slug: "northridge",
      city: "Orem",
      description: "Established tree-lined streets in north Orem with 3–4 bedroom ramblers and two-stories, away from the University Parkway apartment strip.",
      character: "Established single-family streets with ramblers, two-stories, and low-maintenance landscaping.",
      typicalHomes: "3–4 bedroom ramblers and two-stories",
      priceRange: "$400K–$650K",
      highlights: ["3–4 bedroom ramblers", "Established tree-lined streets", "Alpine School District zoning"],
      nearbySchools: ["Timpanogos High School", "Orem High School"],
      nearbyParks: ["Orem Fitness Park", "Cascade Park"],
      walkability: "Moderate",
      centerLat: 40.3250,
      centerLng: -111.6950,
    },
    {
      name: "UVU area",
      slug: "uvu-area",
      city: "Orem",
      description: "Apartments and attached product along University Parkway near Utah Valley University, with higher turnover than north Orem single-family streets.",
      character: "UVU-adjacent apartments and townhomes along University Parkway.",
      typicalHomes: "Apartments, condos, and townhomes",
      priceRange: "$250K–$500K",
      highlights: ["Apartments and townhomes", "University Parkway corridor", "Higher lease-turn inventory"],
      nearbySchools: ["Mountain View High School"],
      nearbyParks: ["Orem Fitness Park"],
      walkability: "High",
      centerLat: 40.2790,
      centerLng: -111.7140,
    },
    {
      name: "Cascade",
      slug: "cascade",
      city: "Orem",
      description: "East Orem streets toward the Timpanogos foothills with larger lots, two-stories, and winter snow load on the bench.",
      character: "Foothill two-stories and ramblers with mountain access and furnace winter ops.",
      typicalHomes: "Larger two-stories and ramblers on foothill lots",
      priceRange: "$450K–$750K",
      highlights: ["Foothill two-stories", "Furnace and snow-load checks", "Timpanogos trail access"],
      nearbySchools: ["Timpanogos High School"],
      nearbyParks: ["Cascade Park", "Mt. Timpanogos trailheads"],
      walkability: "Low",
      centerLat: 40.3080,
      centerLng: -111.6750,
    },
  ],
  "South Jordan": [
    {
      name: "Daybreak",
      slug: "daybreak",
      city: "South Jordan",
      description: "4,100-acre master-planned community with single-family, townhomes, TRAX, trails, and HOA-maintained commons. Rental caps and dues must be read in the CC&Rs before listing.",
      character: "Master-planned mixed-use with TRAX, HOA commons, and post-2004 housing.",
      typicalHomes: "Single-family, townhomes, and apartments (2004–present)",
      priceRange: "$450K–$850K",
      highlights: ["HOA-maintained commons and CC&Rs", "TRAX Red Line station", "Post-2004 single-family and townhomes"],
      nearbySchools: ["Elk Meadows Elementary", "South Jordan Middle School"],
      nearbyParks: ["Oquirrh Lake", "Daybreak trails"],
      walkability: "Moderate",
      centerLat: 40.5570,
      centerLng: -112.0050,
    },
    {
      name: "The District",
      slug: "the-district",
      city: "South Jordan",
      description: "Housing adjacent to The District retail center along Bangerter Highway, with newer townhomes, condos, and short drives to Silicon Slopes.",
      character: "Newer attached product next to Bangerter retail and Silicon Slopes commutes.",
      typicalHomes: "Townhomes, condos, and newer single-family",
      priceRange: "$400K–$750K",
      highlights: ["Townhomes and condos", "Bangerter Highway access", "The District retail adjacency"],
      nearbySchools: ["Bingham High School", "South Jordan Middle School"],
      nearbyParks: ["SoJo Trail", "Mulligans Golf Course"],
      walkability: "Moderate",
      centerLat: 40.5470,
      centerLng: -111.9770,
    },
    {
      name: "River Oaks",
      slug: "river-oaks",
      city: "South Jordan",
      description: "Established east-side streets with larger lots and older single-family than Daybreak, closer to the Jordan River corridor.",
      character: "Established east-side lots with 1990s single-family and larger yards.",
      typicalHomes: "1990s single-family homes on larger lots",
      priceRange: "$500K–$800K",
      highlights: ["Larger-lot 1990s homes", "Jordan River corridor", "Fewer HOA constraints than Daybreak"],
      nearbySchools: ["Bingham High School"],
      nearbyParks: ["Jordan River Parkway"],
      walkability: "Low",
      centerLat: 40.5620,
      centerLng: -111.9550,
    },
    {
      name: "SoDa Row",
      slug: "soda-row",
      city: "South Jordan",
      description: "Walkable commercial street inside Daybreak with mixed-use buildings, attached housing, and HOA rules that apply to rentals.",
      character: "Mixed-use and attached housing on Daybreak's walkable commercial street.",
      typicalHomes: "Townhomes, stacked flats, and mixed-use residences",
      priceRange: "$400K–$700K",
      highlights: ["HOA rental rules apply", "Mixed-use and townhomes", "Walkable commercial street"],
      nearbySchools: ["Elk Meadows Elementary"],
      nearbyParks: ["Oquirrh Lake"],
      walkability: "High",
      centerLat: 40.5575,
      centerLng: -111.9950,
    },
    {
      name: "Jordan Narrows",
      slug: "jordan-narrows",
      city: "South Jordan",
      description: "Southern frontier of the city with newer construction toward the Point of the Mountain and Bluffdale line.",
      character: "Newer single-family and townhomes on the southern construction edge.",
      typicalHomes: "New-construction single-family and townhomes",
      priceRange: "$500K–$850K",
      highlights: ["New-construction inventory", "Point of the Mountain commute", "HOA communities common"],
      nearbySchools: ["Bingham High School"],
      nearbyParks: ["SoJo Trail"],
      walkability: "Low",
      centerLat: 40.5260,
      centerLng: -111.9600,
    },
  ],
  "West Jordan": [
    {
      name: "Jordan Landing",
      slug: "jordan-landing",
      city: "West Jordan",
      description: "Newer townhomes and condos next to Jordan Landing retail along 7800 South and Bangerter Highway.",
      character: "Attached product and newer single-family next to open-air retail.",
      typicalHomes: "Townhomes, condos, and newer single-family",
      priceRange: "$350K–$600K",
      highlights: ["Townhomes and condos", "Jordan Landing retail", "Bangerter Highway access"],
      nearbySchools: ["West Jordan High School"],
      nearbyParks: ["Ron Wood Park"],
      walkability: "Moderate",
      centerLat: 40.6180,
      centerLng: -111.9850,
    },
    {
      name: "East West Jordan",
      slug: "east-west-jordan",
      city: "West Jordan",
      description: "Established 1990s subdivisions toward Mountain View Corridor and the Jordan River, with 3–5 bedroom single-family the typical hold.",
      character: "1990s–2000s 3–5 bedroom single-family on established streets.",
      typicalHomes: "3–5 bedroom single-family homes",
      priceRange: "$400K–$600K",
      highlights: ["3–5 bedroom single-family", "Mountain View Corridor access", "Jordan School District zoning"],
      nearbySchools: ["West Jordan High School", "Joel P. Jensen Middle School"],
      nearbyParks: ["Jordan River Parkway"],
      walkability: "Low",
      centerLat: 40.6100,
      centerLng: -111.9390,
    },
    {
      name: "Oquirrh Hills",
      slug: "oquirrh-hills",
      city: "West Jordan",
      description: "Western-edge new construction toward the Oquirrh foothills and Mountain View Corridor, with builder inventory still entering the market.",
      character: "Post-2010 single-family and townhomes on the western construction frontier.",
      typicalHomes: "Newer single-family homes and townhomes",
      priceRange: "$400K–$650K",
      highlights: ["Post-2010 construction", "Mountain View Corridor", "HOA communities common"],
      nearbySchools: ["Copper Hills High School"],
      nearbyParks: ["Oquirrh foothill trails"],
      walkability: "Low",
      centerLat: 40.5950,
      centerLng: -112.0400,
    },
    {
      name: "7800 South corridor",
      slug: "7800-south-corridor",
      city: "West Jordan",
      description: "Mixed residential along the 7800 South commercial spine: townhomes, older single-family, and infill near retail and Bangerter.",
      character: "Mixed housing along a commercial arterial with townhomes and 1990s homes.",
      typicalHomes: "Townhomes and 1990s single-family",
      priceRange: "$350K–$550K",
      highlights: ["Townhomes and 1990s homes", "7800 South commercial spine", "Bangerter access"],
      nearbySchools: ["West Jordan High School"],
      nearbyParks: ["Veterans Memorial Park"],
      walkability: "Moderate",
      centerLat: 40.6110,
      centerLng: -111.9760,
    },
    {
      name: "Gardner Village",
      slug: "gardner-village",
      city: "West Jordan",
      description: "Housing near the restored mill shopping village, with older single-family and some infill toward 7000 South.",
      character: "Established single-family near Gardner Village retail and Jordan River access.",
      typicalHomes: "Older single-family homes and some infill townhomes",
      priceRange: "$350K–$550K",
      highlights: ["Older single-family stock", "Gardner Village adjacency", "Jordan River Parkway access"],
      nearbySchools: ["West Jordan High School"],
      nearbyParks: ["Jordan River Parkway"],
      walkability: "Moderate",
      centerLat: 40.5950,
      centerLng: -111.9390,
    },
  ],
  Riverton: [
    {
      name: "Old Town Riverton",
      slug: "old-town-riverton",
      city: "Riverton",
      description: "Historic core near the Old Dome Meeting Hall with older homes, renovation inventory, and a short drive to 12600 South retail.",
      character: "Older housing stock around the civic core with renovation inventory.",
      typicalHomes: "Pre-1990 ramblers, bungalows, and small two-stories",
      priceRange: "$400K–$600K",
      highlights: ["Pre-1990 housing stock", "Renovation inventory", "Civic core near the Dome Meeting Hall"],
      nearbySchools: ["Riverton High School"],
      nearbyParks: ["Riverton City Park"],
      walkability: "Moderate",
      centerLat: 40.5210,
      centerLng: -111.9390,
    },
    {
      name: "Western Riverton",
      slug: "western-riverton",
      city: "Riverton",
      description: "Newer HOA subdivisions toward the Herriman line, with 1990s–2010s single-family, townhomes, and Mountain View Corridor access.",
      character: "HOA-maintained 1990s–2010s single-family and townhomes on the western edge.",
      typicalHomes: "1990s–2010s single-family homes and townhomes",
      priceRange: "$450K–$700K",
      highlights: ["HOA-maintained 1990s–2010s homes", "Mountain View Corridor access", "Townhome inventory"],
      nearbySchools: ["Riverton High School", "Oquirrh Hills Middle School"],
      nearbyParks: ["Old Farm Park"],
      walkability: "Low",
      centerLat: 40.5200,
      centerLng: -112.0000,
    },
    {
      name: "12600 South corridor",
      slug: "12600-south-corridor",
      city: "Riverton",
      description: "Townhomes and single-family along Riverton's main commercial arterial, with Bangerter access and daily-errand retail.",
      character: "Attached and single-family product on the 12600 South commercial spine.",
      typicalHomes: "Townhomes and 2000s single-family",
      priceRange: "$400K–$650K",
      highlights: ["Townhome inventory", "12600 South retail", "Bangerter Highway access"],
      nearbySchools: ["Riverton High School"],
      nearbyParks: ["Riverton City Park"],
      walkability: "Moderate",
      centerLat: 40.5260,
      centerLng: -111.9590,
    },
    {
      name: "Eastern Riverton",
      slug: "eastern-riverton",
      city: "Riverton",
      description: "Established larger-lot streets toward South Jordan and the Jordan River, with 1990s two-stories and fewer attached products.",
      character: "Larger-lot 1990s single-family with Bangerter and I-15 access.",
      typicalHomes: "1990s two-stories on larger lots",
      priceRange: "$500K–$750K",
      highlights: ["Larger-lot 1990s two-stories", "Jordan River access", "Bangerter / I-15 commute"],
      nearbySchools: ["Riverton High School", "Rose Creek Elementary"],
      nearbyParks: ["Jordan River Parkway"],
      walkability: "Low",
      centerLat: 40.5220,
      centerLng: -111.9200,
    },
  ],
  Bountiful: [
    {
      name: "Val Verda",
      slug: "val-verda",
      city: "Bountiful",
      description: "Established south Bountiful streets with mid-century homes, mature trees, and a short hop to I-15 and Centerville FrontRunner.",
      character: "Mid-century ramblers and split-levels on established lots.",
      typicalHomes: "Mid-century ramblers and split-levels",
      priceRange: "$450K–$700K",
      highlights: ["Mid-century ramblers", "I-15 and FrontRunner access", "Davis School District zoning"],
      nearbySchools: ["Bountiful High School", "South Davis Junior High"],
      nearbyParks: ["Bountiful city parks"],
      walkability: "Moderate",
      centerLat: 40.8770,
      centerLng: -111.8630,
    },
    {
      name: "East Bench",
      slug: "east-bench",
      city: "Bountiful",
      description: "Hillside lots with valley views and Mueller Park / Holbrook Canyon trail access. Snow load and furnace checks are the winter ops items.",
      character: "East-bench two-stories and ramblers with canyon access and winter snow load.",
      typicalHomes: "Two-stories and ramblers on hillside lots",
      priceRange: "$500K–$850K",
      highlights: ["Hillside lots", "Snow load and furnace checks", "Mueller Park trail access"],
      nearbySchools: ["Bountiful High School", "Bountiful Elementary"],
      nearbyParks: ["Mueller Park Trail", "Holbrook Canyon"],
      walkability: "Low",
      centerLat: 40.8890,
      centerLng: -111.8530,
    },
    {
      name: "Downtown Bountiful",
      slug: "downtown-bountiful",
      city: "Bountiful",
      description: "Walkable Main Street core with older homes, small commercial, and a 15-minute I-15 run to downtown Salt Lake.",
      character: "Older housing around a walkable Main Street strip.",
      typicalHomes: "Older ramblers, bungalows, and small two-stories",
      priceRange: "$400K–$650K",
      highlights: ["Older ramblers and bungalows", "Walkable Main Street", "15-minute I-15 commute to SLC"],
      nearbySchools: ["Bountiful High School", "Bountiful Elementary"],
      nearbyParks: ["Bountiful City Park"],
      walkability: "High",
      centerLat: 40.8894,
      centerLng: -111.8808,
    },
  ],
  Layton: [
    {
      name: "East Layton",
      slug: "east-layton",
      city: "Layton",
      description: "Foothill streets toward the Bonneville Shoreline Trail with newer single-family, townhomes, and winter snow load on the bench.",
      character: "East-bench single-family and townhomes with trail access and furnace winter ops.",
      typicalHomes: "Newer single-family homes and townhomes",
      priceRange: "$400K–$700K",
      highlights: ["Single-family and townhomes", "Bonneville Shoreline Trail access", "Snow load and furnace checks"],
      nearbySchools: ["Northridge High School", "Central Davis Junior High"],
      nearbyParks: ["Adams Canyon Trail", "East Layton trailheads"],
      walkability: "Low",
      centerLat: 41.0780,
      centerLng: -111.9380,
    },
    {
      name: "Hill AFB area",
      slug: "hill-afb-area",
      city: "Layton",
      description: "West and north Layton housing with a short drive to Hill Air Force Base. Townhomes and 3–4 bedroom homes are the typical rental product.",
      character: "3–4 bedroom homes and townhomes with a short Hill AFB commute.",
      typicalHomes: "3–4 bedroom single-family homes and townhomes",
      priceRange: "$350K–$550K",
      highlights: ["3–4 bedroom homes and townhomes", "Hill AFB commute", "FrontRunner access"],
      nearbySchools: ["Layton High School"],
      nearbyParks: ["Layton Commons Park"],
      walkability: "Low",
      centerLat: 41.0900,
      centerLng: -112.0000,
    },
    {
      name: "Antelope Dr corridor",
      slug: "antelope-dr-corridor",
      city: "Layton",
      description: "Mixed housing along Antelope Drive retail: townhomes, 1990s single-family, and I-15 / FrontRunner access.",
      character: "Townhomes and 1990s homes on Layton's main commercial arterial.",
      typicalHomes: "Townhomes and 1990s single-family",
      priceRange: "$350K–$550K",
      highlights: ["Townhomes and 1990s homes", "Antelope Drive retail", "I-15 and FrontRunner access"],
      nearbySchools: ["Layton High School", "Central Davis Junior High"],
      nearbyParks: ["Layton Commons Park", "Andy Adams Park"],
      walkability: "Moderate",
      centerLat: 41.0870,
      centerLng: -111.9710,
    },
  ],
  Murray: [
    {
      name: "Fashion Place",
      slug: "fashion-place",
      city: "Murray",
      description: "Condos and townhomes next to Fashion Place Mall with TRAX access and I-15 / I-215 interchange proximity.",
      character: "Attached product next to mall retail and dual TRAX lines.",
      typicalHomes: "Condos, townhomes, and mid-century infill",
      priceRange: "$300K–$550K",
      highlights: ["Condos and townhomes", "Dual TRAX lines", "Fashion Place retail"],
      nearbySchools: ["Murray High School", "Hillcrest Junior High"],
      nearbyParks: ["Murray Park"],
      walkability: "High",
      centerLat: 40.6350,
      centerLng: -111.8900,
    },
    {
      name: "Murray Downtown",
      slug: "murray-downtown",
      city: "Murray",
      description: "Walkable historic core with mid-century homes, State Street commercial, and Murray City School District geography.",
      character: "Mid-century homes around a walkable downtown and city services.",
      typicalHomes: "Mid-century ramblers, bungalows, and small two-stories",
      priceRange: "$350K–$600K",
      highlights: ["Mid-century ramblers", "Walkable historic core", "Murray City School District zoning"],
      nearbySchools: ["Murray High School", "Liberty Elementary"],
      nearbyParks: ["Murray Park", "Murray City Golf Course"],
      walkability: "High",
      centerLat: 40.6670,
      centerLng: -111.8880,
    },
    {
      name: "Intermountain Medical Center vicinity",
      slug: "intermountain-medical-center",
      city: "Murray",
      description: "Housing around the 520-bed hospital campus: condos, townhomes, and mid-century homes with TRAX and I-215 / I-15 access.",
      character: "Hospital-adjacent condos, townhomes, and mid-century homes.",
      typicalHomes: "Condos, townhomes, and mid-century single-family",
      priceRange: "$300K–$550K",
      highlights: ["Condos and townhomes", "Hospital-campus adjacency", "TRAX and freeway access"],
      nearbySchools: ["Murray High School"],
      nearbyParks: ["Murray Park"],
      walkability: "Moderate",
      centerLat: 40.6600,
      centerLng: -111.8900,
    },
    {
      name: "East Murray",
      slug: "east-murray",
      city: "Murray",
      description: "Hillside mid-century homes toward Holladay with established lots and a short run to I-215.",
      character: "East-side mid-century homes on established lots.",
      typicalHomes: "Mid-century ramblers and split-levels",
      priceRange: "$400K–$700K",
      highlights: ["Mid-century ramblers", "I-215 access", "Established lots"],
      nearbySchools: ["Murray High School", "Hillcrest Junior High"],
      nearbyParks: ["Murray Park"],
      walkability: "Low",
      centerLat: 40.6660,
      centerLng: -111.8600,
    },
    {
      name: "Fireclay District",
      slug: "fireclay-district",
      city: "Murray",
      description: "Mixed-use infill district with newer condos, apartments, and TRAX, on former industrial land near State Street.",
      character: "Newer mixed-use and condo inventory in a TRAX-served infill district.",
      typicalHomes: "Condos, apartments, and new mixed-use residences",
      priceRange: "$300K–$550K",
      highlights: ["New condos and mixed-use", "TRAX-served infill", "State Street adjacency"],
      nearbySchools: ["Murray High School"],
      nearbyParks: ["Jordan River Parkway"],
      walkability: "High",
      centerLat: 40.6550,
      centerLng: -111.8880,
    },
  ],
}

export function getNeighborhoodsForCity(cityName: string): NeighborhoodInfo[] {
  return neighborhoodsByCity[cityName] || []
}

function normalizeHoodLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[/\-]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^the /, "")
}

function expandPlaceAbbrevs(value: string): string {
  return value
    .replace(/\bst\b/g, "street")
    .replace(/\bdr\b/g, "drive")
    .replace(/\bblvd\b/g, "boulevard")
}

const GENERIC_HOOD_TOKENS = new Set(["area", "east", "west", "north", "south", "near", "with"])

function distinctiveTokens(value: string): string[] {
  return expandPlaceAbbrevs(normalizeHoodLabel(value))
    .split(" ")
    .filter((t) => t.length >= 5 && !GENERIC_HOOD_TOKENS.has(t))
}

/**
 * Match a city-content neighborhood label (e.g. "Avenues" or
 * "Traverse Mountain, master-planned…") to a neighborhood-content entry.
 */
export function findNeighborhoodForCard(cityName: string, cardLabel: string): NeighborhoodInfo | null {
  const candidates = neighborhoodsByCity[cityName]
  if (!candidates) return null
  const namePart = cardLabel.includes(", ") ? cardLabel.split(", ")[0] : cardLabel
  const normalized = expandPlaceAbbrevs(normalizeHoodLabel(namePart))
  const exact =
    candidates.find((n) => {
      const name = expandPlaceAbbrevs(normalizeHoodLabel(n.name))
      return name === normalized || name === `the ${normalized}` || `the ${name}` === normalized
    }) ?? null
  if (exact) return exact

  const contained =
    candidates.find((n) => {
      const name = expandPlaceAbbrevs(normalizeHoodLabel(n.name))
      const shorter = name.length <= normalized.length ? name : normalized
      const longer = name.length <= normalized.length ? normalized : name
      return shorter.length >= 8 && longer.includes(shorter)
    }) ?? null
  if (contained) return contained

  const queryTokens = distinctiveTokens(namePart)
  if (queryTokens.length === 0) return null
  const scored = candidates
    .map((n) => {
      const name = expandPlaceAbbrevs(normalizeHoodLabel(n.name))
      const score = queryTokens.filter((t) => name.includes(t)).length
      return { n, score }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
  if (scored.length === 0) return null
  if (scored.length === 1 || scored[0].score > scored[1].score) return scored[0].n
  return null
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
