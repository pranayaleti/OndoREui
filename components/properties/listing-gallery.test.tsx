import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ListingGallery } from "./listing-gallery"

describe("ListingGallery", () => {
  const photos = [
    { id: "p1", url: "/photo-1.jpg", caption: "Front", orderIndex: 0 },
    { id: "p2", url: "/photo-2.jpg", caption: "Kitchen", orderIndex: 1 },
    { id: "p3", url: "/photo-3.jpg", caption: null, orderIndex: 2 },
  ]

  it("returns nothing when the listing has no photos", () => {
    const { container } = render(<ListingGallery title="Cedar Hollow" photos={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("opens a lightbox and moves between photos with arrows", () => {
    render(<ListingGallery title="Cedar Hollow" photos={photos} />)
    fireEvent.click(screen.getAllByRole("button", { name: /open photo 1 of 3/i })[0])
    expect(screen.getAllByText("1 / 3").length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: /next photo/i }))
    expect(screen.getByText("2 / 3")).toBeInTheDocument()
    fireEvent.keyDown(window, { key: "ArrowRight" })
    expect(screen.getByText("3 / 3")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /close photos/i }))
    expect(screen.queryByRole("button", { name: /next photo/i })).not.toBeInTheDocument()
  })

  it("uses a single desktop column when the listing has one photo", () => {
    const { container } = render(<ListingGallery title="Cedar Hollow" photos={[photos[0]]} />)
    const desktop = container.querySelector(".md\\:grid")
    expect(desktop?.className).toContain("md:grid-cols-1")
    expect(desktop?.className).not.toContain("md:grid-cols-2")
  })

  it("keeps two desktop columns when there are thumbnails", () => {
    const { container } = render(<ListingGallery title="Cedar Hollow" photos={photos} />)
    expect(container.querySelector(".md\\:grid")?.className).toContain("md:grid-cols-2")
  })
})
