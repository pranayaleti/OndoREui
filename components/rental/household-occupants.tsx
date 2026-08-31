"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emptyHouseholdOccupant, type HouseholdOccupant } from "@/lib/rental-application"

export function HouseholdOccupants({
  occupants,
  onChange,
}: {
  occupants: HouseholdOccupant[]
  onChange: (next: HouseholdOccupant[]) => void
}) {
  const rows = occupants.length > 0 ? occupants : [emptyHouseholdOccupant()]

  function patch(index: number, nextRow: HouseholdOccupant) {
    onChange(rows.map((row, i) => (i === index ? nextRow : row)))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        List other people who will live here. Add every additional adult or occupant. Each adult
        completes their own application when required.
      </p>
      {rows.map((occupant, index) => (
        <div key={`occupant-${index}`} className="space-y-3 rounded-xl border border-border p-4" data-testid={`household-occupant-${index}`}>
          <p className="font-medium">Occupant {index + 1}</p>
          <div>
            <Label htmlFor={`occ-name-${index}`}>Name</Label>
            <Input
              id={`occ-name-${index}`}
              className="mt-1"
              value={occupant.fullName ?? ""}
              onChange={(e) => patch(index, { ...occupant, fullName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`occ-rel-${index}`}>Relationship</Label>
            <Input
              id={`occ-rel-${index}`}
              className="mt-1"
              value={occupant.relationship ?? ""}
              onChange={(e) => patch(index, { ...occupant, relationship: e.target.value })}
            />
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(occupant.isAdult)}
              onChange={(e) => patch(index, { ...occupant, isAdult: e.target.checked })}
            />
            This person is 18 or older
          </label>
          {rows.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              Remove occupant
            </Button>
          ) : null}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        onClick={() => onChange([...rows, emptyHouseholdOccupant()])}
      >
        Add another occupant
      </Button>
    </div>
  )
}
