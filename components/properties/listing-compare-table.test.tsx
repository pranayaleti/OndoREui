import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ListingCompareTable } from "./listing-compare-table"

describe("ListingCompareTable", () => {
  it("compares listed facts and does not invent a winner or neighborhood score", () => {
    render(
      <ListingCompareTable
        listings={[
          {
            publicId: "a",
            title: "Cedar Hollow",
            price: 2195,
            type: "house",
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1600,
            city: "Lehi",
            state: "UT",
            availability: "now",
            amenities: ["laundry", "parking"],
            petPolicy: {
              petsAllowed: true,
              allowedSpecies: ["dog"],
              maxPets: 1,
              maxWeightLbs: null,
              monthlyPetRentCents: 2500,
              petDepositCents: null,
            },
          },
          {
            publicId: "b",
            title: "State Street Flat",
            price: 1650,
            type: "apartment",
            bedrooms: 2,
            bathrooms: 1,
            sqft: 0,
            city: "Lehi",
            state: "UT",
            availability: null,
            amenities: [],
          },
        ]}
      />,
    )
    expect((screen.getByRole("link", { name: /cedar hollow/i }).getAttribute("href") ?? "").replace(/\/$/, "")).toBe(
      "/properties/a",
    )
    expect(screen.getByText("$2,195/mo")).toBeInTheDocument()
    expect(screen.getAllByText("Not listed").length).toBeGreaterThan(0)
    expect(screen.getByText("Ask leasing for move-in")).toBeInTheDocument()
    expect(screen.getByText("Pets allowed")).toBeInTheDocument()
    expect(screen.queryByText(/best value|walk score|great schools/i)).not.toBeInTheDocument()
  })
})
