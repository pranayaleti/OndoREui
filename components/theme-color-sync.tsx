"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/** Browser chrome colours, matching the page background of each theme (see _design-tokens.css). */
export const THEME_COLOR_DARK = "#0b1220"
export const THEME_COLOR_LIGHT = "#fafafa"

export function themeColorFor(resolvedTheme: string | undefined): string {
  return resolvedTheme === "light" ? THEME_COLOR_LIGHT : THEME_COLOR_DARK
}

/**
 * Keeps <meta name="theme-color"> on the active theme. The layout ships the dark value (the
 * default theme); a prefers-color-scheme media query on the meta would follow the OS instead
 * of the visitor's choice and paint white browser chrome around a dark site.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute("content", themeColorFor(resolvedTheme))
  }, [resolvedTheme])

  return null
}
