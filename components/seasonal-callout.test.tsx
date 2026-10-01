import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { SeasonalCallout, getSeason } from "./seasonal-callout"

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

  it("does not render the current-season badge in server HTML", () => {
    const html = renderToString(<SeasonalCallout cityName="Lehi" audience="owner" />)
    expect(html).not.toContain("This season")
  })

  describe("after mount", () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it("highlights the current season in the browser", () => {
      vi.useFakeTimers({ toFake: ["Date"] })
      vi.setSystemTime(new Date(2026, 9, 1))
      render(<SeasonalCallout cityName="Lehi" audience="owner" />)
      const badges = screen.getAllByText("This season")
      expect(badges).toHaveLength(1)
      expect(screen.getByText("Fall in Lehi")).toContainElement(badges[0])
    })
  })

  it("maps months to seasons", () => {
    expect(getSeason(new Date(2026, 0, 15))).toBe("winter")
    expect(getSeason(new Date(2026, 2, 1))).toBe("spring")
    expect(getSeason(new Date(2026, 5, 1))).toBe("summer")
    expect(getSeason(new Date(2026, 8, 1))).toBe("fall")
    expect(getSeason(new Date(2026, 11, 31))).toBe("winter")
  })

  it("uses no em dashes in visible copy", () => {
    render(<SeasonalCallout cityName="Lehi" audience="owner" />)
    expect(document.body.textContent ?? "").not.toContain("\u2014")
  })
})
