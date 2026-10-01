import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PropertyImage } from "./optimized-image"

describe("PropertyImage", () => {
  it("applies object-cover to the img, not the wrapper", () => {
    render(<PropertyImage src="/a.jpg" alt="Front" className="h-full w-full" />)
    const img = screen.getByAltText("Front")
    expect(img.className).toContain("object-cover")
    expect(img.parentElement?.className).not.toContain("object-cover")
  })

  it("uses a theme token for the error label", () => {
    render(<PropertyImage src="/a.jpg" alt="Front" />)
    fireEvent.error(screen.getByAltText("Front"))
    const label = screen.getByText("Image unavailable")
    expect(label.parentElement?.className).toContain("text-muted-foreground")
    expect(label.parentElement?.className).not.toContain("text-gray-400")
  })
})
