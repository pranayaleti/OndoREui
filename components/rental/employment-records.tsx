"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emptyEmploymentRecord, type EmploymentRecord } from "@/lib/rental-application"

export function EmploymentRecords({
  records,
  onChange,
}: {
  records: EmploymentRecord[]
  onChange: (next: EmploymentRecord[]) => void
}) {
  const rows = records.length > 0 ? records : [emptyEmploymentRecord()]

  function patch(index: number, nextRow: EmploymentRecord) {
    onChange(rows.map((row, i) => (i === index ? nextRow : row)))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add each current and recent job. Self-employed work uses the same fields — list the business name as
        the employer.
      </p>
      {rows.map((job, index) => (
        <div key={`job-${index}`} className="space-y-3 rounded-xl border border-border p-4" data-testid={`employment-record-${index}`}>
          <p className="font-medium">Job {index + 1}</p>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(job.selfEmployed)}
              onChange={(e) => patch(index, { ...job, selfEmployed: e.target.checked })}
            />
            I am self-employed
          </label>
          <div>
            <Label htmlFor={`emp-${index}`}>Employer or business</Label>
            <Input
              id={`emp-${index}`}
              className="mt-1"
              value={job.employer ?? ""}
              onChange={(e) => patch(index, { ...job, employer: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`title-${index}`}>Title</Label>
            <Input
              id={`title-${index}`}
              className="mt-1"
              value={job.title ?? ""}
              onChange={(e) => patch(index, { ...job, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`duration-${index}`}>Duration</Label>
            <Input
              id={`duration-${index}`}
              className="mt-1"
              placeholder="For example, 2 years"
              value={job.duration ?? ""}
              onChange={(e) => patch(index, { ...job, duration: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor={`inc-${index}`}>Monthly income (USD)</Label>
            <Input
              id={`inc-${index}`}
              className="mt-1"
              inputMode="decimal"
              value={job.monthlyIncomeCents != null ? String(job.monthlyIncomeCents / 100) : ""}
              onChange={(e) => {
                const n = Number(e.target.value)
                patch(index, {
                  ...job,
                  monthlyIncomeCents: e.target.value.trim() && Number.isFinite(n) ? Math.round(n * 100) : null,
                })
              }}
            />
          </div>
          {rows.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              className="min-h-11"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              Remove job
            </Button>
          ) : null}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        onClick={() => onChange([...rows, emptyEmploymentRecord()])}
      >
        Add another job
      </Button>
    </div>
  )
}
