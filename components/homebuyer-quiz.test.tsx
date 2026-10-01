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

  it("reports which next step the buyer takes", () => {
    render(<HomebuyerQuiz />)
    answerAll()
    const book = screen.getByRole("link", { name: /book a free call/i })
    expect(book).toHaveAttribute("data-analytics-event", "quiz_cta_click")
    expect(book).toHaveAttribute("data-analytics-category", "homebuyer_quiz")
    expect(book).toHaveAttribute("data-analytics-label", "book")
  })

  it("sends a buyer who is already under contract to the Loan Estimate second look", () => {
    render(<HomebuyerQuiz />)
    answerAll({ stage: "Under contract" })
    expect(screen.getByRole("heading", { name: /second look before you close/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /get a second look/i })).toHaveAttribute("href", "/loans/second-look/")
  })

  it("sends every answer, the estimate and the texting consent with the buyer lead", async () => {
    render(<HomebuyerQuiz />)
    answerAll()
    fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Ada Lovelace" } })
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "ada@example.com" } })
    fireEvent.change(screen.getByLabelText(/^phone/i), { target: { value: "801-555-0100" } })
    fireEvent.click(screen.getByRole("checkbox", { name: /text and call you/i }))
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
    expect(payload.message).toMatch(/Text consent given: \d{4}-\d{2}-\d{2}T/)
    expect(payload.message).toContain("Reply STOP to cancel or HELP for help")
    expect(await screen.findByText(/we'll reach out/i)).toBeInTheDocument()
  })

  it("keeps an earlier answer when the visitor goes back", () => {
    render(<HomebuyerQuiz />)
    choose("Making offers now")
    fireEvent.click(screen.getByRole("button", { name: /back/i }))
    expect(screen.getByRole("radio", { name: "Making offers now" })).toHaveAttribute("aria-checked", "true")
  })

  it("moves between answers with the arrow keys without choosing, and has one tab stop", () => {
    render(<HomebuyerQuiz />)
    const radios = screen.getAllByRole("radio")
    expect(radios.filter((radio) => radio.tabIndex === 0)).toHaveLength(1)
    radios[0]!.focus()
    fireEvent.keyDown(radios[0]!, { key: "ArrowDown" })
    expect(radios[1]).toHaveFocus()
    // Arrow keys only move focus: the question has not advanced.
    expect(screen.getByText(/question 1 of/i)).toBeInTheDocument()
    fireEvent.keyDown(radios[1]!, { key: "End" })
    expect(radios[radios.length - 1]).toHaveFocus()
  })

  it("keeps Send enabled on the follow-up form and says what is missing", () => {
    render(<HomebuyerQuiz />)
    answerAll()
    const send = screen.getByRole("button", { name: /send my results/i })
    expect(send).toBeEnabled()
    fireEvent.click(send)
    expect(screen.getByLabelText(/^email/i)).toHaveAccessibleDescription("Enter your email.")
    expect(screen.getByLabelText(/^name/i)).toHaveAccessibleDescription("Enter your name.")
    expect(submitContactLead).not.toHaveBeenCalled()
  })
})
