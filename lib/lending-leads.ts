import { formatCurrency } from "@/lib/cost-of-living"
import { CREDIT_BANDS, type QuizAnswers } from "@/lib/homebuyer-quiz"

/**
 * Lead summaries for the Loan Estimate second look and the refinance rate watch.
 * Both pages are built but unpublished (app/loans/_second-look, app/refinance/_watch)
 * until Ondo's NMLS license is active: they solicit mortgage business.
 */

export const CASH_SOURCES = [
  { value: "savings", label: "Savings" },
  { value: "gift", label: "Gift from family" },
  { value: "home_sale", label: "Sale of a home" },
  { value: "retirement", label: "Retirement account" },
  { value: "other", label: "Something else" },
] as const

export const NEW_CONSTRUCTION_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "unsure", label: "Not sure" },
] as const

export type SecondLookAnswers = {
  /** YYYY-MM-DD from a date input. */
  closingDate: string
  interestRate?: number
  points?: number
  originationCharges?: number
  apr?: number
  cashToClose?: number
  credit: QuizAnswers["credit"]
  cashSource: (typeof CASH_SOURCES)[number]["value"]
  newConstruction: (typeof NEW_CONSTRUCTION_OPTIONS)[number]["value"]
  notes: string
}

export type RateWatchAnswers = {
  currentRate: number
  targetRate?: number
  balance?: number
  city?: string
}

/** Reads "$2,100", "6.875" or " 410,000 " from a text input; blank or garbled input is "not given". */
export function parseOptionalAmount(raw: string): number | undefined {
  const cleaned = raw.replace(/[$,\s]/g, "")
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return undefined
  return Number(cleaned)
}

const percent = (value?: number) => (value === undefined ? "not given" : `${value}%`)
const dollars = (value?: number) => (value === undefined ? "not given" : formatCurrency(value))

function labelFor(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

export function secondLookMessage(answers: SecondLookAnswers, textConsent: boolean): string {
  return [
    "Loan Estimate second look (/loans/second-look)",
    `Closing date: ${answers.closingDate}`,
    `Interest rate: ${percent(answers.interestRate)}`,
    `Points: ${dollars(answers.points)}`,
    `Origination charges (Section A): ${dollars(answers.originationCharges)}`,
    `APR: ${percent(answers.apr)}`,
    `Cash to close: ${dollars(answers.cashToClose)}`,
    `Credit: ${labelFor(CREDIT_BANDS, answers.credit)}`,
    `Cash to close from: ${labelFor(CASH_SOURCES, answers.cashSource)}`,
    `New construction: ${labelFor(NEW_CONSTRUCTION_OPTIONS, answers.newConstruction)}`,
    answers.notes.trim() ? `Notes: ${answers.notes.trim()}` : null,
    `OK to text: ${textConsent ? "Yes" : "No"}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n")
}

export function rateWatchMessage(answers: RateWatchAnswers, textConsent: boolean): string {
  return [
    "Refinance rate watch (/refinance/watch)",
    `Current rate: ${percent(answers.currentRate)}`,
    `Target rate: ${percent(answers.targetRate)}`,
    `Balance: ${dollars(answers.balance)}`,
    answers.city?.trim() ? `City: ${answers.city.trim()}` : null,
    `OK to text: ${textConsent ? "Yes" : "No"}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n")
}
