import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { CoApplicantClient } from "./co-applicant-client"

const getCoApplicantInvite = vi.fn()
const saveCoApplicantProgress = vi.fn()

vi.mock("next/navigation", () => ({ useParams: () => ({}) }))
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))
vi.mock("@/lib/api/rental", () => ({
  getCoApplicantInvite: (...args: unknown[]) => getCoApplicantInvite(...args),
  saveCoApplicantProgress: (...args: unknown[]) => saveCoApplicantProgress(...args),
}))

const validInvite = { coApplicant: { id: "c1", firstName: "A", lastName: "B", email: "a@b.co", wizardPayload: {} } }

describe("CoApplicantClient", () => {
  beforeEach(() => {
    getCoApplicantInvite.mockReset()
    saveCoApplicantProgress.mockReset().mockResolvedValue({})
  })

  it("shows a loading state, not the form, while the invite is checked", () => {
    getCoApplicantInvite.mockReturnValue(new Promise(() => {}))
    render(<CoApplicantClient token="tok" />)
    expect(screen.getByRole("status")).toHaveTextContent(/checking your invite/i)
    expect(screen.queryByRole("button", { name: /save my application/i })).not.toBeInTheDocument()
  })

  it("hides the form and offers a contact path when the invite is invalid", async () => {
    getCoApplicantInvite.mockRejectedValue(new Error("This invite has expired"))
    render(<CoApplicantClient token="tok" />)
    expect(await screen.findByRole("alert")).toHaveTextContent("This invite has expired")
    expect(screen.queryByRole("button", { name: /save my application/i })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute("href", "/contact/")
    expect(document.querySelector('a[href^="tel:"]')).not.toBeNull()
  })

  it("keeps submit disabled until a phone and all four authorizations are given", async () => {
    getCoApplicantInvite.mockResolvedValue(validInvite)
    render(<CoApplicantClient token="tok" />)
    const submit = await screen.findByRole("button", { name: /save my application/i })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "801-555-0100" } })
    const boxes = screen.getAllByRole("checkbox")
    expect(boxes).toHaveLength(4)
    boxes.slice(0, 3).forEach((box) => fireEvent.click(box))
    expect(submit).toBeDisabled()
    fireEvent.click(boxes[3]!)
    expect(submit).toBeEnabled()

    fireEvent.click(submit)
    await waitFor(() => expect(saveCoApplicantProgress).toHaveBeenCalledTimes(1))
    expect(saveCoApplicantProgress.mock.calls[0]![1]).toMatchObject({
      applicant: { phone: "801-555-0100" },
      authorizations: { credit: true, background: true, rental: true, employment: true },
    })
    expect(await screen.findByText(/your portion is saved/i)).toBeInTheDocument()
  })

  it("does not submit with a blank phone even if every box is checked", async () => {
    getCoApplicantInvite.mockResolvedValue(validInvite)
    render(<CoApplicantClient token="tok" />)
    const submit = await screen.findByRole("button", { name: /save my application/i })
    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box))
    expect(submit).toBeDisabled()
  })

  it("keeps the form and shows the error when saving fails, without claiming it was saved", async () => {
    getCoApplicantInvite.mockResolvedValue(validInvite)
    saveCoApplicantProgress.mockRejectedValue(new Error("Could not save"))
    render(<CoApplicantClient token="tok" />)
    const submit = await screen.findByRole("button", { name: /save my application/i })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "801-555-0100" } })
    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box))
    fireEvent.click(submit)
    expect(await screen.findByText("Could not save")).toBeInTheDocument()
    expect(screen.queryByText(/your portion is saved/i)).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save my application/i })).toBeEnabled()
  })

  it("treats a missing token as an invalid invite without calling the API", async () => {
    render(<CoApplicantClient />)
    expect(await screen.findByRole("alert")).toHaveTextContent(/not valid/i)
    expect(getCoApplicantInvite).not.toHaveBeenCalled()
  })

  it("does not look up the static-export placeholder token", () => {
    render(<CoApplicantClient token="_" />)
    expect(getCoApplicantInvite).not.toHaveBeenCalled()
    expect(screen.getByRole("status")).toHaveTextContent(/checking your invite/i)
  })

  it("starts from a phone number the invite already holds and keeps the saved answers", async () => {
    getCoApplicantInvite.mockResolvedValue({
      coApplicant: { ...validInvite.coApplicant, wizardPayload: { applicant: { phone: "801-555-0111", firstName: "A" }, other: 1 } },
    })
    render(<CoApplicantClient token="tok" />)
    const phone = (await screen.findByLabelText(/phone/i)) as HTMLInputElement
    expect(phone.value).toBe("801-555-0111")
    screen.getAllByRole("checkbox").forEach((box) => fireEvent.click(box))
    fireEvent.click(screen.getByRole("button", { name: /save my application/i }))
    await waitFor(() => expect(saveCoApplicantProgress).toHaveBeenCalledTimes(1))
    expect(saveCoApplicantProgress.mock.calls[0]![1]).toMatchObject({ other: 1, applicant: { phone: "801-555-0111", firstName: "A" } })
  })
})
