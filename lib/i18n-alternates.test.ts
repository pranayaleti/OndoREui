import { describe, it, expect, afterEach } from "vitest"
import {
  BCP47_BY_LOCALE,
  buildMetadataLanguages,
  buildSitemapAlternateRefs,
  isLocaleRoutingEnabled,
} from "./i18n-alternates"
import { SUPPORTED_LOCALES } from "./locales"
import { SITE_URL } from "./site"

const originalFlag = process.env["NEXT_PUBLIC_I18N_ROUTED"]

afterEach(() => {
  if (originalFlag === undefined) {
    delete process.env["NEXT_PUBLIC_I18N_ROUTED"]
  } else {
    process.env["NEXT_PUBLIC_I18N_ROUTED"] = originalFlag
  }
})

describe("i18n alternates", () => {
  it("emits only x-default and en-US before locale-routed URLs ship", () => {
    delete process.env["NEXT_PUBLIC_I18N_ROUTED"]

    expect(isLocaleRoutingEnabled()).toBe(false)
    expect(buildMetadataLanguages("/properties/test")).toEqual({
      "x-default": `${SITE_URL}/properties/test/`,
      "en-US": `${SITE_URL}/properties/test/`,
    })
    expect(buildSitemapAlternateRefs("/properties/test")).toEqual([
      { href: `${SITE_URL}/properties/test/`, hreflang: "x-default" },
      { href: `${SITE_URL}/properties/test/`, hreflang: "en-US" },
    ])
  })

  it("emits all 8 BCP-47 language alternates when NEXT_PUBLIC_I18N_ROUTED=1", () => {
    process.env["NEXT_PUBLIC_I18N_ROUTED"] = "1"

    expect(isLocaleRoutingEnabled()).toBe(true)
    const languages = buildMetadataLanguages("/contact")
    expect(languages["x-default"]).toBe(`${SITE_URL}/contact/`)
    for (const locale of SUPPORTED_LOCALES) {
      const tag = BCP47_BY_LOCALE[locale]
      const expected = locale === "en"
        ? `${SITE_URL}/contact/`
        : `${SITE_URL}/${locale}/contact/`
      expect(languages[tag]).toBe(expected)
    }
  })

  it("normalizes path slashes consistently", () => {
    delete process.env["NEXT_PUBLIC_I18N_ROUTED"]

    expect(buildMetadataLanguages("contact")).toEqual(buildMetadataLanguages("/contact/"))
  })
})
