import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("next/navigation", () => ({ useParams: () => ({}) }))
vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))

import { VisitConfirmClient } from "./visit-confirm-client"

const visit = {
  id: "v1",
  leadId: "l1",
  propertyId: "p1",
  proposedSlots: ["2026-10-10T17:00:00.000Z"],
  status: "proposed",
  scheduledAt: null,
  properties: { title: "Maple House", addressLine1: "1 Main St", city: "Lehi" },
}

function mockFetchSequence(...responses: Array<{ status: number; body?: unknown } | Error>) {
  const fn = vi.fn()
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r)
    else fn.mockResolvedValueOnce({ ok: r.status < 400, status: r.status, json: async () => r.body ?? {} })
  }
  global.fetch = fn as unknown as typeof fetch
}

describe("VisitConfirmClient load failures", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("says the link is invalid only when the API returns 404", async () => {
    mockFetchSequence({ status: 404 })
    render(<VisitConfirmClient token="abc" />)
    expect(await screen.findByText(/invalid or has already been used/i)).toBeInTheDocument()
  })

  it("shows a retry state on a 500, and recovers on retry", async () => {
    mockFetchSequence({ status: 500 }, { status: 200, body: visit })
    render(<VisitConfirmClient token="abc" />)
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load/i)
    expect(screen.queryByText(/invalid or has already been used/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(await screen.findByText("Choose a time")).toBeInTheDocument()
  })
})
