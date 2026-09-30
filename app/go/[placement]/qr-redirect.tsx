"use client"

import { useEffect } from "react"

/** Immediate client-side hop for browsers that ignore or delay the meta refresh. */
export function QrRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])
  return null
}
