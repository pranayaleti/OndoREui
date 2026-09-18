import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ProsCons } from "./pros-cons"

const pros = ["Keeps the seller's lower rate.", "Lower closing costs."]
const cons = ["You must cover the seller's equity.", "Lender approval still applies."]

describe("ProsCons", () => {
  it("renders both columns with their items", () => {
    render(<ProsCons pros={pros} cons={cons} />)
    expect(screen.getByText("Keeps the seller's lower rate.")).toBeInTheDocument()
    expect(screen.getByText("Lender approval still applies.")).toBeInTheDocument()
  })

  it("labels each column so the two lists are distinguishable", () => {
    render(<ProsCons pros={pros} cons={cons} />)
    expect(screen.getByRole("list", { name: "Pros" })).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "Cons" })).toBeInTheDocument()
  })

  it("accepts custom column headings", () => {
    render(<ProsCons pros={pros} cons={cons} prosHeading="Why it helps" consHeading="Why it might not" />)
    expect(screen.getByRole("list", { name: "Why it helps" })).toBeInTheDocument()
    expect(screen.getByRole("list", { name: "Why it might not" })).toBeInTheDocument()
  })

  it("renders one column when the other is empty", () => {
    render(<ProsCons pros={pros} cons={[]} />)
    expect(screen.getByRole("list", { name: "Pros" })).toBeInTheDocument()
    expect(screen.queryByRole("list", { name: "Cons" })).not.toBeInTheDocument()
  })

  it("renders nothing when both columns are empty", () => {
    const { container } = render(<ProsCons pros={[]} cons={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
