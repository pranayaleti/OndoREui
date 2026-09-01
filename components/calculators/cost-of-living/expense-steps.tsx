"use client"

import {
  INCLUDED_IN_HEALTHCARE,
  INCLUDED_IN_HOUSING,
  INCLUDED_IN_VEHICLES,
  MAX_ADULTS,
  MAX_CHILDREN,
  MAX_PETS,
  SUGGESTED_STARTING_POINT_HINT,
} from "@/lib/cost-of-living-defaults"
import type { CostOfLivingResult, CostOfLivingState } from "@/lib/cost-of-living"
import { CurrencyInput, ExpenseRow, NumberStepper } from "./fields"

type HouseholdStepProps = {
  household: CostOfLivingState["household"]
  onChange: (household: CostOfLivingState["household"]) => void
}

export function HouseholdStep({ household, onChange }: HouseholdStepProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <NumberStepper
        label="Adults"
        value={household.adults}
        min={1}
        max={MAX_ADULTS}
        onChange={(adults) => onChange({ ...household, adults })}
      />
      <NumberStepper
        label="Children"
        value={household.children}
        min={0}
        max={MAX_CHILDREN}
        onChange={(children) => onChange({ ...household, children })}
        hint="Opens a childcare section when greater than zero."
      />
      <NumberStepper
        label="Pets"
        value={household.pets}
        min={0}
        max={MAX_PETS}
        onChange={(pets) => onChange({ ...household, pets })}
        hint="Opens a pet section when greater than zero."
      />
    </div>
  )
}

type IncomeStepProps = {
  income: CostOfLivingState["income"]
  onChange: (income: CostOfLivingState["income"]) => void
}

export function IncomeStep({ income, onChange }: IncomeStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Optional. Used for cash flow and a housing budget range. Not a credit check.
      </p>
      <CurrencyInput
        label="Primary income"
        value={income.primaryMonthly}
        onChange={(primaryMonthly) => onChange({ ...income, primaryMonthly })}
        suffix="/mo"
      />
      <CurrencyInput
        label="Secondary income"
        value={income.secondaryMonthly}
        onChange={(secondaryMonthly) => onChange({ ...income, secondaryMonthly })}
        suffix="/mo"
      />
      <CurrencyInput
        label="Other income"
        value={income.otherMonthly}
        onChange={(otherMonthly) => onChange({ ...income, otherMonthly })}
        suffix="/mo"
      />
      <CurrencyInput
        label="Target monthly savings"
        value={income.targetSavingsMonthly}
        onChange={(targetSavingsMonthly) => onChange({ ...income, targetSavingsMonthly })}
        suffix="/mo"
        hint="A goal, not an expense. Subtracted after bills to show remaining cash."
      />
    </div>
  )
}

type NamedStepProps<T> = {
  values: T
  onChange: (values: T) => void
}

export function UtilitiesStep({
  values,
  includedInHousing,
  onChange,
}: NamedStepProps<CostOfLivingState["utilities"]> & { includedInHousing: boolean }) {
  if (includedInHousing) {
    return (
      <p className="rounded-md border border-border bg-muted/40 p-4 text-sm">
        {INCLUDED_IN_HOUSING}. Utility lines are not added again. Turn off “Utilities included in rent” on the Housing
        step if you pay them separately.
      </p>
    )
  }
  return (
    <div>
      <ExpenseRow label="Electricity" value={values.electricity} onChange={(electricity) => onChange({ ...values, electricity })} />
      <ExpenseRow label="Natural gas" value={values.naturalGas} onChange={(naturalGas) => onChange({ ...values, naturalGas })} />
      <ExpenseRow label="Water" value={values.water} onChange={(water) => onChange({ ...values, water })} />
      <ExpenseRow label="Sewer" value={values.sewer} onChange={(sewer) => onChange({ ...values, sewer })} />
      <ExpenseRow label="Trash" value={values.trash} onChange={(trash) => onChange({ ...values, trash })} />
      <ExpenseRow label="Internet" value={values.internet} onChange={(internet) => onChange({ ...values, internet })} />
      <ExpenseRow label="Mobile" value={values.mobile} onChange={(mobile) => onChange({ ...values, mobile })} hint="Suggested starting point scales with adults." />
      <ExpenseRow label="Streaming" value={values.streaming} onChange={(streaming) => onChange({ ...values, streaming })} />
      <ExpenseRow label="Other utilities" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function FoodStep({ values, onChange }: NamedStepProps<CostOfLivingState["food"]>) {
  return (
    <div>
      <ExpenseRow
        label="Groceries"
        value={values.groceries}
        onChange={(groceries) => onChange({ ...values, groceries })}
        hint="Suggested starting point scales with household size. Adjust to your actual cost."
      />
      <ExpenseRow label="Dining out" value={values.diningOut} onChange={(diningOut) => onChange({ ...values, diningOut })} />
      <ExpenseRow label="Takeout" value={values.takeout} onChange={(takeout) => onChange({ ...values, takeout })} />
      <ExpenseRow label="Coffee" value={values.coffee} onChange={(coffee) => onChange({ ...values, coffee })} />
      <ExpenseRow
        label="Alcohol / entertainment food"
        value={values.alcoholEntertainment}
        onChange={(alcoholEntertainment) => onChange({ ...values, alcoholEntertainment })}
      />
      <ExpenseRow label="Other food" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function InsuranceStep({
  values,
  result,
  mode,
  includedAmounts,
  onChange,
}: NamedStepProps<CostOfLivingState["insurance"]> & {
  result: CostOfLivingResult
  mode: CostOfLivingState["housing"]["mode"]
  includedAmounts: { auto: number; homeowners: number; renters: number; health: number }
}) {
  const { inclusions } = result
  return (
    <div>
      <ExpenseRow
        label="Auto insurance"
        value={inclusions.autoInsuranceInVehicles ? includedAmounts.auto : values.auto}
        onChange={(auto) => onChange({ ...values, auto })}
        includedLabel={inclusions.autoInsuranceInVehicles ? INCLUDED_IN_VEHICLES : undefined}
        hint={inclusions.autoInsuranceInVehicles ? INCLUDED_IN_VEHICLES : SUGGESTED_STARTING_POINT_HINT}
      />
      <ExpenseRow
        label="Homeowners insurance"
        value={mode === "rent" || inclusions.homeownersInsuranceInHousing ? includedAmounts.homeowners : values.homeowners}
        onChange={(homeowners) => onChange({ ...values, homeowners })}
        includedLabel={
          mode === "rent"
            ? "Not used while renting"
            : inclusions.homeownersInsuranceInHousing
              ? INCLUDED_IN_HOUSING
              : undefined
        }
      />
      <ExpenseRow
        label="Renters insurance"
        value={mode === "buy" || inclusions.rentersInsuranceInHousing ? includedAmounts.renters : values.renters}
        onChange={(renters) => onChange({ ...values, renters })}
        includedLabel={
          mode === "buy" ? "Not used while buying" : inclusions.rentersInsuranceInHousing ? INCLUDED_IN_HOUSING : undefined
        }
      />
      <ExpenseRow
        label="Health insurance"
        value={inclusions.healthInsuranceInHealthcare ? includedAmounts.health : values.health}
        onChange={(health) => onChange({ ...values, health })}
        includedLabel={inclusions.healthInsuranceInHealthcare ? INCLUDED_IN_HEALTHCARE : undefined}
      />
      <ExpenseRow label="Life insurance" value={values.life} onChange={(life) => onChange({ ...values, life })} />
      <ExpenseRow
        label="Disability insurance"
        value={values.disability}
        onChange={(disability) => onChange({ ...values, disability })}
      />
      <ExpenseRow label="Other insurance" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function HealthcareStep({
  healthcare,
  personal,
  onHealthcareChange,
  onPersonalChange,
}: {
  healthcare: CostOfLivingState["healthcare"]
  personal: CostOfLivingState["personal"]
  onHealthcareChange: (value: CostOfLivingState["healthcare"]) => void
  onPersonalChange: (value: CostOfLivingState["personal"]) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold">Healthcare</h3>
        <p className="mb-2 text-xs text-muted-foreground">
          Health insurance entered here is not added again under Insurance.
        </p>
        <ExpenseRow
          label="Health insurance"
          value={healthcare.healthInsurance}
          onChange={(healthInsurance) => onHealthcareChange({ ...healthcare, healthInsurance })}
        />
        <ExpenseRow label="Medical" value={healthcare.medical} onChange={(medical) => onHealthcareChange({ ...healthcare, medical })} />
        <ExpenseRow label="Dental" value={healthcare.dental} onChange={(dental) => onHealthcareChange({ ...healthcare, dental })} />
        <ExpenseRow label="Vision" value={healthcare.vision} onChange={(vision) => onHealthcareChange({ ...healthcare, vision })} />
        <ExpenseRow
          label="Prescriptions"
          value={healthcare.prescriptions}
          onChange={(prescriptions) => onHealthcareChange({ ...healthcare, prescriptions })}
        />
        <ExpenseRow label="Other healthcare" value={healthcare.other} onChange={(other) => onHealthcareChange({ ...healthcare, other })} />
      </div>
      <div>
        <h3 className="mb-1 text-base font-semibold">Personal</h3>
        <ExpenseRow label="Clothing" value={personal.clothing} onChange={(clothing) => onPersonalChange({ ...personal, clothing })} />
        <ExpenseRow
          label="Personal care"
          value={personal.personalCare}
          onChange={(personalCare) => onPersonalChange({ ...personal, personalCare })}
        />
        <ExpenseRow label="Haircuts" value={personal.haircuts} onChange={(haircuts) => onPersonalChange({ ...personal, haircuts })} />
        <ExpenseRow label="Fitness" value={personal.fitness} onChange={(fitness) => onPersonalChange({ ...personal, fitness })} />
        <ExpenseRow
          label="Subscriptions"
          value={personal.subscriptions}
          onChange={(subscriptions) => onPersonalChange({ ...personal, subscriptions })}
        />
        <ExpenseRow
          label="Miscellaneous"
          value={personal.miscellaneous}
          onChange={(miscellaneous) => onPersonalChange({ ...personal, miscellaneous })}
        />
      </div>
    </div>
  )
}

export function ChildrenStep({ values, onChange }: NamedStepProps<CostOfLivingState["children"]>) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">
        Suggested starting points scale with the number of children. They are not typical costs for a specific age.
      </p>
      <ExpenseRow label="Childcare" value={values.childcare} onChange={(childcare) => onChange({ ...values, childcare })} />
      <ExpenseRow label="School" value={values.school} onChange={(school) => onChange({ ...values, school })} />
      <ExpenseRow label="Activities" value={values.activities} onChange={(activities) => onChange({ ...values, activities })} />
      <ExpenseRow label="Clothing" value={values.clothing} onChange={(clothing) => onChange({ ...values, clothing })} />
      <ExpenseRow
        label="Additional child food / school lunch"
        value={values.food}
        onChange={(food) => onChange({ ...values, food })}
        hint="Groceries on the Food step already include a household grocery estimate. Use this only for extra child costs."
      />
      <ExpenseRow label="Education" value={values.education} onChange={(education) => onChange({ ...values, education })} />
      <ExpenseRow label="Other" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function PetsStep({ values, onChange }: NamedStepProps<CostOfLivingState["pets"]>) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{SUGGESTED_STARTING_POINT_HINT} Amounts scale with pet count.</p>
      <ExpenseRow label="Food" value={values.food} onChange={(food) => onChange({ ...values, food })} />
      <ExpenseRow label="Vet" value={values.vet} onChange={(vet) => onChange({ ...values, vet })} />
      <ExpenseRow label="Insurance" value={values.insurance} onChange={(insurance) => onChange({ ...values, insurance })} />
      <ExpenseRow label="Grooming" value={values.grooming} onChange={(grooming) => onChange({ ...values, grooming })} />
      <ExpenseRow label="Medication" value={values.medication} onChange={(medication) => onChange({ ...values, medication })} />
      <ExpenseRow label="Other" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function DebtStep({ values, onChange }: NamedStepProps<CostOfLivingState["debt"]>) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">Optional. Enter monthly payments, not balances.</p>
      <ExpenseRow
        label="Student loans"
        value={values.studentLoans}
        onChange={(studentLoans) => onChange({ ...values, studentLoans })}
      />
      <ExpenseRow
        label="Credit cards"
        value={values.creditCards}
        onChange={(creditCards) => onChange({ ...values, creditCards })}
      />
      <ExpenseRow
        label="Personal loans"
        value={values.personalLoans}
        onChange={(personalLoans) => onChange({ ...values, personalLoans })}
      />
      <ExpenseRow label="Other debt" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}

export function LifestyleStep({ values, onChange }: NamedStepProps<CostOfLivingState["lifestyle"]>) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">
        Optional. Restaurants and subscriptions default to $0 so they are not added on top of Food and Personal unless
        you choose to.
      </p>
      <ExpenseRow
        label="Entertainment"
        value={values.entertainment}
        onChange={(entertainment) => onChange({ ...values, entertainment })}
      />
      <ExpenseRow label="Travel" value={values.travel} onChange={(travel) => onChange({ ...values, travel })} />
      <ExpenseRow label="Hobbies" value={values.hobbies} onChange={(hobbies) => onChange({ ...values, hobbies })} />
      <ExpenseRow
        label="Restaurants (additional)"
        value={values.restaurants}
        onChange={(restaurants) => onChange({ ...values, restaurants })}
        hint="Dining out is already on the Food step. Leave $0 unless this is extra."
      />
      <ExpenseRow label="Shopping" value={values.shopping} onChange={(shopping) => onChange({ ...values, shopping })} />
      <ExpenseRow
        label="Subscriptions (additional)"
        value={values.subscriptions}
        onChange={(subscriptions) => onChange({ ...values, subscriptions })}
        hint="Personal subscriptions are already counted. Leave $0 unless this is extra."
      />
      <ExpenseRow label="Gifts" value={values.gifts} onChange={(gifts) => onChange({ ...values, gifts })} />
      <ExpenseRow label="Other lifestyle" value={values.other} onChange={(other) => onChange({ ...values, other })} />
    </div>
  )
}
