import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { HouseholdOccupants } from "./household-occupants"
import { emptyHouseholdOccupant, type HouseholdOccupant } from "@/lib/rental-application"

describe("HouseholdOccupants", () => {
  it("lists more than one extra occupant and adds another row", () => {
    const occupants: HouseholdOccupant[] = [
      { fullName: "Ada Browser", relationship: "partner", isAdult: true },
      { fullName: "Charles Babbage", relationship: "roommate", isAdult: true },
    ]
    const onChange = vi.fn()
    render(<HouseholdOccupants occupants={occupants} onChange={onChange} />)

    expect(screen.getByDisplayValue("Ada Browser")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Charles Babbage")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /add another occupant/i }))
    expect(onChange).toHaveBeenCalledWith([...occupants, emptyHouseholdOccupant()])
  })

  it("removes an occupant row", () => {
    const occupants: HouseholdOccupant[] = [{ fullName: "Ada Browser" }, { fullName: "Charles Babbage" }]
    const onChange = vi.fn()
    render(<HouseholdOccupants occupants={occupants} onChange={onChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: /remove occupant/i })[1]!)
    expect(onChange).toHaveBeenCalledWith([{ fullName: "Ada Browser" }])
  })
})
