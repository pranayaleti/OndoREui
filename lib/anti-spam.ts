/**
 * Lightweight client-side anti-spam helpers for public lead/contact forms.
 *
 * Two layered defenses, both gated entirely client-side:
 *   1. Honeypot field — a hidden input bots gleefully fill in. Human users
 *      can't see or focus it, so any non-empty value at submit time is a
 *      reliable bot signal. Drop the submission silently (don't tell the
 *      bot which field gave it away).
 *   2. Submit time-gate — bots POST in <100 ms; legitimate humans take at
 *      least a few seconds to read + fill a multi-field form. Reject any
 *      submission that arrives sooner than `minDwellMs`.
 *
 * Both signals are weak alone but very high precision together. They cost
 * nothing in UX (no captcha) and are widely deployed. Pair with a
 * server-side rate limit (already enforced on /api/leads/submit and
 * /api/contact-leads).
 *
 * Usage:
 *   const { honeypotProps, gate } = useAntiSpam()
 *   ...
 *   <input {...honeypotProps} />
 *   ...
 *   const onSubmit = (e) => {
 *     e.preventDefault()
 *     if (gate.isLikelyBot()) {
 *       gate.recordAttempt()
 *       return // pretend success; bots aren't told why
 *     }
 *     submit(...)
 *   }
 */

import { useMemo, useRef, useState } from "react"

export interface AntiSpamConfig {
  /** Minimum time the form must be on screen before a submit is accepted. */
  minDwellMs?: number
  /** Honeypot field name. Use something innocuous so bots target it. */
  honeypotName?: string
}

export interface AntiSpamHandle {
  honeypotProps: {
    type: "text"
    name: string
    autoComplete: "off"
    tabIndex: -1
    "aria-hidden": true
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    style: React.CSSProperties
  }
  gate: {
    isLikelyBot: () => boolean
    recordAttempt: () => void
  }
}

const DEFAULT_MIN_DWELL_MS = 2_500
const DEFAULT_HONEYPOT_NAME = "website"

/**
 * Hook returning a honeypot input prop bag and a submit-time gate.
 * Mounted once per form; reset between submissions if you want to allow
 * a retry after a tripped gate (call `recordAttempt` to re-arm).
 */
export function useAntiSpam(config: AntiSpamConfig = {}): AntiSpamHandle {
  const minDwellMs = config.minDwellMs ?? DEFAULT_MIN_DWELL_MS
  const honeypotName = config.honeypotName ?? DEFAULT_HONEYPOT_NAME

  const mountedAtRef = useRef<number>(Date.now())
  const [hpValue, setHpValue] = useState<string>("")

  const honeypotProps = useMemo<AntiSpamHandle["honeypotProps"]>(
    () => ({
      type: "text",
      name: honeypotName,
      autoComplete: "off",
      tabIndex: -1,
      "aria-hidden": true,
      value: hpValue,
      onChange: (e) => setHpValue(e.target.value),
      // Visually + acoustically hidden but still focusable to anything that
      // crawls all inputs. Avoid `display: none` because some bots skip
      // those entirely.
      style: {
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      },
    }),
    [hpValue, honeypotName]
  )

  const gate = useMemo(
    () => ({
      isLikelyBot(): boolean {
        if (hpValue.trim() !== "") return true
        const dwell = Date.now() - mountedAtRef.current
        if (dwell < minDwellMs) return true
        return false
      },
      recordAttempt(): void {
        mountedAtRef.current = Date.now()
        setHpValue("")
      },
    }),
    [hpValue, minDwellMs]
  )

  return { honeypotProps, gate }
}
