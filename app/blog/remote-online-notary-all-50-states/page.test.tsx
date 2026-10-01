import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import Page from "./page"

describe("remote-online-notary-all-50-states", () => {
  const html = renderToStaticMarkup(<Page />)

  it("leads the state cards with Utah and links each state page", () => {
    const names = [...html.matchAll(/Online notary in ([A-Za-z .]+)</g)].map((m) => m[1])
    expect(names).toHaveLength(10)
    expect(names[0]).toBe("Utah")
    expect(html).toContain('href="/notary/utah/"')
  })

  it("does not claim the cards are the most requested, or list territories", () => {
    expect(html).not.toMatch(/most requested/i)
    expect(html).not.toContain("American Samoa")
    expect(html).toContain('href="/notary/locations/"')
  })
})
