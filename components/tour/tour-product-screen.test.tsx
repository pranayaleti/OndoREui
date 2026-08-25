import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  TourProductScreen,
  TOUR_ASSISTANT_DISCLAIMER,
  TOUR_SAMPLE_DISCLAIMER,
  TOUR_SCREEN_IDS,
} from "./tour-product-screen"

describe("TourProductScreen", () => {
  it("renders a sample caption for every tour screen", () => {
    for (const id of TOUR_SCREEN_IDS) {
      const { unmount } = render(<TourProductScreen id={id} />)
      expect(
        screen.getByText(TOUR_SAMPLE_DISCLAIMER, { exact: false }),
      ).toBeInTheDocument()
      unmount()
    }
  })

  it("discloses that the assistant is automated and not lending advice", () => {
    render(<TourProductScreen id="assistant" />)
    expect(
      screen.getByText(TOUR_ASSISTANT_DISCLAIMER, { exact: false }),
    ).toBeInTheDocument()
  })

  it("marks the product UI as a sample, not a live account", () => {
    render(<TourProductScreen id="owner" />)
    expect(screen.getAllByText(/sample/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/screenshot coming soon/i)).not.toBeInTheDocument()
  })
})
