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
})
