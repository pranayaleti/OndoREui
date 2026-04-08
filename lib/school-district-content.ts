export type SchoolInfo = {
  name: string
  level: "Elementary" | "Middle" | "High" | "K-12"
  grades: string
  enrollment?: number
  notes?: string
}

export type SchoolDistrictInfo = {
  name: string
  slug: string
  overview: string
  headquarters: string
  website: string
  enrollment: number
  schools: SchoolInfo[]
  citiesServed: string[]
  notablePrograms: string[]
  highlights: string[]
}

export const schoolDistricts: SchoolDistrictInfo[] = [
  {
    name: "Weber School District",
    slug: "weber-school-district",
    overview:
      "Weber School District serves northern Utah County and most of Weber County, covering communities from North Ogden to Riverdale. It is one of Utah's largest districts, known for strong STEM programs, robust athletics, and community involvement. The district consistently ranks above the state average on ACT scores.",
    headquarters: "Ogden, UT",
    website: "https://www.wsd.net",
    enrollment: 31000,
    schools: [
      { name: "North Ogden Elementary", level: "Elementary", grades: "K–6" },
      { name: "Green Acres Elementary", level: "Elementary", grades: "K–6" },
      { name: "North Ogden Junior High", level: "Middle", grades: "7–9" },
      { name: "Weber High School", level: "High", grades: "10–12", enrollment: 2800, notes: "Weber Warriors — strong CTE and AP programs" },
      { name: "Bonneville High School", level: "High", grades: "10–12", enrollment: 1900 },
      { name: "Roy High School", level: "High", grades: "10–12", enrollment: 2100 },
    ],
    citiesServed: ["North Ogden", "Ogden", "South Ogden", "Washington Terrace", "Riverdale", "Roy", "Hooper", "West Point"],
    notablePrograms: ["STEM Academy", "Dual Immersion (Spanish, Mandarin)", "Career & Technical Education", "Advanced Placement"],
    highlights: [
      "Above-average ACT scores vs. Utah state",
      "Multiple CTE pathways: healthcare, IT, manufacturing",
      "Strong athletic traditions at Weber and Roy High",
      "Dual-language immersion programs at elementary level",
    ],
  },
  {
    name: "Davis School District",
    slug: "davis-school-district",
    overview:
      "Davis School District is one of Utah's premier districts, serving Davis County from Layton to North Salt Lake. It ranks among the top districts in the state for graduation rates and college readiness. The district offers extensive honors, AP, and dual-enrollment programs in partnership with Bountiful-area colleges.",
    headquarters: "Farmington, UT",
    website: "https://www.davis.k12.ut.us",
    enrollment: 74000,
    schools: [
      { name: "Layton High School", level: "High", grades: "10–12", enrollment: 2600, notes: "Robust theater and performing arts" },
      { name: "Viewmont High School", level: "High", grades: "10–12", enrollment: 2200 },
      { name: "Bountiful High School", level: "High", grades: "10–12", enrollment: 1800 },
      { name: "Farmington High School", level: "High", grades: "10–12", enrollment: 2400, notes: "Brand new facility (2020)" },
      { name: "Centerville Junior High", level: "Middle", grades: "7–9" },
      { name: "Kaysville Elementary", level: "Elementary", grades: "K–6" },
    ],
    citiesServed: ["Layton", "Kaysville", "Farmington", "Centerville", "Bountiful", "Woods Cross", "North Salt Lake", "Clinton", "Syracuse", "Clearfield"],
    notablePrograms: ["AP Capstone Program", "IB Diploma (Farmington HS)", "STEM Pathways", "Concurrent Enrollment with SLCC/UVU"],
    highlights: [
      "Top 3 Utah district by graduation rate",
      "IB Diploma Programme at Farmington High School",
      "Farmington HS opened 2020 — state-of-the-art facilities",
      "Multiple STEM magnet programs across the district",
    ],
  },
  {
    name: "Salt Lake City School District",
    slug: "salt-lake-city-school-district",
    overview:
      "Salt Lake City School District is the urban core district serving central Salt Lake City neighborhoods. The district has undergone significant investment in facilities and technology, offering strong bilingual and dual-language programs. West High School and East High School are flagship institutions with national academic recognition.",
    headquarters: "Salt Lake City, UT",
    website: "https://www.slcschools.org",
    enrollment: 22000,
    schools: [
      { name: "East High School", level: "High", grades: "10–12", enrollment: 1700, notes: "National Blue Ribbon School" },
      { name: "West High School", level: "High", grades: "10–12", enrollment: 2200 },
      { name: "Highland High School", level: "High", grades: "10–12", enrollment: 1400 },
      { name: "Ensign Elementary", level: "Elementary", grades: "K–6", notes: "Serves The Avenues neighborhood" },
      { name: "Hawthorne Elementary", level: "Elementary", grades: "K–6", notes: "Serves Sugar House" },
      { name: "Open Classroom", level: "K-12", grades: "K–12", notes: "Project-based alternative school" },
    ],
    citiesServed: ["Salt Lake City"],
    notablePrograms: ["Dual Language Immersion (Spanish, French, Mandarin)", "IB Programme at East High", "Open Classroom alternative school", "Career & Technical Education"],
    highlights: [
      "East High — National Blue Ribbon School recognition",
      "Extensive dual-language immersion from K–12",
      "Open Classroom — project-based alternative program",
      "Strong arts and music programs across all levels",
    ],
  },
  {
    name: "Canyons School District",
    slug: "canyons-school-district",
    overview:
      "Canyons School District serves the southeastern Salt Lake Valley — Sandy, Draper, Holladay, Cottonwood Heights, and South Jordan. Known for high graduation rates, exceptional AP participation, and corner canyon area schools consistently ranked among Utah's best.",
    headquarters: "Sandy, UT",
    website: "https://www.canyonsdistrict.org",
    enrollment: 34000,
    schools: [
      { name: "Corner Canyon High School", level: "High", grades: "10–12", enrollment: 3200, notes: "#1 ranked Utah high school by AP participation" },
      { name: "Alta High School", level: "High", grades: "10–12", enrollment: 2200 },
      { name: "Jordan High School", level: "High", grades: "10–12", enrollment: 2800 },
      { name: "Draper Park Middle School", level: "Middle", grades: "6–8" },
      { name: "Draper Elementary", level: "Elementary", grades: "K–5" },
      { name: "Cottonwood Elementary", level: "Elementary", grades: "K–5" },
    ],
    citiesServed: ["Draper", "Sandy", "Holladay", "Cottonwood Heights", "Midvale", "South Jordan"],
    notablePrograms: ["AP Capstone Diploma Program", "STEM Academy at Corner Canyon", "CTE Health Sciences", "Gifted & Talented IEP programs"],
    highlights: [
      "Corner Canyon HS — #1 in Utah for AP exam participation and scores",
      "STEM Academy program at multiple schools",
      "Above-average graduation and college-readiness rates",
      "Strong community support and PTA engagement",
    ],
  },
  {
    name: "Alpine School District",
    slug: "alpine-school-district",
    overview:
      "Alpine School District is Utah's largest public school district, serving northern Utah County from American Fork and Alpine through Lehi, Saratoga Springs, and Eagle Mountain. The district has seen explosive growth mirroring Silicon Slopes' tech boom and consistently builds new schools to keep pace. Strong STEM programs align with the tech-sector workforce in the area.",
    headquarters: "American Fork, UT",
    website: "https://www.alpinedistrict.org",
    enrollment: 82000,
    schools: [
      { name: "Lone Peak High School", level: "High", grades: "10–12", enrollment: 3400, notes: "National Merit Scholar pipeline" },
      { name: "Lehi High School", level: "High", grades: "10–12", enrollment: 3100 },
      { name: "American Fork High School", level: "High", grades: "10–12", enrollment: 3300 },
      { name: "Northridge High School", level: "High", grades: "10–12", enrollment: 2400 },
      { name: "Vista Heights Middle", level: "Middle", grades: "6–8" },
      { name: "Traverse Mountain Elementary", level: "Elementary", grades: "K–6", notes: "Serves Traverse Mountain community" },
    ],
    citiesServed: ["Lehi", "American Fork", "Highland", "Alpine", "Saratoga Springs", "Eagle Mountain", "Vineyard", "Lindon", "Pleasant Grove"],
    notablePrograms: ["STEM Excellence Programs", "Dual Language (Spanish, Portuguese)", "CTE Technology & Engineering", "IB Candidate School"],
    highlights: [
      "Utah's largest school district by enrollment",
      "Strong STEM curriculum aligned with Silicon Slopes workforce",
      "New schools built every 2–3 years due to population growth",
      "National Merit Scholars consistently produced by Lone Peak HS",
    ],
  },
  {
    name: "Provo City School District",
    slug: "provo-city-school-district",
    overview:
      "Provo City School District serves the city of Provo and benefits from proximity to Brigham Young University and Utah Valley University. The district has a strong academic culture, competitive high schools, and robust dual-enrollment programs with local universities.",
    headquarters: "Provo, UT",
    website: "https://provo.edu",
    enrollment: 15000,
    schools: [
      { name: "Provo High School", level: "High", grades: "10–12", enrollment: 1900 },
      { name: "Timpview High School", level: "High", grades: "10–12", enrollment: 1700, notes: "Serves northeast Provo — Edgemont area" },
      { name: "Dixon Middle School", level: "Middle", grades: "6–9" },
      { name: "Edgemont Elementary", level: "Elementary", grades: "K–6" },
      { name: "Rock Canyon Elementary", level: "Elementary", grades: "K–6" },
    ],
    citiesServed: ["Provo"],
    notablePrograms: ["Dual Enrollment with BYU and UVU", "International Baccalaureate", "ELL Programs for large ESL population", "STEM Academy"],
    highlights: [
      "BYU proximity drives strong academic culture",
      "Dual enrollment credits available at BYU and UVU",
      "IB Programme candidate school",
      "Large ESL/dual-language programs reflecting diverse community",
    ],
  },
]

export function findDistrictBySlug(slug: string): SchoolDistrictInfo | undefined {
  return schoolDistricts.find((d) => d.slug === slug)
}

export const allDistrictSlugs = schoolDistricts.map((d) => d.slug)
