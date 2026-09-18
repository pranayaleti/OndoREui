import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleToc } from "./article-toc"
import type { OutlineEntry } from "@/lib/content/article-outline"

const outline: OutlineEntry[] = [
  { id: "what-it-is", text: "What it is", level: 2 },
  { id: "who-qualifies", text: "Who qualifies", level: 2 },
  { id: "credit-check", text: "Credit check", level: 3 },
]

describe("ArticleToc", () => {
  it("links each heading to its anchor", () => {
    render(<ArticleToc items={outline} />)
    expect(screen.getByRole("link", { name: "What it is" })).toHaveAttribute("href", "#what-it-is")
    expect(screen.getByRole("link", { name: "Credit check" })).toHaveAttribute("href", "#credit-check")
  })

  it("exposes itself as a labelled navigation landmark", () => {
    render(<ArticleToc items={outline} />)
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument()
  })

  it("indents subheadings so the hierarchy is visible", () => {
    render(<ArticleToc items={outline} />)
    const nested = screen.getByRole("link", { name: "Credit check" }).closest("li")
    const topLevel = screen.getByRole("link", { name: "What it is" }).closest("li")
    expect(nested?.className).not.toEqual(topLevel?.className)
  })

  it("renders nothing for a single heading, which is not worth navigating", () => {
    const { container } = render(<ArticleToc items={[outline[0]]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when there are no headings", () => {
    const { container } = render(<ArticleToc items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
