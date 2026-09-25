import { describe, it, expect } from "vitest"
import { parseOptionalAmount, rateWatchMessage, secondLookMessage } from "@/lib/lending-leads"

describe("secondLookMessage", () => {
  it("puts every Loan Estimate number the buyer gave in front of the loan officer", () => {
    const message = secondLookMessage(
      {
        closingDate: "2026-10-30",
        interestRate: 6.875,
        points: 2_100,
        originationCharges: 3_450,
        apr: 7.021,
        cashToClose: 38_500,
        credit: "700_759",
        cashSource: "gift",
        newConstruction: "no",
        notes: "Lock expires 10/20",
      },
      true,
    )
    expect(message).toContain("Closing date: 2026-10-30")
    expect(message).toContain("Interest rate: 6.875%")
    expect(message).toContain("Points: $2,100")
    expect(message).toContain("Origination charges (Section A): $3,450")
    expect(message).toContain("APR: 7.021%")
    expect(message).toContain("Cash to close: $38,500")
    expect(message).toContain("Credit: 700 to 759")
    expect(message).toContain("Cash to close from: Gift from family")
    expect(message).toContain("New construction: No")
    expect(message).toContain("Notes: Lock expires 10/20")
    expect(message).toContain("OK to text: Yes")
  })

  it("marks numbers the buyer left blank instead of inventing zeros", () => {
    const message = secondLookMessage(
      { closingDate: "2026-11-15", credit: "unsure", cashSource: "savings", newConstruction: "unsure", notes: "" },
      false,
    )
    expect(message).toContain("Interest rate: not given")
    expect(message).toContain("Points: not given")
    expect(message).not.toContain("Notes:")
    expect(message).toContain("OK to text: No")
  })
})

describe("rateWatchMessage", () => {
  it("records the current rate, the target and the balance", () => {
    const message = rateWatchMessage({ currentRate: 7.25, targetRate: 6.25, balance: 410_000, city: "Lehi" }, true)
    expect(message).toContain("Current rate: 7.25%")
    expect(message).toContain("Target rate: 6.25%")
    expect(message).toContain("Balance: $410,000")
    expect(message).toContain("City: Lehi")
    expect(message).toContain("OK to text: Yes")
  })

  it("marks an open target when the owner just wants to hear when rates drop", () => {
    expect(rateWatchMessage({ currentRate: 7.25 }, false)).toContain("Target rate: not given")
  })
})

describe("parseOptionalAmount", () => {
  it.each([
    ["$2,100", 2_100],
    ["6.875", 6.875],
    [" 410,000 ", 410_000],
    ["", undefined],
    ["n/a", undefined],
    ["6.8.7", undefined],
  ] as const)("reads %j as %j", (raw, expected) => {
    expect(parseOptionalAmount(raw)).toBe(expected)
  })
})
