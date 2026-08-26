import { describe, expect, it } from "vitest"
import { OWNER_HOUSING_TYPES } from "./owner-housing-types"

const STEERING =
  /quality tenants|family-friendly|family-oriented|young professionals|who should live|safe neighborhood/i

describe("OWNER_HOUSING_TYPES", () => {
  it("covers the four long-term housing types Ondo actually manages", () => {
    const ids = OWNER_HOUSING_TYPES.map((t) => t.id)
    expect(ids).toEqual(["sfh", "townhome", "condo-hoa", "small-multifamily"])
  })

  it("does not advertise vacation or short-term rentals", () => {
    const blob = OWNER_HOUSING_TYPES.map((t) => `${t.title} ${t.utahHook} ${t.opsNote}`).join(" ")
    expect(blob).not.toMatch(/vacation|short-term|STR\b|Airbnb/i)
  })

  it("stays Fair Housing-safe: housing stock and ops, not occupant type", () => {
    for (const type of OWNER_HOUSING_TYPES) {
      expect(`${type.title} ${type.utahHook} ${type.opsNote}`).not.toMatch(STEERING)
    }
  })

  it("links each type to an existing neighborhood or property-management path", () => {
    for (const type of OWNER_HOUSING_TYPES) {
      expect(type.href).toMatch(/^\/(neighborhoods|property-management)\//)
    }
  })
})
