import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ArticleCallout } from "./article-callout"
import { KeyTakeaways } from "./key-takeaways"

describe("article label contrast classes", () => {
  it("warning label uses the destructive text token, not the fill", () => {
    render(<ArticleCallout variant="warning">x</ArticleCallout>)
    const label = screen.getByText("Warning")
    expect(label.className).toContain("text-destructive-emphasis")
    expect(label.className).not.toMatch(/(^|\s)text-destructive(\s|$)/)
  })

  it("pitfall label is dark amber in light theme, light amber in dark", () => {
    render(<ArticleCallout variant="pitfall">x</ArticleCallout>)
    const label = screen.getByText("Watch out")
    expect(label.className).toContain("text-amber-700")
    expect(label.className).toContain("dark:text-amber-400")
  })

  it("primary-coloured headings darken in the light theme", () => {
    render(<KeyTakeaways items={["a"]} />)
    expect(screen.getByRole("heading", { name: "Key takeaways" }).className).toContain("text-orange-700")
  })
})
