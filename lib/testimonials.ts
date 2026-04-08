export type Testimonial = {
  name: string
  role: "Owner" | "Tenant" | "Investor" | "Buyer" | "Seller"
  city: string
  service: "property-management" | "buy-sell" | "loans" | "investments"
  quote: string
  rating: number
  image?: string
}

export const testimonials: Testimonial[] = [
  // Salt Lake City
  {
    name: "Sarah J.",
    role: "Tenant",
    city: "Salt Lake City",
    service: "property-management",
    quote: "Ondo RE made finding my new apartment in Sugar House so easy. Their team was responsive and helped me find exactly what I was looking for — walkable to TRAX and within my budget.",
    rating: 5,
    image: "/professional-woman-smiling.webp",
  },
  {
    name: "Michael T.",
    role: "Owner",
    city: "Salt Lake City",
    service: "property-management",
    quote: "Since hiring Ondo to manage my Avenues duplex, I've had zero stress. They handle everything professionally and my rental income has actually increased with better tenant placement.",
    rating: 5,
    image: "/professional-man-suit.webp",
  },
  {
    name: "Jennifer L.",
    role: "Investor",
    city: "Salt Lake City",
    service: "investments",
    quote: "The data-driven approach Ondo RE takes to investment analysis helped me identify undervalued properties near the University of Utah. My portfolio has grown 15% in one year.",
    rating: 5,
    image: "/professional-woman-glasses.webp",
  },

  // Draper
  {
    name: "David K.",
    role: "Owner",
    city: "Draper",
    service: "property-management",
    quote: "Managing my Suncrest rental from out of state was a nightmare until I found Ondo. Their owner dashboard shows me everything — rent status, maintenance, financials — in real time.",
    rating: 5,
  },
  {
    name: "Amanda R.",
    role: "Buyer",
    city: "Draper",
    service: "buy-sell",
    quote: "We relocated from California for the Silicon Slopes tech jobs. Ondo's local knowledge of Draper neighborhoods saved us from a bad HOA situation and found us a home near Corner Canyon trails.",
    rating: 5,
  },

  // Lehi
  {
    name: "Jason M.",
    role: "Investor",
    city: "Lehi",
    service: "investments",
    quote: "The Traverse Mountain townhome Ondo helped me acquire has been fully occupied since day one. Their tenant screening is thorough — quality tenants, zero turnover in 18 months.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "Tenant",
    city: "Lehi",
    service: "property-management",
    quote: "Maintenance requests get handled within 24 hours. I submitted a plumbing issue at 10 PM and had a plumber there by 9 AM the next morning. That's unheard of with other management companies.",
    rating: 5,
  },

  // Provo
  {
    name: "Tyler B.",
    role: "Owner",
    city: "Provo",
    service: "property-management",
    quote: "I own three rentals near BYU campus. Ondo handles the student turnover seamlessly — properties are cleaned, repaired, and re-listed within days of lease end. Vacancy stays under two weeks.",
    rating: 5,
  },

  // Sandy
  {
    name: "Lisa N.",
    role: "Seller",
    city: "Sandy",
    service: "buy-sell",
    quote: "Ondo's twilight photography and video tour of our Sandy home generated 12 showings in the first weekend. We got three offers above asking price and closed in 21 days.",
    rating: 5,
  },

  // Orem
  {
    name: "Mark H.",
    role: "Owner",
    city: "Orem",
    service: "property-management",
    quote: "The AI-powered risk alerts caught a potential late payment trend early. Ondo reached out to the tenant proactively and set up a payment plan before it became an issue. Smart management.",
    rating: 5,
  },

  // Ogden
  {
    name: "Rachel W.",
    role: "Investor",
    city: "Ogden",
    service: "investments",
    quote: "Ondo identified a value-add fourplex near 25th Street that I would have overlooked. After renovations their recommended contractor completed, rents increased 30%. Incredible ROI guidance.",
    rating: 5,
  },

  // Bountiful
  {
    name: "Chris D.",
    role: "Tenant",
    city: "Bountiful",
    service: "property-management",
    quote: "The online portal makes everything simple — rent payments, maintenance requests, document storage. I've rented from three different companies and Ondo's tech is leagues ahead.",
    rating: 5,
  },

  // Layton
  {
    name: "Karen P.",
    role: "Owner",
    city: "Layton",
    service: "property-management",
    quote: "With my husband deployed, having Ondo manage our rental near Hill AFB gives me peace of mind. They handle everything from inspections to lease renewals. Professional and caring team.",
    rating: 5,
  },

  // South Jordan
  {
    name: "Robert G.",
    role: "Buyer",
    city: "South Jordan",
    service: "loans",
    quote: "Ondo's loan team got us pre-approved in 48 hours and locked in a great rate. The whole process from application to closing on our South Jordan home took just 28 days.",
    rating: 5,
  },

  // Riverton
  {
    name: "Stephanie F.",
    role: "Owner",
    city: "Riverton",
    service: "property-management",
    quote: "I switched to Ondo from another PM company and immediately saw the difference. Better communication, faster maintenance, and my monthly statements are clear and detailed.",
    rating: 5,
  },
]

/**
 * Get testimonials for a specific city, falling back to nearby-city testimonials
 * if insufficient matches.
 */
export function getTestimonialsForCity(cityName: string, limit = 3): Testimonial[] {
  const exact = testimonials.filter((t) => t.city === cityName)
  if (exact.length >= limit) return exact.slice(0, limit)

  // Fill with general testimonials, avoiding duplicates
  const rest = testimonials.filter((t) => t.city !== cityName)
  return [...exact, ...rest].slice(0, limit)
}

/**
 * Get testimonials for a specific service type.
 */
export function getTestimonialsForService(
  service: Testimonial["service"],
  limit = 3
): Testimonial[] {
  const matching = testimonials.filter((t) => t.service === service)
  if (matching.length >= limit) return matching.slice(0, limit)
  return [...matching, ...testimonials.filter((t) => t.service !== service)].slice(0, limit)
}
