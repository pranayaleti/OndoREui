import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { RenterPath } from "./renter-path"

describe("RenterPath", () => {
  it("explains tour-then-invite on listings without cloning competitor apply copy", () => {
    render(<RenterPath />)
    expect(screen.getByRole("heading", { name: /how to rent with ondo/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /request a showing/i })).toHaveAttribute("href", "#ask-leasing")
    expect(screen.getByText(/apply by invite/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing opportunity/i)).toBeInTheDocument()
    expect(screen.queryByText(/apply online/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/schedule a tour/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/get notified of new listings/i)).not.toBeInTheDocument()
  })

  it("uses tighter copy on a listing detail without a public Apply CTA", () => {
    render(<RenterPath variant="listing-detail" />)
    expect(screen.getByText(/screening links go out/i)).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /^apply$/i })).not.toBeInTheDocument()
  })
})
