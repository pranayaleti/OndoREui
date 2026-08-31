"use client"

import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import {
  getPresentTestimonialRoles,
  testimonials,
  type TestimonialRole,
} from "@/lib/testimonials"

type RoleFilter = "All" | TestimonialRole

export function TestimonialsCarousel() {
  const { t } = useTranslation()
  const roles = useMemo(() => getPresentTestimonialRoles(), [])
  const [role, setRole] = useState<RoleFilter>("All")
  const scrollerRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => (role === "All" ? testimonials : testimonials.filter((item) => item.role === role)),
    [role]
  )

  const scrollByCard = useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const delta = Math.max(el.clientWidth * 0.85, 280) * direction
    el.scrollBy({ left: delta, behavior: prefersReducedMotion ? "auto" : "smooth" })
  }, [])

  const onNavKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollByCard(-1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollByCard(1)
      }
    },
    [scrollByCard]
  )

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-wrap justify-center gap-2 ${STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS}`}
        role="group"
        aria-label={t("testimonialUi.filterRole")}
      >
        {(["All", ...roles] as const).map((option) => {
          const selected = role === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setRole(option)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              }`}
            >
                {option === "All" ? t("testimonialUi.allRoles") : option}
            </button>
          )
        })}
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          role="region"
          // A horizontally scrollable region must be reachable by keyboard (axe
          // scrollable-region-focusable / WCAG 2.1.1). The cards hold no focusable
          // children, so the scroller itself has to take focus. jsx-a11y only
          // allowlists `tabpanel` for this, hence the targeted exception.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={t("testimonialUi.carouselLabel")}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth motion-reduce:scroll-auto"
        >
          {items.map((item) => (
            <div
              key={`${item.name}-${item.city}-${item.role}`}
              className="w-[min(100%,20rem)] shrink-0 snap-start sm:w-[min(100%,24rem)]"
            >
              <TestimonialCard testimonial={item} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scrollByCard(-1)}
            onKeyDown={onNavKeyDown}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scrollByCard(1)}
            onKeyDown={onNavKeyDown}
            aria-label="Next reviews"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
