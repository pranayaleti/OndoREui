import { describe, it, expect } from "vitest"
import {
  getPresentTestimonialRoles,
  getPresentTestimonialServices,
  getTestimonialKind,
  getTestimonialsForCity,
  getTestimonialsForService,
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
})

describe("testimonials only hold real reviews", () => {
  it("publishes no composite or undated entries", () => {
    for (const item of testimonials) {
      expect(getTestimonialKind(item), `${item.name} (${item.city})`).toBe("review")
      expect(item.reviewDate, `${item.name} (${item.city})`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it("never publishes loan testimonials", () => {
    expect(testimonials.filter((item) => item.service === "loans")).toEqual([])
  })

  it("does not ship the removed composite names", () => {
    const removed = ["Sarah J.", "Michael T.", "Jennifer L.", "Priya S.", "Rachel W.", "Robert G."]
    const names = testimonials.map((item) => item.name)
    for (const name of removed) expect(names).not.toContain(name)
  })

  it("derives roles and services from the data", () => {
    expect(getPresentTestimonialRoles()).toHaveLength(new Set(testimonials.map((item) => item.role)).size)
    expect(getPresentTestimonialServices()).toHaveLength(new Set(testimonials.map((item) => item.service)).size)
  })

  it("returns only what exists for a city or service", () => {
    expect(getTestimonialsForCity("Lehi")).toHaveLength(Math.min(3, testimonials.length))
    expect(getTestimonialsForService("property-management")).toHaveLength(Math.min(3, testimonials.length))
  })
})
