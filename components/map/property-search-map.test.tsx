import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

vi.mock("./property-map", () => ({
  default: ({ properties }: { properties: { id: string }[] }) => (
    <div data-testid="map" data-count={properties.length} />
  ),
}))
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

import PropertySearchMap from "./property-search-map"

const base = { bedrooms: 2, bathrooms: 1, lat: 40.7, lng: -111.9 }
const properties = [
  { ...base, id: "cheap", title: "Cheap Flat", price: 1200 },
  { ...base, id: "luxury", title: "Luxury Estate", price: 15000 },
]

describe("PropertySearchMap", () => {
  it("renders each card as an article with a title link and no button wrapping a link", () => {
    render(<PropertySearchMap properties={properties} onPropertyClick={vi.fn()} />)
    expect(screen.getAllByRole("article")).toHaveLength(2)
    expect(screen.queryAllByRole("button").every((b) => !b.querySelector("a"))).toBe(true)
    const title = screen.getByRole("link", { name: "Cheap Flat" })
    expect(title.getAttribute("href")).toBe("/properties/cheap/")
  })

  it("does not cap listings at $10,000 when max price is Any", () => {
    render(<PropertySearchMap properties={properties} />)
    expect(screen.getByText("Luxury Estate")).toBeTruthy()
    expect(screen.getByTestId("map").getAttribute("data-count")).toBe("2")
  })

  it("still filters when a max price is chosen and restores Any on reset", () => {
    render(<PropertySearchMap properties={properties} />)
    fireEvent.change(screen.getByLabelText("Max Price"), { target: { value: "2000" } })
    expect(screen.queryByText("Luxury Estate")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))
    expect(screen.getByText("Luxury Estate")).toBeTruthy()
    expect((screen.getByLabelText("Max Price") as HTMLSelectElement).value).toBe("any")
  })
})
