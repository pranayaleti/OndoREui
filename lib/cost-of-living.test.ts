import { describe, expect, it } from "vitest"
import { DEFAULT_MORTGAGE_RATE } from "@/lib/mortgage-utils"
import { COST_OF_LIVING_DEFAULTS as D, COST_OF_LIVING_LENDING_DISCLAIMER, COST_OF_LIVING_NOT_ADVICE } from "@/lib/cost-of-living-defaults"
import {
  calculateAnnualExpenses,
  calculateCostOfLiving,
  calculateHousingBudget,
  calculateHousingExpenses,
  calculateMonthlyPISafe,
  calculateRemainingIncome,
  calculateTransportationExpenses,
  calculateUtilitiesExpenses,
  createDefaultState,
  createVehicle,
  exploreHomesHref,
  formatCurrency,
  inclusionFlags,
  money,
  sanitizeAmount,
  suggestedChildrenExpenses,
  suggestedGroceries,
  suggestedPetsExpenses,
  withVehicleCount,
  type CostOfLivingState,
} from "@/lib/cost-of-living"

function buyState(overrides?: Partial<CostOfLivingState>): CostOfLivingState {
  return { ...createDefaultState(), ...overrides }
}

describe("sanitizeAmount", () => {
  it("turns empty, invalid, and negative values into 0", () => {
    expect(sanitizeAmount(undefined)).toBe(0)
    expect(sanitizeAmount(null)).toBe(0)
    expect(sanitizeAmount(Number.NaN)).toBe(0)
    expect(sanitizeAmount(Number.POSITIVE_INFINITY)).toBe(0)
    expect(sanitizeAmount(-40)).toBe(0)
    expect(sanitizeAmount(1250)).toBe(1250)
  })
})

describe("formatCurrency", () => {
  it("formats whole dollars with a thousands separator", () => {
    expect(formatCurrency(1250)).toBe("$1,250")
    expect(formatCurrency(0)).toBe("$0")
    expect(formatCurrency(Number.NaN)).toBe("$0")
    expect(formatCurrency(-100)).toBe("-$100")
  })
})

describe("buy vs rent housing", () => {
  it("computes P&I from mortgage utils for the default buy example", () => {
    const state = createDefaultState()
    const housing = calculateHousingExpenses(state.housing)
    const loan = 450_000 * 0.8
    const expectedPi = calculateMonthlyPISafe(loan, DEFAULT_MORTGAGE_RATE, 30)
    expect(housing.principalAndInterest).toBeCloseTo(expectedPi, 2)
    expect(housing.total).toBeGreaterThan(housing.principalAndInterest)
    expect(housing.homeownersInsurance).toBeGreaterThan(0)
    expect(housing.rent).toBe(0)
  })

  it("sums rent lines without P&I", () => {
    const state = createDefaultState()
    state.housing.mode = "rent"
    const housing = calculateHousingExpenses(state.housing)
    expect(housing.principalAndInterest).toBe(0)
    expect(housing.rent).toBe(D.housing.rent.monthlyRent)
    expect(housing.rentersInsurance).toBe(D.housing.rent.rentersInsuranceMonthly)
    expect(housing.total).toBe(
      money(
        D.housing.rent.monthlyRent +
          D.housing.rent.rentersInsuranceMonthly +
          D.housing.rent.parkingMonthly +
          D.housing.rent.hoaAmenityMonthly +
          D.housing.rent.otherMonthly,
      ),
    )
  })

  it("does not produce NaN when home price or term is invalid", () => {
    const state = createDefaultState()
    state.housing.buy.homePrice = Number.NaN
    state.housing.buy.loanTermYears = 0
    const housing = calculateHousingExpenses(state.housing)
    expect(Number.isFinite(housing.total)).toBe(true)
    expect(housing.principalAndInterest).toBe(0)
  })
})

describe("vehicles", () => {
  it("returns 0 transportation from vehicles when count is 0", () => {
    const empty = calculateTransportationExpenses([], {
      publicTransit: 0,
      rideshare: 0,
      bikeScooter: 0,
      train: 0,
      other: 0,
    })
    expect(empty.vehicleTotals).toEqual([])
    expect(empty.total).toBe(0)
  })

  it("adds and removes vehicle cards immediately in state", () => {
    let state = createDefaultState()
    expect(state.vehicles).toHaveLength(1)
    state = withVehicleCount(state, 3)
    expect(state.vehicles.map((v) => v.id)).toEqual(["vehicle-1", "vehicle-2", "vehicle-3"])
    state = withVehicleCount(state, 2)
    expect(state.vehicles).toHaveLength(2)
    state = withVehicleCount(state, 0)
    expect(state.vehicles).toHaveLength(0)
  })

  it("sums 1, 2, and 3 typical vehicles", () => {
    const one = calculateTransportationExpenses([createVehicle(0)], {
      publicTransit: 0,
      rideshare: 0,
      bikeScooter: 0,
      train: 0,
      other: 0,
    })
    const two = calculateTransportationExpenses([createVehicle(0), createVehicle(1)], {
      publicTransit: 0,
      rideshare: 0,
      bikeScooter: 0,
      train: 0,
      other: 0,
    })
    expect(two.total).toBeCloseTo(one.total * 2, 2)
    const three = calculateTransportationExpenses(
      [createVehicle(0), createVehicle(1), createVehicle(2)],
      { publicTransit: 10, rideshare: 0, bikeScooter: 0, train: 0, other: 0 },
    )
    expect(three.total).toBeCloseTo(one.total * 3 + 10, 2)
  })
})

describe("double-counting", () => {
  it("excludes homeowners insurance from the insurance subtotal when it is in buy housing", () => {
    const state = createDefaultState()
    state.insurance.homeowners = 400
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.homeownersInsuranceInHousing).toBe(true)
    expect(result.housing.homeownersInsurance).toBeGreaterThan(0)
    expect(result.insurance).toBe(money(state.insurance.life + state.insurance.disability + state.insurance.other))
  })

  it("excludes renters insurance from the insurance subtotal when it is in rent housing", () => {
    const state = createDefaultState()
    state.housing.mode = "rent"
    state.insurance.renters = 50
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.rentersInsuranceInHousing).toBe(true)
    expect(result.housing.rentersInsurance).toBe(D.housing.rent.rentersInsuranceMonthly)
    expect(result.insurance).not.toBeGreaterThan(money(state.insurance.life + 50))
    expect(result.insurance).toBe(money(state.insurance.life + state.insurance.disability + state.insurance.other))
  })

  it("excludes auto insurance from the insurance subtotal when vehicles already include it", () => {
    const state = createDefaultState()
    state.insurance.auto = 500
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.autoInsuranceInVehicles).toBe(true)
    expect(result.insurance).toBe(money(state.insurance.life + state.insurance.disability + state.insurance.other))
    expect(result.transportation).toBeGreaterThan(state.vehicles[0]?.insurance ?? 0)
  })

  it("counts auto insurance in insurance when no vehicle insurance is entered", () => {
    const state = withVehicleCount(createDefaultState(), 0)
    state.insurance.auto = 180
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.autoInsuranceInVehicles).toBe(false)
    expect(result.insurance).toBe(money(180 + state.insurance.life))
  })

  it("does not add utilities when they are marked included in rent", () => {
    const state = createDefaultState()
    state.housing.mode = "rent"
    state.housing.rent.utilitiesIncluded = true
    state.utilities.electricity = 200
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.utilitiesInHousing).toBe(true)
    expect(result.utilities).toBe(0)
    expect(calculateUtilitiesExpenses(state.utilities, true)).toBe(0)
  })

  it("excludes health insurance from the insurance subtotal when healthcare already has it", () => {
    const state = createDefaultState()
    state.insurance.health = 900
    const result = calculateCostOfLiving(state)
    expect(result.inclusions.healthInsuranceInHealthcare).toBe(true)
    expect(result.healthcare).toBeGreaterThan(state.healthcare.healthInsurance - 1)
    expect(result.insurance).toBe(money(state.insurance.life + state.insurance.disability + state.insurance.other))
  })
})

describe("children and pets", () => {
  it("skips children and pets categories when counts are 0", () => {
    const result = calculateCostOfLiving(createDefaultState())
    expect(result.childcare).toBe(0)
    expect(result.pets).toBe(0)
    expect(result.slices.some((slice) => slice.id === "childcare")).toBe(false)
    expect(result.slices.some((slice) => slice.id === "pets")).toBe(false)
  })

  it("includes scaled child costs only when children > 0", () => {
    const state = createDefaultState()
    state.household.children = 2
    state.children = suggestedChildrenExpenses(2)
    const result = calculateCostOfLiving(state)
    expect(result.childcare).toBeGreaterThan(0)
    expect(result.slices.some((slice) => slice.id === "childcare")).toBe(true)
  })

  it("includes pet costs only when pets > 0", () => {
    const state = createDefaultState()
    state.household.pets = 1
    state.pets = suggestedPetsExpenses(1)
    const result = calculateCostOfLiving(state)
    expect(result.pets).toBeGreaterThan(0)
    expect(result.slices.some((slice) => slice.id === "pets")).toBe(true)
  })

  it("scales grocery suggestions with household size", () => {
    expect(suggestedGroceries(1, 0)).toBe(D.food.groceriesBase)
    expect(suggestedGroceries(2, 0)).toBe(D.food.groceriesBase + D.food.groceriesPerExtraAdult)
    expect(suggestedGroceries(2, 2)).toBe(
      D.food.groceriesBase + D.food.groceriesPerExtraAdult + D.food.groceriesPerChild * 2,
    )
  })
})

describe("totals, cash flow, and budget", () => {
  it("annual expenses are 12 × monthly", () => {
    const result = calculateCostOfLiving(createDefaultState())
    expect(result.annualExpenses).toBe(calculateAnnualExpenses(result.expensesTotal))
    expect(result.annualExpenses).toBe(money(result.expensesTotal * 12))
  })

  it("remaining is income − expenses − savings", () => {
    expect(calculateRemainingIncome(8000, 5000, 500)).toBe(2500)
    expect(calculateRemainingIncome(0, 100, 0)).toBe(-100)
  })

  it("does not invent a housing budget without income", () => {
    const state = createDefaultState()
    expect(calculateHousingBudget(state, 3000)).toBeNull()
    expect(calculateCostOfLiving(state).housingBudget).toBeNull()
  })

  it("returns a planning housing range when income is provided", () => {
    const state = createDefaultState()
    state.income.primaryMonthly = 8000
    state.income.targetSavingsMonthly = 400
    const result = calculateCostOfLiving(state)
    expect(result.housingBudget).not.toBeNull()
    expect(result.housingBudget?.lowMonthly).toBeGreaterThan(0)
    expect(result.housingBudget?.highMonthly).toBeGreaterThanOrEqual(result.housingBudget?.lowMonthly ?? 0)
  })

  it("skips empty categories in the visual breakdown", () => {
    const state = withVehicleCount(createDefaultState(), 0)
    state.otherTransport = { publicTransit: 0, rideshare: 0, bikeScooter: 0, train: 0, other: 0 }
    state.debt = { studentLoans: 0, creditCards: 0, personalLoans: 0, other: 0 }
    const result = calculateCostOfLiving(state)
    expect(result.slices.every((slice) => slice.amount > 0)).toBe(true)
    expect(result.slices.some((slice) => slice.id === "debt")).toBe(false)
  })

  it("points renters at property search with maxPrice and buyers at /buy", () => {
    const rent = buyState()
    rent.housing.mode = "rent"
    const rentResult = calculateCostOfLiving(stateWith(rent))
    expect(exploreHomesHref(stateWith(rent), rentResult)).toMatch(/^\/properties\/\?maxPrice=\d+$/)

    const buy = createDefaultState()
    const buyResult = calculateCostOfLiving(buy)
    expect(exploreHomesHref(buy, buyResult)).toBe("/buy/")
  })
})

function stateWith(state: CostOfLivingState): CostOfLivingState {
  return state
}

describe("insurance helper flags", () => {
  it("treats vehicle insurance as included only when a vehicle line is positive", () => {
    const none = withVehicleCount(createDefaultState(), 0)
    expect(inclusionFlags(none).autoInsuranceInVehicles).toBe(false)
    const one = createDefaultState()
    one.vehicles[0] = { ...createVehicle(0), insurance: 0 }
    expect(inclusionFlags(one).autoInsuranceInVehicles).toBe(false)
  })
})

describe("compliance copy", () => {
  it("frames the tool as an estimate, not a loan offer", () => {
    expect(COST_OF_LIVING_LENDING_DISCLAIMER).toMatch(/NMLS ID on file/)
    expect(COST_OF_LIVING_LENDING_DISCLAIMER).toMatch(/not a commitment to lend/i)
    expect(COST_OF_LIVING_NOT_ADVICE).toMatch(/not a loan quote/i)
    expect(COST_OF_LIVING_NOT_ADVICE).not.toMatch(/you qualify/i)
  })
})
