"use client"

import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"

interface LoadErrorRetryProps {
  title: string
  message: string
  onRetry: () => void
  /** Wrap in a full-height centered shell (standalone pages). Off when the card sits inside a page. */
  fullPage?: boolean
}

/**
 * Shown when a request failed for a reason other than "not found" (timeout, network, 5xx): the
 * link or data is probably fine, so offer a retry and a phone number instead of a dead end.
 */
export function LoadErrorRetry({ title, message, onRetry, fullPage = true }: LoadErrorRetryProps) {
  const Heading = fullPage ? "h1" : "h2"
  const card = (
    <div role="alert" className="max-w-md text-center">
      <Heading className="mb-2 text-2xl font-bold text-foreground">{title}</Heading>
      <p className="text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
      <p className="mt-4 text-sm text-muted-foreground">
        Or call us at{" "}
        <a href={`tel:${SITE_PHONE_TEL}`} className="underline">
          {SITE_PHONE}
        </a>
      </p>
    </div>
  )
  if (!fullPage) return card
  return <div className="flex min-h-screen items-center justify-center bg-background p-6">{card}</div>
}
