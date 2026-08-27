import { describe, expect, it } from "vitest"
import { CITY_MARKET_AS_OF, cityMarketData } from "./city-market-data"
import {
  ARRIVAL_FAIR_HOUSING,
  ARRIVAL_LENDING_DISCLOSURE,
  ARRIVAL_REAL_ESTATE_DISCLOSURE,
  ARRIVAL_RENT_DISCLOSURE,
  arrivalContactPrefill,
  arrivalPathInquiryType,
  arrivalPrimaryCta,
  arrivalSecondaryCta,
  commuteRowsForWorkplace,
  formatMedianRent,
  minutesLabel,
  MAX_COMMUTE_ROWS,
  tourWindowForStartDate,
} from "./utah-arrival"

describe("commuteRowsForWorkplace", () => {
  it("puts Lehi first at 0 minutes and ranks nearby Silicon Slopes cities", () => {
    const rows = commuteRowsForWorkplace(cityMarketData, "Lehi")
    expect(rows[0]?.city).toBe("Lehi")
    expect(rows[0]?.minutes).toBe(0)
    expect(rows[0]?.listingsHref).toBe("/properties/?query=Lehi")
    expect(rows[0]?.guideHref).toBe("/locations/lehi/")
    const americanFork = rows.find((row) => row.city === "American Fork")
    expect(americanFork?.minutes).toBe(8)
    expect(rows.some((row) => row.city === "Ogden")).toBe(false)
  })

  it("maps Hill AFB without inventing a housing city named Hill", () => {
    const rows = commuteRowsForWorkplace(cityMarketData, "Hill AFB")
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((row) => row.city !== "Hill AFB")).toBe(true)
    expect(rows[0]?.minutes).toBeLessThanOrEqual(10)
  })

  it("returns nothing for an empty query or a city we do not cover", () => {
    expect(commuteRowsForWorkplace(cityMarketData, "   ")).toEqual([])
    expect(commuteRowsForWorkplace(cityMarketData, "Moab")).toEqual([])
  })

  it("caps the ledger so phones are not flooded", () => {
    const rows = commuteRowsForWorkplace(cityMarketData, "Salt Lake City")
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThanOrEqual(MAX_COMMUTE_ROWS)
  })
})

describe("tourWindowForStartDate", () => {
  const today = new Date(2026, 7, 26)

  it("gives a 45–60 day touring window for a start date far enough out", () => {
    const result = tourWindowForStartDate("2026-12-01", today)
    expect(result.kind).toBe("window")
    if (result.kind !== "window") return
    expect(result.tourFrom).toEqual(new Date(2026, 9, 2))
    expect(result.tourTo).toEqual(new Date(2026, 9, 17))
  })

  it("flags start dates inside 45 days instead of inventing availability", () => {
    const result = tourWindowForStartDate("2026-09-15", today)
    expect(result).toEqual({ kind: "soon", daysUntilStart: 20 })
  })

  it("rejects dates that already passed", () => {
    expect(tourWindowForStartDate("2026-08-01", today)).toEqual({ kind: "past" })
    expect(tourWindowForStartDate("not-a-date", today)).toEqual({ kind: "invalid" })
  })
})

describe("arrival path routing", () => {
  it("maps each path to a real contact inquiry type", () => {
    expect(arrivalPathInquiryType("rent")).toBe("renter")
    expect(arrivalPathInquiryType("leaving-a-home")).toBe("owner")
    expect(arrivalPathInquiryType("buy")).toBe("buyer")
    expect(arrivalPathInquiryType("people-ops")).toBe("other")
  })

  it("points each path at an Ondo surface instead of a public apply form", () => {
    expect(arrivalPrimaryCta("rent", "Lehi", "/properties/?query=Lehi")).toEqual({
      href: "/properties/?query=Lehi",
      label: "Open rentals in Lehi",
    })
    expect(arrivalPrimaryCta("buy", "Lehi", "/properties/?query=Lehi").href).toBe("/buy/")
    expect(arrivalPrimaryCta("leaving-a-home", "Lehi", "/properties/?query=Lehi").href).toBe(
      "/whats-my-home-worth/",
    )
    expect(arrivalSecondaryCta("rent")?.href).toBe("/notary/")
    expect(arrivalSecondaryCta("people-ops")?.href).toBe("/properties/")
  })

  it("keeps prefill copy invite-only and free of occupant steering", () => {
    const blob = [
      arrivalContactPrefill("rent", "Lehi", "American Fork"),
      arrivalContactPrefill("buy", "Lehi"),
      arrivalContactPrefill("leaving-a-home", "Provo"),
      arrivalContactPrefill("people-ops", "Ogden", "Ogden"),
      ARRIVAL_FAIR_HOUSING,
      ARRIVAL_LENDING_DISCLOSURE,
      ARRIVAL_REAL_ESTATE_DISCLOSURE,
    ].join(" ")

    expect(blob).toMatch(/request a showing/i)
    expect(blob).toMatch(/NMLS ID on file/)
    expect(blob).toMatch(/not a loan application/i)
    expect(blob).toMatch(/not required to use Ondo for financing/i)
    expect(blob).toMatch(/management fee is charged when rent is collected/i)
    expect(blob).toMatch(/deemed reliable but is not guaranteed/i)
    expect(blob).toMatch(/reasonable accommodations/i)
    expect(blob).not.toMatch(/apply online|quality tenants|guaranteed placement|family-friendly|key hires/i)
    expect(blob).not.toMatch(/area tour|settling in|welcoming you home|pitch deck/i)
  })
})

describe("arrival labels", () => {
  it("formats rent and drive time in en-US without calling 0 minutes a drive", () => {
    expect(formatMedianRent(1750)).toBe("$1,750/mo")
    expect(minutesLabel(0)).toBe("At workplace")
    expect(minutesLabel(8)).toBe("8 min")
  })

  it("discloses Ondo city medians with an as-of stamp and no MLS or appraisal claim", () => {
    expect(ARRIVAL_RENT_DISCLOSURE).toContain(CITY_MARKET_AS_OF)
    expect(ARRIVAL_RENT_DISCLOSURE).toMatch(/as of .+ — verify/i)
    expect(ARRIVAL_RENT_DISCLOSURE).toMatch(/compiled by Ondo Real Estate/i)
    expect(ARRIVAL_RENT_DISCLOSURE).toMatch(/not an MLS pull, an appraisal/i)
    expect(ARRIVAL_RENT_DISCLOSURE).not.toMatch(/guaranteed|you qualify|pre-?approved/i)
  })
})
