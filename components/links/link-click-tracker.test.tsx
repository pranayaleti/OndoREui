import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent, screen } from "@testing-library/react"
import { LinkClickTracker } from "./link-click-tracker"

// Hash hrefs keep jsdom from attempting (unimplemented) navigation on click.
function renderLinks() {
  return render(
    <>
      <a href="#buy" data-links-id="buy">
        <span>Buy a home in Utah</span>
      </a>
      <a href="#about">About Ondo</a>
    </>,
  )
}

describe("LinkClickTracker", () => {
  const gtag = vi.fn()

  beforeEach(() => {
    gtag.mockReset()
    vi.stubGlobal("gtag", gtag)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("reports the tapped link's id to GA4, even when the tap lands on its inner text", () => {
    renderLinks()
    render(<LinkClickTracker />)
    fireEvent.click(screen.getByText("Buy a home in Utah"))
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith("event", "links_click", {
      event_category: "links_page",
      event_label: "buy",
      value: undefined,
    })
  })

  it("ignores links without a tracking id", () => {
    renderLinks()
    render(<LinkClickTracker />)
    fireEvent.click(screen.getByText("About Ondo"))
    expect(gtag).not.toHaveBeenCalled()
  })

  it("stops reporting after it unmounts, so a remount cannot double count", () => {
    renderLinks()
    const tracker = render(<LinkClickTracker />)
    tracker.unmount()
    fireEvent.click(screen.getByText("Buy a home in Utah"))
    expect(gtag).not.toHaveBeenCalled()
  })
})
