"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emptyPetAnimal, type PetAnimal } from "@/lib/rental-application"

export function PetAnimals({
  animals,
  onChange,
}: {
  animals: PetAnimal[]
  onChange: (next: PetAnimal[]) => void
}) {
  function patch(index: number, nextRow: PetAnimal) {
    onChange(animals.map((row, i) => (i === index ? nextRow : row)))
  }

  return (
    <div className="space-y-4">
      {animals.map((animal, index) => (
        <div key={`pet-${index}`} className="space-y-3 rounded-xl border border-border p-4" data-testid={`pet-animal-${index}`}>
          <p className="font-medium">Animal {index + 1}</p>
          <div>
            <Label htmlFor={`pet-name-${index}`}>Name</Label>
            <Input
              id={`pet-name-${index}`}
              className="mt-1"
              value={animal.name ?? ""}
              onChange={(e) => patch(index, { ...animal, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`pet-type-${index}`}>Type</Label>
            <Input
              id={`pet-type-${index}`}
              className="mt-1"
              value={animal.type ?? ""}
              onChange={(e) => patch(index, { ...animal, type: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`pet-breed-${index}`}>Breed</Label>
            <Input
              id={`pet-breed-${index}`}
              className="mt-1"
              value={animal.breed ?? ""}
              onChange={(e) => patch(index, { ...animal, breed: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`pet-age-${index}`}>Age (years)</Label>
            <Input
              id={`pet-age-${index}`}
              className="mt-1"
              inputMode="decimal"
              value={animal.ageYears != null ? String(animal.ageYears) : ""}
              onChange={(e) => {
                const n = Number(e.target.value)
                patch(index, {
                  ...animal,
                  ageYears: e.target.value.trim() && Number.isFinite(n) ? n : null,
                })
              }}
            />
          </div>
          <div>
            <Label htmlFor={`pet-size-${index}`}>Size</Label>
            <Input
              id={`pet-size-${index}`}
              className="mt-1"
              value={animal.size ?? ""}
              onChange={(e) => patch(index, { ...animal, size: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`pet-docs-${index}`}>Vaccination or photo notes</Label>
            <Input
              id={`pet-docs-${index}`}
              className="mt-1"
              value={animal.docs ?? ""}
              onChange={(e) => patch(index, { ...animal, docs: e.target.value })}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Upload files on the Documents step. Assistance animal documentation is listed separately
              there.
            </p>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(animal.isAssistanceAnimal)}
              onChange={(e) => patch(index, { ...animal, isAssistanceAnimal: e.target.checked })}
            />
            This is an assistance animal (not a pet)
          </label>
          {animal.isAssistanceAnimal ? (
            <p className="text-xs text-muted-foreground">
              Assistance animals are not pets. We do not charge pet rent or pet deposits for them.
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={() => onChange(animals.filter((_, i) => i !== index))}
          >
            Remove animal
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        onClick={() => onChange([...animals, emptyPetAnimal()])}
      >
        Add another animal
      </Button>
    </div>
  )
}
