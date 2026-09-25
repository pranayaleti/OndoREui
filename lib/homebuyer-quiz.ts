import { estimateAffordability } from "@/lib/affordability"
import { formatCurrency } from "@/lib/cost-of-living"
import { COST_OF_LIVING_DEFAULTS } from "@/lib/cost-of-living-defaults"
import { DEFAULT_MORTGAGE_RATE, calculateMonthlyPI, getProgramMI, type LoanProgram } from "@/lib/mortgage-utils"

/**
 * The /buy/quiz homebuyer budget quiz: answer options, the estimate, and the lead
 * summary. The math is lib/affordability.ts, shared with the affordability calculator.
 * It is a planning estimate from a brokerage, not a loan offer: no rate in here is a
 * quote, and nothing promises approval.
 */

export const BUYER_STAGES = [
  { value: "starting", label: "Just starting to look" },
  { value: "offers", label: "Making offers now" },
  { value: "under_contract", label: "Under contract" },
  { value: "questions", label: "Just have questions" },
] as const

export const PRE_APPROVAL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
  { value: "unsure", label: "Not sure" },
] as const

export const BUYING_AREAS = [
  { value: "salt_lake", label: "Salt Lake County" },
  { value: "utah_county", label: "Utah County" },
  { value: "davis_weber", label: "Davis or Weber County" },
  { value: "elsewhere_utah", label: "Somewhere else in Utah" },
  { value: "outside_utah", label: "Outside Utah" },
] as const

/** `score` is a representative midpoint, used only to price mortgage insurance. */
export const CREDIT_BANDS = [
  { value: "760_plus", label: "760+", score: 770 },
  { value: "700_759", label: "700 to 759", score: 730 },
  { value: "660_699", label: "660 to 699", score: 680 },
  { value: "620_659", label: "620 to 659", score: 640 },
  { value: "under_620", label: "Under 620", score: 600 },
  { value: "unsure", label: "Not sure", score: 680 },
] as const

type Option = { readonly value: string; readonly label: string }

export type QuizAnswers = {
  stage: (typeof BUYER_STAGES)[number]["value"]
  preApproved: (typeof PRE_APPROVAL_OPTIONS)[number]["value"]
  area: (typeof BUYING_AREAS)[number]["value"]
  veteran: boolean
  annualIncome: number
  monthlyDebts: number
  downPayment: number
  credit: (typeof CREDIT_BANDS)[number]["value"]
}

/** Shown beside every estimate. Tax and insurance are the Utah planning defaults. */
export const QUIZ_ASSUMPTIONS = {
  interestRate: DEFAULT_MORTGAGE_RATE,
  termYears: 30,
  propertyTaxRatePercent: COST_OF_LIVING_DEFAULTS.housing.buy.propertyTaxRatePercent,
  insuranceRatePercent: COST_OF_LIVING_DEFAULTS.housing.buy.homeownersInsuranceRatePercent,
} as const

/**
 * Lowest down payment each program allows: FHA 3.5% (580+ scores), conventional 3% for
 * first-time and low-down products, VA and USDA none. Savings below this cap the price
 * even when income would allow more.
 */
export const MIN_DOWN_PERCENT: Record<LoanProgram, number> = { va: 0, usda: 0, fha: 3.5, conventional: 3 }

export const PROGRAM_LABELS: Record<LoanProgram, string> = {
  va: "VA",
  fha: "FHA",
  conventional: "Conventional",
  usda: "USDA",
}

export type QuizEstimate =
  | {
      ok: true
      program: LoanProgram
      comfortablePrice: number
      upperPrice: number
      monthlyAtUpper: number
      limitedBy: "income" | "down_payment"
    }
  | { ok: false; program: LoanProgram; reason: "no_income" | "debts" | "down_payment" }

export function loanProgramFor({ veteran, credit }: Pick<QuizAnswers, "veteran" | "credit">): LoanProgram {
  if (veteran) return "va"
  return credit === "under_620" || credit === "620_659" ? "fha" : "conventional"
}

function creditScore(credit: QuizAnswers["credit"]): number {
  return CREDIT_BANDS.find((band) => band.value === credit)!.score
}

function monthlyPaymentAt(price: number, answers: QuizAnswers, program: LoanProgram): number {
  const { interestRate, termYears, propertyTaxRatePercent, insuranceRatePercent } = QUIZ_ASSUMPTIONS
  const loan = price - answers.downPayment
  const mortgageInsurance = getProgramMI(program, loan, price, creditScore(answers.credit), termYears, answers.downPayment)
  return (
    calculateMonthlyPI(loan, interestRate, termYears) +
    (price * propertyTaxRatePercent) / 100 / 12 +
    (price * insuranceRatePercent) / 100 / 12 +
    mortgageInsurance.monthlyMI
  )
}

export function estimateForAnswers(answers: QuizAnswers): QuizEstimate {
  const program = loanProgramFor(answers)
  if (!(answers.annualIncome > 0)) return { ok: false, program, reason: "no_income" }

  const minDown = MIN_DOWN_PERCENT[program] / 100
  if (minDown > 0 && !(answers.downPayment > 0)) return { ok: false, program, reason: "down_payment" }

  const byIncome = estimateAffordability({
    annualIncome: answers.annualIncome,
    monthlyDebts: answers.monthlyDebts,
    downPayment: answers.downPayment,
    ...QUIZ_ASSUMPTIONS,
    program,
    creditScore: creditScore(answers.credit),
  })
  if (!(byIncome.maxLoanAmount > 0)) return { ok: false, program, reason: "debts" }

  const downPaymentCap = minDown > 0 ? answers.downPayment / minDown : Number.POSITIVE_INFINITY
  if (downPaymentCap < byIncome.maxHomePrice) {
    return {
      ok: true,
      program,
      comfortablePrice: downPaymentCap * 0.9,
      upperPrice: downPaymentCap,
      monthlyAtUpper: monthlyPaymentAt(downPaymentCap, answers, program),
      limitedBy: "down_payment",
    }
  }
  return {
    ok: true,
    program,
    comfortablePrice: byIncome.recommendedHomePrice,
    upperPrice: byIncome.maxHomePrice,
    monthlyAtUpper: byIncome.monthlyPayment.total,
    limitedBy: "income",
  }
}

function labelFor(options: readonly Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

const NO_ESTIMATE_REASONS: Record<Extract<QuizEstimate, { ok: false }>["reason"], string> = {
  no_income: "no income entered",
  debts: "debts exceed the DTI limit",
  down_payment: "no down payment saved",
}

/** Plain-text summary for the lead record, so the follow-up call starts with context. */
export function leadMessageFor(answers: QuizAnswers, estimate: QuizEstimate, textConsent: boolean): string {
  const estimateLine = estimate.ok
    ? `Estimate: ${formatCurrency(estimate.comfortablePrice)} to ${formatCurrency(estimate.upperPrice)} (${PROGRAM_LABELS[estimate.program]}, limited by ${estimate.limitedBy === "income" ? "income" : "down payment"})`
    : `Estimate: none (${NO_ESTIMATE_REASONS[estimate.reason]})`
  return [
    "Homebuyer quiz (/buy/quiz)",
    `Stage: ${labelFor(BUYER_STAGES, answers.stage)}`,
    `Pre-approved: ${labelFor(PRE_APPROVAL_OPTIONS, answers.preApproved)}`,
    `Area: ${labelFor(BUYING_AREAS, answers.area)}`,
    `Veteran or military: ${answers.veteran ? "Yes" : "No"}`,
    `Income: ${formatCurrency(answers.annualIncome)}/yr`,
    `Monthly debts: ${formatCurrency(answers.monthlyDebts)}`,
    `Down payment saved: ${formatCurrency(answers.downPayment)}`,
    `Credit: ${labelFor(CREDIT_BANDS, answers.credit)}`,
    estimateLine,
    `OK to text: ${textConsent ? "Yes" : "No"}`,
  ].join("\n")
}
