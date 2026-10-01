export interface RetirementInputs {
  currentAge: number
  retirementAge: number
  lifeExpectancy: number
  currentSavings: number
  /** Annual income and expenses today; the difference is what you can save. */
  currentIncome: number
  currentExpenses: number
  currentRealEstateValue: number
  realEstateIncome: number
  realEstateExpenses: number
  realEstateAppreciation: number
  monthlyContribution: number
  investmentReturn: number
  inflationRate: number
  desiredRetirementIncome: number
  socialSecurityIncome: number
  otherIncome: number
}

export interface RetirementProjectionYear {
  age: number
  year: number
  savings: number
  realEstateValue: number
  totalAssets: number
  projectedIncome: number
}

export type RetirementReadiness = "On Track" | "Close to Target" | "Needs Attention"

export interface RetirementResults {
  totalRetirementSavings: number
  realEstateValueAtRetirement: number
  totalRetirementAssets: number
  annualRetirementIncome: number
  /** Desired income (in retirement-year dollars) minus projected income. Negative means a surplus. */
  retirementIncomeGap: number
  yearsOfRetirement: number
  monthlyRetirementBudget: number
  retirementReadiness: RetirementReadiness
  recommendations: string[]
  /** Income minus expenses today, per year. Can be negative. */
  annualSavingsCapacity: number
  /** Planned contributions per year minus savings capacity; positive means contributions exceed what the budget leaves. */
  contributionOverCapacity: number
  /** Notes about the inputs (retirement length, savings capacity), shown beside the readiness verdict. */
  notes: string[]
  yearByYearProjection: RetirementProjectionYear[]
}

/** The 4% rule is built on a roughly 30-year retirement. */
export const FOUR_PERCENT_RULE_HORIZON_YEARS = 30

export function calculateRetirement(inputs: RetirementInputs): RetirementResults {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    currentIncome,
    currentExpenses,
    currentRealEstateValue,
    realEstateIncome,
    realEstateExpenses,
    realEstateAppreciation,
    monthlyContribution,
    investmentReturn,
    inflationRate,
    desiredRetirementIncome,
    socialSecurityIncome,
    otherIncome,
  } = inputs

  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const yearsOfRetirement = Math.max(0, lifeExpectancy - retirementAge)

  const netRealEstateIncome = Math.max(0, realEstateIncome - realEstateExpenses)

  const futureValueOfSavings = currentSavings * Math.pow(1 + investmentReturn / 100, yearsToRetirement)

  const monthlyRate = investmentReturn / 100 / 12
  const totalMonths = yearsToRetirement * 12
  const futureValueOfContributions =
    monthlyRate > 0
      ? (monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1)) / monthlyRate
      : monthlyContribution * totalMonths

  // Net rental income reinvested annually (FV of annuity)
  const annualReturn = investmentReturn / 100
  const futureValueOfRentalIncome =
    annualReturn > 0
      ? netRealEstateIncome * ((Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn)
      : netRealEstateIncome * yearsToRetirement

  const totalRetirementSavings = futureValueOfSavings + futureValueOfContributions + futureValueOfRentalIncome

  const realEstateValueAtRetirement =
    currentRealEstateValue * Math.pow(1 + realEstateAppreciation / 100, yearsToRetirement)

  const totalRetirementAssets = totalRetirementSavings + realEstateValueAtRetirement

  const retirementIncomeFromAssets = totalRetirementAssets * 0.04
  const annualRetirementIncome = retirementIncomeFromAssets + socialSecurityIncome + otherIncome

  // Inflate desired income to future dollars for an apples-to-apples comparison
  const inflatedDesiredIncome = desiredRetirementIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement)
  const retirementIncomeGap = inflatedDesiredIncome - annualRetirementIncome
  const monthlyRetirementBudget = annualRetirementIncome / 12

  let retirementReadiness: RetirementReadiness
  let recommendations: string[]

  if (annualRetirementIncome >= inflatedDesiredIncome) {
    retirementReadiness = "On Track"
    recommendations = [
      "You're on track for retirement! Consider increasing real estate investments for additional income.",
      "Review your investment allocation to ensure optimal returns.",
      "Consider early retirement options if desired.",
    ]
  } else if (annualRetirementIncome >= inflatedDesiredIncome * 0.8) {
    retirementReadiness = "Close to Target"
    recommendations = [
      "You're close to your retirement goal. Consider increasing monthly contributions.",
      "Explore additional real estate investment opportunities.",
      "Review your retirement age - working a few more years could help.",
    ]
  } else {
    retirementReadiness = "Needs Attention"
    recommendations = [
      "Increase your monthly savings contributions significantly.",
      "Consider investing in additional real estate properties for rental income.",
      "Review your retirement age - you may need to work longer.",
      "Explore ways to reduce retirement expenses or increase income sources.",
    ]
  }

  const annualSavingsCapacity = currentIncome - currentExpenses
  const contributionOverCapacity = monthlyContribution * 12 - annualSavingsCapacity
  const notes: string[] = []
  if (contributionOverCapacity > 0) {
    notes.push(
      annualSavingsCapacity > 0
        ? "Your planned contributions are more than your income leaves after expenses today, so the plan depends on other cash or a smaller budget."
        : "Your expenses are at or above your income today, so the planned contributions have no surplus behind them.",
    )
  }
  if (yearsOfRetirement === 0) {
    notes.push("Life expectancy is at or before your retirement age, so there are no retirement years to fund.")
  } else if (yearsOfRetirement > FOUR_PERCENT_RULE_HORIZON_YEARS) {
    notes.push(
      `A ${yearsOfRetirement}-year retirement is longer than the roughly ${FOUR_PERCENT_RULE_HORIZON_YEARS} years the 4% withdrawal rule is built around, so this income estimate may be too high.`,
    )
  }

  const yearByYearProjection: RetirementProjectionYear[] = []
  let savings = currentSavings
  let realEstateValue = currentRealEstateValue

  for (let year = 1; year <= yearsToRetirement; year++) {
    for (let m = 0; m < 12; m++) {
      savings = savings * (1 + monthlyRate) + monthlyContribution
    }
    savings += netRealEstateIncome
    realEstateValue *= 1 + realEstateAppreciation / 100
    const totalAssets = savings + realEstateValue
    yearByYearProjection.push({
      age: currentAge + year,
      year,
      savings,
      realEstateValue,
      totalAssets,
      projectedIncome: totalAssets * 0.04,
    })
  }

  return {
    totalRetirementSavings,
    realEstateValueAtRetirement,
    totalRetirementAssets,
    annualRetirementIncome,
    retirementIncomeGap,
    yearsOfRetirement,
    monthlyRetirementBudget,
    retirementReadiness,
    recommendations,
    annualSavingsCapacity,
    contributionOverCapacity,
    notes,
    yearByYearProjection,
  }
}
