import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import PropertyMap, {
  syncLeafletSizeAfterContainerResize,
  buildListingPopupHtml,
  escapeMapPopupText,
  prepareLeafletHost,
} from "./property-map"

// PropertyMap gates its real render behind an async `import("leaflet")` in a
// useEffect, showing a "Loading map..." placeholder until it resolves. A bare
// synchronous render() only ever sees that placeholder, it never mounts the
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
    // the loading placeholder disappearing, there's a gap between the two)
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

  it("renders a rent chip on the pin for priced listings and marks the selected one", async () => {
    render(
      <PropertyMap
        selectedPropertyId="1"
        properties={[
          { id: "1", title: "123 Main St", price: 2200, bedrooms: 3, bathrooms: 2, lat: 40.7217, lng: -111.8496 },
        ]}
      />
    )
    const pin = await waitFor(() => {
      const el = document.querySelector(".ondo-price-pin")
      expect(el).toBeTruthy()
      return el!
    })
    expect(pin.textContent).toMatch(/\$2,200/)
    expect(pin.classList.contains("ondo-price-pin--selected")).toBe(true)
  })

  it("shows only bedrooms, with no dangling 'undefined bath', when bathrooms is absent", async () => {
    render(
      <PropertyMap
        properties={[{ id: "2", title: "456 Oak Ave", bedrooms: 3, lat: 40.7217, lng: -111.8496 }]}
      />
    )
    const marker = await waitFor(() => {
      const el = document.querySelector(".custom-map-marker-pin")
      expect(el).toBeTruthy()
      return el!
    })
    fireEvent.click(marker)
    await waitFor(() => expect(screen.getByText("456 Oak Ave")).toBeInTheDocument())
    expect(screen.getByText("3 bed")).toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
  })
})

describe("syncLeafletSizeAfterContainerResize", () => {
  it("invalidates an existing map and is a no-op when Leaflet never attached", () => {
    const invalidateSize = vi.fn()
    syncLeafletSizeAfterContainerResize({ invalidateSize })
    expect(invalidateSize).toHaveBeenCalledTimes(1)
    expect(() => syncLeafletSizeAfterContainerResize(null)).not.toThrow()
  })
})

describe("listing popup HTML", () => {
  it("omits price and bed/bath when those fields are absent", () => {
    const html = buildListingPopupHtml(
      { id: "sugar-house", title: "Sugar House, Salt Lake City" },
      { showListingAction: false },
    )
    expect(html).toContain("Sugar House, Salt Lake City")
    expect(html).not.toMatch(/\$/)
    expect(html).not.toMatch(/bed/)
    expect(html).not.toContain("Show listing")
  })

  it("shows price, beds, and a show-listing action for a full listing", () => {
    const html = buildListingPopupHtml(
      { id: "1", title: "123 Main St", price: 2200, bedrooms: 3, bathrooms: 2, type: "house" },
      { showListingAction: true },
    )
    expect(html).toContain("$2,200/mo")
    expect(html).toContain("3 bed")
    expect(html).toContain("2 bath")
    expect(html).toContain("Show listing")
    expect(html).toContain('data-listing-id="1"')
  })

  it("does not emit undefined bath when bathrooms is missing", () => {
    const html = buildListingPopupHtml(
      { id: "2", title: "456 Oak Ave", bedrooms: 3 },
      { showListingAction: false },
    )
    expect(html).toContain("3 bed")
    expect(html).not.toMatch(/undefined/)
  })

  it("escapes listing titles so popup HTML cannot inject markup", () => {
    expect(escapeMapPopupText(`<img src=x onerror="alert(1)">`)).not.toContain("<img")
    const html = buildListingPopupHtml(
      { id: `a">`, title: `<script>alert(1)</script>` },
      { showListingAction: true },
    )
    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })
})

describe("prepareLeafletHost", () => {
  it("clears a leftover Leaflet id so a second init can reuse the node", () => {
    const node = document.createElement("div") as HTMLDivElement & { _leaflet_id?: number }
    node._leaflet_id = 17
    prepareLeafletHost(node)
    expect(node._leaflet_id).toBeUndefined()
  })
})
