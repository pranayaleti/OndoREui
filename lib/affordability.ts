import {
  calculateMaxLoanFromPayment,
  calculateMonthlyPI,
  clampCreditScore,
  getProgramDTI,
  getProgramMI,
  type LoanProgram,
} from "@/lib/mortgage-utils"

/**
 * The one affordability model on the site. /calculators/affordability and the
 * /buy/quiz homebuyer quiz both call it, so the same answers always produce the
 * same price. Percent inputs are whole percents (6.5 means 6.5%).
 */
export type AffordabilityInput = {
  annualIncome: number
  monthlyDebts: number
  downPayment: number
  interestRate: number
  termYears: number
  propertyTaxRatePercent: number
  insuranceRatePercent: number
  program: LoanProgram
  creditScore: number
}

export type AffordabilityEstimate = {
  maxHomePrice: number
  maxLoanAmount: number
  /** Conservative target: 90% of the maximum. */
  recommendedHomePrice: number
  monthlyPayment: {
    principalAndInterest: number
    propertyTax: number
    insurance: number
    mortgageInsurance: number
    total: number
  }
  frontEndRatio: number
  backEndRatio: number
}

export function estimateAffordability(input: AffordabilityInput): AffordabilityEstimate {
  const { annualIncome, monthlyDebts, downPayment, interestRate, termYears, program } = input
  const creditScore = clampCreditScore(input.creditScore)
  const monthlyIncome = annualIncome / 12

  // The lower of the program's front-end and back-end DTI limits caps the housing
  // payment. A front-end limit of 0 means the program has none (VA).
  const dti = getProgramDTI(program)
  const maxFrontEndPayment =
    dti.frontPercent > 0 ? monthlyIncome * (dti.frontPercent / 100) : Number.POSITIVE_INFINITY
  const maxBackEndPayment = monthlyIncome * (dti.backPercent / 100) - monthlyDebts
  const maxMonthlyPayment = Math.min(maxFrontEndPayment, maxBackEndPayment)

  const monthlyTax = (price: number) => (price * input.propertyTaxRatePercent) / 100 / 12
  const monthlyInsurance = (price: number) => (price * input.insuranceRatePercent) / 100 / 12
  const monthlyMI = (price: number) =>
    getProgramMI(program, price - downPayment, price, creditScore, termYears, downPayment).monthlyMI

  // Tax, insurance and MI grow with the price, so shrink the principal-and-interest
  // budget and re-solve until the price moves by less than $100.
  const uncappedPrice = calculateMaxLoanFromPayment(maxMonthlyPayment, interestRate, termYears) + downPayment
  let price = uncappedPrice
  for (let i = 0; i < 10; i++) {
    const availableForPandI = maxMonthlyPayment - monthlyTax(price) - monthlyInsurance(price) - monthlyMI(price)
    if (availableForPandI > 0) {
      const next = calculateMaxLoanFromPayment(availableForPandI, interestRate, termYears) + downPayment
      if (Math.abs(next - price) < 100) break
      price = next
    } else {
      price *= 0.95
    }
  }

  const maxHomePrice = Math.min(uncappedPrice, price)
  const maxLoanAmount = maxHomePrice - downPayment
  const principalAndInterest = calculateMonthlyPI(maxLoanAmount, interestRate, termYears)
  const propertyTax = monthlyTax(maxHomePrice)
  const insurance = monthlyInsurance(maxHomePrice)
  const mortgageInsurance = getProgramMI(
    program,
    maxLoanAmount,
    maxHomePrice,
    creditScore,
    termYears,
    downPayment,
  ).monthlyMI
  const total = principalAndInterest + propertyTax + insurance + mortgageInsurance

  return {
    maxHomePrice,
    maxLoanAmount,
    recommendedHomePrice: maxHomePrice * 0.9,
    monthlyPayment: { principalAndInterest, propertyTax, insurance, mortgageInsurance, total },
    frontEndRatio: (total / monthlyIncome) * 100,
    backEndRatio: ((monthlyDebts + total) / monthlyIncome) * 100,
  }
}
