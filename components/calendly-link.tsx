"use client"

import { forwardRef, useEffect, useState, type AnchorHTMLAttributes } from "react"
import { calendlyUrlWithAttribution } from "@/lib/calendly-attribution"
import { SITE_CALENDLY_URL } from "@/lib/site"

type CalendlyLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Page or button name, sent to Calendly as utm_content when the campaign has none. */
  contentLabel: string
  href?: string
}

/**
 * A Calendly link that carries the visitor's campaign (UTMs) into the booking. The server
 * render and first paint use the plain URL; it is upgraded after mount and again at click
 * time, since attribution can be stored after the page mounted.
 */
export const CalendlyLink = forwardRef<HTMLAnchorElement, CalendlyLinkProps>(function CalendlyLink(
  { contentLabel, href = SITE_CALENDLY_URL, onClick, target = "_blank", rel = "noopener noreferrer", children, ...rest },
  ref,
) {
  const [resolved, setResolved] = useState(href)

  useEffect(() => {
    setResolved(calendlyUrlWithAttribution(contentLabel, href))
  }, [contentLabel, href])

  return (
    <a
      {...rest}
      ref={ref}
      href={resolved}
      target={target}
      rel={rel}
      onClick={(event) => {
        event.currentTarget.href = calendlyUrlWithAttribution(contentLabel, href)
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
})
