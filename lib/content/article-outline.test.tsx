import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { extractOutline, readingTimeMinutes } from "./article-outline"

describe("extractOutline", () => {
  it("collects an h2 heading with its slugified id", () => {
    const { outline } = extractOutline(<h2>Gather this first</h2>)
    expect(outline).toEqual([{ id: "gather-this-first", text: "Gather this first", level: 2 }])
  })

  it("stamps the derived id onto the rendered heading", () => {
    const { nodes } = extractOutline(<h2>Gather this first</h2>)
    const { container } = render(<>{nodes}</>)
    expect(container.querySelector("h2")).toHaveAttribute("id", "gather-this-first")
  })

  it("finds headings nested inside fragments and wrapper elements", () => {
    const { outline } = extractOutline(
      <>
        <p>Intro</p>
        <div>
          <section>
            <h2>The three numbers</h2>
          </section>
        </div>
      </>,
    )
    expect(outline.map((entry) => entry.text)).toEqual(["The three numbers"])
  })

  it("joins interpolated values into the heading text", () => {
    const asOf = "September 2026"
    const { outline } = extractOutline(<h2>Common stalls (as of {asOf})</h2>)
    expect(outline[0]).toEqual({
      id: "common-stalls-as-of-september-2026",
      text: "Common stalls (as of September 2026)",
      level: 2,
    })
  })

  it("gives repeated heading text unique ids", () => {
    const { outline } = extractOutline(
      <>
        <h2>What it costs</h2>
        <h2>What it costs</h2>
      </>,
    )
    expect(outline.map((entry) => entry.id)).toEqual(["what-it-costs", "what-it-costs-2"])
  })

  it("keeps an id the author already wrote", () => {
    const { outline } = extractOutline(<h2 id="author-chosen">Gather this first</h2>)
    expect(outline[0].id).toBe("author-chosen")
  })

  it("records h3 headings at level 3", () => {
    const { outline } = extractOutline(
      <>
        <h2>Steps</h2>
        <h3>Contact the lender</h3>
      </>,
    )
    expect(outline).toEqual([
      { id: "steps", text: "Steps", level: 2 },
      { id: "contact-the-lender", text: "Contact the lender", level: 3 },
    ])
  })

  it("strips curly punctuation out of ids", () => {
    const { outline } = extractOutline(<h2>What “bank statement” usually means</h2>)
    expect(outline[0].id).toBe("what-bank-statement-usually-means")
  })

  it("counts words across all text in the tree", () => {
    const { wordCount } = extractOutline(
      <>
        <h2>Two words</h2>
        <p>Three more words</p>
      </>,
    )
    expect(wordCount).toBe(5)
  })

  it("returns an empty outline when there are no headings", () => {
    const { outline, nodes } = extractOutline(<p>Just a paragraph</p>)
    expect(outline).toEqual([])
    const { container } = render(<>{nodes}</>)
    expect(container.textContent).toBe("Just a paragraph")
  })

  it("leaves non-heading markup untouched", () => {
    const { nodes } = extractOutline(
      <div>
        <h2>Heading</h2>
        <a href="https://www.hud.gov">HUD</a>
      </div>,
    )
    const { container } = render(<>{nodes}</>)
    expect(container.querySelector("a")).toHaveAttribute("href", "https://www.hud.gov")
  })
})

describe("readingTimeMinutes", () => {
  it("rounds up to whole minutes at 225 words per minute", () => {
    expect(readingTimeMinutes(450)).toBe(2)
    expect(readingTimeMinutes(451)).toBe(3)
  })

  it("never reports less than one minute", () => {
    expect(readingTimeMinutes(0)).toBe(1)
  })
})
