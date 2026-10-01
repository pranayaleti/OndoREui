"use client"

import { useEffect, useRef } from "react"

/**
 * Reading-progress bar. Render it inside the sticky site header: it pins to the
 * header's bottom edge, so it stays visible below the desktop utility strip and
 * the main bar. Progress is written straight to the bar's transform (no React
 * state), so scrolling does not re-render anything.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const bar = barRef.current
      if (!bar) return
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight
      const progress =
        scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      const clamped = Math.min(100, Math.max(0, progress))
      bar.style.transform = `scaleX(${clamped / 100})`
    }

    // Reset progress on bfcache page restore
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        handleScroll()
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    window.addEventListener("pageshow", handlePageShow)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      data-testid="scroll-progress"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-muted dark:bg-card"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent-1 transition-transform duration-150 ease-out motion-reduce:transition-none"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
