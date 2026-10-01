import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"

let mockPathname = "/"
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname }))

import { StickyBarOffset } from "./sticky-bar-offset"

describe("StickyBarOffset", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  it("reserves room for the sticky bar where the bar renders", () => {
    const { container } = render(<StickyBarOffset>x</StickyBarOffset>)
    expect((container.firstChild as HTMLElement).className).toContain("pb-[calc(4.5rem")
  })

  it.each(["/links/", "/buy/quiz/", "/qualify/", "/login/"])("adds no padding on %s, where there is no bar", (pathname) => {
    mockPathname = pathname
    const { container } = render(<StickyBarOffset>x</StickyBarOffset>)
    expect((container.firstChild as HTMLElement).className).not.toContain("pb-")
  })
})
