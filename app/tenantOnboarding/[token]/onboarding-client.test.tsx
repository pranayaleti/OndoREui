import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

vi.mock("next/navigation", () => ({ useParams: () => ({ token: "tok" }) }))
const validate = vi.fn()
vi.mock("@/lib/api/tenantOnboarding", () => ({
  validateOnboardingToken: (t: string) => validate(t),
  completeStep: vi.fn(),
  uploadIdDocument: vi.fn(),
  triggerBackgroundCheck: vi.fn(),
  saveEmergencyContacts: vi.fn(),
}))

import { OnboardingClient } from "./onboarding-client"

describe("OnboardingClient landmarks", () => {
  beforeEach(() => {
    validate.mockReset()
  })

  it("has a main landmark and an h1 while loading", () => {
    validate.mockReturnValue(new Promise(() => {}))
    render(<OnboardingClient />)
    expect(screen.getByRole("main")).toBeTruthy()
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Tenant onboarding")
  })

  it("has an h1 in the error state", async () => {
    validate.mockResolvedValue({ error: "Bad link" })
    render(<OnboardingClient />)
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Something Went Wrong"))
    expect(screen.getAllByRole("main")).toHaveLength(1)
  })

  it("has one h1 and one main in the step flow", async () => {
    validate.mockResolvedValue({
      data: {
        id: "1",
        status: "in_progress",
        currentStep: 0,
        steps: [{ name: "welcome", label: "Welcome", status: "pending" }],
      },
    })
    render(<OnboardingClient />)
    await waitFor(() => expect(screen.getByText("Get Started")).toBeTruthy())
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole("main")).toHaveLength(1)
  })
})
