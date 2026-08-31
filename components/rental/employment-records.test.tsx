import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { EmploymentRecords } from "./employment-records"
import { emptyEmploymentRecord, type EmploymentRecord } from "@/lib/rental-application"

describe("EmploymentRecords", () => {
  it("lists more than one job and adds another row", () => {
    const records: EmploymentRecord[] = [
      { employer: "Acme", title: "Engineer", duration: "3 years", monthlyIncomeCents: 700000 },
      { employer: "Ada Consulting", title: "Owner", duration: "1 year", selfEmployed: true, monthlyIncomeCents: 200000 },
    ]
    const onChange = vi.fn()
    render(<EmploymentRecords records={records} onChange={onChange} />)

    expect(screen.getByDisplayValue("Acme")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Ada Consulting")).toBeInTheDocument()
    expect(screen.getByDisplayValue("3 years")).toBeInTheDocument()
    expect(screen.getAllByLabelText(/self-employed/i)[1]).toBeChecked()

    fireEvent.click(screen.getByRole("button", { name: /add another job/i }))
    expect(onChange).toHaveBeenCalledWith([...records, emptyEmploymentRecord()])
  })

  it("removes a job row", () => {
    const records: EmploymentRecord[] = [{ employer: "Acme" }, { employer: "Ada Consulting" }]
    const onChange = vi.fn()
    render(<EmploymentRecords records={records} onChange={onChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: /remove job/i })[1]!)
    expect(onChange).toHaveBeenCalledWith([{ employer: "Acme" }])
  })
})
