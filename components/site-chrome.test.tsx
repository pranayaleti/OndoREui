import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

let mockPathname: string | null = "/"
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname }))

import { SiteChrome } from "./site-chrome"

function renderChrome() {
  return render(
    <SiteChrome>
      <nav aria-label="Site header" />
    </SiteChrome>,
  )
}

describe("SiteChrome", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  // trailingSlash: true means the exported page is served at /links/.
  it.each(["/links", "/links/"])("drops header, footer and floating widgets on %s", (pathname) => {
    mockPathname = pathname
    renderChrome()
    expect(screen.queryByRole("navigation", { name: "Site header" })).not.toBeInTheDocument()
  })

  it.each(["/", "/socials/", "/linkshub/", "/properties/links/"])("keeps site chrome on %s", (pathname) => {
    mockPathname = pathname
    renderChrome()
    expect(screen.getByRole("navigation", { name: "Site header" })).toBeInTheDocument()
  })

  it("keeps site chrome while the pathname is unknown", () => {
    mockPathname = null
    renderChrome()
    expect(screen.getByRole("navigation", { name: "Site header" })).toBeInTheDocument()
  })
})
