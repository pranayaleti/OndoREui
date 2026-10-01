// Notary coverage data: the 50 US states and the curated city list that lib/notary-cities.ts
// builds its route allowlist from. Imported on every page through the header search index,
// so keep it small: no ZIP lists, no build-time file reads.

// All 50 US states with abbreviations and slugs
export const US_STATES = {
  AL: { name: "Alabama", slug: "alabama" },
  AK: { name: "Alaska", slug: "alaska" },
  AZ: { name: "Arizona", slug: "arizona" },
  AR: { name: "Arkansas", slug: "arkansas" },
  CA: { name: "California", slug: "california" },
  CO: { name: "Colorado", slug: "colorado" },
  CT: { name: "Connecticut", slug: "connecticut" },
  DE: { name: "Delaware", slug: "delaware" },
  FL: { name: "Florida", slug: "florida" },
  GA: { name: "Georgia", slug: "georgia" },
  HI: { name: "Hawaii", slug: "hawaii" },
  ID: { name: "Idaho", slug: "idaho" },
  IL: { name: "Illinois", slug: "illinois" },
  IN: { name: "Indiana", slug: "indiana" },
  IA: { name: "Iowa", slug: "iowa" },
  KS: { name: "Kansas", slug: "kansas" },
  KY: { name: "Kentucky", slug: "kentucky" },
  LA: { name: "Louisiana", slug: "louisiana" },
  ME: { name: "Maine", slug: "maine" },
  MD: { name: "Maryland", slug: "maryland" },
  MA: { name: "Massachusetts", slug: "massachusetts" },
  MI: { name: "Michigan", slug: "michigan" },
  MN: { name: "Minnesota", slug: "minnesota" },
  MS: { name: "Mississippi", slug: "mississippi" },
  MO: { name: "Missouri", slug: "missouri" },
  MT: { name: "Montana", slug: "montana" },
  NE: { name: "Nebraska", slug: "nebraska" },
  NV: { name: "Nevada", slug: "nevada" },
  NH: { name: "New Hampshire", slug: "new-hampshire" },
  NJ: { name: "New Jersey", slug: "new-jersey" },
  NM: { name: "New Mexico", slug: "new-mexico" },
  NY: { name: "New York", slug: "new-york" },
  NC: { name: "North Carolina", slug: "north-carolina" },
  ND: { name: "North Dakota", slug: "north-dakota" },
  OH: { name: "Ohio", slug: "ohio" },
  OK: { name: "Oklahoma", slug: "oklahoma" },
  OR: { name: "Oregon", slug: "oregon" },
  PA: { name: "Pennsylvania", slug: "pennsylvania" },
  RI: { name: "Rhode Island", slug: "rhode-island" },
  SC: { name: "South Carolina", slug: "south-carolina" },
  SD: { name: "South Dakota", slug: "south-dakota" },
  TN: { name: "Tennessee", slug: "tennessee" },
  TX: { name: "Texas", slug: "texas" },
  UT: { name: "Utah", slug: "utah" },
  VT: { name: "Vermont", slug: "vermont" },
  VA: { name: "Virginia", slug: "virginia" },
  WA: { name: "Washington", slug: "washington" },
  WV: { name: "West Virginia", slug: "west-virginia" },
  WI: { name: "Wisconsin", slug: "wisconsin" },
  WY: { name: "Wyoming", slug: "wyoming" },
};

// Major US cities with their counties, in prominence order (notary-cities caps each state to the first few).
export const US_CITIES = [
  // California
  { city: "Los Angeles", state: "CA", stateName: "California", county: "Los Angeles County" },
  { city: "San Francisco", state: "CA", stateName: "California", county: "San Francisco County" },
  { city: "San Diego", state: "CA", stateName: "California", county: "San Diego County" },
  { city: "San Jose", state: "CA", stateName: "California", county: "Santa Clara County" },
  { city: "Sacramento", state: "CA", stateName: "California", county: "Sacramento County" },
  { city: "Fresno", state: "CA", stateName: "California", county: "Fresno County" },
  { city: "Oakland", state: "CA", stateName: "California", county: "Alameda County" },
  { city: "Long Beach", state: "CA", stateName: "California", county: "Los Angeles County" },
  { city: "Bakersfield", state: "CA", stateName: "California", county: "Kern County" },
  { city: "Anaheim", state: "CA", stateName: "California", county: "Orange County" },

  // Texas
  { city: "Houston", state: "TX", stateName: "Texas", county: "Harris County" },
  { city: "San Antonio", state: "TX", stateName: "Texas", county: "Bexar County" },
  { city: "Dallas", state: "TX", stateName: "Texas", county: "Dallas County" },
  { city: "Austin", state: "TX", stateName: "Texas", county: "Travis County" },
  { city: "Fort Worth", state: "TX", stateName: "Texas", county: "Tarrant County" },
  { city: "El Paso", state: "TX", stateName: "Texas", county: "El Paso County" },
  { city: "Arlington", state: "TX", stateName: "Texas", county: "Tarrant County" },
  { city: "Corpus Christi", state: "TX", stateName: "Texas", county: "Nueces County" },
  { city: "Plano", state: "TX", stateName: "Texas", county: "Collin County" },
  { city: "Lubbock", state: "TX", stateName: "Texas", county: "Lubbock County" },

  // New York
  { city: "New York City", state: "NY", stateName: "New York", county: "New York County" },
  { city: "Buffalo", state: "NY", stateName: "New York", county: "Erie County" },
  { city: "Rochester", state: "NY", stateName: "New York", county: "Monroe County" },
  { city: "Yonkers", state: "NY", stateName: "New York", county: "Westchester County" },
  { city: "Syracuse", state: "NY", stateName: "New York", county: "Onondaga County" },

  // Florida
  { city: "Jacksonville", state: "FL", stateName: "Florida", county: "Duval County" },
  { city: "Miami", state: "FL", stateName: "Florida", county: "Miami-Dade County" },
  { city: "Tampa", state: "FL", stateName: "Florida", county: "Hillsborough County" },
  { city: "Orlando", state: "FL", stateName: "Florida", county: "Orange County" },
  { city: "St. Petersburg", state: "FL", stateName: "Florida", county: "Pinellas County" },
  { city: "Hialeah", state: "FL", stateName: "Florida", county: "Miami-Dade County" },
  { city: "Tallahassee", state: "FL", stateName: "Florida", county: "Leon County" },
  { city: "Fort Lauderdale", state: "FL", stateName: "Florida", county: "Broward County" },

  // Illinois
  { city: "Chicago", state: "IL", stateName: "Illinois", county: "Cook County" },
  { city: "Aurora", state: "IL", stateName: "Illinois", county: "Kane County" },
  { city: "Rockford", state: "IL", stateName: "Illinois", county: "Winnebago County" },
  { city: "Joliet", state: "IL", stateName: "Illinois", county: "Will County" },
  { city: "Naperville", state: "IL", stateName: "Illinois", county: "DuPage County" },

  // Pennsylvania
  { city: "Philadelphia", state: "PA", stateName: "Pennsylvania", county: "Philadelphia County" },
  { city: "Pittsburgh", state: "PA", stateName: "Pennsylvania", county: "Allegheny County" },
  { city: "Allentown", state: "PA", stateName: "Pennsylvania", county: "Lehigh County" },
  { city: "Erie", state: "PA", stateName: "Pennsylvania", county: "Erie County" },
  { city: "Reading", state: "PA", stateName: "Pennsylvania", county: "Berks County" },

  // Ohio
  { city: "Columbus", state: "OH", stateName: "Ohio", county: "Franklin County" },
  { city: "Cleveland", state: "OH", stateName: "Ohio", county: "Cuyahoga County" },
  { city: "Cincinnati", state: "OH", stateName: "Ohio", county: "Hamilton County" },
  { city: "Toledo", state: "OH", stateName: "Ohio", county: "Lucas County" },
  { city: "Akron", state: "OH", stateName: "Ohio", county: "Summit County" },

  // Georgia
  { city: "Atlanta", state: "GA", stateName: "Georgia", county: "Fulton County" },
  { city: "Augusta", state: "GA", stateName: "Georgia", county: "Richmond County" },
  { city: "Columbus", state: "GA", stateName: "Georgia", county: "Muscogee County" },
  { city: "Savannah", state: "GA", stateName: "Georgia", county: "Chatham County" },
  { city: "Athens", state: "GA", stateName: "Georgia", county: "Clarke County" },

  // North Carolina
  { city: "Charlotte", state: "NC", stateName: "North Carolina", county: "Mecklenburg County" },
  { city: "Raleigh", state: "NC", stateName: "North Carolina", county: "Wake County" },
  { city: "Greensboro", state: "NC", stateName: "North Carolina", county: "Guilford County" },
  { city: "Durham", state: "NC", stateName: "North Carolina", county: "Durham County" },
  { city: "Winston-Salem", state: "NC", stateName: "North Carolina", county: "Forsyth County" },

  // Michigan
  { city: "Detroit", state: "MI", stateName: "Michigan", county: "Wayne County" },
  { city: "Grand Rapids", state: "MI", stateName: "Michigan", county: "Kent County" },
  { city: "Warren", state: "MI", stateName: "Michigan", county: "Macomb County" },
  { city: "Sterling Heights", state: "MI", stateName: "Michigan", county: "Macomb County" },
  { city: "Lansing", state: "MI", stateName: "Michigan", county: "Ingham County" },

  // New Jersey
  { city: "Newark", state: "NJ", stateName: "New Jersey", county: "Essex County" },
  { city: "Jersey City", state: "NJ", stateName: "New Jersey", county: "Hudson County" },
  { city: "Paterson", state: "NJ", stateName: "New Jersey", county: "Passaic County" },
  { city: "Elizabeth", state: "NJ", stateName: "New Jersey", county: "Union County" },
  { city: "Edison", state: "NJ", stateName: "New Jersey", county: "Middlesex County" },

  // Virginia
  { city: "Virginia Beach", state: "VA", stateName: "Virginia", county: "Virginia Beach City" },
  { city: "Norfolk", state: "VA", stateName: "Virginia", county: "Norfolk City" },
  { city: "Chesapeake", state: "VA", stateName: "Virginia", county: "Chesapeake City" },
  { city: "Richmond", state: "VA", stateName: "Virginia", county: "Richmond City" },
  { city: "Newport News", state: "VA", stateName: "Virginia", county: "Newport News City" },

  // Washington
  { city: "Seattle", state: "WA", stateName: "Washington", county: "King County" },
  { city: "Spokane", state: "WA", stateName: "Washington", county: "Spokane County" },
  { city: "Tacoma", state: "WA", stateName: "Washington", county: "Pierce County" },
  { city: "Vancouver", state: "WA", stateName: "Washington", county: "Clark County" },
  { city: "Bellevue", state: "WA", stateName: "Washington", county: "King County" },

  // Massachusetts
  { city: "Boston", state: "MA", stateName: "Massachusetts", county: "Suffolk County" },
  { city: "Worcester", state: "MA", stateName: "Massachusetts", county: "Worcester County" },
  { city: "Springfield", state: "MA", stateName: "Massachusetts", county: "Hampden County" },
  { city: "Cambridge", state: "MA", stateName: "Massachusetts", county: "Middlesex County" },
  { city: "Lowell", state: "MA", stateName: "Massachusetts", county: "Middlesex County" },

  // Arizona
  { city: "Phoenix", state: "AZ", stateName: "Arizona", county: "Maricopa County" },
  { city: "Tucson", state: "AZ", stateName: "Arizona", county: "Pima County" },
  { city: "Mesa", state: "AZ", stateName: "Arizona", county: "Maricopa County" },
  { city: "Chandler", state: "AZ", stateName: "Arizona", county: "Maricopa County" },
  { city: "Scottsdale", state: "AZ", stateName: "Arizona", county: "Maricopa County" },

  // Colorado
  { city: "Denver", state: "CO", stateName: "Colorado", county: "Denver County" },
  { city: "Colorado Springs", state: "CO", stateName: "Colorado", county: "El Paso County" },
  { city: "Aurora", state: "CO", stateName: "Colorado", county: "Arapahoe County" },
  { city: "Fort Collins", state: "CO", stateName: "Colorado", county: "Larimer County" },
  { city: "Boulder", state: "CO", stateName: "Colorado", county: "Boulder County" },

  // Indiana
  { city: "Indianapolis", state: "IN", stateName: "Indiana", county: "Marion County" },
  { city: "Fort Wayne", state: "IN", stateName: "Indiana", county: "Allen County" },
  { city: "Evansville", state: "IN", stateName: "Indiana", county: "Vanderburgh County" },
  { city: "South Bend", state: "IN", stateName: "Indiana", county: "St. Joseph County" },
  { city: "Carmel", state: "IN", stateName: "Indiana", county: "Hamilton County" },

  // Tennessee
  { city: "Nashville", state: "TN", stateName: "Tennessee", county: "Davidson County" },
  { city: "Memphis", state: "TN", stateName: "Tennessee", county: "Shelby County" },
  { city: "Knoxville", state: "TN", stateName: "Tennessee", county: "Knox County" },
  { city: "Chattanooga", state: "TN", stateName: "Tennessee", county: "Hamilton County" },
  { city: "Clarksville", state: "TN", stateName: "Tennessee", county: "Montgomery County" },

  // Missouri
  { city: "Kansas City", state: "MO", stateName: "Missouri", county: "Jackson County" },
  { city: "St. Louis", state: "MO", stateName: "Missouri", county: "St. Louis City" },
  { city: "Springfield", state: "MO", stateName: "Missouri", county: "Greene County" },
  { city: "Columbia", state: "MO", stateName: "Missouri", county: "Boone County" },
  { city: "Independence", state: "MO", stateName: "Missouri", county: "Jackson County" },

  // Maryland
  { city: "Baltimore", state: "MD", stateName: "Maryland", county: "Baltimore City" },
  { city: "Frederick", state: "MD", stateName: "Maryland", county: "Frederick County" },
  { city: "Rockville", state: "MD", stateName: "Maryland", county: "Montgomery County" },
  { city: "Gaithersburg", state: "MD", stateName: "Maryland", county: "Montgomery County" },
  { city: "Bowie", state: "MD", stateName: "Maryland", county: "Prince George's County" },

  // Wisconsin
  { city: "Milwaukee", state: "WI", stateName: "Wisconsin", county: "Milwaukee County" },
  { city: "Madison", state: "WI", stateName: "Wisconsin", county: "Dane County" },
  { city: "Green Bay", state: "WI", stateName: "Wisconsin", county: "Brown County" },
  { city: "Kenosha", state: "WI", stateName: "Wisconsin", county: "Kenosha County" },
  { city: "Racine", state: "WI", stateName: "Wisconsin", county: "Racine County" },

  // Minnesota
  { city: "Minneapolis", state: "MN", stateName: "Minnesota", county: "Hennepin County" },
  { city: "St. Paul", state: "MN", stateName: "Minnesota", county: "Ramsey County" },
  { city: "Rochester", state: "MN", stateName: "Minnesota", county: "Olmsted County" },
  { city: "Duluth", state: "MN", stateName: "Minnesota", county: "St. Louis County" },
  { city: "Bloomington", state: "MN", stateName: "Minnesota", county: "Hennepin County" },

  // Louisiana
  { city: "New Orleans", state: "LA", stateName: "Louisiana", county: "Orleans Parish" },
  { city: "Baton Rouge", state: "LA", stateName: "Louisiana", county: "East Baton Rouge Parish" },
  { city: "Shreveport", state: "LA", stateName: "Louisiana", county: "Caddo Parish" },
  { city: "Lafayette", state: "LA", stateName: "Louisiana", county: "Lafayette Parish" },
  { city: "Lake Charles", state: "LA", stateName: "Louisiana", county: "Calcasieu Parish" },

  // Oregon
  { city: "Portland", state: "OR", stateName: "Oregon", county: "Multnomah County" },
  { city: "Eugene", state: "OR", stateName: "Oregon", county: "Lane County" },
  { city: "Salem", state: "OR", stateName: "Oregon", county: "Marion County" },
  { city: "Gresham", state: "OR", stateName: "Oregon", county: "Multnomah County" },
  { city: "Bend", state: "OR", stateName: "Oregon", county: "Deschutes County" },

  // Oklahoma
  { city: "Oklahoma City", state: "OK", stateName: "Oklahoma", county: "Oklahoma County" },
  { city: "Tulsa", state: "OK", stateName: "Oklahoma", county: "Tulsa County" },
  { city: "Norman", state: "OK", stateName: "Oklahoma", county: "Cleveland County" },
  { city: "Broken Arrow", state: "OK", stateName: "Oklahoma", county: "Tulsa County" },
  { city: "Lawton", state: "OK", stateName: "Oklahoma", county: "Comanche County" },

  // Connecticut
  { city: "Bridgeport", state: "CT", stateName: "Connecticut", county: "Fairfield County" },
  { city: "New Haven", state: "CT", stateName: "Connecticut", county: "New Haven County" },
  { city: "Hartford", state: "CT", stateName: "Connecticut", county: "Hartford County" },
  { city: "Stamford", state: "CT", stateName: "Connecticut", county: "Fairfield County" },
  { city: "Waterbury", state: "CT", stateName: "Connecticut", county: "New Haven County" },

  // Utah
  { city: "Salt Lake City", state: "UT", stateName: "Utah", county: "Salt Lake County" },
  { city: "West Valley City", state: "UT", stateName: "Utah", county: "Salt Lake County" },
  { city: "Provo", state: "UT", stateName: "Utah", county: "Utah County" },
  { city: "West Jordan", state: "UT", stateName: "Utah", county: "Salt Lake County" },
  { city: "Orem", state: "UT", stateName: "Utah", county: "Utah County" },

  // Nevada
  { city: "Las Vegas", state: "NV", stateName: "Nevada", county: "Clark County" },
  { city: "Henderson", state: "NV", stateName: "Nevada", county: "Clark County" },
  { city: "Reno", state: "NV", stateName: "Nevada", county: "Washoe County" },
  { city: "North Las Vegas", state: "NV", stateName: "Nevada", county: "Clark County" },
  { city: "Sparks", state: "NV", stateName: "Nevada", county: "Washoe County" },

  // District of Columbia
  { city: "Washington", state: "DC", stateName: "District of Columbia", county: "District of Columbia" },

  // Alabama
  { city: "Birmingham", state: "AL", stateName: "Alabama", county: "Jefferson County" },
  { city: "Montgomery", state: "AL", stateName: "Alabama", county: "Montgomery County" },
  { city: "Mobile", state: "AL", stateName: "Alabama", county: "Mobile County" },
  { city: "Huntsville", state: "AL", stateName: "Alabama", county: "Madison County" },
  { city: "Tuscaloosa", state: "AL", stateName: "Alabama", county: "Tuscaloosa County" },

  // Alaska
  { city: "Anchorage", state: "AK", stateName: "Alaska", county: "Anchorage Municipality" },
  { city: "Fairbanks", state: "AK", stateName: "Alaska", county: "Fairbanks North Star Borough" },
  { city: "Juneau", state: "AK", stateName: "Alaska", county: "Juneau City and Borough" },
  { city: "Sitka", state: "AK", stateName: "Alaska", county: "Sitka City and Borough" },
  { city: "Ketchikan", state: "AK", stateName: "Alaska", county: "Ketchikan Gateway Borough" },

  // Arkansas
  { city: "Little Rock", state: "AR", stateName: "Arkansas", county: "Pulaski County" },
  { city: "Fort Smith", state: "AR", stateName: "Arkansas", county: "Sebastian County" },
  { city: "Fayetteville", state: "AR", stateName: "Arkansas", county: "Washington County" },
  { city: "Springdale", state: "AR", stateName: "Arkansas", county: "Washington County" },
  { city: "Jonesboro", state: "AR", stateName: "Arkansas", county: "Craighead County" },

  // Delaware
  { city: "Wilmington", state: "DE", stateName: "Delaware", county: "New Castle County" },
  { city: "Dover", state: "DE", stateName: "Delaware", county: "Kent County" },
  { city: "Newark", state: "DE", stateName: "Delaware", county: "New Castle County" },
  { city: "Middletown", state: "DE", stateName: "Delaware", county: "New Castle County" },
  { city: "Smyrna", state: "DE", stateName: "Delaware", county: "Kent County" },

  // Hawaii
  { city: "Honolulu", state: "HI", stateName: "Hawaii", county: "Honolulu County" },
  { city: "Hilo", state: "HI", stateName: "Hawaii", county: "Hawaii County" },
  { city: "Kailua", state: "HI", stateName: "Hawaii", county: "Honolulu County" },
  { city: "Kaneohe", state: "HI", stateName: "Hawaii", county: "Honolulu County" },
  { city: "Pearl City", state: "HI", stateName: "Hawaii", county: "Honolulu County" },

  // Idaho
  { city: "Boise", state: "ID", stateName: "Idaho", county: "Ada County" },
  { city: "Nampa", state: "ID", stateName: "Idaho", county: "Canyon County" },
  { city: "Meridian", state: "ID", stateName: "Idaho", county: "Ada County" },
  { city: "Idaho Falls", state: "ID", stateName: "Idaho", county: "Bonneville County" },
  { city: "Pocatello", state: "ID", stateName: "Idaho", county: "Bannock County" },

  // Iowa
  { city: "Des Moines", state: "IA", stateName: "Iowa", county: "Polk County" },
  { city: "Cedar Rapids", state: "IA", stateName: "Iowa", county: "Linn County" },
  { city: "Davenport", state: "IA", stateName: "Iowa", county: "Scott County" },
  { city: "Sioux City", state: "IA", stateName: "Iowa", county: "Woodbury County" },
  { city: "Iowa City", state: "IA", stateName: "Iowa", county: "Johnson County" },

  // Kansas
  { city: "Wichita", state: "KS", stateName: "Kansas", county: "Sedgwick County" },
  { city: "Overland Park", state: "KS", stateName: "Kansas", county: "Johnson County" },
  { city: "Kansas City", state: "KS", stateName: "Kansas", county: "Wyandotte County" },
  { city: "Olathe", state: "KS", stateName: "Kansas", county: "Johnson County" },
  { city: "Topeka", state: "KS", stateName: "Kansas", county: "Shawnee County" },

  // Kentucky
  { city: "Louisville", state: "KY", stateName: "Kentucky", county: "Jefferson County" },
  { city: "Lexington", state: "KY", stateName: "Kentucky", county: "Fayette County" },
  { city: "Bowling Green", state: "KY", stateName: "Kentucky", county: "Warren County" },
  { city: "Owensboro", state: "KY", stateName: "Kentucky", county: "Daviess County" },
  { city: "Covington", state: "KY", stateName: "Kentucky", county: "Kenton County" },

  // Maine
  { city: "Portland", state: "ME", stateName: "Maine", county: "Cumberland County" },
  { city: "Lewiston", state: "ME", stateName: "Maine", county: "Androscoggin County" },
  { city: "Bangor", state: "ME", stateName: "Maine", county: "Penobscot County" },
  { city: "South Portland", state: "ME", stateName: "Maine", county: "Cumberland County" },
  { city: "Auburn", state: "ME", stateName: "Maine", county: "Androscoggin County" },

  // Mississippi
  { city: "Jackson", state: "MS", stateName: "Mississippi", county: "Hinds County" },
  { city: "Gulfport", state: "MS", stateName: "Mississippi", county: "Harrison County" },
  { city: "Southaven", state: "MS", stateName: "Mississippi", county: "DeSoto County" },
  { city: "Hattiesburg", state: "MS", stateName: "Mississippi", county: "Forrest County" },
  { city: "Biloxi", state: "MS", stateName: "Mississippi", county: "Harrison County" },

  // Montana
  { city: "Billings", state: "MT", stateName: "Montana", county: "Yellowstone County" },
  { city: "Missoula", state: "MT", stateName: "Montana", county: "Missoula County" },
  { city: "Great Falls", state: "MT", stateName: "Montana", county: "Cascade County" },
  { city: "Bozeman", state: "MT", stateName: "Montana", county: "Gallatin County" },
  { city: "Butte", state: "MT", stateName: "Montana", county: "Silver Bow County" },

  // Nebraska
  { city: "Omaha", state: "NE", stateName: "Nebraska", county: "Douglas County" },
  { city: "Lincoln", state: "NE", stateName: "Nebraska", county: "Lancaster County" },
  { city: "Bellevue", state: "NE", stateName: "Nebraska", county: "Sarpy County" },
  { city: "Grand Island", state: "NE", stateName: "Nebraska", county: "Hall County" },
  { city: "Kearney", state: "NE", stateName: "Nebraska", county: "Buffalo County" },

  // New Hampshire
  { city: "Manchester", state: "NH", stateName: "New Hampshire", county: "Hillsborough County" },
  { city: "Nashua", state: "NH", stateName: "New Hampshire", county: "Hillsborough County" },
  { city: "Concord", state: "NH", stateName: "New Hampshire", county: "Merrimack County" },
  { city: "Derry", state: "NH", stateName: "New Hampshire", county: "Rockingham County" },
  { city: "Rochester", state: "NH", stateName: "New Hampshire", county: "Strafford County" },

  // New Mexico
  { city: "Albuquerque", state: "NM", stateName: "New Mexico", county: "Bernalillo County" },
  { city: "Las Cruces", state: "NM", stateName: "New Mexico", county: "Doña Ana County" },
  { city: "Rio Rancho", state: "NM", stateName: "New Mexico", county: "Sandoval County" },
  { city: "Santa Fe", state: "NM", stateName: "New Mexico", county: "Santa Fe County" },
  { city: "Roswell", state: "NM", stateName: "New Mexico", county: "Chaves County" },

  // North Dakota
  { city: "Fargo", state: "ND", stateName: "North Dakota", county: "Cass County" },
  { city: "Bismarck", state: "ND", stateName: "North Dakota", county: "Burleigh County" },
  { city: "Grand Forks", state: "ND", stateName: "North Dakota", county: "Grand Forks County" },
  { city: "Minot", state: "ND", stateName: "North Dakota", county: "Ward County" },
  { city: "West Fargo", state: "ND", stateName: "North Dakota", county: "Cass County" },

  // Rhode Island
  { city: "Providence", state: "RI", stateName: "Rhode Island", county: "Providence County" },
  { city: "Warwick", state: "RI", stateName: "Rhode Island", county: "Kent County" },
  { city: "Cranston", state: "RI", stateName: "Rhode Island", county: "Providence County" },
  { city: "Pawtucket", state: "RI", stateName: "Rhode Island", county: "Providence County" },
  { city: "East Providence", state: "RI", stateName: "Rhode Island", county: "Providence County" },

  // South Carolina
  { city: "Charleston", state: "SC", stateName: "South Carolina", county: "Charleston County" },
  { city: "Columbia", state: "SC", stateName: "South Carolina", county: "Richland County" },
  { city: "North Charleston", state: "SC", stateName: "South Carolina", county: "Charleston County" },
  { city: "Greenville", state: "SC", stateName: "South Carolina", county: "Greenville County" },
  { city: "Rock Hill", state: "SC", stateName: "South Carolina", county: "York County" },

  // South Dakota
  { city: "Sioux Falls", state: "SD", stateName: "South Dakota", county: "Minnehaha County" },
  { city: "Rapid City", state: "SD", stateName: "South Dakota", county: "Pennington County" },
  { city: "Aberdeen", state: "SD", stateName: "South Dakota", county: "Brown County" },
  { city: "Brookings", state: "SD", stateName: "South Dakota", county: "Brookings County" },
  { city: "Watertown", state: "SD", stateName: "South Dakota", county: "Codington County" },

  // Vermont
  { city: "Burlington", state: "VT", stateName: "Vermont", county: "Chittenden County" },
  { city: "Essex", state: "VT", stateName: "Vermont", county: "Chittenden County" },
  { city: "South Burlington", state: "VT", stateName: "Vermont", county: "Chittenden County" },
  { city: "Colchester", state: "VT", stateName: "Vermont", county: "Chittenden County" },
  { city: "Rutland", state: "VT", stateName: "Vermont", county: "Rutland County" },

  // West Virginia
  { city: "Charleston", state: "WV", stateName: "West Virginia", county: "Kanawha County" },
  { city: "Huntington", state: "WV", stateName: "West Virginia", county: "Cabell County" },
  { city: "Parkersburg", state: "WV", stateName: "West Virginia", county: "Wood County" },
  { city: "Morgantown", state: "WV", stateName: "West Virginia", county: "Monongalia County" },
  { city: "Wheeling", state: "WV", stateName: "West Virginia", county: "Ohio County" },

  // Wyoming
  { city: "Cheyenne", state: "WY", stateName: "Wyoming", county: "Laramie County" },
  { city: "Casper", state: "WY", stateName: "Wyoming", county: "Natrona County" },
  { city: "Laramie", state: "WY", stateName: "Wyoming", county: "Albany County" },
  { city: "Gillette", state: "WY", stateName: "Wyoming", county: "Campbell County" },
  { city: "Rock Springs", state: "WY", stateName: "Wyoming", county: "Sweetwater County" },
];

export function generateCitySlug(cityName: string) {
  return cityName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
