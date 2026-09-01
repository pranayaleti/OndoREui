"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { COST_OF_LIVING_STORAGE_KEY } from "@/lib/cost-of-living-defaults"
import { cn } from "@/lib/utils"
import {
  calculateCostOfLiving,
  createDefaultState,
  stateHasSubstantialInput,
  suggestedChildrenExpenses,
  suggestedGroceries,
  suggestedMobile,
  suggestedPetsExpenses,
  withVehicleCount,
  type CostOfLivingState,
} from "@/lib/cost-of-living"
import { HousingStep } from "./housing-step"
import { TransportationStep } from "./transportation-step"
import {
  ChildrenStep,
  DebtStep,
  FoodStep,
  HealthcareStep,
  HouseholdStep,
  IncomeStep,
  InsuranceStep,
  LifestyleStep,
  PetsStep,
  UtilitiesStep,
} from "./expense-steps"
import { ProgressStepper, type StepDefinition } from "./progress-stepper"
import { MobileSummaryBar, SummaryPanel } from "./summary-panel"

const ALL_STEPS: StepDefinition[] = [
  { id: "household", label: "Household" },
  { id: "income", label: "Income" },
  { id: "housing", label: "Housing" },
  { id: "transportation", label: "Transportation" },
  { id: "utilities", label: "Utilities" },
  { id: "food", label: "Food" },
  { id: "insurance", label: "Insurance" },
  { id: "healthcare", label: "Health" },
  { id: "children", label: "Children" },
  { id: "pets", label: "Pets" },
  { id: "debt", label: "Debt" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "results", label: "Summary" },
]

function visibleStepsFor(state: CostOfLivingState): StepDefinition[] {
  return ALL_STEPS.filter((step) => {
    if (step.id === "children") return state.household.children > 0
    if (step.id === "pets") return state.household.pets > 0
    return true
  })
}

function parseStoredState(raw: string | null): CostOfLivingState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CostOfLivingState
    if (!parsed?.household || !parsed?.housing) return null
    return { ...createDefaultState(), ...parsed, household: { ...createDefaultState().household, ...parsed.household } }
  } catch {
    return null
  }
}

export function MonthlyExpenseCalculator() {
  const baselineRef = useRef(createDefaultState())
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [state, setState] = useState<CostOfLivingState>(baselineRef.current)
  const [currentStep, setCurrentStep] = useState("household")
  const [hydrated, setHydrated] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [isLgUp, setIsLgUp] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = parseStoredState(window.localStorage.getItem(COST_OF_LIVING_STORAGE_KEY))
    if (stored) setState(stored)
    setHydrated(true)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const sync = () => setIsLgUp(window.innerWidth >= 1024)
    sync()
    mql.addEventListener("change", sync)
    window.addEventListener("resize", sync)
    return () => {
      mql.removeEventListener("change", sync)
      window.removeEventListener("resize", sync)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(COST_OF_LIVING_STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota */
    }
  }, [state, hydrated])

  const result = useMemo(() => calculateCostOfLiving(state), [state])
  const steps = useMemo(() => visibleStepsFor(state), [state])

  useEffect(() => {
    if (!steps.some((step) => step.id === currentStep)) {
      setCurrentStep(steps[0]?.id ?? "household")
    }
  }, [steps, currentStep])

  const goTo = useCallback((id: string) => {
    setCurrentStep(id)
    if (id === "results") setHasCalculated(true)
    headingRef.current?.focus()
  }, [])

  const updateHousehold = (household: CostOfLivingState["household"]) => {
    setState((prev) => {
      const next = { ...prev, household }
      if (prev.utilities.mobile === suggestedMobile(prev.household.adults)) {
        next.utilities = { ...next.utilities, mobile: suggestedMobile(household.adults) }
      }
      if (prev.food.groceries === suggestedGroceries(prev.household.adults, prev.household.children)) {
        next.food = { ...next.food, groceries: suggestedGroceries(household.adults, household.children) }
      }
      if (JSON.stringify(prev.children) === JSON.stringify(suggestedChildrenExpenses(prev.household.children))) {
        next.children = suggestedChildrenExpenses(household.children)
      }
      if (JSON.stringify(prev.pets) === JSON.stringify(suggestedPetsExpenses(prev.household.pets))) {
        next.pets = suggestedPetsExpenses(household.pets)
      }
      return next
    })
  }

  const reset = () => {
    const fresh = createDefaultState()
    baselineRef.current = fresh
    setState(fresh)
    setCurrentStep("household")
    setHasCalculated(false)
    try {
      window.localStorage.removeItem(COST_OF_LIVING_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const requestReset = () => {
    if (stateHasSubstantialInput(state, baselineRef.current)) {
      setConfirmReset(true)
      return
    }
    reset()
  }

  const stepIndex = Math.max(0, steps.findIndex((step) => step.id === currentStep))
  const isLast = currentStep === "results"
  const nextStep = steps[stepIndex + 1]
  const prevStep = steps[stepIndex - 1]

  const renderStep = (id: string) => {
    switch (id) {
      case "household":
        return <HouseholdStep household={state.household} onChange={updateHousehold} />
      case "income":
        return <IncomeStep income={state.income} onChange={(income) => setState((prev) => ({ ...prev, income }))} />
      case "housing":
        return (
          <HousingStep
            state={state}
            onChange={(housing) => setState((prev) => ({ ...prev, housing }))}
            principalAndInterest={result.housing.principalAndInterest}
            housingTotal={result.housing.total}
          />
        )
      case "transportation":
        return (
          <TransportationStep
            state={state}
            vehicleTotals={result.vehicleTotals}
            onVehicleCountChange={(count) => setState((prev) => withVehicleCount(prev, count))}
            onVehiclesChange={(vehicles) => setState((prev) => ({ ...prev, vehicles }))}
            onOtherChange={(otherTransport) => setState((prev) => ({ ...prev, otherTransport }))}
          />
        )
      case "utilities":
        return (
          <UtilitiesStep
            values={state.utilities}
            includedInHousing={result.inclusions.utilitiesInHousing}
            onChange={(utilities) => setState((prev) => ({ ...prev, utilities }))}
          />
        )
      case "food":
        return <FoodStep values={state.food} onChange={(food) => setState((prev) => ({ ...prev, food }))} />
      case "insurance":
        return (
          <InsuranceStep
            values={state.insurance}
            result={result}
            mode={state.housing.mode}
            includedAmounts={{
              auto: state.vehicles.reduce((sum, vehicle) => sum + vehicle.insurance, 0),
              homeowners: result.housing.homeownersInsurance,
              renters: result.housing.rentersInsurance,
              health: state.healthcare.healthInsurance,
            }}
            onChange={(insurance) => setState((prev) => ({ ...prev, insurance }))}
          />
        )
      case "healthcare":
        return (
          <HealthcareStep
            healthcare={state.healthcare}
            personal={state.personal}
            onHealthcareChange={(healthcare) => setState((prev) => ({ ...prev, healthcare }))}
            onPersonalChange={(personal) => setState((prev) => ({ ...prev, personal }))}
          />
        )
      case "children":
        return <ChildrenStep values={state.children} onChange={(children) => setState((prev) => ({ ...prev, children }))} />
      case "pets":
        return <PetsStep values={state.pets} onChange={(pets) => setState((prev) => ({ ...prev, pets }))} />
      case "debt":
        return <DebtStep values={state.debt} onChange={(debt) => setState((prev) => ({ ...prev, debt }))} />
      case "lifestyle":
        return (
          <LifestyleStep values={state.lifestyle} onChange={(lifestyle) => setState((prev) => ({ ...prev, lifestyle }))} />
        )
      case "results":
        return (
          <SummaryPanel
            result={result}
            state={state}
            onAdjust={() => goTo("housing")}
            showCta
          />
        )
      default:
        return null
    }
  }

  const currentMeta = steps.find((step) => step.id === currentStep) ?? steps[0]

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground lg:pb-8">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/calculators" aria-label="Back to calculators" className="text-primary hover:text-primary/80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Planning tool</p>
            <h1 className="text-2xl font-bold tracking-tight">Monthly Cost of Living Calculator</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Build a realistic monthly picture — housing, transportation, utilities, food, and the rest — without
          treating suggested amounts as exact bills. Totals update as you type.
        </p>

        <ProgressStepper steps={steps} currentId={currentStep} onSelect={goTo} />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold outline-none">
                {currentMeta?.label}
              </h2>
              <Button type="button" variant="ghost" onClick={requestReset}>
                Start over
              </Button>
            </div>

            {isLgUp !== false ? (
              <div
                className={cn(
                  "rounded-lg border border-border bg-card p-6 shadow-sm",
                  isLgUp === null && "hidden lg:block",
                )}
              >
                {renderStep(currentStep)}
                <div className="mt-8 flex justify-between gap-3">
                  <Button type="button" variant="outline" disabled={!prevStep} onClick={() => prevStep && goTo(prevStep.id)}>
                    Back
                  </Button>
                  {nextStep ? (
                    <Button type="button" onClick={() => goTo(nextStep.id)}>
                      Continue
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {isLgUp !== true ? (
              <Accordion
                type="single"
                collapsible
                value={currentStep}
                onValueChange={(value) => {
                  if (value) goTo(value)
                }}
                className={cn(isLgUp === null && "lg:hidden")}
              >
                {steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="text-left">{step.label}</AccordionTrigger>
                    <AccordionContent>{currentStep === step.id ? renderStep(step.id) : null}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : null}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <SummaryPanel
                result={result}
                state={state}
                compact
                showCta
                onAdjust={() => goTo("housing")}
              />
            </div>
          </div>
        </div>
      </div>

      {!isLast ? <MobileSummaryBar total={result.expensesTotal} onViewSummary={() => goTo("results")} /> : null}

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start over?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears the numbers you entered, including anything saved on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my numbers</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>Start over</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LeadCaptureModal
        calculatorSlug="cost-of-living"
        calculatorName="Monthly Cost of Living"
        hasCalculated={hasCalculated}
      />
    </div>
  )
}
