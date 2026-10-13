import type { ContactInquiryType } from "@/lib/leads-api"
import { calculateMonthlyPI } from "@/lib/mortgage-utils"

/**
 * The "Comment NUMBERS" calculator (/numbers/), the lead magnet from the "Put a Number on
 * the Problem" reel. Three problems, each priced in dollars: a higher mortgage rate, a
 * rental sitting empty, and a listing priced too high. Pure math here; the page is
 * components/numbers/numbers-calculator.tsx.
 */

export type NumbersTab = "rate" | "vacancy" | "pricing"

export const NUMBERS_TABS: ReadonlyArray<{ id: NumbersTab; label: string; inquiryType: ContactInquiryType }> = [
  // Borrowers have no inquiry type of their own (lib/leads-api.ts), so the rate tab sends "other".
  { id: "rate", label: "Mortgage rate", inquiryType: "other" },
  { id: "vacancy", label: "Empty rental", inquiryType: "owner_rental_services" },
  { id: "pricing", label: "Overpriced listing", inquiryType: "seller" },
]

export type RateInputs = { loan: number; rateLow: number; rateHigh: number; years: number }
export type VacancyInputs = { rent: number; months: number; turnover: number }
export type PricingInputs = { price: number; carry: number; days: number; cut: number }

export type NumbersInputs = { rate: RateInputs; vacancy: VacancyInputs; pricing: PricingInputs }

export const NUMBERS_DEFAULTS: NumbersInputs = {
  rate: { loan: 450_000, rateLow: 6, rateHigh: 6.5, years: 30 },
  vacancy: { rent: 2_000, months: 1, turnover: 600 },
  pricing: { price: 550_000, carry: 3_200, days: 60, cut: 2 },
}

export const LOAN_TERMS = [15, 20, 30] as const

export type NumbersResult = {
  headline: string
  lines: Array<{ label: string; amount: number }>
  total: { label: string; amount: number }
  note: string
  /** One line for the lead message, so the follow-up starts from the visitor's own numbers. */
  summary: string
}

export function formatUsd0(n: number): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

/** 0.5 → "0.5", 0.25 → "0.25", 1 → "1". */
function formatPoints(n: number): string {
  return String(Math.round(n * 1000) / 1000)
}

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function rateGap(input: RateInputs): NumbersResult {
  const loan = nonNegative(input.loan)
  const years = input.years > 0 ? input.years : 30
  // Either box can hold the higher rate; the gap is always the higher minus the lower.
  const low = Math.min(nonNegative(input.rateLow), nonNegative(input.rateHigh))
  const high = Math.max(nonNegative(input.rateLow), nonNegative(input.rateHigh))
  const paymentLow = loan > 0 ? calculateMonthlyPI(loan, low, years) : 0
  const paymentHigh = loan > 0 ? calculateMonthlyPI(loan, high, years) : 0
  const monthly = paymentHigh - paymentLow
  const life = monthly * years * 12
  return {
    headline: `That ${formatPoints(high - low)} point gap costs you ${formatUsd0(life)}.`,
    lines: [
      { label: `Payment at ${high}%`, amount: paymentHigh },
      { label: `Payment at ${low}%`, amount: paymentLow },
      { label: "Difference each month", amount: monthly },
      { label: "Over 5 years", amount: monthly * Math.min(60, years * 12) },
    ],
    total: { label: `Over the full ${years} years`, amount: life },
    note: "Principal and interest only. Taxes, insurance, and mortgage insurance not included.",
    summary: `Rate gap: ${formatUsd0(loan)} loan, ${low}% vs ${high}% over ${years} yrs. ${formatUsd0(monthly)}/mo difference, ${formatUsd0(life)} over the loan.`,
  }
}

export function vacancyCost(input: VacancyInputs): NumbersResult {
  const rent = nonNegative(input.rent)
  const months = nonNegative(input.months)
  const turnover = nonNegative(input.turnover)
  const lost = rent * months
  const total = lost + turnover
  const share = rent > 0 ? (total / (rent * 12)) * 100 : 0
  return {
    headline: `This vacancy costs you ${formatUsd0(total)}.`,
    lines: [
      { label: `Lost rent (${months} mo)`, amount: lost },
      { label: "Turnover costs", amount: turnover },
    ],
    total: { label: "Total cost", amount: total },
    note: `That's ${share.toFixed(1)}% of a full year's rent.`,
    summary: `Vacancy: ${formatUsd0(rent)}/mo rent, ${months} mo empty, ${formatUsd0(turnover)} turnover. Total ${formatUsd0(total)} (${share.toFixed(1)}% of annual rent).`,
  }
}

export function overpricingCost(input: PricingInputs): NumbersResult {
  const price = nonNegative(input.price)
  const carry = nonNegative(input.carry)
  const days = nonNegative(input.days)
  const cut = nonNegative(input.cut)
  const carrying = (carry * days) / 30
  const discount = price * (cut / 100)
  const total = carrying + discount
  return {
    headline: `Overpricing could cost you ${formatUsd0(total)}.`,
    lines: [
      { label: `Carrying costs (${days} days)`, amount: carrying },
      { label: `Extra discount (${cut}%)`, amount: discount },
    ],
    total: { label: "Total cost", amount: total },
    note: "Every month on the market is another month of payments on a home you're trying to leave.",
    summary: `Overpricing: ${formatUsd0(price)} list, ${formatUsd0(carry)}/mo carrying, ${days} extra days, ${cut}% extra discount. Total ${formatUsd0(total)}.`,
  }
}

export function calculateNumbers(tab: NumbersTab, inputs: NumbersInputs): NumbersResult {
  if (tab === "rate") return rateGap(inputs.rate)
  if (tab === "vacancy") return vacancyCost(inputs.vacancy)
  return overpricingCost(inputs.pricing)
}

/** The lead message: which tab the visitor was on, then all three breakdowns. */
export function numbersLeadMessage(tab: NumbersTab, inputs: NumbersInputs): string {
  const viewing = NUMBERS_TABS.find((t) => t.id === tab)?.label ?? tab
  return [
    "NUMBERS calculator (Put a Number on the Problem reel)",
    `Viewing: ${viewing}`,
    ...NUMBERS_TABS.map((t) => calculateNumbers(t.id, inputs).summary),
  ].join("\n")
}
