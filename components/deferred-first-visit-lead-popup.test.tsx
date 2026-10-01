import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"

const popupLoaded = vi.fn()
vi.mock("@/components/first-visit-lead-popup", () => {
  popupLoaded()
  return { FirstVisitLeadPopup: () => <div data-testid="popup" /> }
})

import { DeferredFirstVisitLeadPopup } from "./deferred-first-visit-lead-popup"

describe("DeferredFirstVisitLeadPopup", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    popupLoaded.mockClear()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("does not load the popup at mount, only once the browser is idle", async () => {
    let idle: (() => void) | undefined
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => {
      idle = cb
      return 1
    })
    vi.stubGlobal("cancelIdleCallback", vi.fn())

    render(<DeferredFirstVisitLeadPopup />)
    expect(screen.queryByTestId("popup")).not.toBeInTheDocument()
    expect(popupLoaded).not.toHaveBeenCalled()

    await act(async () => {
      idle?.()
    })
    vi.useRealTimers()
    expect(await screen.findByTestId("popup")).toBeInTheDocument()
  })

  it("falls back to a timer where requestIdleCallback does not exist (Safari)", async () => {
    vi.stubGlobal("requestIdleCallback", undefined)

    render(<DeferredFirstVisitLeadPopup />)
    expect(popupLoaded).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(3_000)
    })
    vi.useRealTimers()
    expect(await screen.findByTestId("popup")).toBeInTheDocument()
  })

  it("cancels the pending load when unmounted", () => {
    const cancel = vi.fn()
    vi.stubGlobal("requestIdleCallback", () => 7)
    vi.stubGlobal("cancelIdleCallback", cancel)

    render(<DeferredFirstVisitLeadPopup />).unmount()
    expect(cancel).toHaveBeenCalledWith(7)
  })
})
