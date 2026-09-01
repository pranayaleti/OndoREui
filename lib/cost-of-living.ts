/**
 * Pure calculation engine for the monthly cost of living calculator.
 * UI must not re-implement these formulas. Suggested dollar amounts live in
 * cost-of-living-defaults.ts — this file only sanitizes, sums, and excludes
 * double-counted lines.
 */
import { calculateMaxLoanFromPayment, calculateMonthlyPI } from "@/lib/mortgage-utils"
import {
  COST_OF_LIVING_DEFAULTS as D,
  HOUSING_BUDGET_HIGH_RATIO,
  HOUSING_BUDGET_LOW_RATIO,
  MAX_ADULTS,
  MAX_CHILDREN,
  MAX_PETS,
  MAX_VEHICLES,
} from "@/lib/cost-of-living-defaults"

export const EXPENSE_CATEGORIES = [
  "housing",
  "transportation",
  "food",
  "utilities",
  "insurance",
  "healthcare",
  "personal",
  "childcare",
  "pets",
  "debt",
  "lifestyle",
  "other",
] as const

export type ExpenseCategoryId = (typeof EXPENSE_CATEGORIES)[number]

export type HousingMode = "buy" | "rent"

export type HouseholdState = {
  adults: number
  children: number
  pets: number
}

export type IncomeState = {
  primaryMonthly: number
  secondaryMonthly: number
  otherMonthly: number
  targetSavingsMonthly: number
}

export type BuyHousingState = {
  homePrice: number
  downPaymentPercent: number
  interestRate: number
  loanTermYears: number
  propertyTaxAnnual: number
  homeownersInsuranceMonthly: number
  hoaMonthly: number
  maintenanceMonthly: number
}

export type RentHousingState = {
  monthlyRent: number
  rentersInsuranceMonthly: number
  parkingMonthly: number
  hoaAmenityMonthly: number
  otherMonthly: number
  utilitiesIncluded: boolean
}

export type HousingState = {
  mode: HousingMode
  buy: BuyHousingState
  rent: RentHousingState
}

export type VehicleState = {
  id: string
  payment: number
  insurance: number
  gas: number
  maintenance: number
  registrationMonthly: number
  parkingTolls: number
  other: number
}

export type OtherTransportState = {
  publicTransit: number
  rideshare: number
  bikeScooter: number
  train: number
  other: number
}

export type NamedMonthly = Record<string, number>

export type UtilitiesState = {
  electricity: number
  naturalGas: number
  water: number
  sewer: number
  trash: number
  internet: number
  mobile: number
  streaming: number
  other: number
}

export type FoodState = {
  groceries: number
  diningOut: number
  takeout: number
  coffee: number
  alcoholEntertainment: number
  other: number
}

export type InsuranceState = {
  auto: number
  homeowners: number
  renters: number
  health: number
  life: number
  disability: number
  other: number
}

export type HealthcareState = {
  healthInsurance: number
  medical: number
  dental: number
  vision: number
  prescriptions: number
  other: number
}

export type PersonalState = {
  clothing: number
  personalCare: number
  haircuts: number
  fitness: number
  subscriptions: number
  miscellaneous: number
}

export type ChildrenExpensesState = {
  childcare: number
  school: number
  activities: number
  clothing: number
  food: number
  education: number
  other: number
}

export type PetsExpensesState = {
  food: number
  vet: number
  insurance: number
  grooming: number
  medication: number
  other: number
}

export type DebtState = {
  studentLoans: number
  creditCards: number
  personalLoans: number
  other: number
}

export type LifestyleState = {
  entertainment: number
  travel: number
  hobbies: number
  restaurants: number
  shopping: number
  subscriptions: number
  gifts: number
  other: number
}

export type CostOfLivingState = {
  household: HouseholdState
  income: IncomeState
  housing: HousingState
  vehicles: VehicleState[]
  otherTransport: OtherTransportState
  utilities: UtilitiesState
  food: FoodState
  insurance: InsuranceState
  healthcare: HealthcareState
  personal: PersonalState
  children: ChildrenExpensesState
  pets: PetsExpensesState
  debt: DebtState
  lifestyle: LifestyleState
}

export type InclusionFlags = {
  autoInsuranceInVehicles: boolean
  homeownersInsuranceInHousing: boolean
  rentersInsuranceInHousing: boolean
  utilitiesInHousing: boolean
  healthInsuranceInHealthcare: boolean
}

export type HousingBreakdown = {
  principalAndInterest: number
  propertyTax: number
  homeownersInsurance: number
  hoa: number
  maintenance: number
  rent: number
  rentersInsurance: number
  parking: number
  amenity: number
  other: number
  total: number
  loanAmount: number
  downPaymentAmount: number
}

export type VehicleBreakdown = {
  id: string
  total: number
}

export type CategorySlice = {
  id: ExpenseCategoryId
  label: string
  amount: number
  percent: number
}

export type HousingBudgetInsight = {
  lowMonthly: number
  highMonthly: number
  remainingAfterSavings: number
  impliedMaxLoan: number
  impliedMaxHomePrice: number
}

export type CostOfLivingResult = {
  incomeTotal: number
  savingsGoal: number
  housing: HousingBreakdown
  vehicleTotals: VehicleBreakdown[]
  transportation: number
  food: number
  utilities: number
  insurance: number
  healthcare: number
  personal: number
  childcare: number
  pets: number
  debt: number
  lifestyle: number
  other: number
  expensesTotal: number
  annualExpenses: number
  remaining: number
  inclusions: InclusionFlags
  slices: CategorySlice[]
  housingBudget: HousingBudgetInsight | null
}

export const CATEGORY_LABELS: Record<ExpenseCategoryId, string> = {
  housing: "Housing",
  transportation: "Transportation",
  food: "Food",
  utilities: "Utilities",
  insurance: "Insurance",
  healthcare: "Healthcare",
  personal: "Personal",
  childcare: "Childcare",
  pets: "Pets",
  debt: "Debt",
  lifestyle: "Lifestyle",
  other: "Other",
}

export function sanitizeAmount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return 0
  return value
}

export function clampInt(value: unknown, min: number, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : min
  return Math.min(max, Math.max(min, n))
}

export function signedMoney(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0
  return Math.round(value * 100) / 100
}

export function money(value: unknown): number {
  return Math.round(sanitizeAmount(value) * 100) / 100
}

export function sumRecord(values: Record<string, number>): number {
  return money(Object.values(values).reduce((sum, item) => sum + sanitizeAmount(item), 0))
}

export function formatCurrency(value: number): string {
  const n = Number.isFinite(value) ? Math.round(value) : 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPercent(value: number): string {
  const n = Number.isFinite(value) ? value : 0
  return `${n.toFixed(1)}%`
}

export function suggestedPropertyTaxAnnual(homePrice: number): number {
  return money((sanitizeAmount(homePrice) * D.housing.buy.propertyTaxRatePercent) / 100)
}

export function suggestedHomeownersInsuranceMonthly(homePrice: number): number {
  return money((sanitizeAmount(homePrice) * D.housing.buy.homeownersInsuranceRatePercent) / 100 / 12)
}

export function suggestedMaintenanceMonthly(homePrice: number): number {
  return money((sanitizeAmount(homePrice) * D.housing.buy.maintenanceRatePercent) / 100 / 12)
}

export function suggestedGroceries(adults: number, children: number): number {
  const extraAdults = Math.max(0, clampInt(adults, 1, MAX_ADULTS) - 1)
  const childCount = clampInt(children, 0, MAX_CHILDREN)
  return money(D.food.groceriesBase + extraAdults * D.food.groceriesPerExtraAdult + childCount * D.food.groceriesPerChild)
}

export function suggestedMobile(adults: number): number {
  return money(D.utilities.mobilePerAdult * clampInt(adults, 1, MAX_ADULTS))
}

export function suggestedChildrenExpenses(children: number): ChildrenExpensesState {
  const n = clampInt(children, 0, MAX_CHILDREN)
  return {
    childcare: money(D.childrenPerChild.childcare * n),
    school: money(D.childrenPerChild.school * n),
    activities: money(D.childrenPerChild.activities * n),
    clothing: money(D.childrenPerChild.clothing * n),
    food: money(D.childrenPerChild.food * n),
    education: money(D.childrenPerChild.education * n),
    other: money(D.childrenPerChild.other * n),
  }
}

export function suggestedPetsExpenses(pets: number): PetsExpensesState {
  const n = clampInt(pets, 0, MAX_PETS)
  return {
    food: money(D.petsPerPet.food * n),
    vet: money(D.petsPerPet.vet * n),
    insurance: money(D.petsPerPet.insurance * n),
    grooming: money(D.petsPerPet.grooming * n),
    medication: money(D.petsPerPet.medication * n),
    other: money(D.petsPerPet.other * n),
  }
}

export function createVehicle(index: number): VehicleState {
  return {
    id: `vehicle-${index + 1}`,
    payment: D.vehicle.payment,
    insurance: D.vehicle.insurance,
    gas: D.vehicle.gas,
    maintenance: D.vehicle.maintenance,
    registrationMonthly: D.vehicle.registrationMonthly,
    parkingTolls: D.vehicle.parkingTolls,
    other: D.vehicle.other,
  }
}

export function createDefaultState(): CostOfLivingState {
  const adults = D.household.adults
  const homePrice = D.housing.buy.homePrice
  return {
    household: { adults, children: D.household.children, pets: D.household.pets },
    income: {
      primaryMonthly: D.income.primaryMonthly,
      secondaryMonthly: D.income.secondaryMonthly,
      otherMonthly: D.income.otherMonthly,
      targetSavingsMonthly: D.income.targetSavingsMonthly,
    },
    housing: {
      mode: "buy",
      buy: {
        homePrice,
        downPaymentPercent: D.housing.buy.downPaymentPercent,
        interestRate: D.housing.buy.interestRate,
        loanTermYears: D.housing.buy.loanTermYears,
        propertyTaxAnnual: suggestedPropertyTaxAnnual(homePrice),
        homeownersInsuranceMonthly: suggestedHomeownersInsuranceMonthly(homePrice),
        hoaMonthly: D.housing.buy.hoaMonthly,
        maintenanceMonthly: suggestedMaintenanceMonthly(homePrice),
      },
      rent: {
        monthlyRent: D.housing.rent.monthlyRent,
        rentersInsuranceMonthly: D.housing.rent.rentersInsuranceMonthly,
        parkingMonthly: D.housing.rent.parkingMonthly,
        hoaAmenityMonthly: D.housing.rent.hoaAmenityMonthly,
        otherMonthly: D.housing.rent.otherMonthly,
        utilitiesIncluded: D.housing.rent.utilitiesIncluded,
      },
    },
    vehicles: [createVehicle(0)],
    otherTransport: { ...D.otherTransport },
    utilities: {
      electricity: D.utilities.electricity,
      naturalGas: D.utilities.naturalGas,
      water: D.utilities.water,
      sewer: D.utilities.sewer,
      trash: D.utilities.trash,
      internet: D.utilities.internet,
      mobile: suggestedMobile(adults),
      streaming: D.utilities.streaming,
      other: D.utilities.other,
    },
    food: {
      groceries: suggestedGroceries(adults, D.household.children),
      diningOut: D.food.diningOut,
      takeout: D.food.takeout,
      coffee: D.food.coffee,
      alcoholEntertainment: D.food.alcoholEntertainment,
      other: D.food.other,
    },
    insurance: { ...D.insurance },
    healthcare: { ...D.healthcare },
    personal: { ...D.personal },
    children: suggestedChildrenExpenses(0),
    pets: suggestedPetsExpenses(0),
    debt: { ...D.debt },
    lifestyle: { ...D.lifestyle },
  }
}

export function withVehicleCount(state: CostOfLivingState, count: number): CostOfLivingState {
  const nextCount = clampInt(count, 0, MAX_VEHICLES)
  const current = state.vehicles
  if (nextCount === current.length) return state
  if (nextCount < current.length) {
    return { ...state, vehicles: current.slice(0, nextCount) }
  }
  const added = Array.from({ length: nextCount - current.length }, (_, i) => createVehicle(current.length + i))
  return { ...state, vehicles: [...current, ...added] }
}

export function downPaymentAmount(buy: BuyHousingState): number {
  const price = sanitizeAmount(buy.homePrice)
  const pct = sanitizeAmount(buy.downPaymentPercent)
  return money(price * (Math.min(100, pct) / 100))
}

export function calculateMonthlyPISafe(principal: number, annualRatePercent: number, termYears: number): number {
  const p = sanitizeAmount(principal)
  const years = sanitizeAmount(termYears)
  if (p === 0 || years === 0) return 0
  const payment = calculateMonthlyPI(p, sanitizeAmount(annualRatePercent), years)
  return Number.isFinite(payment) ? money(payment) : 0
}

export function calculateHousingExpenses(housing: HousingState): HousingBreakdown {
  const empty: HousingBreakdown = {
    principalAndInterest: 0,
    propertyTax: 0,
    homeownersInsurance: 0,
    hoa: 0,
    maintenance: 0,
    rent: 0,
    rentersInsurance: 0,
    parking: 0,
    amenity: 0,
    other: 0,
    total: 0,
    loanAmount: 0,
    downPaymentAmount: 0,
  }

  if (housing.mode === "buy") {
    const down = downPaymentAmount(housing.buy)
    const loan = money(Math.max(0, sanitizeAmount(housing.buy.homePrice) - down))
    const principalAndInterest = calculateMonthlyPISafe(loan, housing.buy.interestRate, housing.buy.loanTermYears)
    const propertyTax = money(sanitizeAmount(housing.buy.propertyTaxAnnual) / 12)
    const homeownersInsurance = money(housing.buy.homeownersInsuranceMonthly)
    const hoa = money(housing.buy.hoaMonthly)
    const maintenance = money(housing.buy.maintenanceMonthly)
    const total = money(principalAndInterest + propertyTax + homeownersInsurance + hoa + maintenance)
    return {
      ...empty,
      principalAndInterest,
      propertyTax,
      homeownersInsurance,
      hoa,
      maintenance,
      total,
      loanAmount: loan,
      downPaymentAmount: down,
    }
  }

  if (housing.mode === "rent") {
    const rent = money(housing.rent.monthlyRent)
    const rentersInsurance = money(housing.rent.rentersInsuranceMonthly)
    const parking = money(housing.rent.parkingMonthly)
    const amenity = money(housing.rent.hoaAmenityMonthly)
    const other = money(housing.rent.otherMonthly)
    const total = money(rent + rentersInsurance + parking + amenity + other)
    return { ...empty, rent, rentersInsurance, parking, amenity, other, total }
  }

  const _exhaustive: never = housing.mode
  return _exhaustive
}

export function calculateVehicleExpenses(vehicle: VehicleState): number {
  return money(
    sanitizeAmount(vehicle.payment) +
      sanitizeAmount(vehicle.insurance) +
      sanitizeAmount(vehicle.gas) +
      sanitizeAmount(vehicle.maintenance) +
      sanitizeAmount(vehicle.registrationMonthly) +
      sanitizeAmount(vehicle.parkingTolls) +
      sanitizeAmount(vehicle.other),
  )
}

export function calculateTransportationExpenses(
  vehicles: VehicleState[],
  other: OtherTransportState,
): { vehicleTotals: VehicleBreakdown[]; total: number } {
  const vehicleTotals = vehicles.map((vehicle) => ({
    id: vehicle.id,
    total: calculateVehicleExpenses(vehicle),
  }))
  const otherTotal = sumRecord(other)
  const total = money(vehicleTotals.reduce((sum, item) => sum + item.total, 0) + otherTotal)
  return { vehicleTotals, total }
}

export function calculateFoodExpenses(food: FoodState): number {
  return sumRecord(food)
}

export function inclusionFlags(state: CostOfLivingState): InclusionFlags {
  const autoInsuranceInVehicles = state.vehicles.some((vehicle) => sanitizeAmount(vehicle.insurance) > 0)
  const homeownersInsuranceInHousing =
    state.housing.mode === "buy" && sanitizeAmount(state.housing.buy.homeownersInsuranceMonthly) > 0
  const rentersInsuranceInHousing =
    state.housing.mode === "rent" && sanitizeAmount(state.housing.rent.rentersInsuranceMonthly) > 0
  const utilitiesInHousing = state.housing.mode === "rent" && state.housing.rent.utilitiesIncluded
  const healthInsuranceInHealthcare = sanitizeAmount(state.healthcare.healthInsurance) > 0
  return {
    autoInsuranceInVehicles,
    homeownersInsuranceInHousing,
    rentersInsuranceInHousing,
    utilitiesInHousing,
    healthInsuranceInHealthcare,
  }
}

export function calculateUtilitiesExpenses(utilities: UtilitiesState, utilitiesInHousing: boolean): number {
  if (utilitiesInHousing) return 0
  return sumRecord(utilities)
}

export function calculateInsuranceExpenses(insurance: InsuranceState, inclusions: InclusionFlags, mode: HousingMode): number {
  const auto = inclusions.autoInsuranceInVehicles ? 0 : money(insurance.auto)
  const homeowners = mode === "rent" || inclusions.homeownersInsuranceInHousing ? 0 : money(insurance.homeowners)
  const renters = mode === "buy" || inclusions.rentersInsuranceInHousing ? 0 : money(insurance.renters)
  const health = inclusions.healthInsuranceInHealthcare ? 0 : money(insurance.health)
  return money(auto + homeowners + renters + health + money(insurance.life) + money(insurance.disability) + money(insurance.other))
}

export function calculateHealthcareExpenses(healthcare: HealthcareState): number {
  return sumRecord(healthcare)
}

export function calculateTotalExpenses(parts: {
  housing: number
  transportation: number
  food: number
  utilities: number
  insurance: number
  healthcare: number
  personal: number
  childcare: number
  pets: number
  debt: number
  lifestyle: number
  other: number
}): number {
  return money(
    parts.housing +
      parts.transportation +
      parts.food +
      parts.utilities +
      parts.insurance +
      parts.healthcare +
      parts.personal +
      parts.childcare +
      parts.pets +
      parts.debt +
      parts.lifestyle +
      parts.other,
  )
}

export function calculateAnnualExpenses(monthly: number): number {
  return money(sanitizeAmount(monthly) * 12)
}

export function calculateRemainingIncome(incomeTotal: number, expensesTotal: number, savingsGoal: number): number {
  return signedMoney(sanitizeAmount(incomeTotal) - sanitizeAmount(expensesTotal) - sanitizeAmount(savingsGoal))
}

export function calculateHousingBudget(
  state: CostOfLivingState,
  expensesExcludingHousing: number,
): HousingBudgetInsight | null {
  const incomeTotal = money(
    sanitizeAmount(state.income.primaryMonthly) +
      sanitizeAmount(state.income.secondaryMonthly) +
      sanitizeAmount(state.income.otherMonthly),
  )
  if (incomeTotal <= 0) return null

  const savings = money(state.income.targetSavingsMonthly)
  const remainingAfterSavings = money(incomeTotal - expensesExcludingHousing - savings)
  const remainingWithoutSavings = money(incomeTotal - expensesExcludingHousing)
  const frontLow = money(incomeTotal * HOUSING_BUDGET_LOW_RATIO)
  const frontHigh = money(incomeTotal * HOUSING_BUDGET_HIGH_RATIO)
  const lowMonthly = money(Math.max(0, Math.min(frontLow, Math.max(0, remainingAfterSavings))))
  const highMonthly = money(Math.max(lowMonthly, Math.min(frontHigh, Math.max(0, remainingWithoutSavings))))

  const rate = state.housing.buy.interestRate
  const term = state.housing.buy.loanTermYears
  const impliedMaxLoan = calculateMaxLoanFromPayment(highMonthly, sanitizeAmount(rate), sanitizeAmount(term))
  const safeLoan = Number.isFinite(impliedMaxLoan) ? money(impliedMaxLoan) : 0
  const down = downPaymentAmount(state.housing.buy)
  const impliedMaxHomePrice = money(safeLoan + down)

  return {
    lowMonthly,
    highMonthly,
    remainingAfterSavings,
    impliedMaxLoan: safeLoan,
    impliedMaxHomePrice,
  }
}

function sliceFor(
  id: ExpenseCategoryId,
  amount: number,
  expensesTotal: number,
): CategorySlice | null {
  const value = money(amount)
  if (value <= 0) return null
  const percent = expensesTotal > 0 ? (value / expensesTotal) * 100 : 0
  return { id, label: CATEGORY_LABELS[id], amount: value, percent }
}

export function calculateCostOfLiving(state: CostOfLivingState): CostOfLivingResult {
  const inclusions = inclusionFlags(state)
  const housing = calculateHousingExpenses(state.housing)
  const transport = calculateTransportationExpenses(state.vehicles, state.otherTransport)
  const childrenCount = clampInt(state.household.children, 0, MAX_CHILDREN)
  const petsCount = clampInt(state.household.pets, 0, MAX_PETS)

  const food = calculateFoodExpenses(state.food)
  const utilities = calculateUtilitiesExpenses(state.utilities, inclusions.utilitiesInHousing)
  const insurance = calculateInsuranceExpenses(state.insurance, inclusions, state.housing.mode)
  const healthcare = calculateHealthcareExpenses(state.healthcare)
  const personal = sumRecord(state.personal)
  const childcare = childrenCount > 0 ? sumRecord(state.children) : 0
  const pets = petsCount > 0 ? sumRecord(state.pets) : 0
  const debt = sumRecord(state.debt)
  const lifestyle = sumRecord(state.lifestyle)
  const other = 0

  const expensesTotal = calculateTotalExpenses({
    housing: housing.total,
    transportation: transport.total,
    food,
    utilities,
    insurance,
    healthcare,
    personal,
    childcare,
    pets,
    debt,
    lifestyle,
    other,
  })

  const incomeTotal = money(
    sanitizeAmount(state.income.primaryMonthly) +
      sanitizeAmount(state.income.secondaryMonthly) +
      sanitizeAmount(state.income.otherMonthly),
  )
  const savingsGoal = money(state.income.targetSavingsMonthly)
  const remaining = calculateRemainingIncome(incomeTotal, expensesTotal, savingsGoal)
  const housingBudget = calculateHousingBudget(state, money(expensesTotal - housing.total))

  const slices = (
    [
      sliceFor("housing", housing.total, expensesTotal),
      sliceFor("transportation", transport.total, expensesTotal),
      sliceFor("food", food, expensesTotal),
      sliceFor("utilities", utilities, expensesTotal),
      sliceFor("insurance", insurance, expensesTotal),
      sliceFor("healthcare", healthcare, expensesTotal),
      sliceFor("personal", personal, expensesTotal),
      sliceFor("childcare", childcare, expensesTotal),
      sliceFor("pets", pets, expensesTotal),
      sliceFor("debt", debt, expensesTotal),
      sliceFor("lifestyle", lifestyle, expensesTotal),
      sliceFor("other", other, expensesTotal),
    ] as Array<CategorySlice | null>
  ).filter((item): item is CategorySlice => item !== null)

  return {
    incomeTotal,
    savingsGoal,
    housing,
    vehicleTotals: transport.vehicleTotals,
    transportation: transport.total,
    food,
    utilities,
    insurance,
    healthcare,
    personal,
    childcare,
    pets,
    debt,
    lifestyle,
    other,
    expensesTotal,
    annualExpenses: calculateAnnualExpenses(expensesTotal),
    remaining,
    inclusions,
    slices,
    housingBudget,
  }
}

export function exploreHomesHref(state: CostOfLivingState, result: CostOfLivingResult): string {
  if (state.housing.mode === "rent") {
    const budget = result.housingBudget?.highMonthly || result.housing.total
    const maxPrice = Math.max(0, Math.round(budget))
    return `/properties/?maxPrice=${maxPrice}`
  }
  return "/buy/"
}

export function stateHasSubstantialInput(state: CostOfLivingState, baseline: CostOfLivingState): boolean {
  if (state.household.children > 0 || state.household.pets > 0) return true
  if (state.vehicles.length !== baseline.vehicles.length) return true
  if (state.income.primaryMonthly > 0 || state.income.secondaryMonthly > 0 || state.income.otherMonthly > 0) {
    return true
  }
  if (state.housing.mode !== baseline.housing.mode) return true
  try {
    return JSON.stringify(state) !== JSON.stringify(baseline)
  } catch {
    return true
  }
}
