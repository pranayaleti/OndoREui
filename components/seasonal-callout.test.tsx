import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SeasonalCallout } from "./seasonal-callout"

describe("SeasonalCallout", () => {
  it("renders all four seasons with the city name interpolated", () => {
    render(<SeasonalCallout cityName="Lehi" audience="owner" />)
    expect(screen.getByRole("heading", { name: /four-season wasatch guide for lehi/i })).toBeInTheDocument()
    expect(screen.getByText("Winter in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Spring in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Summer in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Fall in Lehi")).toBeInTheDocument()
  })

  it("keeps operational tips only — no freeze-day stats or tenant-quality claims", () => {
    render(<SeasonalCallout cityName="Lehi" audience="owner" />)
    const text = document.body.textContent ?? ""
    expect(text).toMatch(/furnace/i)
    expect(text).not.toMatch(/\d+\s+freeze/i)
    expect(text).not.toMatch(/energy bills? (up|down|increase)/i)
    expect(text).not.toMatch(/quality tenants/i)
  })
})
