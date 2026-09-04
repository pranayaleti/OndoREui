import { calculateMonthlyPI } from "@/lib/mortgage-utils"

/** 30-year fixed term used only as a labeled worksheet assumption. */
export const LISTING_INVESTOR_LOAN_TERM_YEARS = 30

export type ListingInvestorAssumptions = {
  listedMonthlyRent: number
  purchasePrice: number
  downPaymentPercent: number
  closingCostsPercent: number
  mortgageRatePercent: number
  loanTermYears?: number
  taxPercent: number
  insurancePercent: number
  hoaPercent: number
  vacancyPercent: number
  managementPercent: number
}

export type ListingInvestorIllustration = {
  grossAnnualRent: number
  vacancyLoss: number
  effectiveGrossIncome: number
  annualOperatingExpenses: number
  noi: number
  capRatePercent: number
  loanAmount: number
  monthlyPI: number
  annualDebtService: number
  downPaymentAmount: number
  closingCostsAmount: number
  cashInvested: number
  annualCashFlow: number
  cashOnCashPercent: number | null
}

function nonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return value
}

function clampPercent(value: number): number {
  return Math.min(100, nonNegative(value))
}

/**
 * Illustrative underwrite from listed monthly rent plus user assumptions.
 * Returns null when purchase price is missing or not positive — no yields.
 */
export function calculateListingInvestorIllustration(
  input: ListingInvestorAssumptions,
): ListingInvestorIllustration | null {
  const purchasePrice = input.purchasePrice
  if (!Number.isFinite(purchasePrice) || purchasePrice <= 0) return null

  const listedMonthlyRent = nonNegative(input.listedMonthlyRent)
  const downPaymentPercent = clampPercent(input.downPaymentPercent)
  const closingCostsPercent = nonNegative(input.closingCostsPercent)
  const mortgageRatePercent = nonNegative(input.mortgageRatePercent)
  const taxPercent = nonNegative(input.taxPercent)
  const insurancePercent = nonNegative(input.insurancePercent)
  const hoaPercent = nonNegative(input.hoaPercent)
  const vacancyPercent = nonNegative(input.vacancyPercent)
  const managementPercent = nonNegative(input.managementPercent)
  const loanTermYears =
    input.loanTermYears && input.loanTermYears > 0
      ? input.loanTermYears
      : LISTING_INVESTOR_LOAN_TERM_YEARS

  const grossAnnualRent = listedMonthlyRent * 12
  const vacancyLoss = grossAnnualRent * (vacancyPercent / 100)
  const effectiveGrossIncome = grossAnnualRent - vacancyLoss
  const annualTax = purchasePrice * (taxPercent / 100)
  const annualInsurance = purchasePrice * (insurancePercent / 100)
  const annualHoa = purchasePrice * (hoaPercent / 100)
  const annualManagement = grossAnnualRent * (managementPercent / 100)
  const annualOperatingExpenses = annualTax + annualInsurance + annualHoa + annualManagement
  const noi = effectiveGrossIncome - annualOperatingExpenses
  const capRatePercent = (noi / purchasePrice) * 100

  const downPaymentAmount = purchasePrice * (downPaymentPercent / 100)
  const closingCostsAmount = purchasePrice * (closingCostsPercent / 100)
  const cashInvested = downPaymentAmount + closingCostsAmount
  const loanAmount = Math.max(0, purchasePrice - downPaymentAmount)
  const monthlyPI = calculateMonthlyPI(loanAmount, mortgageRatePercent, loanTermYears)
  const annualDebtService = Number.isFinite(monthlyPI) ? monthlyPI * 12 : 0
  const annualCashFlow = noi - annualDebtService
  const cashOnCashPercent = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : null

  return {
    grossAnnualRent,
    vacancyLoss,
    effectiveGrossIncome,
    annualOperatingExpenses,
    noi,
    capRatePercent,
    loanAmount,
    monthlyPI: Number.isFinite(monthlyPI) ? monthlyPI : 0,
    annualDebtService,
    downPaymentAmount,
    closingCostsAmount,
    cashInvested,
    annualCashFlow,
    cashOnCashPercent,
  }
}
