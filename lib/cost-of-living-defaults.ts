/**
 * Central suggested amounts and planning copy for the monthly cost of living calculator.
 * These are typical starting points, not quotes, averages for a specific city, or facts.
 */
import { DEFAULT_MORTGAGE_RATE } from "@/lib/mortgage-utils"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"

export const COST_OF_LIVING_STORAGE_KEY = "ondo:cost-of-living:v1"

export const TYPICAL_ESTIMATE_HINT =
  "Typical estimate — adjust based on your actual cost."
export const SUGGESTED_STARTING_POINT_HINT =
  "Suggested starting point — not an exact figure. Adjust to your actual expenses."
export const DONT_KNOW_YOUR_NUMBER = "Don't know your number?"
export const INCLUDED_IN_HOUSING = "Included in housing"
export const INCLUDED_IN_VEHICLES = "Included in vehicles"
export const INCLUDED_IN_HEALTHCARE = "Included in healthcare"

export const COST_OF_LIVING_PLANNING_DISCLAIMER =
  "Estimates are for planning purposes only. Actual expenses vary based on location, household size, lifestyle, insurance rates, property costs, and other individual factors."

export const COST_OF_LIVING_NOT_ADVICE =
  "This calculator is a planning tool. It is not a loan quote, credit decision, underwriting result, or financial, tax, or legal advice. You are not required to use Ondo for financing to buy or sell with Ondo."

/** Server-side template disclosure — never omit from the calculator surface. */
export const COST_OF_LIVING_LENDING_DISCLAIMER = ARRIVAL_LENDING_DISCLOSURE

export const HOUSING_BUDGET_RANGE_COPY =
  "Based on your inputs, a housing payment around {low}–{high}/month may fit within your target budget."

export const MAX_ADULTS = 12
export const MAX_CHILDREN = 10
export const MAX_PETS = 8
export const MAX_VEHICLES = 8

/** Front-end housing share used only as a planning band (not underwriting). */
export const HOUSING_BUDGET_LOW_RATIO = 0.25
export const HOUSING_BUDGET_HIGH_RATIO = 0.32

export const COST_OF_LIVING_DEFAULTS = {
  household: {
    adults: 2,
    children: 0,
    pets: 0,
  },
  income: {
    primaryMonthly: 0,
    secondaryMonthly: 0,
    otherMonthly: 0,
    targetSavingsMonthly: 0,
  },
  housing: {
    buy: {
      homePrice: 450_000,
      downPaymentPercent: 20,
      interestRate: DEFAULT_MORTGAGE_RATE,
      loanTermYears: 30,
      /** Annual tax as a percent of price — used to seed the editable dollar field. */
      propertyTaxRatePercent: 0.65,
      /** Annual homeowners insurance as a percent of price. */
      homeownersInsuranceRatePercent: 0.35,
      hoaMonthly: 0,
      /** Annual maintenance as a percent of price. */
      maintenanceRatePercent: 1,
    },
    rent: {
      monthlyRent: 1_850,
      rentersInsuranceMonthly: 18,
      parkingMonthly: 0,
      hoaAmenityMonthly: 0,
      otherMonthly: 0,
      utilitiesIncluded: false,
    },
  },
  vehicle: {
    payment: 425,
    insurance: 145,
    gas: 165,
    maintenance: 75,
    registrationMonthly: 15,
    parkingTolls: 15,
    other: 0,
  },
  otherTransport: {
    publicTransit: 0,
    rideshare: 35,
    bikeScooter: 0,
    train: 0,
    other: 0,
  },
  utilities: {
    electricity: 115,
    naturalGas: 48,
    water: 42,
    sewer: 28,
    trash: 24,
    internet: 75,
    mobilePerAdult: 55,
    streaming: 35,
    other: 0,
  },
  food: {
    groceriesBase: 380,
    groceriesPerExtraAdult: 140,
    groceriesPerChild: 110,
    diningOut: 140,
    takeout: 70,
    coffee: 35,
    alcoholEntertainment: 40,
    other: 0,
  },
  insurance: {
    auto: 0,
    homeowners: 0,
    renters: 0,
    health: 0,
    life: 35,
    disability: 0,
    other: 0,
  },
  healthcare: {
    healthInsurance: 380,
    medical: 35,
    dental: 25,
    vision: 12,
    prescriptions: 22,
    other: 0,
  },
  personal: {
    clothing: 70,
    personalCare: 35,
    haircuts: 28,
    fitness: 35,
    subscriptions: 22,
    miscellaneous: 45,
  },
  childrenPerChild: {
    childcare: 450,
    school: 40,
    activities: 70,
    clothing: 50,
    food: 80,
    education: 40,
    other: 0,
  },
  petsPerPet: {
    food: 38,
    vet: 32,
    insurance: 28,
    grooming: 22,
    medication: 12,
    other: 0,
  },
  debt: {
    studentLoans: 0,
    creditCards: 0,
    personalLoans: 0,
    other: 0,
  },
  lifestyle: {
    entertainment: 70,
    travel: 80,
    hobbies: 35,
    restaurants: 0,
    shopping: 65,
    subscriptions: 0,
    gifts: 25,
    other: 0,
  },
} as const

export type CostOfLivingDefaults = typeof COST_OF_LIVING_DEFAULTS
