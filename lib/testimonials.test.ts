import { describe, it, expect } from "vitest"
import {
  getPresentTestimonialRoles,
  getPresentTestimonialServices,
  getTestimonialKind,
  testimonials,
} from "./testimonials"

const OCCUPANT_QUALITY =
  /quality tenants|high-quality tenants|tenant quality|better tenants|ideal for families|young professionals/i

describe("testimonials Fair Housing", () => {
  it("does not describe occupant quality or who should live in a unit", () => {
    for (const t of testimonials) {
      expect(t.quote, `${t.name} (${t.city})`).not.toMatch(OCCUPANT_QUALITY)
    }
  })

  it("exposes every role present in the data, including Seller when present", () => {
    const roles = getPresentTestimonialRoles()
    const unique = new Set(testimonials.map((item) => item.role))
    expect(roles).toHaveLength(unique.size)
    expect(roles).toEqual(expect.arrayContaining([...unique]))
    expect(roles).toContain("Seller")
  })

  it("exposes every service present in the data", () => {
    const services = getPresentTestimonialServices()
    const unique = new Set(testimonials.map((item) => item.service))
    expect(services).toHaveLength(unique.size)
    expect(services).toEqual(expect.arrayContaining([...unique]))
  })

  it("labels current quotes as composites, not Google reviews", () => {
    for (const item of testimonials) {
      expect(getTestimonialKind(item), `${item.name} (${item.city})`).toBe("composite")
      expect(item.reviewDate).toBeUndefined()
      expect(item.quote).not.toMatch(/google/i)
    }
  })
})
