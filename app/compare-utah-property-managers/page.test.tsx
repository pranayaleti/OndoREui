import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import CompareUtahPropertyManagersPage from "./page"

describe("Compare Utah property managers page", () => {
  it("lists Rentomatic at the advertised $159/mo flat and $0 placement as of Aug 2026", () => {
    render(<CompareUtahPropertyManagersPage />)
    expect(screen.getAllByText(/\$159/).length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/\$89–\$129/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/\$0 placement/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/\$0 signup/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/not disclosed/i)).toBeInTheDocument()
  })

  it("tells readers to verify competitor figures before relying on them", () => {
    render(<CompareUtahPropertyManagersPage />)
    expect(screen.getAllByText(/verify/i).length).toBeGreaterThan(0)
  })

  it("does not describe Rentomatic as AppFolio-based", () => {
    render(<CompareUtahPropertyManagersPage />)
    const rentomaticHeader = screen.getByRole("columnheader", { name: /rentomatic/i })
    expect(rentomaticHeader).toBeInTheDocument()
    expect(screen.queryByText(/AppFolio-based/i)).not.toBeInTheDocument()
  })

  it("does not say Ondo waives a setup fee that pricing says does not exist", () => {
    render(<CompareUtahPropertyManagersPage />)
    expect(screen.queryByText(/waives the setup fee/i)).not.toBeInTheDocument()
    expect(screen.getByText(/none — onboarding is included/i)).toBeInTheDocument()
  })
})
