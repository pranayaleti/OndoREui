import { describe, expect, it } from "vitest"
import { PROGRAM_FIT_IDS, cellsForColumns, filterProgramColumns, rowsForTable } from "./program-fit"

const RESTRICTED = /guaranteed approval|you will qualify|best rate|lowest rate guaranteed/i

describe("program fit tables", () => {
  it("keeps purchase and equity columns filterable", () => {
    const purchase = filterProgramColumns("purchase", ["va", "fha"])
    expect(purchase.map((column) => column.id)).toEqual(["fha", "va"])
    const equity = filterProgramColumns("equity")
    expect(equity.map((column) => column.id)).toEqual(["refinance", "heloc"])
  })

  it("does not use restricted lending promises in cells", () => {
    for (const table of ["purchase", "equity"] as const) {
      const columns = filterProgramColumns(table)
      for (const row of rowsForTable(table)) {
        for (const cell of cellsForColumns(row, columns)) {
          expect(cell, `${table}:${row.id}`).not.toMatch(RESTRICTED)
        }
      }
    }
  })

  it("covers every program id in purchase or equity rows", () => {
    const seen = new Set<string>()
    for (const table of ["purchase", "equity"] as const) {
      for (const column of filterProgramColumns(table)) {
        seen.add(column.id)
      }
    }
    for (const id of PROGRAM_FIT_IDS) {
      expect(seen.has(id), id).toBe(true)
    }
  })
})
