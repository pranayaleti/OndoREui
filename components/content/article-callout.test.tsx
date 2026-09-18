import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleCallout } from "./article-callout"

describe("ArticleCallout", () => {
  it("renders its body", () => {
    render(<ArticleCallout variant="tip">Ask the servicer in writing.</ArticleCallout>)
    expect(screen.getByText("Ask the servicer in writing.")).toBeInTheDocument()
  })

  it("states the variant in text, not only in colour", () => {
    render(<ArticleCallout variant="warning">Rates change.</ArticleCallout>)
    expect(screen.getByText("Warning")).toBeInTheDocument()
  })

  it("uses a distinct default label per variant", () => {
    const { rerender } = render(<ArticleCallout variant="pitfall">a</ArticleCallout>)
    expect(screen.getByText("Watch out")).toBeInTheDocument()
    rerender(<ArticleCallout variant="note">b</ArticleCallout>)
    expect(screen.getByText("Note")).toBeInTheDocument()
  })

  it("lets the caller override the label", () => {
    render(
      <ArticleCallout variant="tip" title="Ondo tip">
        body
      </ArticleCallout>,
    )
    expect(screen.getByText("Ondo tip")).toBeInTheDocument()
    expect(screen.queryByText("Tip")).not.toBeInTheDocument()
  })

  it("is a labelled region announcing what kind of callout it is", () => {
    render(<ArticleCallout variant="warning">Rates change.</ArticleCallout>)
    expect(screen.getByRole("region", { name: "Warning" })).toBeInTheDocument()
  })

  it("hides the decorative icon from assistive technology", () => {
    const { container } = render(<ArticleCallout variant="tip">body</ArticleCallout>)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })
})
