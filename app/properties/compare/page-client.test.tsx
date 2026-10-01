import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))
vi.mock("@/lib/listing-compare", async () => {
  const actual = await vi.importActual<typeof import("@/lib/listing-compare")>("@/lib/listing-compare")
  return { ...actual, readCompareIds: () => ["a", "b"] }
})

import { ListingCompareClient } from "./page-client"
import { SITE_PHONE } from "@/lib/site"

describe("ListingCompareClient outage handling", () => {
  beforeEach(() => vi.restoreAllMocks())

  it("shows a retry state with the phone number on a 503 instead of saying saved listings are gone", async () => {
    const fn = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ data: [] }) })
    global.fetch = fn as unknown as typeof fetch

    render(<ListingCompareClient />)
    expect(await screen.findByRole("alert")).toHaveTextContent(/temporarily unavailable/i)
    expect(screen.queryByText(/no longer public/i)).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: SITE_PHONE })).toBeInTheDocument()

    // Retry re-requests the list; an empty but healthy list is the genuine "no longer public" case.
    fireEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(await screen.findByText(/no longer on the public market/i)).toBeInTheDocument()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
