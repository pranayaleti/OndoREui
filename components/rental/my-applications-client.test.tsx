import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

const list = vi.fn()
vi.mock("@/lib/api/rental", () => ({
  listMyRentalApplications: () => list(),
  getRentalApplication: vi.fn(),
}))

import { MyApplicationsClient } from "./my-applications-client"

describe("MyApplicationsClient headings", () => {
  it("shows the h1 while loading and once loaded", async () => {
    list.mockResolvedValue([])
    render(<MyApplicationsClient />)
    expect(screen.getByRole("heading", { level: 1, name: "My applications" })).toBeTruthy()
    await waitFor(() => expect(screen.getByText(/do not have any rental applications/)).toBeTruthy())
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  })
})
