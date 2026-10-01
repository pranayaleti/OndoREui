/**
 * The launcher must not drag the chat panel into every page: the panel chunk is requested on the
 * first click, not at mount. The panel module is replaced with a stub whose factory only runs when
 * the chunk is actually imported.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => "/property-management/" }))

const panelLoaded = vi.fn()
vi.mock("@/components/PublicAssistantPanel", () => {
  panelLoaded()
  return {
    default: ({ open, onReady, onClose }: { open: boolean; onReady: () => void; onClose: () => void }) => {
      // The real panel reports readiness once mounted.
      void Promise.resolve().then(onReady)
      return open ? (
        <section aria-label="Ondo assistant">
          <button type="button" onClick={onClose}>
            stub close
          </button>
        </section>
      ) : null
    },
  }
})

import PublicAssistantWidget from "./PublicAssistantWidget"

beforeEach(() => {
  panelLoaded.mockClear()
})

describe("PublicAssistantWidget lazy loading", () => {
  it("does not load the chat panel until the launcher is clicked", async () => {
    render(<PublicAssistantWidget />)
    expect(screen.getByRole("button", { name: /open the ondo assistant/i })).toBeInTheDocument()
    await new Promise((r) => setTimeout(r, 20))
    expect(panelLoaded).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: /open the ondo assistant/i }))
    expect(await screen.findByRole("region", { name: /ondo assistant/i })).toBeInTheDocument()
    expect(panelLoaded).toHaveBeenCalledTimes(1)
  })

  it("keeps the launcher on screen until the panel has loaded, then swaps it out", async () => {
    render(<PublicAssistantWidget />)
    fireEvent.click(screen.getByRole("button", { name: /open the ondo assistant/i }))
    // Immediately after the click the panel chunk is still in flight.
    expect(screen.getByRole("button", { name: /open the ondo assistant/i })).toBeInTheDocument()

    await screen.findByRole("region", { name: /ondo assistant/i })
    await vi.waitFor(() =>
      expect(screen.queryByRole("button", { name: /open the ondo assistant/i })).not.toBeInTheDocument(),
    )
  })
})
