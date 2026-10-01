import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { CalendlyInlineEmbed } from "./calendly-inline-embed"

function loadScheduler() {
  fireEvent.click(screen.getByRole("button", { name: "Pick a time" }))
}

describe("CalendlyInlineEmbed", () => {
  afterEach(() => {
    window.location.hash = ""
  })

  it("renders a facade and loads no third-party iframe until asked", () => {
    const { container } = render(<CalendlyInlineEmbed />)
    expect(container.querySelector("iframe")).toBeNull()
    expect(screen.getByRole("button", { name: "Pick a time" })).toBeInTheDocument()
    // The fallback link works without the iframe.
    expect(screen.getByRole("link", { name: /open scheduling in a new tab/i })).toBeInTheDocument()
  })

  it("loads the Calendly iframe after the visitor clicks Pick a time", () => {
    const { container } = render(<CalendlyInlineEmbed />)
    loadScheduler()
    const iframe = container.querySelector("iframe")
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute("src")).toContain("embed_type=Inline")
    expect(screen.queryByRole("button", { name: "Pick a time" })).toBeNull()
  })

  it("loads the iframe without a click when the visitor arrives on the booking anchor", () => {
    window.location.hash = "#book-a-call"
    const { container } = render(<CalendlyInlineEmbed />)
    expect(container.querySelector("iframe")).not.toBeNull()
  })

  it("loads the iframe when the booking anchor is clicked on the same page", () => {
    const { container } = render(<CalendlyInlineEmbed />)
    expect(container.querySelector("iframe")).toBeNull()
    act(() => {
      window.location.hash = "#book-a-call"
      window.dispatchEvent(new HashChangeEvent("hashchange"))
    })
    expect(container.querySelector("iframe")).not.toBeNull()
  })

  it("ignores unrelated hashes", () => {
    window.location.hash = "#faq"
    const { container } = render(<CalendlyInlineEmbed />)
    expect(container.querySelector("iframe")).toBeNull()
  })

  it("delegates only fullscreen and payment to the third-party iframe", () => {
    const { container } = render(<CalendlyInlineEmbed />)
    loadScheduler()
    const allow = container.querySelector("iframe")?.getAttribute("allow") ?? ""
    expect(allow).toBe("fullscreen; payment")
    expect(allow).not.toMatch(/camera|microphone/)
  })

  it("does not hijack Ctrl/Cmd+Shift+F anywhere on the page", () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<CalendlyInlineEmbed />)
    loadScheduler()
    const shell = container.querySelector("iframe")?.parentElement as HTMLElement
    shell.requestFullscreen = requestFullscreen

    const event = new KeyboardEvent("keydown", { key: "F", shiftKey: true, ctrlKey: true, cancelable: true })
    document.body.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(requestFullscreen).not.toHaveBeenCalled()
  })

  it("offers the fullscreen toggle only once the calendar is loaded", () => {
    render(<CalendlyInlineEmbed />)
    expect(screen.queryByRole("button", { name: /scheduling calendar in fullscreen/i })).toBeNull()
    loadScheduler()
    expect(screen.getByRole("button", { name: /scheduling calendar in fullscreen/i })).toBeInTheDocument()
  })
})
