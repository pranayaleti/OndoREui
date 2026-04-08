"use client"

import { Building, MapPin, Star, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const stats = [
  { icon: MapPin, value: 55, suffix: "+", label: "Utah cities served" },
  { icon: Building, value: 200, suffix: "+", label: "Properties managed" },
  { icon: Star, value: 4.9, suffix: "★", label: "Average client rating", decimals: 1 },
  { icon: Clock, value: 24, suffix: "/7", label: "Emergency maintenance response" },
]

function useCountUp(target: number, decimals = 0, duration = 1200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

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

function StatItem({ icon: Icon, value: target, suffix, label, decimals = 0 }: (typeof stats)[number]) {
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

export function SocialProofBar() {
  return (
    <section className="py-10 bg-muted/50 dark:bg-muted/10 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
