import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { RenterPath } from "./renter-path"

describe("RenterPath", () => {
  it("explains find, review, and apply on listings", () => {
    render(<RenterPath />)
    expect(screen.getByRole("heading", { name: /how to rent with ondo/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /tour or apply/i })).toHaveAttribute("href", "#ask-leasing")
    expect(screen.getByText(/equal housing opportunity/i)).toBeInTheDocument()
    expect(screen.queryByText(/get notified of new listings/i)).not.toBeInTheDocument()
  })

  it("points listing-detail readers at written requirements", () => {
    render(<RenterPath variant="listing-detail" />)
    expect(screen.getByText(/application requirements/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /review requirements/i })).toHaveAttribute("href", "#listing-apply")
  })
})
