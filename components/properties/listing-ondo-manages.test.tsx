import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  LISTING_ONDO_MANAGES_BODY,
  LISTING_ONDO_MANAGES_HEADING,
  ListingOndoManages,
} from "./listing-ondo-manages"

describe("ListingOndoManages", () => {
  it("states that Ondo is the manager without yield or neighborhood claims", () => {
    render(<ListingOndoManages />)

    expect(screen.getByRole("heading", { name: LISTING_ONDO_MANAGES_HEADING })).toBeInTheDocument()
    expect(screen.getByText(LISTING_ONDO_MANAGES_BODY)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /ask leasing/i })).toHaveAttribute("href", "#listing-inquire")
    expect(screen.queryByText(/set it and forget it|guaranteed income|high-yield/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/safe neighborhood|good schools|crime/i)).not.toBeInTheDocument()
  })
})
