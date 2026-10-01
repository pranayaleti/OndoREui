import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { LazyImage } from "./lazy-image"

describe("LazyImage", () => {
  it("with fill, covers its parent and puts className on the image", () => {
    const { container } = render(
      <div className="relative h-48">
        <LazyImage src="/a.webp" alt="A" fill priority className="object-cover" sizes="100vw" />
      </div>,
    )
    const wrapper = container.firstElementChild?.firstElementChild as HTMLElement
    expect(wrapper).toHaveClass("absolute", "inset-0")
    expect(wrapper).not.toHaveClass("object-cover")
    expect(container.querySelector("img")).toHaveClass("object-cover")
  })

  it("without fill, keeps className on the wrapper", () => {
    const { container } = render(
      <LazyImage src="/a.webp" alt="A" width={480} height={280} priority className="h-40 w-full" />,
    )
    expect(container.firstElementChild).toHaveClass("relative", "h-40", "w-full")
    expect(container.querySelector("img")).not.toHaveClass("h-40")
  })
})
