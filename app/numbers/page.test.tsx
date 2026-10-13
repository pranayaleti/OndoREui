import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import NumbersPage, { metadata } from "./page"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("/numbers", () => {
  it("shows the rate-gap receipt before anyone gives an email", () => {
    render(<NumbersPage />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("What is this problem really costing you?")
    expect(screen.getByText(/^That 0\.5 point gap costs you \$/)).toBeInTheDocument()
  })

  it("carries the lending and real estate disclosures", () => {
    render(<NumbersPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing opportunity/i)).toBeInTheDocument()
  })

  // Reached from Instagram DMs; the indexable versions of these numbers are the /calculators/ pages.
  it("stays out of search results", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true })
  })

  it("sends the visitor's numbers as a social lead routed by the open tab", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, message: "ok", leadId: "lead-1" }), { status: 201 }),
    )
    vi.stubGlobal("fetch", fetchMock)
    render(<NumbersPage />)

    // Radix tabs switch on mousedown.
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Empty rental" }), { button: 0 })
    expect(screen.getByText("This vacancy costs you $2,600.")).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada Lovelace" } })
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Send my numbers" }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toMatch(/\/api\/leads\/contact$/)
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", source: "social", inquiryType: "owner_rental_services" })
    expect(body.message).toContain("Viewing: Empty rental")
    expect(await screen.findByText(/personal review of your numbers at ada@example.com/)).toBeInTheDocument()
  })
})
