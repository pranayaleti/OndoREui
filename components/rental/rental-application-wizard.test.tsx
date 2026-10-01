import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { RentalApplicationWizard } from "./rental-application-wizard"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))
vi.mock("@/lib/analytics", () => ({ analytics: { trackEvent: vi.fn() } }))
vi.mock("@/lib/rental-analytics", () => ({ trackRentalFunnel: vi.fn() }))
vi.mock("@/components/stripe-payment-form", () => ({ StripePaymentForm: () => null }))

vi.mock("@/lib/api/rental", () => ({
  getRentalApplication: vi.fn(),
  saveRentalProgress: vi.fn(),
  submitRentalApplication: vi.fn(),
  inviteCoApplicant: vi.fn(),
  createRentalFeeIntent: vi.fn(),
  uploadRentalDocument: vi.fn(),
}))

import {
  getRentalApplication,
  saveRentalProgress,
  submitRentalApplication,
  uploadRentalDocument,
  type ApplicationBundle,
} from "@/lib/api/rental"

function makeBundle(currentStep: string, wizardPayload: Record<string, unknown> = {}): ApplicationBundle {
  return {
    application: {
      id: "app-1",
      propertyId: "prop-1",
      firstName: "",
      lastName: "",
      email: "",
      status: "draft",
      statusLabel: "Draft",
      currentStep,
      completionPercent: 10,
      applicantNextAction: null,
      submittedAt: null,
      createdAt: "2026-09-01T00:00:00Z",
      updatedAt: "2026-09-01T00:00:00Z",
      wizardPayload,
    },
    property: null,
    requirements: {
      applicationFees: { applicationFeeCents: 0, screeningFeeCents: 0, otherFees: [] },
      securityDeposit: { monthsOfRent: null, amountCents: null },
      categories: [],
    },
    coApplicants: [],
    documents: [],
    checklist: [{ type: "id", label: "Photo ID", required: true, status: "required", isComplete: false }],
    events: [],
    fullyComplete: false,
    completedAdultApplicants: 0,
    requiredAdults: 1,
    nextAction: "",
  } as unknown as ApplicationBundle
}

beforeEach(() => {
  vi.mocked(getRentalApplication).mockReset()
  vi.mocked(saveRentalProgress).mockReset()
  vi.mocked(submitRentalApplication).mockReset()
  vi.mocked(uploadRentalDocument).mockReset()
})

describe("RentalApplicationWizard", () => {
  it("keeps unsaved edits when an upload refreshes the application", async () => {
    // Initial load and the post-upload refresh both return a server copy with no carrier saved yet.
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("documents"))
    vi.mocked(uploadRentalDocument).mockResolvedValue({})

    render(<RentalApplicationWizard applicationId="app-1" />)
    const carrier = (await screen.findByLabelText(/insurance carrier/i)) as HTMLInputElement
    fireEvent.change(carrier, { target: { value: "Acme Mutual" } })
    expect(carrier.value).toBe("Acme Mutual")

    const file = new File(["x"], "id.pdf", { type: "application/pdf" })
    fireEvent.change(screen.getByLabelText(/photo id/i), { target: { files: [file] } })

    await waitFor(() => expect(uploadRentalDocument).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(getRentalApplication).toHaveBeenCalledTimes(2))
    expect((screen.getByLabelText(/insurance carrier/i) as HTMLInputElement).value).toBe("Acme Mutual")
  })

  it("does not submit when the final save fails", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("submit"))
    vi.mocked(saveRentalProgress).mockRejectedValue(new Error("Could not save answers"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /submit application/i }))

    expect(await screen.findByText("Could not save answers")).toBeInTheDocument()
    expect(submitRentalApplication).not.toHaveBeenCalled()
    expect(screen.queryByText(/application received/i)).not.toBeInTheDocument()
  })

  it("submits after the final save succeeds", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("submit"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("submit"))
    vi.mocked(submitRentalApplication).mockResolvedValue({} as never)

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /submit application/i }))

    await waitFor(() => expect(submitRentalApplication).toHaveBeenCalledTimes(1))
    expect(await screen.findByText(/application received/i)).toBeInTheDocument()
  })

  it("blocks Save and continue on the applicant step until name and email are valid, with an alert", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("applicant"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("household"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    const first = await screen.findByLabelText(/first name/i)
    expect(first).toHaveAttribute("autocomplete", "given-name")
    expect(screen.getByLabelText(/last name/i)).toHaveAttribute("autocomplete", "family-name")
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute("autocomplete", "email")
    expect(screen.getByLabelText(/^phone/i)).toHaveAttribute("autocomplete", "tel")

    fireEvent.click(screen.getByRole("button", { name: /save and continue/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/first name/i)
    expect(saveRentalProgress).not.toHaveBeenCalled()

    fireEvent.change(first, { target: { value: "Ada" } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Lovelace" } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "not-an-email" } })
    fireEvent.click(screen.getByRole("button", { name: /save and continue/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i)
    expect(saveRentalProgress).not.toHaveBeenCalled()

    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "ada@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /save and continue/i }))
    await waitFor(() => expect(saveRentalProgress).toHaveBeenCalledTimes(1))
  })

  it("still lets Back save a draft with blanks", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("applicant"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("property"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /^back$/i }))
    await waitFor(() => expect(saveRentalProgress).toHaveBeenCalledTimes(1))
  })

  it("moves focus to the step heading after the step changes, not on first load", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("documents"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("authorization"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    const heading = await screen.findByRole("heading", { level: 1 })
    expect(heading).not.toHaveFocus()

    fireEvent.click(screen.getByRole("button", { name: /save and continue/i }))
    await waitFor(() => expect(saveRentalProgress).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveFocus())
  })

  it("announces save errors with role=alert", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("documents"))
    vi.mocked(saveRentalProgress).mockRejectedValue(new Error("Could not save answers"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /save and continue/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not save answers")
  })

  it("does not report the application received when the submit call fails after a good save", async () => {
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("submit"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("submit"))
    vi.mocked(submitRentalApplication).mockRejectedValue(new Error("Application is missing a required document"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /submit application/i }))

    expect(await screen.findByText("Application is missing a required document")).toBeInTheDocument()
    expect(screen.queryByText(/application received/i)).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /submit application/i })).toBeEnabled()
  })

  it("still loads and saves when the browser blocks localStorage", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.mocked(getRentalApplication).mockResolvedValue(makeBundle("documents"))
    vi.mocked(saveRentalProgress).mockResolvedValue(makeBundle("authorization"))

    render(<RentalApplicationWizard applicationId="app-1" />)
    fireEvent.click(await screen.findByRole("button", { name: /save and continue/i }))
    await waitFor(() => expect(saveRentalProgress).toHaveBeenCalledTimes(1))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it("shows a load error instead of a blank wizard when the application cannot be fetched", async () => {
    vi.mocked(getRentalApplication).mockRejectedValue(new Error("Application not found"))
    render(<RentalApplicationWizard applicationId="app-1" />)
    expect(await screen.findByText("Application not found")).toBeInTheDocument()
  })
})
