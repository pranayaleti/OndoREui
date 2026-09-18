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

  it("gives each step a heading that links into the outline", () => {
    const { container } = render(<StepList steps={steps} />)
    expect(container.querySelectorAll("h3")).toHaveLength(2)
  })

  it("renders nothing when there are no steps", () => {
    const { container } = render(<StepList steps={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
