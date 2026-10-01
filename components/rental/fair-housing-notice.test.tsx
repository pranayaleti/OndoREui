import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { FairHousingNotice } from "./fair-housing-notice"
import { FAIR_HOUSING_STATEMENT } from "@/lib/rental-application"

describe("FairHousingNotice", () => {
  it.each([false, true])("shows the whole statement without clamping (compact=%s)", (compact) => {
    const { container } = render(<FairHousingNotice compact={compact} />)
    expect(container.textContent).toContain(FAIR_HOUSING_STATEMENT)
    expect(container.innerHTML).not.toMatch(/line-clamp/)
  })
})
