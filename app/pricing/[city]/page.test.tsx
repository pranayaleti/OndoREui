import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import PricingCityRedirect, { generateMetadata, generateStaticParams } from "./page"
import { allCitySlugs } from "@/lib/utah-cities"

describe("/pricing/<city>/ redirect pages", () => {
  it("keeps a stub for every city so old links still land", () => {
    expect(generateStaticParams().map(({ city }) => city)).toEqual(allCitySlugs)
  })

  it("redirects to the property management fee schedule without being indexed", async () => {
    const params = Promise.resolve({ city: "lehi" })
    const meta = await generateMetadata({ params })
    expect(meta.robots).toMatchObject({ index: false })
    expect(meta.alternates?.canonical).toMatch(/\/property-management\/lehi\/$/)
    const html = renderToStaticMarkup(await PricingCityRedirect({ params }))
    expect(html).toContain('http-equiv="refresh" content="0;url=/property-management/lehi/#fees"')
    expect(html).toContain('href="/property-management/lehi/#fees"')
  })
})
