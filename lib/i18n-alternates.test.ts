import { describe, it, expect } from "vitest"
import { buildMetadataLanguages, buildSitemapAlternateRefs } from "./i18n-alternates"
import { SITE_URL } from "./site"

describe("i18n alternates (English-only)", () => {
  it("emits only x-default and en-US for metadata languages", () => {
    expect(buildMetadataLanguages("/properties/test")).toEqual({
      "x-default": `${SITE_URL}/properties/test/`,
      "en-US": `${SITE_URL}/properties/test/`,
    })
  })

  it("emits only x-default and en-US for sitemap alternate refs", () => {
    expect(buildSitemapAlternateRefs("/properties/test")).toEqual([
      { href: `${SITE_URL}/properties/test/`, hreflang: "x-default" },
      { href: `${SITE_URL}/properties/test/`, hreflang: "en-US" },
    ])
  })

  it("normalizes path slashes consistently", () => {
    expect(buildMetadataLanguages("contact")).toEqual(buildMetadataLanguages("/contact/"))
  })
})
