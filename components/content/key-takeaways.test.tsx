import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { KeyTakeaways, KEY_TAKEAWAYS_CAPTION } from "./key-takeaways"

const items = ["MIP is timed from original LTV.", "PMI can come off with equity."]

describe("KeyTakeaways", () => {
  it("lists every takeaway", () => {
    render(<KeyTakeaways items={items} />)
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("PMI can come off with equity.")).toBeInTheDocument()
  })

  it("is a labelled region so screen readers can skip to or past it", () => {
    render(<KeyTakeaways items={items} />)
    expect(screen.getByRole("region", { name: "Key takeaways" })).toBeInTheDocument()
  })

  it("accepts a custom heading", () => {
    render(<KeyTakeaways items={items} heading="At a glance" />)
    expect(screen.getByRole("region", { name: "At a glance" })).toBeInTheDocument()
  })

  it("renders nothing when there are no takeaways", () => {
    const { container } = render(<KeyTakeaways items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe("KeyTakeaways compliance framing", () => {
  it("carries a caption, because the box is the chunk that gets extracted without the page's disclosures", () => {
    render(<KeyTakeaways items={items} />)
    expect(screen.getByText(KEY_TAKEAWAYS_CAPTION)).toBeInTheDocument()
  })
})
