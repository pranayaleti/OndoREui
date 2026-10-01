import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const postReadiness = vi.fn()
vi.mock("@/lib/api/rental", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api/rental")>()),
  postReadiness: (...args: unknown[]) => postReadiness(...args),
}))

import { ReadinessForm } from "./readiness-form"

const result = (outcome: "ready" | "needs_more") => ({
  outcome,
  headline: outcome === "ready" ? "You have what this property asks for" : "A few things to line up",
  body: "Details",
  missing: [],
  notes: [],
})

describe("ReadinessForm", () => {
  beforeEach(() => postReadiness.mockReset())

  it("does not ask about assistance animals and says accommodations can be requested any time", () => {
    render(<ReadinessForm propertyId="p1" onReady={() => {}} />)
    expect(screen.queryByRole("checkbox", { name: /request an assistance animal/i })).not.toBeInTheDocument()
    expect(screen.getByText(/do not need to tell us here about an assistance animal/i)).toBeInTheDocument()
  })

  it("never sends an assistance-animal answer", async () => {
    postReadiness.mockResolvedValue(result("ready"))
    render(<ReadinessForm propertyId="p1" onReady={() => {}} />)
    fireEvent.click(screen.getByRole("button", { name: /check your application requirements/i }))
    await waitFor(() => expect(postReadiness).toHaveBeenCalledTimes(1))
    expect(postReadiness.mock.calls[0]![1].hasAssistanceAnimal).toBe(false)
  })

  it("keeps a way to apply after every outcome", async () => {
    const onReady = vi.fn()
    postReadiness.mockResolvedValue(result("needs_more"))
    render(<ReadinessForm propertyId="p1" onReady={onReady} />)
    fireEvent.click(screen.getByRole("button", { name: /check your application requirements/i }))
    const apply = await screen.findByRole("button", { name: /apply anyway/i })
    fireEvent.click(apply)
    expect(onReady).toHaveBeenCalledTimes(1)
  })

  it("labels the button Start application when ready", async () => {
    postReadiness.mockResolvedValue(result("ready"))
    render(<ReadinessForm propertyId="p1" onReady={() => {}} />)
    fireEvent.click(screen.getByRole("button", { name: /check your application requirements/i }))
    expect(await screen.findByRole("button", { name: /start application/i })).toBeInTheDocument()
  })
})
