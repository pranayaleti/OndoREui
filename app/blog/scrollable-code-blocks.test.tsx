import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import UtahRentVsBuy from "./utah-rent-vs-buy-wasatch-front/page"
import RentingVsOwning from "./renting-vs-owning-hidden-math/page"
import MobileNotary from "./mobile-notary-utah-county-guide/page"
import PrepareRon from "./prepare-for-remote-online-notary-session/page"
import RonClosings from "./remote-online-notary-real-estate-closings/page"
import RonAll50 from "./remote-online-notary-all-50-states/page"
import NotaryWorkflows from "./modernizing-notary-workflows-integration/page"
import TechnicalSeo from "./technical-seo-for-real-estate/page"

// Diagrams and scenario grids are real lists, so nothing needs horizontal scrolling.
const listPosts = {
  "utah-rent-vs-buy-wasatch-front": UtahRentVsBuy,
  "renting-vs-owning-hidden-math": RentingVsOwning,
  "mobile-notary-utah-county-guide": MobileNotary,
  "prepare-for-remote-online-notary-session": PrepareRon,
  "remote-online-notary-real-estate-closings": RonClosings,
  "remote-online-notary-all-50-states": RonAll50,
}

// Real code samples keep a <pre>, which must be keyboard-scrollable and named.
const codePosts = {
  "modernizing-notary-workflows-integration": NotaryWorkflows,
  "technical-seo-for-real-estate": TechnicalSeo,
}

describe("blog diagrams and code blocks", () => {
  it.each(Object.entries(listPosts))("%s has no <pre> diagram", (_slug, Page) => {
    const { container } = render(<Page />)
    expect(container.querySelector("pre")).toBeNull()
  })

  it.each(Object.entries(codePosts))("%s code block is a focusable, labelled region", (_slug, Page) => {
    const { container } = render(<Page />)
    const blocks = container.querySelectorAll("pre")
    expect(blocks.length).toBeGreaterThan(0)
    blocks.forEach((pre) => {
      expect(pre).toHaveAttribute("tabindex", "0")
      expect(pre).toHaveAttribute("role", "region")
      expect(pre.getAttribute("aria-label")).toBeTruthy()
    })
  })
})
