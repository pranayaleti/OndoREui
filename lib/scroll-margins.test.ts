import { describe, expect, it } from "vitest"
import { STICKY_HEADER_SCROLL_MARGIN_CLASS } from "./scroll-margins"

describe("STICKY_HEADER_SCROLL_MARGIN_CLASS", () => {
  it("clears the mobile nav and the taller desktop utility+nav header", () => {
    expect(STICKY_HEADER_SCROLL_MARGIN_CLASS).toContain("scroll-mt-[5.5rem]")
    expect(STICKY_HEADER_SCROLL_MARGIN_CLASS).toContain("md:scroll-mt-[8.5rem]")
  })
})
