import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleShell, articleMetadata } from "./article-shell"

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

  it("renders an at-a-glance box when the post supplies takeaways", () => {
    render(
      <ArticleShell meta={{ ...meta, takeaways: ["MIP is timed from original LTV."] }}>
        <h2>Only heading</h2>
      </ArticleShell>,
    )
    expect(screen.getByRole("region", { name: "Key takeaways" })).toBeInTheDocument()
    expect(screen.getByText("MIP is timed from original LTV.")).toBeInTheDocument()
  })

  it("omits the at-a-glance box when the post supplies none", () => {
    renderShell(<h2>Only heading</h2>)
    expect(screen.queryByRole("region", { name: "Key takeaways" })).not.toBeInTheDocument()
  })

  it("still renders the body when a post has no headings at all", () => {
    renderShell(<p>Body with no headings.</p>)
    expect(screen.getByText("Body with no headings.")).toBeInTheDocument()
  })

  it("shows the lending disclosure on lending posts", () => {
    renderShell(<h2>Only heading</h2>)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
  })

  it("shows the real-estate disclosure, not the credit one, on non-lending posts", () => {
    renderShell(<h2>Only heading</h2>, { category: "Property Management" })
    expect(screen.queryByText(/not a commitment to lend/i)).not.toBeInTheDocument()
    expect(screen.getByText(/real estate services provided by ondo real estate/i)).toBeInTheDocument()
  })

  it("adds a not-advice notice on investing posts", () => {
    renderShell(<h2>Only heading</h2>, { category: "Strategy" })
    expect(screen.getByText(/not investment, tax or legal advice/i)).toBeInTheDocument()
  })

  it("honors an explicit disclosure override", () => {
    render(
      <ArticleShell meta={{ ...meta, category: "Property Management", disclosure: "lending" }}>
        <h2>Only heading</h2>
      </ArticleShell>,
    )
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
  })

  it("styles the body with the theme tokens, not a forced inverted palette", () => {
    const { container } = renderShell(<h2>What it is</h2>)
    const body = container.querySelector(".prose")
    expect(body).toBeInTheDocument()
    expect(body?.className).not.toContain("prose-invert")
  })
  describe("hub and fallbacks", () => {
    const landlord = { path: "/blog/example-landlord-post", category: "Property Management" }

    it("keeps mortgage posts under the Learn hub", () => {
      renderShell(<h2>Only heading</h2>)
      expect(screen.getByRole("link", { name: "Learn" })).toHaveAttribute("href", "/learn/")
      expect(screen.getByRole("link", { name: "← Mortgage learning hub" })).toHaveAttribute("href", "/learn/")
    })

    it("files a landlord post under the blog index, not the mortgage hub", () => {
      renderShell(<h2>Only heading</h2>, landlord)
      expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog/")
      expect(screen.getByRole("link", { name: "← All articles" })).toHaveAttribute("href", "/blog/")
      expect(screen.queryByText("← Mortgage learning hub")).not.toBeInTheDocument()
      expect(screen.queryByRole("link", { name: "Learn" })).not.toBeInTheDocument()
    })

    it("gives a post outside the content graph related links and a next step", () => {
      renderShell(<h2>Only heading</h2>, landlord)
      expect(screen.getByRole("heading", { name: "Keep going" })).toBeInTheDocument()
      expect(screen.getByRole("heading", { name: "What to do next" })).toBeInTheDocument()
      expect(screen.getByRole("link", { name: "See Ondo RE property management" })).toHaveAttribute(
        "href",
        "/property-management/",
      )
      expect(screen.queryByText(/loan officer/i)).not.toBeInTheDocument()
    })

    it("uses the graph, not the fallback, for a post the graph covers", () => {
      renderShell(<h2>Only heading</h2>, { path: "/blog/appraisal-comes-in-low" })
      expect(screen.getByRole("link", { name: "Talk through the options" })).toHaveAttribute("href", "/qualify/")
    })
  })

  describe("posts folded into a stronger post", () => {
    const mergedInto = { path: "/blog/the-kept-post", title: "The Kept Post" }

    it("is noindex,follow with its canonical on the kept post", () => {
      const merged = articleMetadata({ ...meta, mergedInto })
      expect(merged.robots).toEqual({ index: false, follow: true })
      expect(merged.alternates?.canonical).toBe("https://www.ondorealestate.com/blog/the-kept-post/")
    })

    it("keeps an ordinary post indexable with a self-canonical", () => {
      const own = articleMetadata(meta)
      expect(own.robots).toBeUndefined()
      expect(own.alternates?.canonical).toBe("https://www.ondorealestate.com/blog/example-post/")
    })

    it("links readers to the kept post", () => {
      render(
        <ArticleShell meta={{ ...meta, mergedInto }}>
          <h2>Only heading</h2>
        </ArticleShell>,
      )
      expect(screen.getByRole("link", { name: "The Kept Post" })).toHaveAttribute("href", "/blog/the-kept-post/")
    })

    it("shows no merge notice on an ordinary post", () => {
      renderShell(<h2>Only heading</h2>)
      expect(screen.queryByText(/now lives in/i)).not.toBeInTheDocument()
    })
  })
})
