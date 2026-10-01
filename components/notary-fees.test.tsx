import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { NotaryFees } from "./notary-fees"

describe("NotaryFees", () => {
  it("publishes no scheduling surcharge on a remote notarial act", () => {
    const { container } = render(<NotaryFees />)
    const text = container.textContent ?? ""
    expect(text).toContain("$25 per act")
    expect(text).not.toMatch(/\+\$25|\+\$40|Weekend or holiday|plus same-day or after-hours/i)
    expect(text).not.toMatch(/Total \$(50|65)\b/)
  })
})
