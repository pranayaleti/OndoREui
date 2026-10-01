import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { MarketDataCard } from "./market-data-card"
import { cityMarketData, CITY_MARKET_DATA_DISCLOSURE, CITY_MARKET_AS_OF } from "@/lib/city-market-data"

describe("MarketDataCard", () => {
  it.each(["compact", "full"] as const)("always carries the as-of disclosure (%s)", (variant) => {
    const { container } = render(<MarketDataCard cityName="Lehi" data={cityMarketData.Lehi} variant={variant} />)
    const text = container.textContent ?? ""
    expect(text).toContain(CITY_MARKET_DATA_DISCLOSURE)
    expect(text).toContain(CITY_MARKET_AS_OF)
  })

  it("says population and growth have no named source instead of inventing one", () => {
    const { container } = render(<MarketDataCard cityName="Lehi" data={cityMarketData.Lehi} />)
    expect(container.textContent).toMatch(/population and annual growth are approximate/i)
    expect(container.textContent).not.toMatch(/ACS/)
  })
})
