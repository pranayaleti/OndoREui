import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { HomebuyerQuiz } from "./homebuyer-quiz"

function choose(name: string) {
  fireEvent.click(screen.getByRole("radio", { name }))
}

function enterAmount(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
  fireEvent.click(screen.getByRole("button", { name: /next/i }))
}

function answerAll({
  stage = "Making offers now",
  veteran = "Yes",
  income = "120000",
  debts = "0",
  down = "0",
  credit = "760+",
} = {}) {
  choose(stage)
  choose("Not yet")
  choose("Utah County")
  choose(veteran)
  enterAmount(/household income/i, income)
  enterAmount(/monthly debt/i, debts)
  enterAmount(/down payment/i, down)
  choose(credit)
}

describe("HomebuyerQuiz", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })

  // Expected figures: lib/homebuyer-quiz.test.ts solves this VA case at $515,794 and
  // $573,105; the quiz rounds to the nearest $1,000.
  it("shows an estimated price range right after the last question, with no contact wall", () => {
    render(<HomebuyerQuiz />)
    answerAll()
    expect(screen.getByRole("heading", { name: /your estimate/i })).toBeInTheDocument()
    expect(screen.getByText("$516,000")).toBeInTheDocument()
    expect(screen.getByText("$573,000")).toBeInTheDocument()
    expect(screen.getByText(/not a pre-approval/i)).toBeInTheDocument()
    expect(submitContactLead).not.toHaveBeenCalled()
  })

  it("explains a debt-limited result instead of showing a price", () => {
    render(<HomebuyerQuiz />)
    answerAll({ veteran: "No", income: "50000", debts: "2000", down: "20000", credit: "700 to 759" })
    expect(screen.getByText(/debts already use/i)).toBeInTheDocument()
    expect(screen.queryByText("Upper end")).not.toBeInTheDocument()
  })

  it("matches the next step to where the buyer is", () => {
    render(<HomebuyerQuiz />)
    answerAll({ stage: "Under contract" })
    expect(screen.getByRole("heading", { name: /questions before closing/i })).toBeInTheDocument()
  })

  it("sends every answer, the estimate and the texting consent with the buyer lead", async () => {
    render(<HomebuyerQuiz />)
    answerAll()
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Ada Lovelace" } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "ada@example.com" } })
    fireEvent.click(screen.getByRole("checkbox", { name: /text me/i }))
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const payload = submitContactLead.mock.calls[0]![0]
    expect(payload).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
      inquiryType: "buyer",
      source: "website",
    })
    expect(payload.message).toContain("Stage: Making offers now")
    expect(payload.message).toContain("OK to text: Yes")
    expect(await screen.findByText(/we'll reach out/i)).toBeInTheDocument()
  })

  it("keeps an earlier answer when the visitor goes back", () => {
    render(<HomebuyerQuiz />)
    choose("Making offers now")
    fireEvent.click(screen.getByRole("button", { name: /back/i }))
    expect(screen.getByRole("radio", { name: "Making offers now" })).toHaveAttribute("aria-checked", "true")
  })
})
