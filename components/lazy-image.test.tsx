import { describe, it, expect, vi } from "vitest"
import { render, fireEvent, screen } from "@testing-library/react"
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

  it("renders the <img> in the initial markup and lazy-loads it natively", () => {
    const { container } = render(<LazyImage src="/a.webp" alt="A" width={480} height={280} />)
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute("loading", "lazy")
  })

  it("does not set native lazy loading on a priority image", () => {
    const { container } = render(<LazyImage src="/a.webp" alt="A" width={480} height={280} priority />)
    expect(container.querySelector("img")).not.toHaveAttribute("loading", "lazy")
  })

  it("does not wait for an IntersectionObserver", () => {
    const original = globalThis.IntersectionObserver
    const spy = vi.fn()
    globalThis.IntersectionObserver = spy as unknown as typeof IntersectionObserver
    try {
      const { container } = render(<LazyImage src="/a.webp" alt="A" width={480} height={280} />)
      expect(container.querySelector("img")).not.toBeNull()
      expect(spy).not.toHaveBeenCalled()
    } finally {
      globalThis.IntersectionObserver = original
    }
  })

  it("shows the fallback when the image fails", () => {
    const { container } = render(<LazyImage src="/a.webp" alt="A" width={480} height={280} />)
    fireEvent.error(container.querySelector("img")!)
    expect(screen.getByText("Image unavailable")).toBeInTheDocument()
  })
})
