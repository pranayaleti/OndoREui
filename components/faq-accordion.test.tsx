import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FaqAccordion, guideLink } from "./faq-accordion"

describe("FaqAccordion", () => {
  it("renders answers in the DOM with related guide links under them", () => {
    render(
      <FaqAccordion
        items={[
          { question: "Q1?", answer: "Plain answer one." },
          {
            question: "Q2?",
            answer: "Plain answer two.",
            links: [guideLink("recast-vs-refinance", "Recast vs refinance"), { label: "Qualify", href: "/qualify/" }],
          },
        ]}
      />,
    )
    expect(screen.getByText("Plain answer one.")).toBeInTheDocument()
    expect(screen.getByText(/Plain answer two\./)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Recast vs refinance" })).toHaveAttribute("href", "/blog/recast-vs-refinance/")
    expect(screen.getByRole("link", { name: "Qualify" })).toHaveAttribute("href", "/qualify/")
    expect(screen.getAllByText("Related:")).toHaveLength(1)
  })
})
