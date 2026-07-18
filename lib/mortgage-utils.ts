export type LoanProgram = 'conventional' | 'fha' | 'va' | 'usda'

/** Example default rate for consumer calculators (not a live quote). */
export const DEFAULT_MORTGAGE_RATE = 6.5

export function calculateMonthlyPI(principal: number, annualRatePercent: number, termYears: number): number {
  const monthlyRate = (annualRatePercent / 100) / 12
  const totalPayments = termYears * 12
  if (monthlyRate === 0) return totalPayments === 0 ? 0 : principal / totalPayments
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
}

/** Inverse of calculateMonthlyPI: max principal for a target monthly P&I. */
export function calculateMaxLoanFromPayment(
  monthlyPayment: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) return 0
  const totalPayments = termYears * 12
  if (totalPayments <= 0) return 0
  const monthlyRate = (annualRatePercent / 100) / 12
  if (monthlyRate === 0) return monthlyPayment * totalPayments
  return monthlyPayment * (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate
}

/** Total interest paid over a fully amortizing fixed-rate term. */
export function calculateTotalInterest(principal: number, annualRatePercent: number, termYears: number): number {
  if (!Number.isFinite(principal) || principal <= 0 || termYears <= 0) return 0
  const payment = calculateMonthlyPI(principal, annualRatePercent, termYears)
  if (!Number.isFinite(payment)) return 0
  return Math.max(0, payment * termYears * 12 - principal)
}

/**
 * Estimate remaining months on an amortizing loan from balance, rate, and P&I payment.
 * Returns null when inputs cannot support a finite remaining term.
 */
export function estimateRemainingMonths(
  balance: number,
  annualRatePercent: number,
  monthlyPI: number
): number | null {
  if (!(balance > 0) || !(monthlyPI > 0) || !Number.isFinite(annualRatePercent)) return null
  const monthlyRate = (annualRatePercent / 100) / 12
  if (monthlyRate === 0) return balance / monthlyPI
  if (monthlyPI <= balance * monthlyRate) return null
  const months = Math.log(monthlyPI / (monthlyPI - balance * monthlyRate)) / Math.log(1 + monthlyRate)
  if (!Number.isFinite(months) || months <= 0) return null
  return months
}

export type BuydownStructure = 'flat' | '2-1' | '3-2-1'

export interface BuydownYearDetail {
  year: number
  ratePercent: number
  monthlyPayment: number
  monthlySubsidy: number
  months: number
  yearSubsidy: number
}

export interface TemporaryBuydownInput {
  loanAmount: number
  noteRate: number
  loanTermYears: number
  structure: BuydownStructure
  /** Used only for flat structure. */
  flatBuydownRate?: number
  /** Used only for flat structure (1–3 typical). */
  flatYears?: number
}

export interface TemporaryBuydownResult {
  fullMonthlyPayment: number
  schedule: BuydownYearDetail[]
  buydownMonths: number
  estimatedBuydownCost: number
  averageMonthlySubsidy: number
  /** Month-weighted average rate during the buydown period only. */
  effectiveBuydownRate: number
  totalSubsidySavings: number
}

/** Annual rates charged to the borrower during each buydown year (note rate never changes). */
export function getBuydownRateSchedule(
  structure: BuydownStructure,
  noteRate: number,
  flatBuydownRate = noteRate - 1,
  flatYears = 2
): number[] {
  const clampRate = (r: number) => Math.max(0, r)
  switch (structure) {
    case '2-1':
      return [clampRate(noteRate - 2), clampRate(noteRate - 1)]
    case '3-2-1':
      return [clampRate(noteRate - 3), clampRate(noteRate - 2), clampRate(noteRate - 1)]
    case 'flat': {
      const years = Math.max(1, Math.min(5, Math.round(flatYears)))
      const rate = clampRate(flatBuydownRate)
      return Array.from({ length: years }, () => rate)
    }
    default: {
      const _exhaustive: never = structure
      return _exhaustive
    }
  }
}

/**
 * Temporary buydown model: note rate stays fixed for amortization sizing;
 * borrower pays a subsidized payment (P&I at temporary rate, same principal/term)
 * during buydown years. Cost ≈ sum of (full − subsidized) over subsidy months.
 */
export function calculateTemporaryBuydown(input: TemporaryBuydownInput): TemporaryBuydownResult | null {
  const { loanAmount, noteRate, loanTermYears, structure } = input
  if (!(loanAmount > 0) || !(loanTermYears > 0) || !Number.isFinite(noteRate) || noteRate < 0) {
    return null
  }

  const rates = getBuydownRateSchedule(
    structure,
    noteRate,
    input.flatBuydownRate,
    input.flatYears
  )
  if (rates.length === 0) return null
  // Flat structure must use a rate strictly below the note rate
  if (structure === 'flat' && rates.some((r) => r >= noteRate)) return null

  const fullMonthlyPayment = calculateMonthlyPI(loanAmount, noteRate, loanTermYears)
  if (!Number.isFinite(fullMonthlyPayment)) return null

  const schedule: BuydownYearDetail[] = rates.map((ratePercent, index) => {
    const monthlyPayment = calculateMonthlyPI(loanAmount, ratePercent, loanTermYears)
    const monthlySubsidy = Math.max(0, fullMonthlyPayment - monthlyPayment)
    const months = 12
    return {
      year: index + 1,
      ratePercent,
      monthlyPayment,
      monthlySubsidy,
      months,
      yearSubsidy: monthlySubsidy * months,
    }
  })

  const estimatedBuydownCost = schedule.reduce((sum, y) => sum + y.yearSubsidy, 0)
  const buydownMonths = schedule.reduce((sum, y) => sum + y.months, 0)
  const averageMonthlySubsidy = buydownMonths > 0 ? estimatedBuydownCost / buydownMonths : 0
  const effectiveBuydownRate =
    buydownMonths > 0
      ? schedule.reduce((sum, y) => sum + y.ratePercent * y.months, 0) / buydownMonths
      : noteRate

  return {
    fullMonthlyPayment,
    schedule,
    buydownMonths,
    estimatedBuydownCost,
    averageMonthlySubsidy,
    effectiveBuydownRate,
    totalSubsidySavings: estimatedBuydownCost,
  }
}

export interface RefinanceInput {
  currentBalance: number
  currentRate: number
  currentPayment: number
  newRate: number
  newTermYears: number
  closingCosts: number
  annualPropertyTax: number
  annualInsurance: number
}

export interface RefinanceResult {
  newPI: number
  newEscrows: number
  newTotalPayment: number
  currentPI: number
  monthlyPaymentSavings: number
  breakEvenMonths: number | null
  /**
   * P&I payment difference × comparison horizon − closing costs.
   * Horizon is min(estimated remaining months, new term) when remaining is known.
   */
  netPaymentSavingsOverNewTerm: number
  /** Months used for net payment / interest comparisons. */
  comparisonMonths: number
  /** True interest differential over the comparison horizon; else null. */
  interestSavings: number | null
  estimatedRemainingMonths: number | null
  /** New term is longer than the estimated remaining term on the current loan. */
  extendsTerm: boolean
  /** Rate/term refinance looks worthwhile: interest savings, break-even, and lower payment. */
  isBeneficial: boolean
}

/** Interest paid over the first `months` of an amortizing loan (capped at full term). */
export function interestPaidOverMonths(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  months: number,
): number {
  if (!(principal > 0) || !(termYears > 0) || !(months > 0)) return 0
  const payment = calculateMonthlyPI(principal, annualRatePercent, termYears)
  if (!Number.isFinite(payment)) return 0
  const capped = Math.min(months, termYears * 12)
  return interestPaidWithFixedPayment(principal, annualRatePercent, payment, capped)
}

/** Interest paid over `months` given a fixed monthly P&I payment. */
export function interestPaidWithFixedPayment(
  principal: number,
  annualRatePercent: number,
  monthlyPI: number,
  months: number,
): number {
  if (!(principal > 0) || !(monthlyPI > 0) || !(months > 0)) return 0
  const k = Math.floor(months)
  if (k <= 0) return 0
  const monthlyRate = (annualRatePercent / 100) / 12
  if (monthlyRate === 0) return 0
  if (monthlyPI <= principal * monthlyRate) {
    // Interest-only or underwater payment — interest ≈ rate × principal × months
    return principal * monthlyRate * k
  }
  const growth = Math.pow(1 + monthlyRate, k)
  const balanceAfter = principal * growth - (monthlyPI * (growth - 1)) / monthlyRate
  const principalPaid = principal - Math.max(0, balanceAfter)
  return Math.max(0, monthlyPI * k - principalPaid)
}

export function hasCompleteRefinanceInputs(input: RefinanceInput): boolean {
  return (
    input.currentBalance > 0 &&
    Number.isFinite(input.currentRate) &&
    input.currentRate >= 0 &&
    input.currentPayment > 0 &&
    Number.isFinite(input.newRate) &&
    input.newRate >= 0 &&
    input.newTermYears > 0 &&
    Number.isFinite(input.closingCosts) &&
    input.closingCosts >= 0 &&
    Number.isFinite(input.annualPropertyTax) &&
    input.annualPropertyTax >= 0 &&
    Number.isFinite(input.annualInsurance) &&
    input.annualInsurance >= 0
  )
}

export function calculateRefinance(input: RefinanceInput): RefinanceResult | null {
  if (!hasCompleteRefinanceInputs(input)) return null

  const {
    currentBalance,
    currentRate,
    currentPayment,
    newRate,
    newTermYears,
    closingCosts,
    annualPropertyTax,
    annualInsurance,
  } = input

  const newPI = calculateMonthlyPI(currentBalance, newRate, newTermYears)
  if (!Number.isFinite(newPI)) return null

  const newEscrows = annualPropertyTax / 12 + annualInsurance / 12
  const newTotalPayment = newPI + newEscrows
  // Prefer treating currentPayment as total (P&I + escrow). If the entered
  // payment is at or below escrow, treat it as P&I-only.
  const currentPI =
    currentPayment > newEscrows
      ? currentPayment - newEscrows
      : currentPayment
  const monthlyPaymentSavings = currentPayment - newTotalPayment
  const breakEvenMonths =
    monthlyPaymentSavings > 0 && closingCosts > 0
      ? closingCosts / monthlyPaymentSavings
      : monthlyPaymentSavings > 0 && closingCosts === 0
        ? 0
        : null

  const newTermMonths = newTermYears * 12
  const remainingMonths = estimateRemainingMonths(currentBalance, currentRate, currentPI)
  const comparisonMonths =
    remainingMonths != null && remainingMonths > 0
      ? Math.min(remainingMonths, newTermMonths)
      : newTermMonths

  const piDiffPerMonth = currentPI - newPI
  const netPaymentSavingsOverNewTerm = piDiffPerMonth * comparisonMonths - closingCosts

  const extendsTerm =
    remainingMonths != null && newTermMonths > remainingMonths + 0.5

  let interestSavings: number | null = null
  if (remainingMonths != null && remainingMonths > 0) {
    const currentHorizonInterest = interestPaidWithFixedPayment(
      currentBalance,
      currentRate,
      currentPI,
      comparisonMonths,
    )
    const newHorizonInterest = interestPaidOverMonths(
      currentBalance,
      newRate,
      newTermYears,
      comparisonMonths,
    )
    interestSavings = currentHorizonInterest - newHorizonInterest

    // Extending the term while raising the payment should not claim "interest savings".
    if (monthlyPaymentSavings < 0 && extendsTerm && interestSavings > 0) {
      interestSavings = null
    }
  }

  const isBeneficial =
    monthlyPaymentSavings > 0 &&
    interestSavings != null &&
    interestSavings > 0 &&
    breakEvenMonths != null &&
    (remainingMonths == null || breakEvenMonths <= remainingMonths)

  return {
    newPI,
    newEscrows,
    newTotalPayment,
    currentPI,
    monthlyPaymentSavings,
    breakEvenMonths,
    netPaymentSavingsOverNewTerm,
    comparisonMonths,
    interestSavings,
    estimatedRemainingMonths: remainingMonths,
    extendsTerm,
    isBeneficial,
  }
}

export function getLtv(homePrice: number, downPayment: number): number {
  if (homePrice <= 0) return 0
  const loan = Math.max(0, homePrice - downPayment)
  return loan / homePrice
}

export function applyFinancedUpfrontToLoan(baseLoan: number, upfrontFee: number, financed: boolean): number {
  return financed ? baseLoan + upfrontFee : baseLoan
}

export function getProgramDTI(program: LoanProgram): { frontPercent: number; backPercent: number } {
  switch (program) {
    case 'fha':
      // FHA typical manual underwriting guidelines
      return { frontPercent: 31, backPercent: 43 }
    case 'va':
      // VA uses residual income; 41% DTI rule of thumb
      return { frontPercent: 0, backPercent: 41 }
    case 'usda':
      // USDA: 29/41 guidance
      return { frontPercent: 29, backPercent: 41 }
    case 'conventional':
    default:
      // Conventional baseline used publicly
      return { frontPercent: 28, backPercent: 36 }
  }
}

export function estimateConventionalPmiAnnualFactor(ltv: number, creditScore: number): number {
  if (ltv < 0.80) return 0
  // Rough market-average PMI tiers by credit; conservative assumptions
  if (creditScore >= 760) return ltv > 0.90 ? 0.004 : 0.003
  if (creditScore >= 740) return ltv > 0.90 ? 0.005 : 0.004
  if (creditScore >= 700) return 0.008
  if (creditScore >= 660) return 0.011
  return 0.015
}

export function getProgramMI(
  program: LoanProgram,
  baseLoan: number,
  homePrice: number,
  creditScore: number,
  loanTermYears: number,
  downPayment: number
): { monthlyMI: number; upfrontFee: number; description: string } {
  const ltv = getLtv(homePrice, downPayment)

  switch (program) {
    case 'conventional': {
      const annual = estimateConventionalPmiAnnualFactor(ltv, creditScore)
      const monthlyMI = annual > 0 ? (baseLoan * annual) / 12 : 0
      return { monthlyMI, upfrontFee: 0, description: annual > 0 ? 'Conventional PMI' : 'No PMI (LTV < 80%)' }
    }
    case 'fha': {
      // FHA UFMIP ~1.75% upfront; annual MIP commonly 0.55% (>95% LTV) or 0.50% (<=95%) for 30y
      const upfrontFee = baseLoan * 0.0175
      const annualMip = loanTermYears >= 30
        ? (ltv > 0.95 ? 0.0055 : 0.0050)
        : (ltv > 0.95 ? 0.0050 : 0.0045)
      const monthlyMI = (baseLoan * annualMip) / 12
      return { monthlyMI, upfrontFee, description: 'FHA MIP' }
    }
    case 'va': {
      // VA: no monthly MI; funding fee approx by down payment (first use)
      const downPct = homePrice > 0 ? (downPayment / homePrice) : 0
      let feeRate = 0.0215
      if (downPct >= 0.10) feeRate = 0.0125
      else if (downPct >= 0.05) feeRate = 0.015
      const upfrontFee = baseLoan * feeRate
      return { monthlyMI: 0, upfrontFee, description: 'VA Funding Fee' }
    }
    case 'usda': {
      // USDA: 1.0% upfront guarantee fee; 0.35% annual fee monthly
      const upfrontFee = baseLoan * 0.01
      const monthlyMI = (baseLoan * 0.0035) / 12
      return { monthlyMI, upfrontFee, description: 'USDA Guarantee Fee' }
    }
    default:
      return { monthlyMI: 0, upfrontFee: 0, description: '' }
  }
}

export function clampCreditScore(score: number): number {
  if (!Number.isFinite(score)) return 740
  return Math.max(300, Math.min(850, Math.round(score)))
}


