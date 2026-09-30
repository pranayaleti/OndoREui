import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import NeighborhoodCityRedirect, { generateStaticParams, metadata } from "./page"
import { allNeighborhoodParams, neighborhoodsByCity } from "@/lib/neighborhood-content"
import { toCitySlug } from "@/lib/utah-cities"

describe("/neighborhoods/<city>/ redirect pages", () => {
  const cities = generateStaticParams().map(({ city }) => city)

  it("covers every city that has neighborhood pages below it", () => {
    const withPages = new Set(allNeighborhoodParams().map(({ city }) => city))
    expect(new Set(cities)).toEqual(withPages)
  })

  // The hub renders one section per city with id="hoods-<slug>"; the redirect must land on it.
  it("targets the section ids the /neighborhoods/ hub renders", () => {
    const hubIds = new Set(Object.keys(neighborhoodsByCity).map((city) => `hoods-${toCitySlug(city)}`))
    for (const city of cities) expect(hubIds.has(`hoods-${city}`), city).toBe(true)
  })

  it("redirects without being indexed", async () => {
    expect(metadata.robots).toMatchObject({ index: false })
    const html = renderToStaticMarkup(await NeighborhoodCityRedirect({ params: Promise.resolve({ city: "lehi" }) }))
    expect(html).toContain('http-equiv="refresh" content="0;url=/neighborhoods/#hoods-lehi"')
    expect(html).toContain('href="/neighborhoods/#hoods-lehi"')
  })
})
