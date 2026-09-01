"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  COST_OF_LIVING_DEFAULTS as D,
  INCLUDED_IN_HOUSING,
  SUGGESTED_STARTING_POINT_HINT,
} from "@/lib/cost-of-living-defaults"
import {
  formatCurrency,
  suggestedHomeownersInsuranceMonthly,
  suggestedMaintenanceMonthly,
  suggestedPropertyTaxAnnual,
  type CostOfLivingState,
} from "@/lib/cost-of-living"
import { BuyRentToggle, CurrencyInput, NumberStepper, PercentInput } from "./fields"

type HousingStepProps = {
  state: CostOfLivingState
  onChange: (housing: CostOfLivingState["housing"]) => void
  principalAndInterest: number
  housingTotal: number
}

export function HousingStep({ state, onChange, principalAndInterest, housingTotal }: HousingStepProps) {
  const { housing } = state
  const buy = housing.buy

  const updateBuy = (patch: Partial<typeof buy>) => {
    const next = { ...buy, ...patch }
    if (patch.homePrice !== undefined) {
      const price = patch.homePrice
      if (buy.propertyTaxAnnual === suggestedPropertyTaxAnnual(buy.homePrice)) {
        next.propertyTaxAnnual = suggestedPropertyTaxAnnual(price)
      }
      if (buy.homeownersInsuranceMonthly === suggestedHomeownersInsuranceMonthly(buy.homePrice)) {
        next.homeownersInsuranceMonthly = suggestedHomeownersInsuranceMonthly(price)
      }
      if (buy.maintenanceMonthly === suggestedMaintenanceMonthly(buy.homePrice)) {
        next.maintenanceMonthly = suggestedMaintenanceMonthly(price)
      }
    }
    onChange({ ...housing, buy: next })
  }

  return (
    <div className="space-y-6">
      <BuyRentToggle value={housing.mode} onChange={(mode) => onChange({ ...housing, mode })} />

      {housing.mode === "buy" ? (
        <div className="space-y-4">
          <CurrencyInput
            label="Home price"
            value={buy.homePrice}
            onChange={(homePrice) => updateBuy({ homePrice })}
            hint={SUGGESTED_STARTING_POINT_HINT}
          />
          <PercentInput
            label="Down payment"
            value={buy.downPaymentPercent}
            onChange={(downPaymentPercent) => updateBuy({ downPaymentPercent })}
            hint={`About ${formatCurrency(buy.homePrice * (buy.downPaymentPercent / 100))} down. Example rate is not a quote.`}
          />
          <PercentInput
            label="Interest rate"
            value={buy.interestRate}
            onChange={(interestRate) => updateBuy({ interestRate })}
            max={20}
            hint={`Example ${D.housing.buy.interestRate}% — not a quote, lock, or APR.`}
          />
          <NumberStepper
            label="Loan term (years)"
            value={buy.loanTermYears}
            min={10}
            max={40}
            onChange={(loanTermYears) => updateBuy({ loanTermYears })}
            hint="Typical 15 or 30 years."
          />
          <CurrencyInput
            label="Property tax (annual)"
            value={buy.propertyTaxAnnual}
            onChange={(propertyTaxAnnual) => updateBuy({ propertyTaxAnnual })}
            hint={`${SUGGESTED_STARTING_POINT_HINT} Utah bills vary by county.`}
            suffix="/yr"
          />
          <CurrencyInput
            label="Homeowners insurance"
            value={buy.homeownersInsuranceMonthly}
            onChange={(homeownersInsuranceMonthly) => updateBuy({ homeownersInsuranceMonthly })}
            hint={`${SUGGESTED_STARTING_POINT_HINT} Counted in housing, not again under Insurance.`}
            suffix="/mo"
          />
          <CurrencyInput
            label="HOA dues"
            value={buy.hoaMonthly}
            onChange={(hoaMonthly) => updateBuy({ hoaMonthly })}
            hint="Enter 0 if you do not have an HOA."
          />
          <CurrencyInput
            label="Home maintenance"
            value={buy.maintenanceMonthly}
            onChange={(maintenanceMonthly) => updateBuy({ maintenanceMonthly })}
            hint="Suggested starting point is about 1% of price per year, divided monthly."
          />
          <dl className="grid gap-2 rounded-md border border-border bg-muted/40 p-4 text-sm">
            <div className="flex justify-between">
              <dt>Principal &amp; interest</dt>
              <dd className="tabular-nums">{formatCurrency(principalAndInterest)}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>Total housing</dt>
              <dd className="tabular-nums">{formatCurrency(housingTotal)}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="space-y-4">
          <CurrencyInput
            label="Monthly rent"
            value={housing.rent.monthlyRent}
            onChange={(monthlyRent) => onChange({ ...housing, rent: { ...housing.rent, monthlyRent } })}
            hint={SUGGESTED_STARTING_POINT_HINT}
          />
          <CurrencyInput
            label="Renters insurance"
            value={housing.rent.rentersInsuranceMonthly}
            onChange={(rentersInsuranceMonthly) =>
              onChange({ ...housing, rent: { ...housing.rent, rentersInsuranceMonthly } })
            }
            hint={`${INCLUDED_IN_HOUSING} unless you set this to $0.`}
          />
          <CurrencyInput
            label="Parking"
            value={housing.rent.parkingMonthly}
            onChange={(parkingMonthly) => onChange({ ...housing, rent: { ...housing.rent, parkingMonthly } })}
          />
          <CurrencyInput
            label="HOA / amenity fee"
            value={housing.rent.hoaAmenityMonthly}
            onChange={(hoaAmenityMonthly) => onChange({ ...housing, rent: { ...housing.rent, hoaAmenityMonthly } })}
          />
          <CurrencyInput
            label="Other housing"
            value={housing.rent.otherMonthly}
            onChange={(otherMonthly) => onChange({ ...housing, rent: { ...housing.rent, otherMonthly } })}
          />
          <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
            <Label htmlFor="utilities-included" className="text-sm font-medium">
              Utilities included in rent
            </Label>
            <Switch
              id="utilities-included"
              checked={housing.rent.utilitiesIncluded}
              onCheckedChange={(utilitiesIncluded) =>
                onChange({ ...housing, rent: { ...housing.rent, utilitiesIncluded } })
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            If utilities are included in rent, they are marked included on the Utilities step and not added again.
          </p>
          <p className="text-sm font-medium">
            Total housing: <span className="tabular-nums">{formatCurrency(housingTotal)}</span>
          </p>
        </div>
      )}
    </div>
  )
}
