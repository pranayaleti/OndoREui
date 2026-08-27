import { describe, expect, it } from "vitest"
import { BUY_PROCESS_STEPS, SELL_PROCESS_STEPS } from "./buy-sell-process"

describe("buy/sell how-it-works copy", () => {
  it("describes an agent-led buyer search instead of a public MLS feed", () => {
    const blob = BUY_PROCESS_STEPS.map((step) => `${step.title} ${step.desc}`).join(" ")
    expect(blob).toMatch(/agent/i)
    expect(blob).toMatch(/rental/i)
    expect(blob).not.toMatch(/advanced MLS search tools/i)
    expect(blob).not.toMatch(/4 minutes/i)
    expect(blob).not.toMatch(/pre-?qualification letter/i)
  })

  it("uses the seller services already published on the site index", () => {
    const blob = SELL_PROCESS_STEPS.map((step) => `${step.title} ${step.desc}`).join(" ")
    expect(blob).toMatch(/CMA/)
    expect(blob).toMatch(/photography/i)
    expect(blob).toMatch(/MLS syndication/i)
    expect(blob).toMatch(/Negotiation/i)
    expect(blob).not.toMatch(/top dollar/i)
    expect(blob).not.toMatch(/faster sales/i)
  })

  it("links buyers to financing and agent matching", () => {
    expect(BUY_PROCESS_STEPS.some((step) => step.href === "/loans")).toBe(true)
    expect(BUY_PROCESS_STEPS.some((step) => step.href === "/get-matched")).toBe(true)
  })
})
