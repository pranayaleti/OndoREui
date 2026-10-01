import { describe, expect, it } from "vitest"
import type { ReactElement } from "react"
import NotaryCityRoute from "@/app/notary/[state]/[city]/page"
import { getAllNotaryCityParams } from "@/lib/notary-cities"
import { SITE_ORGANIZATION_ID } from "@/lib/seo"

type SeoProps = { jsonLd: Array<Record<string, unknown> | null> }

describe("notary city page structured data", () => {
  it("describes a Service run by the one site Organization, not a LocalBusiness per city", async () => {
    const params = getAllNotaryCityParams()
    expect(params.length).toBeGreaterThan(100)
    const first = params[0]!

    const tree = (await NotaryCityRoute({ params: Promise.resolve(first) })) as ReactElement<{
      children: ReactElement<SeoProps>[]
    }>
    const seo = tree.props.children.find((child) => child?.props && "jsonLd" in child.props)!
    const entries = seo.props.jsonLd.filter(Boolean) as Array<Record<string, unknown>>

    const types = entries.map((e) => JSON.stringify(e["@type"]))
    expect(types.some((t) => /LocalBusiness|Organization/.test(t))).toBe(false)

    const service = entries.find((e) => e["@type"] === "Service")!
    expect(service.provider).toEqual({ "@id": SITE_ORGANIZATION_ID })
    expect(service.areaServed).toMatchObject({ "@type": "City" })
  })
})
