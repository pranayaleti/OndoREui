import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent, screen } from "@testing-library/react"
import { analyticsAttributes } from "@/lib/analytics"
import { ClickTracker } from "./click-tracker"

// Hash hrefs keep jsdom from attempting (unimplemented) navigation on click.
function renderLinks() {
  return render(
    <>
      <a href="#ig" {...analyticsAttributes("social_click", "footer", "instagram")}>
        <span>Instagram</span>
      </a>
      <a href="#about">About Ondo</a>
    </>,
  )
}

describe("ClickTracker", () => {
  const gtag = vi.fn()

  beforeEach(() => {
    gtag.mockReset()
    vi.stubGlobal("gtag", gtag)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("reports the tagged element's event, where it sits, and what it is, even from inner text", () => {
    renderLinks()
    render(<ClickTracker />)
    fireEvent.click(screen.getByText("Instagram"))
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith("event", "social_click", {
      event_category: "footer",
      event_label: "instagram",
      value: undefined,
    })
  })

  it("ignores clicks on untagged elements", () => {
    renderLinks()
    render(<ClickTracker />)
    fireEvent.click(screen.getByText("About Ondo"))
    expect(gtag).not.toHaveBeenCalled()
  })

  it("stops reporting after it unmounts, so a remount cannot double count", () => {
    renderLinks()
    const tracker = render(<ClickTracker />)
    tracker.unmount()
    fireEvent.click(screen.getByText("Instagram"))
    expect(gtag).not.toHaveBeenCalled()
  })
})
