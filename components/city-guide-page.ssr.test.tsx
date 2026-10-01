import { describe, it, expect, vi } from "vitest"
import { renderToString } from "react-dom/server"
import { CityGuidePage } from "./city-guide-page"
import { findCityBySlug } from "@/lib/utah-cities"
import { cityContentByName } from "@/lib/city-content"

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/locations/salt-lake-city",
  }
})

/** JSON-LD blocks that are present in the server-rendered HTML string (what crawlers get). */
function jsonLdBlocks(html: string): Array<Record<string, unknown>> {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  return blocks.map((m) => JSON.parse(m[1]!))
}

describe("CityGuidePage server HTML", () => {
  const slc = findCityBySlug("salt-lake-city")!
  const html = renderToString(<CityGuidePage city={slc} />)

  it("contains the FAQPage JSON-LD in the markup itself, not only after hydration", () => {
    const faqPages = jsonLdBlocks(html).filter((b) => b["@type"] === "FAQPage")
    expect(faqPages).toHaveLength(1)
    const entities = faqPages[0]!.mainEntity as Array<{ name: string }>
    expect(entities.length).toBeGreaterThan(0)
  })

  it("marks up only questions that are also visible on the page", () => {
    const faq = cityContentByName[slc.name]?.faq ?? []
    expect(faq.length).toBeGreaterThan(0)
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, "")
    const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;")
    for (const item of faq) {
      expect(visible).toContain(escape(item.q))
    }
  })
})
