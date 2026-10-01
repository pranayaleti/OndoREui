import { describe, it, expect } from "vitest"
import { schoolDistricts } from "./school-district-content"

describe("school district content", () => {
  const text = JSON.stringify(schoolDistricts)

  it("publishes no rankings or unsourced superlatives", () => {
    expect(text).not.toMatch(/#1|top 3|ranks? |ranked|premier|blue ribbon|national merit|above-average|consistently/i)
    expect(text).not.toMatch(/best/i)
  })
})
