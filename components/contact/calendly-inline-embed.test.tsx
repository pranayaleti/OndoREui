import { describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import { CalendlyInlineEmbed } from "./calendly-inline-embed"

describe("CalendlyInlineEmbed", () => {
  it("delegates only fullscreen and payment to the third-party iframe", () => {
    const { container } = render(<CalendlyInlineEmbed />)
    const allow = container.querySelector("iframe")?.getAttribute("allow") ?? ""
    expect(allow).toBe("fullscreen; payment")
    expect(allow).not.toMatch(/camera|microphone/)
  })

  it("does not hijack Ctrl/Cmd+Shift+F anywhere on the page", () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<CalendlyInlineEmbed />)
    const shell = container.querySelector("iframe")?.parentElement as HTMLElement
    shell.requestFullscreen = requestFullscreen

    const event = new KeyboardEvent("keydown", { key: "F", shiftKey: true, ctrlKey: true, cancelable: true })
    document.body.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(requestFullscreen).not.toHaveBeenCalled()
  })
})
