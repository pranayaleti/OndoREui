import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

const validate = vi.fn()
vi.mock("@/lib/api/invitations", () => ({ validateInviteToken: (t: string) => validate(t) }))

import InvitePageClient from "./invite-page-client"

describe("InvitePageClient landmarks", () => {
  beforeEach(() => {
    validate.mockReset()
  })

  it("has a main landmark and an h1 while validating", () => {
    validate.mockReturnValue(new Promise(() => {}))
    render(<InvitePageClient token="abc" />)
    expect(screen.getByRole("main")).toBeTruthy()
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Accept invitation")
  })

  it("has exactly one h1 for an expired invitation", async () => {
    validate.mockResolvedValue(null)
    render(<InvitePageClient token="abc" />)
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Invitation Expired"))
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole("main")).toHaveLength(1)
  })

  it("has an h1 for an invalid link and for a valid invitation", async () => {
    render(<InvitePageClient token="_" />)
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Invalid Link"))

    validate.mockResolvedValue({ role: "tenant", email: "a@b.co", propertyTitle: null, unitNumber: null })
    render(<InvitePageClient token="good" />)
    await waitFor(() => expect(screen.getByText(/You.re Invited!/)).toBeTruthy())
    expect(screen.getAllByRole("heading", { level: 1 }).some((h) => /Invited/.test(h.textContent ?? ""))).toBe(true)
  })
})
