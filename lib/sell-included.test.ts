import { describe, expect, it } from "vitest"
import { SELL_INCLUDED_ROWS } from "./sell-included"

describe("SELL_INCLUDED_ROWS", () => {
  it("only claims listing services already on the public site index", () => {
    const blob = SELL_INCLUDED_ROWS.map((row) => `${row.item} ${row.ondo}`).join(" ")
    expect(blob).toMatch(/CMA/)
    expect(blob).toMatch(/photography/i)
    expect(blob).toMatch(/MLS/)
    expect(blob).toMatch(/negotiat/i)
    expect(blob).toMatch(/Staging guidance/)
  })

  it("does not invent a savings number or dunk a named shop", () => {
    const blob = SELL_INCLUDED_ROWS.map((row) => `${row.item} ${row.ondo} ${row.typical}`).join(" ")
    expect(blob).not.toMatch(/\$1,?950/)
    expect(blob).not.toMatch(/typical 6%/)
    expect(blob).not.toMatch(/Flat Rate/i)
    expect(blob).not.toMatch(/top dollar/i)
    expect(blob).not.toMatch(/guarantee/i)
    expect(blob).not.toMatch(/rebate/i)
  })

  it("treats buyer-broker pay as negotiated after 2024", () => {
    const row = SELL_INCLUDED_ROWS.find((item) => /buyer-broker/i.test(item.item))
    expect(row?.ondo).toMatch(/negotiated/i)
    expect(row?.ondo).not.toMatch(/typically free/i)
    expect(row?.typical).toMatch(/2024/)
  })
})
