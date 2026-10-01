import { LoanProgram, getProgramMI, calculateMonthlyPI } from "@/lib/mortgage-utils"

export interface ClosingCostInput {
  homePrice: number
  loanAmount: number
  downPayment: number
  interestRate?: number
  loanTerm?: number
  propertyTax: number
  insurance: number
  titleInsurance: number
  appraisal: number
  inspection: number
  originationFee: number
  discountPoints: number
  /** Days of prepaid interest. */
  prepaidInterest: number
  escrowReserves: number
  program?: LoanProgram
  /** Roll the FHA/VA/USDA upfront fee into the loan instead of paying it at closing. Default true. */
  financeUpfrontFee?: boolean
}

export interface ClosingCostResults {
  /** Everything the buyer pays at closing, excluding a financed upfront fee. */
  totalClosingCosts: number
  /** Down payment plus cash closing costs. */
  outOfPocket: number
  lenderCosts: number
  thirdPartyCosts: number
  prepaidCosts: number
  /** FHA/VA/USDA upfront fee that is added to the loan balance (0 when paid in cash or not applicable). */
  financedUpfrontFee: number
  /** Cash closing costs as a share of the home price, in percent. */
  closingCostPercentOfPrice: number
  monthlyPayment: number
  /** Months of first-month principal needed to equal total closing costs (rough equity payback, not true break-even). */
  equityPaybackMonths: number
  monthlyPI?: number
}

/**
 * The FHA/VA/USDA upfront fee is usually financed, so it raises the loan
 * balance rather than the cash needed at closing. Turn financeUpfrontFee off
 * to see it as a cash cost instead.
 */
export function calculateClosingCosts(input: ClosingCostInput): ClosingCostResults {
  const {
    homePrice, loanAmount, downPayment, propertyTax, insurance, titleInsurance,
    appraisal, inspection, originationFee, discountPoints, prepaidInterest, escrowReserves,
  } = input
  const financeUpfrontFee = input.financeUpfrontFee ?? true

  const monthlyTax = propertyTax / 12
  const monthlyInsurance = insurance / 12

  const baseLender = originationFee + (discountPoints * loanAmount) / 100
  const upfrontFee = getProgramMI(
    input.program || "conventional", loanAmount, homePrice, 740, input.loanTerm || 30, downPayment,
  ).upfrontFee
  const financedUpfrontFee = financeUpfrontFee ? upfrontFee : 0
  const lenderCosts = baseLender + (financeUpfrontFee ? 0 : upfrontFee)

  const thirdPartyCosts = titleInsurance + appraisal + inspection

  // Prepaid interest is entered in days and converted to dollars.
  const dailyInterest = input.interestRate
    ? (loanAmount * (input.interestRate / 100)) / 365
    : 0
  const prepaidCosts =
    dailyInterest * prepaidInterest + escrowReserves + monthlyTax * 2 + monthlyInsurance * 2

  const totalClosingCosts = lenderCosts + thirdPartyCosts + prepaidCosts
  const outOfPocket = downPayment + totalClosingCosts

  const financedLoan = loanAmount + financedUpfrontFee
  let monthlyPI = 0
  if (input.interestRate != null && input.loanTerm) {
    monthlyPI = calculateMonthlyPI(financedLoan, input.interestRate, input.loanTerm)
  }
  const monthlyPayment = monthlyTax + monthlyInsurance + (monthlyPI || financedLoan * 0.005)

  // First-month principal = P&I payment minus first month's interest.
  const firstMonthInterest = input.interestRate
    ? financedLoan * (input.interestRate / 100 / 12)
    : 0
  const firstMonthPrincipal = monthlyPI > 0 ? monthlyPI - firstMonthInterest : 0
  const equityPaybackMonths = firstMonthPrincipal > 0 ? totalClosingCosts / firstMonthPrincipal : 0

  return {
    totalClosingCosts,
    outOfPocket,
    lenderCosts,
    thirdPartyCosts,
    prepaidCosts,
    financedUpfrontFee,
    closingCostPercentOfPrice: homePrice > 0 ? (totalClosingCosts / homePrice) * 100 : 0,
    monthlyPayment,
    equityPaybackMonths,
    monthlyPI: monthlyPI || undefined,
  }
}
