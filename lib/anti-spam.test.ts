/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAntiSpam } from "./anti-spam"

describe("useAntiSpam", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("flags as bot when honeypot has any non-empty value", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const { result } = renderHook(() => useAntiSpam({ minDwellMs: 0 }))
    act(() => {
      result.current.honeypotProps.onChange({
        target: { value: "spam" },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.gate.isLikelyBot()).toBe(true)
  })

  it("flags as bot when submit happens before minDwell elapses", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const { result } = renderHook(() => useAntiSpam({ minDwellMs: 2_500 }))
    // Immediate submit — too fast for a real user.
    expect(result.current.gate.isLikelyBot()).toBe(true)
  })

  it("clears the bot flag after the dwell window has passed AND honeypot empty", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const { result } = renderHook(() => useAntiSpam({ minDwellMs: 2_500 }))

    vi.setSystemTime(new Date("2026-01-01T00:00:03Z")) // 3s later
    expect(result.current.gate.isLikelyBot()).toBe(false)
  })

  it("recordAttempt re-arms both the dwell window and honeypot", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const { result } = renderHook(() => useAntiSpam({ minDwellMs: 1_000 }))

    // Wait past dwell, fill honeypot, submit attempt → record.
    vi.setSystemTime(new Date("2026-01-01T00:00:02Z"))
    act(() => {
      result.current.honeypotProps.onChange({
        target: { value: "x" },
      } as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.gate.isLikelyBot()).toBe(true)

    act(() => {
      result.current.gate.recordAttempt()
    })

    // Honeypot cleared, dwell reset → still flagged as bot until 1s passes.
    expect(result.current.gate.isLikelyBot()).toBe(true)
    vi.setSystemTime(new Date("2026-01-01T00:00:04Z"))
    expect(result.current.gate.isLikelyBot()).toBe(false)
  })

  it("honeypot input has the right anti-targeting attributes", () => {
    const { result } = renderHook(() => useAntiSpam())
    const props = result.current.honeypotProps
    expect(props.tabIndex).toBe(-1)
    expect(props["aria-hidden"]).toBe(true)
    expect(props.autoComplete).toBe("off")
    expect(props.style.position).toBe("absolute")
    expect(props.style.opacity).toBe(0)
  })
})
