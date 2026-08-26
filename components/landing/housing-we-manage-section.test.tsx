import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { HousingWeManageSection } from "./housing-we-manage-section"
import { OWNER_HOUSING_TYPES } from "@/lib/owner-housing-types"

describe("HousingWeManageSection", () => {
  it("renders four distinct housing types Ondo manages", () => {
    render(<HousingWeManageSection />)
    for (const type of OWNER_HOUSING_TYPES) {
      expect(screen.getByRole("heading", { name: type.title })).toBeInTheDocument()
      expect(screen.getByText(type.utahHook)).toBeInTheDocument()
    }
  })

  it("does not clone a numbered 01–06 Get analysis grid or advertise STR", () => {
    const { container } = render(<HousingWeManageSection />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/\b0[1-6]\b/)
    expect(text).not.toMatch(/get analysis/i)
    expect(text).not.toMatch(/vacation|short-term rental|Airbnb/i)
    expect(screen.queryAllByRole("link", { name: /get analysis/i })).toHaveLength(0)
  })

  it("does not use guarantee language", () => {
    const { container } = render(<HousingWeManageSection />)
    expect(container.textContent ?? "").not.toMatch(/guarantee/i)
  })
})
