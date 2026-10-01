import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import Page, { metadata } from "./page"

describe("/news", () => {
  it("is titled and described as a list of sources, not as news or market updates", () => {
    expect(JSON.stringify(metadata.title)).toMatch(/news sources/i)
    expect(JSON.stringify(metadata.title)).not.toMatch(/market updates/i)
    expect(String(metadata.description)).toMatch(/links to/i)
  })

  it("does not claim the outside links are updated daily or weekly", () => {
    const { container } = render(<Page />)
    expect(container.textContent).not.toMatch(/updated (daily|weekly|monthly|regularly)/i)
    expect(container.textContent).not.toMatch(/aggregat/i)
  })
})
