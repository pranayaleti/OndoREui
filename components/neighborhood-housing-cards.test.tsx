import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  buildNeighborhoodHousingCards,
  NeighborhoodHousingCards,
} from "./neighborhood-housing-cards"

describe("buildNeighborhoodHousingCards", () => {
  it("gives Sandy housing-stock facts instead of name-only cards", () => {
    const cards = buildNeighborhoodHousingCards("Sandy")
    expect(cards.length).toBeGreaterThanOrEqual(3)
    expect(
      cards.every((c) => Boolean(c.typicalHomes)),
      cards.map((c) => `${c.name}:${c.typicalHomes ?? "none"}`).join("; "),
    ).toBe(true)
    expect(cards.some((c) => c.href?.includes("/neighborhoods/sandy/"))).toBe(true)
  })

  it("leaves Roy as name-only rather than inventing subdivisions", () => {
    const cards = buildNeighborhoodHousingCards("Roy")
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.every((c) => !c.typicalHomes && !c.href)).toBe(true)
  })
})

describe("NeighborhoodHousingCards", () => {
  it("renders typical homes on Sandy cards", () => {
    render(<NeighborhoodHousingCards cityName="Sandy" />)
    expect(screen.getAllByText(/Typical homes:/i).length).toBeGreaterThanOrEqual(3)
  })
})
