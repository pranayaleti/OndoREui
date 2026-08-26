import { describe, it, expect } from "vitest"
import { subServiceDefinitions } from "./sub-service-content"
import { cityMarketData } from "./city-market-data"

describe("maintenance coordination claims", () => {
  it("does not promise an unverifiable under-4-hour dispatch SLA", () => {
    const maintenance = subServiceDefinitions["maintenance-coordination"]
    expect(maintenance).toBeDefined()
    const data = cityMarketData.Lehi
    expect(data).toBeDefined()
    const blob = [
      ...maintenance.features.map((f) => `${f.title} ${f.description}`),
      ...maintenance.howItWorks.map((s) => `${s.title} ${s.desc}`),
      ...maintenance.localizedBenefits("Lehi", data),
      ...maintenance.baseFaqs.map((f) => `${f.q} ${f.a}`),
    ].join("\n")
    expect(blob).not.toMatch(/under 4 hours/i)
    expect(blob).toMatch(/24\/7 emergency line/i)
  })
})
