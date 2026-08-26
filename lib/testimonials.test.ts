import { describe, it, expect } from "vitest"
import { testimonials } from "./testimonials"

const OCCUPANT_QUALITY =
  /quality tenants|high-quality tenants|tenant quality|better tenants|ideal for families|young professionals/i

describe("testimonials Fair Housing", () => {
  it("does not describe occupant quality or who should live in a unit", () => {
    for (const t of testimonials) {
      expect(t.quote, `${t.name} (${t.city})`).not.toMatch(OCCUPANT_QUALITY)
    }
  })
})
