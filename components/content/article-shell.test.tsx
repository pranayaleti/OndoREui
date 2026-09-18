import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleShell } from "./article-shell"

const meta = {
  path: "/blog/example-post",
  title: "An Example Post",
  description: "A description of the example post.",
  published: "2026-08-29",
  category: "Loan Programs",
}

function renderShell(children: React.ReactNode, overrides: Partial<typeof meta> = {}) {
  return render(<ArticleShell meta={{ ...meta, ...overrides }}>{children}</ArticleShell>)
}

describe("ArticleShell", () => {
  it("stamps ids on body headings so the table of contents can reach them", () => {
    const { container } = renderShell(
      <>
        <h2>What it is</h2>
        <h2>Who qualifies</h2>
      </>,
    )
    expect(container.querySelector("h2#what-it-is")).toBeInTheDocument()
    expect(container.querySelector("h2#who-qualifies")).toBeInTheDocument()
  })

  it("builds a table of contents from the body headings", () => {
    renderShell(
      <>
        <h2>What it is</h2>
        <h2>Who qualifies</h2>
      </>,
    )
    const links = screen.getAllByRole("link", { name: "Who qualifies" })
    expect(links[0]).toHaveAttribute("href", "#who-qualifies")
  })

  it("shows a byline with a default author and a reading time", () => {
    renderShell(<h2>Only heading</h2>)
    expect(screen.getByText("Ondo Real Estate Editorial Team")).toBeInTheDocument()
    expect(screen.getByText(/min read/)).toBeInTheDocument()
  })

  it("prefers an explicit author over the default", () => {
    renderShell(<h2>Only heading</h2>, { author: "Pranay Reddy Aleti" } as Partial<typeof meta>)
    expect(screen.getByText("Pranay Reddy Aleti")).toBeInTheDocument()
  })

  it("still renders the body when a post has no headings at all", () => {
    renderShell(<p>Body with no headings.</p>)
    expect(screen.getByText("Body with no headings.")).toBeInTheDocument()
  })
})
