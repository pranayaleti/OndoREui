import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CITY_MARKET_AS_OF } from "@/lib/city-market-data"
import { ServiceAreaSection } from "./service-area-section"

describe("ServiceAreaSection city coverage", () => {
  it("shows Salt Lake City market stats without hover", () => {
    render(<ServiceAreaSection />)
    expect(screen.getByRole("link", { name: /^city guide$/i })).toHaveAttribute(
      "href",
      "/locations/salt-lake-city/",
    )
    expect(screen.getByText(/\$1,650\/mo/)).toBeInTheDocument()
    expect(screen.queryByText(/hover over a city/i)).not.toBeInTheDocument()
  })

  it("filters to a typed city and updates median rent for phones", () => {
    render(<ServiceAreaSection />)
    fireEvent.change(screen.getByLabelText(/find your city/i), { target: { value: "Lehi" } })
    expect(screen.getByRole("link", { name: /^lehi$/i })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /^ogden$/i })).not.toBeInTheDocument()
    expect(screen.getAllByText("Lehi").length).toBeGreaterThan(0)
    expect(screen.getByRole("link", { name: /^city guide$/i })).toHaveAttribute("href", "/locations/lehi/")
  })

  it("keeps city pills at a 44px minimum tap target", () => {
    render(<ServiceAreaSection />)
    const links = screen.getAllByRole("link")
    const pillLinks = links.filter((l) => l.className.includes("rounded-full"))
    expect(pillLinks.length).toBeGreaterThan(0)
    pillLinks.forEach((l) => expect(l.className).toMatch(/min-h-11/))
  })

  it("stamps median rent with the Ondo city-median as-of date", () => {
    render(<ServiceAreaSection />)
    expect(screen.getByText(new RegExp(CITY_MARKET_AS_OF))).toBeInTheDocument()
    expect(screen.getByText(/as of .+ — verify/i)).toBeInTheDocument()
    expect(screen.getByText(/not an mls pull/i)).toBeInTheDocument()
  })

  it("does not change the stats card or announce it when a city pill is hovered or focused", () => {
    const { container } = render(<ServiceAreaSection />)
    const lehi = screen.getByRole("link", { name: /^lehi$/i })
    fireEvent.pointerEnter(lehi)
    fireEvent.focus(lehi)
    expect(screen.getByRole("link", { name: /^city guide$/i })).toHaveAttribute(
      "href",
      "/locations/salt-lake-city/",
    )
    expect(container.querySelector("[aria-live]")).toBeNull()
  })

  it("announces the shown city once for a typed search", () => {
    render(<ServiceAreaSection />)
    expect(screen.getByRole("status")).toHaveTextContent("")
    fireEvent.change(screen.getByLabelText(/find your city/i), { target: { value: "Lehi" } })
    expect(screen.getByRole("status")).toHaveTextContent("Showing market stats for Lehi.")
  })
})
