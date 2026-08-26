"use client"

import { Building, MapPin, ShieldCheck, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  LICENSING_HREF,
  PROPERTIES_MANAGED,
  UTAH_CITIES_SERVED,
} from "@/lib/social-proof-stats"

type CountStat = {
  kind?: "count"
  icon: typeof MapPin
  value: number
  suffix: string
  label: string
  decimals?: number
}

type LinkStat = {
  kind: "link"
  icon: typeof ShieldCheck
  href: string
  valueLabel: string
  label: string
}

const stats: Array<CountStat | LinkStat> = [
  { icon: MapPin, value: UTAH_CITIES_SERVED, suffix: "+", label: "Utah cities served" },
  { icon: Building, value: PROPERTIES_MANAGED, suffix: "+", label: "Properties managed & growing" },
  {
    kind: "link",
    icon: ShieldCheck,
    href: LICENSING_HREF,
    valueLabel: "Licensed",
    label: "Brokerage, PM & NMLS disclosures",
  },
  { icon: Clock, value: 24, suffix: "/7", label: "Emergency maintenance response" },
]

function useCountUp(target: number, decimals = 0, duration = 1200) {
  // Initialize at the TARGET value so SSR + first paint render the real number
  // ("55+" not "0+"). This matters for SEO crawlers and avoids the placeholder-y
  // "0+" flash users saw before JS hydrated.
  const [value, setValue] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced-motion preference: skip animation entirely.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Drop to 0 only AFTER mount (post-hydration) so SEO + above-the-fold paint
    // still see the real target value. Then animate from 0 -> target when the
    // element scrolls into view.
    setValue(0)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setValue(parseFloat((eased * target).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, decimals, duration])

  return { value, ref }
}

function StatItem({ icon: Icon, value: target, suffix, label, decimals = 0 }: CountStat) {
  const { value, ref } = useCountUp(target, decimals)

  return (
    <div className="flex flex-col items-center text-center gap-2">
      <Icon className="h-6 w-6 text-primary" aria-hidden />
      <span ref={ref} className="text-2xl font-bold text-foreground">
        {value}{suffix}
      </span>
      <span className="text-sm text-foreground/60">{label}</span>
    </div>
  )
}

function LinkStatItem({ icon: Icon, href, valueLabel, label }: LinkStat) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Icon className="h-6 w-6 text-primary" aria-hidden />
      <span className="text-2xl font-bold text-foreground underline-offset-4 hover:underline">
        {valueLabel}
      </span>
      <span className="text-sm text-foreground/60">{label}</span>
    </Link>
  )
}

export function SocialProofBar() {
  return (
    <section className="py-10 bg-muted/50 dark:bg-muted/10 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) =>
            stat.kind === "link" ? (
              <LinkStatItem key={stat.label} {...stat} />
            ) : (
              <StatItem key={stat.label} {...stat} />
            ),
          )}
        </div>
      </div>
    </section>
  )
}
