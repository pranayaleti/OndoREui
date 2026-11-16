import { describe, it, expect } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { SERVICE_HUB_PATHS, subServiceDefinitions } from "./sub-service-content"
import { cityMarketData } from "./city-market-data"
import { parseRedirects } from "../scripts/generate-legacy-redirects.mjs"

describe("service hub links", () => {
  // A public/_redirects source is served as a meta-refresh stub: linking it costs a redirect
  // hop and 404s the next/link prefetch of the stub's RSC payload (/buy-sell/ was one).
  const root = join(__dirname, "..")
  const redirected = new Set(parseRedirects(readFileSync(join(root, "public", "_redirects"), "utf8")).map((rule) => rule.from))

  it("point every service and sub-service at a real hub page, never a legacy redirect", () => {
    const hrefs = [...Object.values(SERVICE_HUB_PATHS), ...Object.values(subServiceDefinitions).map((def) => def.parentHref)]
    for (const href of hrefs) {
      expect(redirected.has(href.replace(/\/+$/, "")), href).toBe(false)
      expect(existsSync(join(root, "app", href, "page.tsx")), href).toBe(true)
    }
    expect(SERVICE_HUB_PATHS["buy-sell"]).toBe("/buy/")
  })
})

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
    expect(blob).toMatch(/emergencies first/i)
  })
})

describe("loan program copy", () => {
  it("does not promise best rates, monthly PMI savings, or a hardcoded conforming limit", () => {
    const data = cityMarketData.Lehi
    expect(data).toBeDefined()
    const slugs = ["conventional", "va", "usda", "jumbo"] as const
    const blob = slugs
      .map((slug) => {
        const def = subServiceDefinitions[slug]
        return [
          ...def.features.map((f) => `${f.title} ${f.description}`),
          ...def.localizedBenefits("Lehi", data),
          ...def.baseFaqs.map((f) => `${f.q} ${f.a}`),
          def.localizedIntro("Lehi", data),
          def.metaDescription("Lehi"),
        ].join("\n")
      })
      .join("\n")
    expect(blob).not.toMatch(/best rates/i)
    expect(blob).not.toMatch(/lowest interest rates/i)
    expect(blob).not.toMatch(/saving hundreds/i)
    expect(blob).not.toMatch(/\$766,550/)
    expect(blob).not.toMatch(/\$200–500 per month/)
  })
})

function allCopy(slug: string, city = "Lehi"): string {
  const def = subServiceDefinitions[slug]
  const data = cityMarketData[city]
  return [
    ...def.features.map((f) => `${f.title} ${f.description}`),
    ...def.howItWorks.map((s) => `${s.title} ${s.desc}`),
    ...def.localizedBenefits(city, data),
    ...def.baseFaqs.map((f) => `${f.q} ${f.a}`),
    def.localizedIntro(city, data),
    def.metaDescription(city),
  ].join("\n")
}

describe("loan sub-services state no computed payment", () => {
  // A stated payment amount is a Reg Z trigger term. Payment figures come from a loan
  // officer, not from a fixed factor applied to a city median.
  it("has no monthly payment figure or 'current rates' payment claim on any loans sub-service", () => {
    for (const def of Object.values(subServiceDefinitions).filter((d) => d.parentService === "loans")) {
      const blob = allCopy(def.slug)
      expect(blob, def.slug).not.toMatch(/monthly (mortgage )?payment (estimate|of)/i)
      expect(blob, def.slug).not.toMatch(/at current rates/i)
      expect(blob, def.slug).not.toMatch(/competitive (mortgage|rates)/i)
      expect(blob, def.slug).not.toMatch(/saving you hundreds/i)
    }
  })

  it("first-time buyer and FHA benefit lines point to a written estimate instead of a number", () => {
    const data = cityMarketData.Lehi
    for (const slug of ["fha", "first-time-buyers"]) {
      const def = subServiceDefinitions[slug]
      const line = def.localizedBenefits("Lehi", data).find((b) => /payment estimate/i.test(b))
      expect(line, slug).toBeDefined()
      expect(line).toMatch(/loan officer/i)
    }
  })
})

describe("tenant screening fair housing copy", () => {
  it("has no blanket felony threshold, no 57-22-4 citation, and states individualized review", () => {
    const blob = allCopy("tenant-screening")
    expect(blob).not.toMatch(/felony/i)
    expect(blob).not.toMatch(/57-22-4/)
    expect(blob).toMatch(/reviewed individually/i)
    expect(blob).toMatch(/nature, severity, and/i)
  })
})
