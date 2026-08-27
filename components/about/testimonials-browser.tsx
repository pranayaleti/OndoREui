"use client"

import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"
import {
  getPresentTestimonialRoles,
  getPresentTestimonialServices,
  TESTIMONIAL_SERVICE_LABELS,
  testimonials,
  type TestimonialRole,
  type TestimonialService,
} from "@/lib/testimonials"

type RoleFilter = "All" | TestimonialRole
type ServiceFilter = "All" | TestimonialService

export function TestimonialsBrowser() {
  const { t } = useTranslation()
  const roles = useMemo(() => getPresentTestimonialRoles(), [])
  const services = useMemo(() => getPresentTestimonialServices(), [])
  const [role, setRole] = useState<RoleFilter>("All")
  const [service, setService] = useState<ServiceFilter>("All")

  const items = useMemo(
    () =>
      testimonials.filter((item) => {
        const roleMatch = role === "All" || item.role === role
        const serviceMatch = service === "All" || item.service === service
        return roleMatch && serviceMatch
      }),
    [role, service]
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div
          role="group"
          aria-label={t("testimonialUi.filterRole")}
          className={`flex flex-wrap justify-center gap-2 ${STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS}`}
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
        <div
          role="group"
          aria-label={t("testimonialUi.filterService")}
          className={`flex flex-wrap justify-center gap-2 ${STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS}`}
        >
          {(["All", ...services] as const).map((option) => {
            const selected = service === option
            const label = option === "All" ? t("testimonialUi.allServices") : TESTIMONIAL_SERVICE_LABELS[option]
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setService(option)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-sm text-foreground/70" aria-live="polite">
        {items.length === 1
          ? t("testimonialUi.countOne")
          : t("testimonialUi.countMany", { count: items.length })}
      </p>
      <p className="text-center text-xs text-foreground/60">{t("testimonialUi.compositeDisclaimer")}</p>

      {items.length === 0 ? (
        <p className="text-center text-foreground/70">{t("testimonialUi.empty")}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={`${item.name}-${item.city}-${item.role}`}>
              <TestimonialCard testimonial={item} showService />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
