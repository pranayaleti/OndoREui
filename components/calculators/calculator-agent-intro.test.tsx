import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CalculatorAgentIntro } from "./calculator-agent-intro"

describe("CalculatorAgentIntro disclosure", () => {
  it("links consumers to the licensing page, not a markdown file, for disclosures", () => {
    const { container } = render(<CalculatorAgentIntro slug="home-sale" />)
    const licensing = screen.getByRole("link", { name: /licensing and disclosures/i })
    expect(licensing.getAttribute("href")).toBe("/licensing/")
    expect(container.textContent).not.toMatch(/for the full disclosures/i)
    expect(container.textContent).toMatch(/not a quote or a commitment to lend/i)
  })

  it("keeps the markdown twin as a small note for AI agents", () => {
    render(<CalculatorAgentIntro slug="home-sale" />)
    const md = screen.getByRole("link", { name: /markdown version/i })
    expect(md.getAttribute("href")).toMatch(/\/calculators\/home-sale\.md$/)
    expect(md.getAttribute("rel")).toBe("alternate")
  })
})
