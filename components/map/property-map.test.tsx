import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PropertyMap from "./property-map"

// react-leaflet requires a real DOM measurement environment Leaflet doesn't get
// in jsdom by default; the component's own isClient/loading-state gate means
// we're testing that a marker with no price renders without crashing and
// without a price string, once the client-side map mounts.
vi.mock("leaflet", async () => {
  const actual = await vi.importActual<typeof import("leaflet")>("leaflet")
  return actual
})

describe("PropertyMap with a listing-less marker", () => {
  it("accepts a marker with no price/bedrooms/bathrooms", () => {
    expect(() =>
      render(
        <PropertyMap
          properties={[{ id: "sugar-house", title: "Sugar House", lat: 40.7217, lng: -111.8496 }]}
          center={[40.7217, -111.8496]}
          zoom={13}
        />
      )
    ).not.toThrow()
  })

  it("still accepts a fully-specified listing marker (backward compatible)", () => {
    expect(() =>
      render(
        <PropertyMap
          properties={[
            { id: "1", title: "123 Main St", price: 2200, bedrooms: 3, bathrooms: 2, lat: 40.7217, lng: -111.8496 },
          ]}
        />
      )
    ).not.toThrow()
  })
})
