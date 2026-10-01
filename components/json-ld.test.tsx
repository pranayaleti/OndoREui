import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { JsonLd, safeJsonLd } from "./json-ld"

describe("safeJsonLd", () => {
  const hostile = {
    name: "</script><script>alert(1)</script>",
    note: "Tom & Jerry <b>bold</b>",
    sep: "a\u2028b\u2029c",
  }

  it("never emits a raw <, > or & that could close the script block", () => {
    const out = safeJsonLd(hostile)
    for (const ch of ["<", ">", "&", "\u2028", "\u2029"]) expect(out).not.toContain(ch)
    expect(out).not.toContain("</script")
  })

  it("stays valid JSON that parses back to the same data", () => {
    expect(JSON.parse(safeJsonLd(hostile))).toEqual(hostile)
  })
})

describe("JsonLd", () => {
  it("renders hostile field values without breaking out of the script tag", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ "@type": "Thing", name: "</script><img src=x onerror=alert(1)>" }} />)
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(html).not.toContain("<img")
  })
})
