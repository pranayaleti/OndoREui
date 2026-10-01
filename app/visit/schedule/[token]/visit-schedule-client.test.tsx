import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

vi.mock("next/navigation", () => ({ useParams: () => ({}) }))
vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))

import { VisitScheduleClient } from "./visit-schedule-client"
import { SITE_PHONE } from "@/lib/site"

const schedule = {
  occupancy: "vacant",
  propertyTitle: "Maple House",
  propertyCity: "Lehi",
  tourType: null,
  windows: [],
  existingVisit: null,
}

function mockFetchSequence(...responses: Array<{ status: number; body?: unknown } | Error>) {
  const fn = vi.fn()
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r)
    else fn.mockResolvedValueOnce({ ok: r.status < 400, status: r.status, json: async () => r.body ?? {} })
  }
  global.fetch = fn as unknown as typeof fetch
  return fn
}

describe("VisitScheduleClient load failures", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("says the link is invalid only when the API returns 404", async () => {
    mockFetchSequence({ status: 404 })
    render(<VisitScheduleClient token="abc" />)
    expect(await screen.findByText(/invalid or is no longer available/i)).toBeInTheDocument()
  })

  it("shows a retry state with the phone number on a 503, and recovers on retry", async () => {
    const fetchMock = mockFetchSequence({ status: 503 }, { status: 200, body: schedule })
    render(<VisitScheduleClient token="abc" />)
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not load/i)
    expect(screen.queryByText(/invalid or is no longer available/i)).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: SITE_PHONE })).toHaveAttribute("href", expect.stringMatching(/^tel:\+?\d{10,}$/))

    fireEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(await screen.findByText("Maple House, Lehi")).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })

  it("shows the retry state on a network failure", async () => {
    mockFetchSequence(new TypeError("Failed to fetch"))
    render(<VisitScheduleClient token="abc" />)
    expect(await screen.findByRole("button", { name: /try again/i })).toBeInTheDocument()
  })
})
