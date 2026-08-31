"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { emptyResidence, type ResidenceRecord } from "@/lib/rental-application"

export function RentalResidences({
  residences,
  onChange,
}: {
  residences: ResidenceRecord[]
  onChange: (next: ResidenceRecord[]) => void
}) {
  const rows = residences.length > 0 ? residences : [emptyResidence()]

  function patch(index: number, nextRow: ResidenceRecord) {
    onChange(rows.map((row, i) => (i === index ? nextRow : row)))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        List current and previous places you have rented. Include landlord contact so leasing can follow up.
      </p>
      {rows.map((residence, index) => (
        <div
          key={`residence-${index}`}
          className="space-y-3 rounded-xl border border-border p-4"
          data-testid={`rental-residence-${index}`}
        >
          <p className="font-medium">Residence {index + 1}</p>
          <div>
            <Label htmlFor={`res-${index}`}>Address</Label>
            <Input
              id={`res-${index}`}
              className="mt-1"
              value={residence.address ?? ""}
              onChange={(e) => patch(index, { ...residence, address: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`ll-${index}`}>Landlord name</Label>
            <Input
              id={`ll-${index}`}
              className="mt-1"
              value={residence.landlordName ?? ""}
              onChange={(e) => patch(index, { ...residence, landlordName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`llp-${index}`}>Landlord phone</Label>
            <Input
              id={`llp-${index}`}
              className="mt-1"
              value={residence.landlordPhone ?? ""}
              onChange={(e) => patch(index, { ...residence, landlordPhone: e.target.value })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`rs-${index}`}>Move-in date</Label>
              <Input
                id={`rs-${index}`}
                type="date"
                className="mt-1"
                value={residence.startDate ?? ""}
                onChange={(e) => patch(index, { ...residence, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`re-${index}`}>Move-out date</Label>
              <Input
                id={`re-${index}`}
                type="date"
                className="mt-1"
                value={residence.endDate ?? ""}
                onChange={(e) => patch(index, { ...residence, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`why-${index}`}>Reason for leaving</Label>
            <Textarea
              id={`why-${index}`}
              className="mt-1"
              value={residence.reasonForLeaving ?? ""}
              onChange={(e) => patch(index, { ...residence, reasonForLeaving: e.target.value })}
            />
          </div>
          {rows.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              Remove residence
            </Button>
          ) : null}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        onClick={() => onChange([...rows, emptyResidence()])}
      >
        Add another residence
      </Button>
    </div>
  )
}
