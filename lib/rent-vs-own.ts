import { calculateMonthlyPI, clampCreditScore, getProgramMI, type LoanProgram } from "@/lib/mortgage-utils"

export interface RentVsOwnInputs {
  monthlyRent: number
  /** Annual rent increase, percent. */
  rentIncrease: number
  /** Refundable at move-out. Only the return it could have earned elsewhere counts as a cost. */
  securityDeposit: number
  rentersInsurance: number
  homePrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
  propertyTax: number
  homeownersInsurance: number
  maintenance: number
  hoa: number
  program: LoanProgram
  creditScore: number
  analysisYears: number
  /** Annual return, percent, on money that is not tied up in the home or the deposit. */
  investmentReturn: number
  homeAppreciation: number
  /** Closing costs paid when buying, percent of price. */
  buyingCostPct: number
  /** Agent and closing costs paid when selling at the end of the window, percent of sale price. */
  sellingCostPct: number
}

export interface RentVsOwnYear {
  year: number
  rentCost: number
  buyCost: number
  principalPaid: number
  equity: number
  difference: number
  /** Cumulative cost of renting, including the return the deposit could have earned. */
  netRentCost: number
  /** Cumulative cost of buying after selling: outflows, buying and selling costs and forgone return, minus equity gained. */
  netBuyCost: number
}

export interface RentVsOwnResults {
  rentTotalCost: number
  buyTotalCost: number
  netRentCost: number
  netBuyCost: number
  /** First year buying costs no more than renting, or null when that never happens inside the window. */
  breakEvenYears: number | null
  analysisYears: number
  monthlyRentEquivalent: number
  annualComparison: RentVsOwnYear[]
  recommendation: string
  explanation: string
}

export function describeRecommendation(
  breakEvenYears: number | null,
  analysisYears: number,
): { recommendation: string; explanation: string } {
  if (breakEvenYears === null) {
    return {
      recommendation: "Renting may be more cost-effective",
      explanation: `Buying does not break even within ${analysisYears} ${analysisYears === 1 ? "year" : "years"} with these numbers. Staying longer, a lower price or a bigger rent increase would change that.`,
    }
  }
  if (breakEvenYears <= 3) {
    return {
      recommendation: "Buying is likely the better choice",
      explanation: `You break even in year ${breakEvenYears}, making buying financially advantageous if you stay at least that long.`,
    }
  }
  if (breakEvenYears <= 7) {
    return {
      recommendation: "Buying could be beneficial",
      explanation: `Buying breaks even in year ${breakEvenYears}, so it may be worthwhile if you plan to stay long-term.`,
    }
  }
  return {
    recommendation: "Renting may be more cost-effective",
    explanation: `Buying only breaks even in year ${breakEvenYears}, so renting could be cheaper in the short to medium term.`,
  }
}

const finite = (n: number, fallback = 0) => (Number.isFinite(n) ? n : fallback)

/**
 * Compare renting with buying over a fixed window. Costs are cumulative and
 * undiscounted; the only time value of money included is the return forgone on
 * cash that buying (down payment, buying costs) or renting (deposit) ties up.
 */
export function calculateRentVsOwn(inputs: RentVsOwnInputs): RentVsOwnResults {
  const analysisYears = Math.max(1, Math.min(60, Math.floor(finite(inputs.analysisYears, 1))))
  const homePrice = Math.max(0, finite(inputs.homePrice))
  const downPayment = Math.min(homePrice, Math.max(0, finite(inputs.downPayment)))
  const loanAmount = homePrice - downPayment
  const loanTerm = Math.max(0, finite(inputs.loanTerm))
  const termMonths = Math.round(loanTerm * 12)
  const monthlyRate = finite(inputs.interestRate) / 100 / 12
  const monthlyPayment = loanAmount > 0 && termMonths > 0 ? calculateMonthlyPI(loanAmount, inputs.interestRate, loanTerm) : 0
  const returnRate = finite(inputs.investmentReturn) / 100
  const appreciation = finite(inputs.homeAppreciation) / 100
  const rentGrowth = finite(inputs.rentIncrease) / 100

  const programMI =
    loanAmount > 0
      ? getProgramMI(inputs.program, loanAmount, homePrice, clampCreditScore(inputs.creditScore), loanTerm, downPayment).monthlyMI
      : 0
  const monthlyOwnerExtras =
    finite(inputs.propertyTax) / 12 +
    finite(inputs.homeownersInsurance) / 12 +
    finite(inputs.maintenance) / 12 +
    finite(inputs.hoa) / 12 +
    programMI
  const monthlyRentEquivalent = monthlyPayment + monthlyOwnerExtras

  const buyingCosts = homePrice * (Math.max(0, finite(inputs.buyingCostPct)) / 100)
  const sellingPct = Math.max(0, finite(inputs.sellingCostPct)) / 100
  const deposit = Math.max(0, finite(inputs.securityDeposit))
  const cashTiedUpBuying = downPayment + buyingCosts

  const annualComparison: RentVsOwnYear[] = []
  let rentTotalCost = 0
  let buyTotalCost = 0
  let currentRent = Math.max(0, finite(inputs.monthlyRent))
  let homeValue = homePrice
  let balance = loanAmount
  let month = 0
  let breakEvenYears: number | null = null

  for (let year = 1; year <= analysisYears; year++) {
    const annualRentCost = currentRent * 12 + Math.max(0, finite(inputs.rentersInsurance))
    rentTotalCost += annualRentCost
    currentRent *= 1 + rentGrowth

    let annualBuyCost = 0
    let principalPaid = 0
    for (let m = 0; m < 12; m++) {
      month += 1
      annualBuyCost += monthlyOwnerExtras
      if (month <= termMonths && balance > 0) {
        const interest = balance * monthlyRate
        const principal = Math.min(balance, monthlyPayment - interest)
        balance -= principal
        principalPaid += principal
        annualBuyCost += monthlyPayment
      }
    }
    buyTotalCost += annualBuyCost
    homeValue *= 1 + appreciation

    const equity = Math.max(0, homeValue - balance)
    const growth = Math.pow(1 + returnRate, year) - 1
    const netRentCost = rentTotalCost + deposit * growth
    const netBuyCost =
      buyTotalCost + buyingCosts + homeValue * sellingPct + cashTiedUpBuying * growth - (equity - downPayment)

    annualComparison.push({
      year,
      rentCost: annualRentCost,
      buyCost: annualBuyCost,
      principalPaid,
      equity,
      difference: annualBuyCost - annualRentCost,
      netRentCost,
      netBuyCost,
    })

    if (breakEvenYears === null && netBuyCost <= netRentCost) breakEvenYears = year
  }

  const last = annualComparison[annualComparison.length - 1]
  return {
    rentTotalCost,
    buyTotalCost,
    netRentCost: last.netRentCost,
    netBuyCost: last.netBuyCost,
    breakEvenYears,
    analysisYears,
    monthlyRentEquivalent,
    annualComparison,
    ...describeRecommendation(breakEvenYears, analysisYears),
  }
}
