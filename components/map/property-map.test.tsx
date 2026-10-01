import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import L from "leaflet"
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
    expect(html).toMatch(/<a[^>]+href="[^"]*#underwrite"[^>]*>Worksheet<\/a>/)
    expect(html).not.toMatch(/cap rate|cash-on-cash|5-year return|estimated rent/i)
  })

  it("does not add a worksheet link on a location-only pin", () => {
    const html = buildListingPopupHtml(
      { id: "sugar-house", title: "Sugar House, Salt Lake City" },
      { showListingAction: false },
    )
    expect(html).not.toContain("Worksheet")
    expect(html).not.toContain("#underwrite")
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

describe("PropertyMap keeps the visitor's view across parent re-renders", () => {
  const listing = (id: string, lat: number) => ({
    id, title: id, price: 2000, bedrooms: 2, bathrooms: 1, lat, lng: -111.89,
  })

  it("fits bounds once for the same listings, even with fresh arrays and a selection change", async () => {
    const fit = vi.spyOn(L.Map.prototype, "fitBounds")
    const setView = vi.spyOn(L.Map.prototype, "setView")
    fit.mockClear()
    setView.mockClear()
    const { rerender } = render(<PropertyMap properties={[listing("a", 40.7), listing("b", 40.8)]} />)
    await waitFor(() => expect(document.querySelectorAll(".ondo-price-pin")).toHaveLength(2))
    expect(fit).toHaveBeenCalledTimes(1)

    // New array and object identities, same listings, plus a selection.
    rerender(
      <PropertyMap properties={[listing("a", 40.7), listing("b", 40.8)]} selectedPropertyId="a" />,
    )
    await waitFor(() =>
      expect(document.querySelectorAll(".ondo-price-pin--selected")).toHaveLength(1),
    )
    expect(fit).toHaveBeenCalledTimes(1)
    // fitBounds itself calls setView once; no further view resets happened.
    expect(setView).toHaveBeenCalledTimes(1)

    // A different set of listings does re-fit.
    rerender(<PropertyMap properties={[listing("a", 40.7), listing("c", 40.9)]} />)
    await waitFor(() => expect(fit).toHaveBeenCalledTimes(2))
    fit.mockRestore()
    setView.mockRestore()
  })

  it("does not reset the view when an omitted center prop is re-evaluated", async () => {
    const setView = vi.spyOn(L.Map.prototype, "setView")
    setView.mockClear()
    const { rerender } = render(<PropertyMap properties={[]} />)
    await waitFor(() => expect(setView).toHaveBeenCalledTimes(1))
    rerender(<PropertyMap properties={[]} className="x" />)
    expect(setView).toHaveBeenCalledTimes(1)
    setView.mockRestore()
  })
})
