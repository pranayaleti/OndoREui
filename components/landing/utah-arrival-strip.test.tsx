import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { UtahArrivalStrip } from "./utah-arrival-strip"

describe("UtahArrivalStrip", () => {
  it("sends homepage visitors to the arrival desk", () => {
    render(<UtahArrivalStrip />)
    expect(screen.getByRole("heading", { name: /starting a job in utah/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /open the arrival desk/i })).toHaveAttribute(
      "href",
      "/moving-to-utah/",
    )
    expect(document.body.textContent).not.toMatch(/welcoming you home|area tour|key hires/i)
  })
})
