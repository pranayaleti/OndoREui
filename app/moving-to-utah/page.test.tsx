import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import MovingToUtahPage from "./page"

vi.mock("@/components/seo", () => ({
  default: () => null,
}))

vi.mock("@/components/contact/contact-lead-form", () => ({
  ContactLeadForm: () => <div data-testid="lead-form" />,
}))

describe("Moving to Utah page", () => {
  it("opens on the workplace question, not a luxury brochure hero", () => {
    render(<MovingToUtahPage />)
    expect(
      screen.getByRole("heading", { name: /where will you spend the workweek/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /housing cities by weekday drive/i })).toBeInTheDocument()
    expect(screen.getByText(/nmls id on file/i)).toBeInTheDocument()
    expect(screen.getAllByText(/equal housing opportunity/i).length).toBeGreaterThan(0)
    expect(document.body.textContent).not.toMatch(
      /welcoming you home|area tour|settling in|pitch deck|quality tenants/i,
    )
  })
})
