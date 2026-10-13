import { calculateMonthlyPI } from "./mortgage-utils"
import { propertyManagementFee } from "./rental-expenses"

export interface ROIInput {
  purchasePrice: number
  downPayment: number
  loanAmount: number
  /** Annual rate, percent. */
  interestRate: number
  loanTerm: number
  monthlyRent: number
  propertyTax: number
  insurance: number
  maintenance: number
  /** Percent of gross rent. */
  propertyManagement: number
  /** Percent of gross rent. */
  vacancyRate: number
  otherExpenses: number
  closingCosts: number
  repairs: number
  /** Annual percent. */
  appreciationRate: number
  /** Years. */
  holdingPeriod: number
  /** 0 means "project from appreciationRate". */
  salePrice: number
  /** Agent commission and seller closing costs, percent of sale price. */
  sellingCostPct: number
}

export interface ROIResults {
  totalCashInvested: number
  annualCashFlow: number
  totalCashFlow: number
  propertyValueAtSale: number
  sellingCosts: number
  loanBalanceAtSale: number
  /** Sale price less selling costs and the loan payoff. */
  netSaleProceeds: number
  totalReturn: number
  /** Whole-period return on cash invested, percent. */
  totalROI: number
  /**
   * Compound annual rate that turns cash invested into cash invested + total
   * return over the holding period, percent. Not totalROI / years: a simple
   * average overstates multi-year returns (74.5% over 5 years is 11.8%/yr, not 14.9%).
   */
  annualizedROI: number
  cashOnCashReturn: number
}

/** Annualize a whole-period percent return over `years`. A total loss or worse is -100%. */
export function annualizeReturn(totalPercent: number, years: number): number {
  if (!Number.isFinite(totalPercent) || !(years > 0)) return 0
  const growth = 1 + totalPercent / 100
  if (growth <= 0) return -100
  return (Math.pow(growth, 1 / years) - 1) * 100
}

/** Remaining principal after `months` level P&I payments. */
function balanceAfter(principal: number, annualRatePercent: number, termYears: number, months: number): number {
  const monthlyRate = annualRatePercent / 100 / 12
  const payment = calculateMonthlyPI(principal, annualRatePercent, termYears)
  const paymentsMade = Math.min(months, termYears * 12)
  let balance = principal
  for (let month = 0; month < paymentsMade; month++) {
    balance = Math.max(0, balance - (payment - balance * monthlyRate))
  }
  return balance
}

export function calculateROI(input: ROIInput): ROIResults {
  const {
    purchasePrice,
    downPayment,
    loanAmount,
    interestRate,
    loanTerm,
    monthlyRent,
    propertyTax,
    insurance,
    maintenance,
    propertyManagement,
    vacancyRate,
    otherExpenses,
    closingCosts,
    repairs,
    appreciationRate,
    holdingPeriod,
    salePrice,
    sellingCostPct,
  } = input

  const grossAnnualRent = monthlyRent * 12
  const effectiveRent = grossAnnualRent * (1 - vacancyRate / 100)
  const operatingExpenses =
    propertyTax + insurance + maintenance + propertyManagementFee(grossAnnualRent, propertyManagement) + otherExpenses
  const netOperatingIncome = effectiveRent - operatingExpenses

  const annualDebtService = calculateMonthlyPI(loanAmount, interestRate, loanTerm) * 12
  const annualCashFlow = netOperatingIncome - annualDebtService
  const totalCashFlow = annualCashFlow * holdingPeriod

  const totalCashInvested = downPayment + closingCosts + repairs

  const propertyValueAtSale =
    salePrice > 0 ? salePrice : purchasePrice * Math.pow(1 + appreciationRate / 100, holdingPeriod)
  const sellingCosts = propertyValueAtSale * (Math.max(0, sellingCostPct) / 100)
  const loanBalanceAtSale = balanceAfter(loanAmount, interestRate, loanTerm, holdingPeriod * 12)
  const netSaleProceeds = propertyValueAtSale - sellingCosts - loanBalanceAtSale

  const totalReturn = totalCashFlow + netSaleProceeds - totalCashInvested
  const totalROI = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0

  return {
    totalCashInvested,
    annualCashFlow,
    totalCashFlow,
    propertyValueAtSale,
    sellingCosts,
    loanBalanceAtSale,
    netSaleProceeds,
    totalReturn,
    totalROI,
    annualizedROI: annualizeReturn(totalROI, holdingPeriod),
    cashOnCashReturn: totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0,
  }
}
