import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import DraperNeighborhoods from "./best-neighborhoods-draper-utah/page"
import LehiNeighborhoods from "./best-neighborhoods-lehi-utah/page"
import DraperCostOfLiving from "./cost-of-living-draper-utah/page"
import InvestNeighborhoods from "./best-neighborhoods-invest-utah-real-estate/page"
import { CITY_MARKET_AS_OF, cityMarketData } from "@/lib/city-market-data"

const usd = (n: number) => `$${n.toLocaleString("en-US")}`

function text(Page: () => React.ReactElement): string {
  const { container } = render(<Page />)
  container.querySelectorAll("script, style").forEach((el) => el.remove())
  return container.textContent ?? ""
}

// The market-report and locations pages read cityMarketData, so the blog posts must too.
describe("city blog posts use the same figures as the city market data", () => {
  it("Draper neighborhoods snapshot matches the data and is dated", () => {
    const d = cityMarketData["Draper"]
    const t = text(DraperNeighborhoods)
    expect(t).toContain(`Median home price: ${usd(d.medianHomePrice)}`)
    expect(t).toContain(`Median rent: ${usd(d.medianRent)}/mo`)
    expect(t).toContain(`Average days on market: ${d.avgDaysOnMarket} days`)
    expect(t).toContain(`Population growth: ${d.growthRate} annually`)
    expect(t).toContain(`as of ${CITY_MARKET_AS_OF}`)
  })

  it("Lehi neighborhoods snapshot matches the data and drops stale facts", () => {
    const d = cityMarketData["Lehi"]
    const t = text(LehiNeighborhoods)
    expect(t).toContain(`Median home price: ${usd(d.medianHomePrice)}`)
    expect(t).toContain(`Median rent: ${usd(d.medianRent)}/mo`)
    expect(t).toContain(`Average days on market: ${d.avgDaysOnMarket} days`)
    expect(t).toContain(`Population: ${d.population.toLocaleString("en-US")}`)
    expect(t).not.toMatch(/IM Flash/)
    expect(t).toContain(`as of ${CITY_MARKET_AS_OF}`)
  })

  it("Draper cost of living uses the data and current utility and transit facts", () => {
    const d = cityMarketData["Draper"]
    const t = text(DraperCostOfLiving)
    expect(t).toContain(usd(d.medianHomePrice))
    expect(t).toContain(`${usd(d.medianRent)}/mo`)
    expect(t).not.toMatch(/\$620,000/)
    expect(t).not.toMatch(/Questar Gas\./)
    expect(t).toMatch(/Enbridge Gas Utah/)
    expect(t).not.toMatch(/one transfer/)
  })

  it("investor guide does not quote a Draper rent range that contradicts the data", () => {
    const d = cityMarketData["Draper"]
    const t = text(InvestNeighborhoods)
    expect(t).not.toMatch(/\$2,800–\$3,800/)
    expect(t).toContain(usd(d.medianRent))
  })
})
