import { formatCents } from "@/lib/rental-application"

export function PetInformation({
  pets,
  assistanceAnimals,
}: {
  pets: {
    allowed: boolean
    maxCount: number | null
    types?: string[]
    extraDepositCents: number | null
    monthlyPetRentCents: number | null
    notes: string | null
  }
  assistanceAnimals?: { documentationMayBeRequested: boolean; additionalFeesOrDeposits: boolean }
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>
        {pets.allowed
          ? "Pets may be allowed under written property rules."
          : "This home does not list pets as allowed. Assistance animals are not pets."}
      </p>
      {pets.maxCount != null ? <p>Typical pet count, if pets are approved: {pets.maxCount}.</p> : null}
      {pets.types && pets.types.length > 0 ? <p>Listed pet types: {pets.types.join(", ")}.</p> : null}
      {pets.extraDepositCents ? <p>Pet deposit: {formatCents(pets.extraDepositCents)} (not charged for assistance animals).</p> : null}
      {pets.monthlyPetRentCents ? (
        <p>Pet rent: {formatCents(pets.monthlyPetRentCents)} / month (not charged for assistance animals).</p>
      ) : null}
      {pets.notes ? <p>{pets.notes}</p> : null}
      <p className="text-muted-foreground">
        Assistance animals that provide disability-related assistance are not pets. We do not charge pet rent or pet deposits for them.
        {assistanceAnimals?.documentationMayBeRequested
          ? " Reliable documentation of a disability-related need may be requested."
          : ""}
      </p>
    </div>
  )
}
