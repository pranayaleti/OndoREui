import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UtahArrivalDesk } from "./utah-arrival-desk"

// The real ContactLeadForm is mounted on purpose: a mocked form cannot show
// whether changing the arrival path, workplace or city wipes what was typed.
vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ message: "ok", leadId: "1" })) }
})

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/moving-to-utah/",
  }
})

describe("UtahArrivalDesk with the real lead form", () => {
  it("keeps the name, email and phone a visitor typed when path, workplace or city change", () => {
    render(<UtahArrivalDesk />)
    const form = document.querySelector("form") as HTMLFormElement
    expect(form).not.toBeNull()
    const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement
    expect(nameInput).not.toBeNull()
    expect(emailInput).not.toBeNull()

    fireEvent.change(nameInput, { target: { value: "Test Person" } })
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })

    fireEvent.click(screen.getByLabelText(/a home is staying behind/i))
    fireEvent.click(screen.getByRole("button", { name: /hill afb/i }))
    fireEvent.change(screen.getByLabelText(/type a workplace/i), { target: { value: "Provo" } })
    const cityRadios = within(screen.getByRole("radiogroup", { name: /housing city/i })).getAllByRole("radio")
    fireEvent.click(cityRadios[cityRadios.length - 1]!)

    // Same DOM nodes, same values: the form was updated in place, not remounted.
    const after = document.querySelector("form") as HTMLFormElement
    expect(after).toBe(form)
    expect((after.querySelector('input[name="name"]') as HTMLInputElement).value).toBe("Test Person")
    expect((after.querySelector('input[name="email"]') as HTMLInputElement).value).toBe("test@example.com")
  })
})
