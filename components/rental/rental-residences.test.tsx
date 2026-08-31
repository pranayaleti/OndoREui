import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RentalResidences } from "./rental-residences"
import { emptyResidence, type ResidenceRecord } from "@/lib/rental-application"

describe("RentalResidences", () => {
  it("lists more than one tenancy and adds another row", () => {
    const residences: ResidenceRecord[] = [
      {
        address: "1 Main St",
        landlordName: "Prior LLC",
        landlordPhone: "8015550100",
        startDate: "2022-01-01",
        endDate: "2024-06-01",
      },
      {
        address: "2 Oak Ave",
        landlordName: "Oak Properties",
        landlordPhone: "8015550199",
        startDate: "2024-06-15",
        endDate: "",
      },
    ]
    const onChange = vi.fn()
    render(<RentalResidences residences={residences} onChange={onChange} />)

    expect(screen.getByDisplayValue("1 Main St")).toBeInTheDocument()
    expect(screen.getByDisplayValue("2 Oak Ave")).toBeInTheDocument()
    expect(screen.getByDisplayValue("8015550100")).toBeInTheDocument()
    expect(screen.getByDisplayValue("2022-01-01")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /add another residence/i }))
    expect(onChange).toHaveBeenCalledWith([...residences, emptyResidence()])
  })

  it("removes a tenancy row", () => {
    const residences: ResidenceRecord[] = [{ address: "1 Main St" }, { address: "2 Oak Ave" }]
    const onChange = vi.fn()
    render(<RentalResidences residences={residences} onChange={onChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: /remove residence/i })[1]!)
    expect(onChange).toHaveBeenCalledWith([{ address: "1 Main St" }])
  })
})
