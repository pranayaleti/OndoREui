"use client"

import {
  COST_OF_LIVING_DEFAULTS as D,
  MAX_VEHICLES,
  SUGGESTED_STARTING_POINT_HINT,
  TYPICAL_ESTIMATE_HINT,
} from "@/lib/cost-of-living-defaults"
import { formatCurrency, type CostOfLivingState, type VehicleState } from "@/lib/cost-of-living"
import { CurrencyInput, NumberStepper, SuggestedValueInput } from "./fields"

type TransportationStepProps = {
  state: CostOfLivingState
  vehicleTotals: Array<{ id: string; total: number }>
  onVehicleCountChange: (count: number) => void
  onVehiclesChange: (vehicles: VehicleState[]) => void
  onOtherChange: (other: CostOfLivingState["otherTransport"]) => void
}

function updateVehicle(vehicles: VehicleState[], id: string, patch: Partial<VehicleState>): VehicleState[] {
  return vehicles.map((vehicle) => (vehicle.id === id ? { ...vehicle, ...patch } : vehicle))
}

export function TransportationStep({
  state,
  vehicleTotals,
  onVehicleCountChange,
  onVehiclesChange,
  onOtherChange,
}: TransportationStepProps) {
  const { vehicles, otherTransport } = state

  return (
    <div className="space-y-8">
      <NumberStepper
        label="Vehicles"
        value={vehicles.length}
        min={0}
        max={MAX_VEHICLES}
        onChange={onVehicleCountChange}
        hint="Adds or removes a car card immediately."
      />

      <div className="space-y-4">
        {vehicles.map((vehicle, index) => {
          const total = vehicleTotals.find((item) => item.id === vehicle.id)?.total ?? 0
          return (
            <article
              key={vehicle.id}
              className="min-w-0 overflow-hidden rounded-lg border border-border p-4"
              aria-labelledby={`${vehicle.id}-title`}
            >
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 id={`${vehicle.id}-title`} className="text-base font-semibold">
                  Car {index + 1}
                </h3>
                <p className="text-sm tabular-nums text-muted-foreground">{formatCurrency(total)}/mo</p>
              </div>
              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                <SuggestedValueInput
                  label="Car payment"
                  value={vehicle.payment}
                  suggested={D.vehicle.payment}
                  onChange={(payment) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { payment }))}
                  hint={TYPICAL_ESTIMATE_HINT}
                />
                <SuggestedValueInput
                  label="Auto insurance"
                  value={vehicle.insurance}
                  suggested={D.vehicle.insurance}
                  onChange={(insurance) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { insurance }))}
                  hint={`${TYPICAL_ESTIMATE_HINT} Counted here, not again under Insurance.`}
                />
                <SuggestedValueInput
                  label="Gas"
                  value={vehicle.gas}
                  suggested={D.vehicle.gas}
                  onChange={(gas) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { gas }))}
                  hint={TYPICAL_ESTIMATE_HINT}
                />
                <SuggestedValueInput
                  label="Maintenance"
                  value={vehicle.maintenance}
                  suggested={D.vehicle.maintenance}
                  onChange={(maintenance) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { maintenance }))}
                  hint={TYPICAL_ESTIMATE_HINT}
                />
                <SuggestedValueInput
                  label="Registration / taxes"
                  value={vehicle.registrationMonthly}
                  suggested={D.vehicle.registrationMonthly}
                  onChange={(registrationMonthly) =>
                    onVehiclesChange(updateVehicle(vehicles, vehicle.id, { registrationMonthly }))
                  }
                  hint="Typical monthly share of an annual registration bill."
                />
                <SuggestedValueInput
                  label="Parking / tolls"
                  value={vehicle.parkingTolls}
                  suggested={D.vehicle.parkingTolls}
                  onChange={(parkingTolls) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { parkingTolls }))}
                  hint={TYPICAL_ESTIMATE_HINT}
                />
                <SuggestedValueInput
                  label="Other"
                  value={vehicle.other}
                  suggested={D.vehicle.other}
                  onChange={(other) => onVehiclesChange(updateVehicle(vehicles, vehicle.id, { other }))}
                />
              </div>
            </article>
          )
        })}
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold">Other transportation</h3>
        <p className="mb-3 text-xs text-muted-foreground">{SUGGESTED_STARTING_POINT_HINT}</p>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <CurrencyInput
            label="Public transit"
            value={otherTransport.publicTransit}
            onChange={(publicTransit) => onOtherChange({ ...otherTransport, publicTransit })}
          />
          <CurrencyInput
            label="Rideshare"
            value={otherTransport.rideshare}
            onChange={(rideshare) => onOtherChange({ ...otherTransport, rideshare })}
          />
          <CurrencyInput
            label="Bike / scooter"
            value={otherTransport.bikeScooter}
            onChange={(bikeScooter) => onOtherChange({ ...otherTransport, bikeScooter })}
          />
          <CurrencyInput
            label="Train"
            value={otherTransport.train}
            onChange={(train) => onOtherChange({ ...otherTransport, train })}
          />
          <CurrencyInput
            label="Other"
            value={otherTransport.other}
            onChange={(other) => onOtherChange({ ...otherTransport, other })}
          />
        </div>
      </div>
    </div>
  )
}
