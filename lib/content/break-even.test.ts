import { describe, expect, it } from "vitest"
import {
  BREAK_EVEN_STAY_SCENARIOS,
  breakEvenColumns,
  breakEvenMonths,
  breakEvenRows,
  earnsBackWithinStay,
  isBreakEvenTableId,
} from "./break-even"

describe("break-even table copy", () => {
  it("ceils months and rejects non-positive savings", () => {
    expect(breakEvenMonths(6_000, 150)).toBe(40)
    expect(breakEvenMonths(3_000, 200)).toBe(15)
    expect(breakEvenMonths(0, 100)).toBe(0)
    expect(breakEvenMonths(1_000, 0)).toBeNull()
    expect(breakEvenMonths(1_000, -10)).toBeNull()
    expect(breakEvenMonths(-1, 100)).toBeNull()
  })

  it("labels whether a stay horizon earns costs back", () => {
    expect(earnsBackWithinStay(3_000, 200, 24)).toBe(true)
    expect(earnsBackWithinStay(6_000, 150, 24)).toBe(false)
    expect(earnsBackWithinStay(4_000, 50, 24)).toBe(false)
    expect(earnsBackWithinStay(1_000, 0, 12)).toBeNull()
  })

  it("builds stay-scenario and recast-vs-refi tables", () => {
    const stayCols = breakEvenColumns("stay-scenarios")
    expect(stayCols.map((column) => column.id)).toEqual(BREAK_EVEN_STAY_SCENARIOS.map((row) => row.id))
    const stayRows = breakEvenRows("stay-scenarios")
    expect(stayRows.some((row) => row.id === "months")).toBe(true)
    expect(stayRows.find((row) => row.id === "months")?.cells.points).toMatch(/40 months/)

    const recastCols = breakEvenColumns("recast-vs-refi")
    expect(recastCols.map((column) => column.id)).toEqual(["recast", "refi-pay", "refi-credit"])
    expect(breakEvenRows("recast-vs-refi").some((row) => row.id === "cost-shape")).toBe(true)
  })

  it("narrows table ids", () => {
    expect(isBreakEvenTableId("stay-scenarios")).toBe(true)
    expect(isBreakEvenTableId("recast-vs-refi")).toBe(true)
    expect(isBreakEvenTableId("twin-article")).toBe(false)
  })
})
