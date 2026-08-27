import { describe, expect, it } from "vitest"
import { CITY_MARKET_AS_OF } from "./city-market-data"
import { FEE_COMPARISON_AS_OF } from "./fee-comparison"

describe("city market data vintage", () => {
  it("stamps Ondo city medians with an as-of month in the same voice as fee comparison", () => {
    expect(CITY_MARKET_AS_OF).toBe(FEE_COMPARISON_AS_OF)
    expect(CITY_MARKET_AS_OF).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
  })
})
