import { describe, it, expect } from "vitest"
import {
  estimateForAnswers,
  leadMessageFor,
  loanProgramFor,
  type QuizAnswers,
} from "@/lib/homebuyer-quiz"

// Expected prices are solved independently in Python (annuity math at 6.5%, 30 years,
// Utah planning defaults of 0.65% tax and 0.35% insurance per year).
const veteran: QuizAnswers = {
  stage: "offers",
  preApproved: "no",
  area: "utah_county",
  veteran: true,
  annualIncome: 120_000,
  monthlyDebts: 0,
  downPayment: 0,
  credit: "760_plus",
}

describe("loanProgramFor", () => {
  it.each([
    [true, "under_620", "va"],
    [false, "under_620", "fha"],
    [false, "620_659", "fha"],
    [false, "660_699", "conventional"],
    [false, "760_plus", "conventional"],
    [false, "unsure", "conventional"],
  ] as const)("veteran=%s with credit %s points to %s", (isVeteran, credit, program) => {
    expect(loanProgramFor({ veteran: isVeteran, credit })).toBe(program)
  })
})

describe("estimateForAnswers", () => {
  it("prices a VA buyer off income alone, since VA needs no down payment", () => {
    const estimate = estimateForAnswers(veteran)
    if (!estimate.ok) throw new Error(`expected an estimate, got ${estimate.reason}`)
    expect(estimate.program).toBe("va")
    expect(estimate.limitedBy).toBe("income")
    // $4,100 budget (41% of $10,000/mo) less 1.0%/yr of the price for tax and insurance.
    expect(Math.abs(estimate.upperPrice - 573_104.87)).toBeLessThan(150)
    expect(Math.abs(estimate.comfortablePrice - 515_794.38)).toBeLessThan(135)
  })

  it("caps the price at what the savings cover as a minimum down payment", () => {
    const estimate = estimateForAnswers({
      ...veteran,
      veteran: false,
      credit: "700_759",
      annualIncome: 200_000,
      downPayment: 15_000,
    })
    if (!estimate.ok) throw new Error(`expected an estimate, got ${estimate.reason}`)
    // $15,000 is 3% of $500,000; income alone would allow more.
    expect(estimate.limitedBy).toBe("down_payment")
    expect(estimate.upperPrice).toBeCloseTo(500_000, 0)
    // P&I $3,065.53 + tax $270.83 + insurance $145.83 + PMI $323.33 (0.8%/yr at 97% LTV).
    expect(estimate.monthlyAtUpper).toBeCloseTo(3_805.53, 1)
  })

  it("explains when existing debts already use the whole DTI budget", () => {
    const estimate = estimateForAnswers({ ...veteran, veteran: false, annualIncome: 50_000, monthlyDebts: 2_000, downPayment: 20_000 })
    expect(estimate).toMatchObject({ ok: false, reason: "debts" })
  })

  it("explains when a non-VA buyer has nothing saved for the minimum down payment", () => {
    const estimate = estimateForAnswers({ ...veteran, veteran: false, downPayment: 0 })
    expect(estimate).toMatchObject({ ok: false, reason: "down_payment" })
  })

  it("does not estimate without income", () => {
    expect(estimateForAnswers({ ...veteran, annualIncome: 0 })).toMatchObject({ ok: false, reason: "no_income" })
  })
})

describe("leadMessageFor", () => {
  it("hands the follow-up every answer, the estimate and the texting consent", () => {
    const message = leadMessageFor(veteran, estimateForAnswers(veteran), true)
    expect(message).toContain("Stage: Making offers now")
    expect(message).toContain("Pre-approved: Not yet")
    expect(message).toContain("Area: Utah County")
    expect(message).toContain("Veteran or military: Yes")
    expect(message).toContain("Income: $120,000/yr")
    expect(message).toContain("Monthly debts: $0")
    expect(message).toContain("Down payment saved: $0")
    expect(message).toContain("Credit: 760+")
    expect(message).toMatch(/Estimate: \$515,\d{3} to \$573,\d{3} \(VA, limited by income\)/)
    expect(message).toContain("OK to text: Yes")
  })

  it("records why there was no estimate", () => {
    const answers = { ...veteran, veteran: false, downPayment: 0 }
    expect(leadMessageFor(answers, estimateForAnswers(answers), false)).toContain(
      "Estimate: none (no down payment saved)",
    )
  })
})
