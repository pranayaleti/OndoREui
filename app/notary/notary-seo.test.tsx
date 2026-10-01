import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { ReactElement } from "react"
import { NOTARY_SERVICE_ID } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_HOURS } from "@/lib/site"
import { NOTARY_HOURS_LABEL, NOTARY_HOURS_SPEC } from "@/lib/notary-fees"
import { metadata as notaryMetadata } from "./page"
import { metadata as onDemandMetadata } from "./on-demand/page"
import { metadata as locationsMetadata } from "./locations/page"
import OnDemandNotaryPage from "./on-demand/page"
import NotaryClient from "./notary-client"
import { generateMetadata as stateMetadata } from "./[state]/page"
import { generateMetadata as cityMetadata } from "./[state]/[city]/page"
import { getAllNotaryCityParams, getAllNotaryStateParams } from "@/lib/notary-cities"

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/notary/",
  }
})

function titleOf(m: { title?: unknown }): string {
  const t = m.title as string | { absolute?: string } | undefined
  return typeof t === "string" ? t : (t?.absolute ?? "")
}

function ldNodes(container: HTMLElement): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = []
  container.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
    const data = JSON.parse(el.textContent || "null")
    if (Array.isArray(data)) out.push(...data)
    else if (data) out.push(data)
  })
  return out
}

describe("notary titles carry one brand", () => {
  it.each([
    ["/notary/", notaryMetadata],
    ["/notary/on-demand/", onDemandMetadata],
    ["/notary/locations/", locationsMetadata],
  ])("%s title is branded once and has no ONDO Notary suffix", (_path, metadata) => {
    const title = titleOf(metadata)
    expect(title).toMatch(new RegExp(`\\| ${SITE_BRAND_SHORT}$`))
    expect(title).not.toMatch(/ONDO Notary/)
    expect(title.length).toBeLessThanOrEqual(60)
  })

  it("keeps the Open Graph title in step with the page title", () => {
    expect(String(notaryMetadata.openGraph?.title)).toBe(titleOf(notaryMetadata))
    expect(String(onDemandMetadata.openGraph?.title)).toBe(titleOf(onDemandMetadata))
    expect(String(locationsMetadata.openGraph?.title)).toBe(titleOf(locationsMetadata))
  })

  it("state and city pages brand once", async () => {
    const stateParams = getAllNotaryStateParams().find((p) => p.state === "utah") ?? getAllNotaryStateParams()[0]!
    const cityParams = getAllNotaryCityParams().find((p) => p.state === "utah") ?? getAllNotaryCityParams()[0]!
    const stateMeta = await stateMetadata({ params: Promise.resolve(stateParams) })
    const cityMeta = await cityMetadata({ params: Promise.resolve(cityParams) })
    for (const meta of [stateMeta, cityMeta]) {
      const title = titleOf(meta)
      expect(title).not.toMatch(/ONDO Notary/)
      expect(title.match(/Ondo RE/g)?.length ?? 0).toBeLessThanOrEqual(1)
      expect(String(meta.openGraph?.title)).not.toMatch(/ONDO Notary/)
    }
  })
})

describe("notary structured data", () => {
  it("/notary/ emits one notary Service with the posted hours and no second business entity", () => {
    const { container } = render(<NotaryClient imageUrl="https://www.ondorealestate.com/modern-office-building.webp" />)
    const nodes = ldNodes(container)
    const types = nodes.flatMap((n) => [n["@type"]].flat())
    expect(types).not.toContain("LocalBusiness")
    expect(types).not.toContain("RealEstateAgent")
    const service = nodes.find((n) => n["@id"] === NOTARY_SERVICE_ID)
    expect(service?.["@type"]).toBe("Service")
    expect(service?.areaServed).toEqual({ "@type": "Country", name: "United States" })
    expect(service?.hoursAvailable).toMatchObject({ opens: NOTARY_HOURS_SPEC.opens, closes: NOTARY_HOURS_SPEC.closes })
    // The posted notary schedule, not the 9 to 5 office hours on the Organization.
    expect(NOTARY_HOURS_LABEL).toBe("Mon–Fri 9 AM – 7 PM MT")
    expect(JSON.stringify(nodes)).not.toContain(SITE_HOURS)
    const web = nodes.find((n) => n["@type"] === "WebPage")
    expect(web?.url).toBe("https://www.ondorealestate.com/notary/")
  })

  it("/notary/on-demand/ uses trailing-slash urls, a Country area and points at the notary Service", () => {
    const { container } = render((OnDemandNotaryPage as () => ReactElement)())
    const nodes = ldNodes(container)
    const web = nodes.find((n) => n["@type"] === "WebPage")
    expect(web?.url).toBe("https://www.ondorealestate.com/notary/on-demand/")
    const service = nodes.find((n) => n["@type"] === "Service")
    expect(service?.areaServed).toEqual({ "@type": "Country", name: "United States" })
    expect(service?.isRelatedTo).toEqual({ "@id": NOTARY_SERVICE_ID })
    const crumbs = nodes.find((n) => n["@type"] === "BreadcrumbList") as { itemListElement: { item: string }[] }
    for (const crumb of crumbs.itemListElement) expect(crumb.item).toMatch(/\/$/)
  })
})
