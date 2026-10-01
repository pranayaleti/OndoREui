import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StepList } from "./step-list"

const steps = [
  { title: "Get details from the seller", body: "Ask for the servicer and the note." },
  { title: "Contact the lender", body: "Confirm the loan is assumable." },
]

describe("StepList", () => {
  it("renders each step's title and body", () => {
    render(<StepList steps={steps} />)
    expect(screen.getByText("Get details from the seller")).toBeInTheDocument()
    expect(screen.getByText("Confirm the loan is assumable.")).toBeInTheDocument()
  })

  it("uses an ordered list so the sequence survives without styling", () => {
    const { container } = render(<StepList steps={steps} />)
    expect(container.querySelector("ol")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("numbers the steps in the markup rather than only in CSS", () => {
    render(<StepList steps={steps} />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("renders each step title as an h3 and uses the ids it is given", () => {
    const { container } = render(<StepList steps={steps} headingIds={["a", "b"]} />)
    const headings = Array.from(container.querySelectorAll("h3"))
    expect(headings.map((h) => h.textContent)).toEqual(steps.map((s) => s.title))
    expect(headings.map((h) => h.id)).toEqual(["a", "b"])
  })

  it("leaves the headings without an id outside an article", () => {
    const { container } = render(<StepList steps={steps} />)
    expect(container.querySelector("h3")).not.toHaveAttribute("id")
  })

  it("renders nothing when there are no steps", () => {
    const { container } = render(<StepList steps={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
