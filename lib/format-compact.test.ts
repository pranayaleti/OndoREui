import { describe, it, expect } from "vitest"
import { formatCompactNumber, formatCompactUsd } from "./format-compact"

describe("formatCompactUsd", () => {
  it("keeps full dollars below $10,000 so rents stay distinct", () => {
    expect(formatCompactUsd(1450)).toBe("$1,450")
    expect(formatCompactUsd(1750)).toBe("$1,750")
    expect(formatCompactUsd(2400)).toBe("$2,400")
    expect(formatCompactUsd(1450)).not.toBe(formatCompactUsd(1750))
  })

  it("uses K from $10,000 and M from $1M", () => {
    expect(formatCompactUsd(10_000)).toBe("$10K")
    expect(formatCompactUsd(452_000)).toBe("$452K")
    expect(formatCompactUsd(1_250_000)).toBe("$1.3M")
  })

  it("rolls 999,500+ over to M instead of printing 1000K", () => {
    expect(formatCompactUsd(999_600)).toBe("$1.0M")
  })
})

describe("formatCompactNumber", () => {
  it("formats populations", () => {
    expect(formatCompactNumber(8500)).toBe("8,500")
    expect(formatCompactNumber(94_000)).toBe("94K")
  })
})
