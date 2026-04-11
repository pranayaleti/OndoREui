"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight
      const progress =
        scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
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
      className="fixed top-16 left-0 right-0 z-40 h-[3px] bg-muted dark:bg-card"
    >
      <div
        className={`h-full bg-accent-1 ${prefersReducedMotion ? "" : "transition-all duration-150 ease-out"}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
