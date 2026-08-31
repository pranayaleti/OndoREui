import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PetAnimals } from "./pet-animals"
import { emptyPetAnimal, type PetAnimal } from "@/lib/rental-application"

describe("PetAnimals", () => {
  it("lists more than one animal and adds another row", () => {
    const animals: PetAnimal[] = [
      { name: "Miso", type: "cat", breed: "DSH", isAssistanceAnimal: false },
      { name: "Guide", type: "dog", isAssistanceAnimal: true },
    ]
    const onChange = vi.fn()
    render(<PetAnimals animals={animals} onChange={onChange} />)

    expect(screen.getByDisplayValue("Miso")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Guide")).toBeInTheDocument()
    expect(screen.getByText(/Assistance animals are not pets/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /add another animal/i }))
    expect(onChange).toHaveBeenCalledWith([...animals, emptyPetAnimal()])
  })

  it("removes an animal row", () => {
    const animals: PetAnimal[] = [{ name: "Miso" }, { name: "Guide", isAssistanceAnimal: true }]
    const onChange = vi.fn()
    render(<PetAnimals animals={animals} onChange={onChange} />)

    fireEvent.click(screen.getAllByRole("button", { name: /remove animal/i })[1]!)
    expect(onChange).toHaveBeenCalledWith([{ name: "Miso" }])
  })
})
