export type TestimonialRole = "Owner" | "Tenant" | "Investor" | "Buyer" | "Seller"
export type TestimonialService = "property-management" | "buy-sell" | "loans" | "investments"
/**
 * `composite` = illustrative copy (no review date). Composites are no longer
 * published; the dataset may hold only `review` entries (permissioned, dated quotes).
 */
export type TestimonialKind = "composite" | "review"

export type Testimonial = {
  name: string
  role: TestimonialRole
  city: string
  service: TestimonialService
  quote: string
  rating: number
  image?: string
  kind?: TestimonialKind
  reviewDate?: string
}

export function getTestimonialKind(item: Testimonial): TestimonialKind {
  if (item.kind) return item.kind
  if (item.reviewDate) return "review"
  return "composite"
}

/** Display order for role chips. Only roles present in `testimonials` are shown. */
export const TESTIMONIAL_ROLE_ORDER: TestimonialRole[] = [
  "Owner",
  "Tenant",
  "Investor",
  "Buyer",
  "Seller",
]

export const TESTIMONIAL_SERVICE_LABELS: Record<TestimonialService, string> = {
  "property-management": "Property management",
  "buy-sell": "Buy & sell",
  loans: "Loans",
  investments: "Investments",
}

const TESTIMONIAL_SERVICE_ORDER: TestimonialService[] = [
  "property-management",
  "buy-sell",
  "loans",
  "investments",
]

/**
 * Real, permissioned, dated reviews only. The earlier set of composite stories
 * (invented names, stock photos, five-star ratings and specific results) was
 * removed because none of it could be verified. Add an entry only with the
 * reviewer's written permission, `kind: "review"` and a `reviewDate`. Do not add
 * numeric outcome claims we cannot document, and never show loan testimonials.
 */
export const testimonials: Testimonial[] = []

export function getPresentTestimonialRoles(): TestimonialRole[] {
  const present = new Set(testimonials.map((item) => item.role))
  return TESTIMONIAL_ROLE_ORDER.filter((role) => present.has(role))
}

export function getPresentTestimonialServices(): TestimonialService[] {
  const present = new Set(testimonials.map((item) => item.service))
  return TESTIMONIAL_SERVICE_ORDER.filter((service) => present.has(service))
}

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
