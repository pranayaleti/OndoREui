import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleByline } from "./article-byline"

/**
 * The date line wraps a nested <time>, so the default matcher — which only sees
 * an element's own text nodes — cannot match it. Assert the full visible line.
 */
function dateLine(value: string) {
  return screen.getByText(
    (_content, element) => element?.tagName === "SPAN" && element.textContent === value,
  )
}

describe("ArticleByline", () => {
  it("names the author", () => {
    render(<ArticleByline author="Ondo Real Estate Editorial Team" published="2026-08-29" wordCount={900} />)
    expect(screen.getByText("Ondo Real Estate Editorial Team")).toBeInTheDocument()
  })

  it("shows the published date when the article has never been revised", () => {
    render(<ArticleByline author="Ondo" published="2026-08-29" wordCount={900} />)
    expect(dateLine("Published August 29, 2026")).toBeInTheDocument()
  })

  it("shows the modified date instead once the article has been revised", () => {
    render(<ArticleByline author="Ondo" published="2026-08-29" modified="2026-09-14" wordCount={900} />)
    expect(dateLine("Updated September 14, 2026")).toBeInTheDocument()
    expect(screen.queryByText(/Published/)).not.toBeInTheDocument()
  })

  it("does not shift the date across a timezone boundary", () => {
    // new Date("2026-01-01") is UTC midnight; formatting it in a US locale
    // without pinning UTC renders December 31.
    render(<ArticleByline author="Ondo" published="2026-01-01" wordCount={900} />)
    expect(dateLine("Published January 1, 2026")).toBeInTheDocument()
  })

  it("reports reading time derived from the word count", () => {
    render(<ArticleByline author="Ondo" published="2026-08-29" wordCount={900} />)
    expect(screen.getByText("4 min read")).toBeInTheDocument()
  })

  it("marks dates up as machine-readable time elements", () => {
    const { container } = render(<ArticleByline author="Ondo" published="2026-08-29" wordCount={900} />)
    expect(container.querySelector("time")).toHaveAttribute("dateTime", "2026-08-29")
  })
})
