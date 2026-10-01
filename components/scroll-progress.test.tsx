import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { ScrollProgress } from "./scroll-progress"

afterEach(() => cleanup())

describe("ScrollProgress", () => {
  it("renders the same markup on the server and client regardless of motion preference", () => {
    // Reduced motion is handled in CSS (motion-reduce:), not by a render-time window read.
    const { container } = render(<ScrollProgress />)
    const bar = container.querySelector("[data-testid='scroll-progress'] > div") as HTMLElement
    expect(bar.className).toContain("motion-reduce:transition-none")
  })

  it("pins to the bottom edge of its (header) container, not a fixed offset", () => {
    render(<ScrollProgress />)
    const wrapper = screen.getByTestId("scroll-progress")
    expect(wrapper.className).toContain("absolute")
    expect(wrapper.className).toContain("bottom-0")
    expect(wrapper.className).not.toContain("fixed")
  })
})
