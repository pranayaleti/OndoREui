import { calculateMaxLoanFromPayment, calculateMonthlyPI } from "@/lib/mortgage-utils"
import { propertyManagementFee } from "@/lib/rental-expenses"

/** Loan-to-value assumed when turning the maximum loan into a rough purchase price. */
export const DSCR_ASSUMED_LTV = 0.75

export interface DscrInput {
  monthlyRent: number
  /** When greater than zero it replaces monthlyRent * 12. */
  annualRent: number
  propertyTax: number
  insurance: number
  maintenance: number
  propertyManagement: number
  vacancyRate: number
  otherExpenses: number
  loanAmount: number
  interestRate: number
  loanTerm: number
  requiredDSCR: number
}

export interface DscrResult {
  annualRentalIncome: number
  annualOperatingExpenses: number
  netOperatingIncome: number
  annualDebtService: number
  dscr: number
  maxLoanAmount: number
  maxPurchasePrice: number
}

/**
 * Debt service coverage for a rental. No debt service (no loan or zero term) gives a ratio of 0,
 * and a non-positive NOI or required ratio gives a maximum loan of 0 instead of a negative or
 * infinite amount.
 */
export function calculateDscr(input: DscrInput): DscrResult {
  const effectiveAnnualRent = input.annualRent > 0 ? input.annualRent : input.monthlyRent * 12
  const annualRentalIncome = effectiveAnnualRent * (1 - input.vacancyRate / 100)
  const managementFee = propertyManagementFee(effectiveAnnualRent, input.propertyManagement)
  const annualOperatingExpenses =
    input.propertyTax + input.insurance + input.maintenance + managementFee + input.otherExpenses
  const netOperatingIncome = annualRentalIncome - annualOperatingExpenses

  const annualDebtService = calculateMonthlyPI(input.loanAmount, input.interestRate, input.loanTerm) * 12
  const dscr =
    Number.isFinite(annualDebtService) && annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0

  const maxLoanAmount =
    input.requiredDSCR > 0
      ? calculateMaxLoanFromPayment(netOperatingIncome / input.requiredDSCR / 12, input.interestRate, input.loanTerm)
      : 0

  return {
    annualRentalIncome,
    annualOperatingExpenses,
    netOperatingIncome,
    annualDebtService: Number.isFinite(annualDebtService) ? annualDebtService : 0,
    dscr,
    maxLoanAmount,
    maxPurchasePrice: maxLoanAmount / DSCR_ASSUMED_LTV,
  }
}
