import { describe, expect, it } from "vitest"
import {
  ALL_STATES_FILTER,
  RESOURCE_TEMPLATES,
  TEMPLATE_DISCLAIMER,
  filterTemplatesByState,
  uniqueTemplateStates,
} from "./templates"

describe("uniqueTemplateStates", () => {
  const withStates = (...states: string[]) =>
    states.map((state) => ({ ...RESOURCE_TEMPLATES[0]!, state }))

  it("lists Utah first, then other states alphabetically, once each", () => {
    expect(uniqueTemplateStates(withStates("NV", "AZ", "UT", "NV", "CO", "UT"))).toEqual([
      "UT",
      "AZ",
      "CO",
      "NV",
    ])
  })

  it("puts Utah first in the real catalog and includes Nevada", () => {
    const states = uniqueTemplateStates(RESOURCE_TEMPLATES)
    expect(states[0]).toBe("UT")
    expect(states).toContain("NV")
    expect(new Set(states).size).toBe(states.length)
  })
})

describe("filterTemplatesByState", () => {
  it("returns the full catalog for the all-states filter", () => {
    expect(filterTemplatesByState(RESOURCE_TEMPLATES, ALL_STATES_FILTER)).toHaveLength(
      RESOURCE_TEMPLATES.length,
    )
  })

  it("keeps only Utah cards when the state filter is UT", () => {
    const utah = filterTemplatesByState(RESOURCE_TEMPLATES, "UT")
    expect(utah.length).toBeGreaterThan(0)
    expect(utah.every((t) => t.state === "UT")).toBe(true)
  })

  it("keeps only Nevada cards when the state filter is NV", () => {
    const nevada = filterTemplatesByState(RESOURCE_TEMPLATES, "NV")
    expect(nevada.length).toBeGreaterThan(0)
    expect(nevada.every((t) => t.state === "NV")).toBe(true)
  })
})

describe("RESOURCE_TEMPLATES catalog", () => {
  it("includes the original Utah cards plus planned addendums and disclosures", () => {
    const ids = RESOURCE_TEMPLATES.map((t) => t.id)
    expect(ids).toEqual(
      expect.arrayContaining([
        "residential-lease",
        "move-in-checklist",
        "maintenance-request",
        "landlord-onboarding-playbook",
        "listing-prep-showing-feedback",
        "pet-addendum",
        "lead-based-paint-disclosure",
        "mold-disclosure",
        "methamphetamine-contamination",
        "utility-hoa-addendum",
      ]),
    )
  })

  it("gives every card applies-when, watch-for bullets, and a reference-only disclaimer", () => {
    expect(TEMPLATE_DISCLAIMER.toLowerCase()).toMatch(/not legal advice/)
    expect(TEMPLATE_DISCLAIMER.toLowerCase()).toMatch(/not an instant download/)
    expect(TEMPLATE_DISCLAIMER.toLowerCase()).toMatch(/reference only/)
    expect(TEMPLATE_DISCLAIMER.toLowerCase()).toMatch(/appropriate legal channels/)
    for (const t of RESOURCE_TEMPLATES) {
      expect(t.appliesWhen.length).toBeGreaterThan(10)
      expect(t.watchFor.length).toBeGreaterThan(0)
      expect(t.disclaimer).toBe(TEMPLATE_DISCLAIMER)
    }
  })
})
