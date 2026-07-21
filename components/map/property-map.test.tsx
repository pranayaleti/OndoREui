import { describe, it, expect } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import PropertyMap from "./property-map"

// PropertyMap gates its real render behind an async `import("leaflet")` in a
// useEffect, showing a "Loading map..." placeholder until it resolves. A bare
// synchronous render() only ever sees that placeholder — it never mounts the
// Marker/Popup this task's conditional JSX lives in. waitFor lets the effect
// resolve so the assertions below exercise the actual changed code.
describe("PropertyMap with a listing-less marker", () => {
  it("shows no price/bed/bath line for a marker with no listing behind it", async () => {
    render(
      <PropertyMap
        properties={[{ id: "sugar-house", title: "Sugar House, Salt Lake City", lat: 40.7217, lng: -111.8496 }]}
        center={[40.7217, -111.8496]}
        zoom={13}
      />
    )
    // react-leaflet doesn't mount a Marker's Popup content into the DOM until
    // the marker opens (click), so wait for the marker icon itself (not just
    // the loading placeholder disappearing — there's a gap between the two)
    // before opening it and asserting on popup text.
    const marker = await waitFor(() => {
      const el = document.querySelector(".custom-map-marker-pin")
      expect(el).toBeTruthy()
      return el!
    })
    fireEvent.click(marker)
    await waitFor(() => expect(screen.getByText("Sugar House, Salt Lake City")).toBeInTheDocument())
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/bed/i)).not.toBeInTheDocument()
  })

  it("still shows price and bed/bath for a fully-specified listing marker (backward compatible)", async () => {
    render(
      <PropertyMap
        properties={[
          { id: "1", title: "123 Main St", price: 2200, bedrooms: 3, bathrooms: 2, lat: 40.7217, lng: -111.8496 },
        ]}
      />
    )
    const marker = await waitFor(() => {
      const el = document.querySelector(".custom-map-marker-pin")
      expect(el).toBeTruthy()
      return el!
    })
    fireEvent.click(marker)
    await waitFor(() => expect(screen.getByText("123 Main St")).toBeInTheDocument())
    expect(screen.getByText(/\$2,200\/mo/)).toBeInTheDocument()
    expect(screen.getByText(/3 bed/)).toBeInTheDocument()
  })
})
