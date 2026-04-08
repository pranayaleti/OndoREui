export type TeamMember = {
  name: string
  slug: string
  title: string
  bio: string
  specialties: string[]
  cities: string[]
  email?: string
  phone?: string
  image?: string
  yearsExperience: number
  licenseNumber?: string
}

export const teamMembers: TeamMember[] = [
  {
    name: "Pranay Reddy Aleti",
    slug: "pranay-reddy-aleti",
    title: "Founder & CEO",
    bio: "Pranay founded Ondo Real Estate with a vision of using technology to make property ownership transparent and stress-free. With deep roots in both software engineering and real estate investment, he built the platform that powers Ondo's owner and tenant portals. He oversees strategic direction and is deeply involved in all Silicon Slopes and Wasatch Front market operations.",
    specialties: ["Property Management", "Investment Strategy", "Platform & Technology", "Commercial Real Estate"],
    cities: ["Lehi", "Draper", "Salt Lake City", "Provo", "Sandy"],
    email: "pranay@ondorealestate.com",
    image: "/professional-man-suit.webp",
    yearsExperience: 8,
  },
  {
    name: "Sarah Kim",
    slug: "sarah-kim",
    title: "Director of Property Management",
    bio: "Sarah oversees Ondo's entire property management portfolio across the Wasatch Front. She brings 10 years of experience in tenant relations, maintenance coordination, and owner reporting. Sarah is known for proactive communication and her ability to resolve complex tenant situations with care and efficiency.",
    specialties: ["Tenant Relations", "Maintenance Coordination", "Owner Reporting", "Lease Compliance"],
    cities: ["Salt Lake City", "Sandy", "Draper", "West Jordan", "South Jordan"],
    email: "sarah@ondorealestate.com",
    image: "/professional-woman-smiling.webp",
    yearsExperience: 10,
  },
  {
    name: "Marcus Thompson",
    slug: "marcus-thompson",
    title: "Lead Mortgage Advisor",
    bio: "Marcus is Ondo's go-to expert for home financing. He specializes in helping first-time buyers and investors navigate conventional, FHA, VA, and jumbo loan products. Marcus has helped over 500 Utah families achieve homeownership and is known for his clear explanations and fast pre-approval turnaround — often within 48 hours.",
    specialties: ["Conventional Loans", "FHA & VA Loans", "Jumbo Mortgages", "Investment Property Financing"],
    cities: ["Lehi", "American Fork", "Pleasant Grove", "Orem", "Provo", "Spanish Fork"],
    email: "marcus@ondorealestate.com",
    image: "/professional-man-suit.webp",
    yearsExperience: 12,
    licenseNumber: "NMLS #123456",
  },
  {
    name: "Jennifer Nakamura",
    slug: "jennifer-nakamura",
    title: "Senior Real Estate Agent",
    bio: "Jennifer specializes in buyer representation and listing strategy for the South Salt Lake Valley. She grew up in Sandy and has deep knowledge of school district boundaries, neighborhood character, and micro-market pricing from Sandy to Riverton. Jennifer's listings consistently achieve above-asking offers.",
    specialties: ["Buyer Representation", "Listing & Staging", "School District Guidance", "Investment Analysis"],
    cities: ["Sandy", "Draper", "Riverton", "South Jordan", "Herriman", "Bluffdale"],
    email: "jennifer@ondorealestate.com",
    image: "/professional-woman-glasses.webp",
    yearsExperience: 7,
  },
  {
    name: "David Patel",
    slug: "david-patel",
    title: "Investment Specialist",
    bio: "David helps investors build and optimize rental portfolios across the Wasatch Front. He specializes in off-market acquisitions, value-add analysis, and multi-family strategies. David has personally managed a portfolio of 12 rental units before joining Ondo and brings an operator's perspective to every client conversation.",
    specialties: ["Portfolio Strategy", "Value-Add Analysis", "Off-Market Acquisitions", "Multi-Family"],
    cities: ["Ogden", "Layton", "Bountiful", "Salt Lake City", "Orem", "Provo"],
    email: "david@ondorealestate.com",
    image: "/professional-man-suit.webp",
    yearsExperience: 9,
  },
]

export function getTeamForCity(cityName: string): TeamMember[] {
  return teamMembers.filter((m) => m.cities.includes(cityName))
}

export function findTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug)
}
