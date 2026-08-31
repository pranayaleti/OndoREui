import {
  RENTER_PATH_FAIR_HOUSING,
  RENTER_PATH_HEADING,
  renterPathIntro,
  renterPathSteps,
  type RenterPathVariant,
} from "@/lib/renter-path"
import { cn } from "@/lib/utils"

type RenterPathProps = {
  variant?: RenterPathVariant
}

export function RenterPath({ variant = "listings" }: RenterPathProps) {
  const intro = renterPathIntro(variant)
  const compact = variant === "listing-detail"
  const steps = renterPathSteps(variant)

  return (
    <section
      aria-labelledby="renter-path-heading"
      className={cn(
        "rounded-xl border border-border bg-card",
        compact ? "px-4 py-4" : "px-4 py-4 md:px-6 md:py-5",
      )}
    >
      <h2
        id="renter-path-heading"
        className={cn(
          "font-semibold tracking-tight text-foreground",
          compact ? "text-base" : "text-lg md:text-xl",
        )}
      >
        {RENTER_PATH_HEADING}
      </h2>
      <p className={cn("mt-1 text-foreground/70", compact ? "text-sm" : "text-sm md:text-base")}>
        {intro}
      </p>
      <ol
        className={cn(
          "mt-4",
          compact
            ? "grid gap-3 sm:grid-cols-3"
            : "grid gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border",
        )}
      >
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn("min-w-0", compact ? "" : "sm:px-4 first:sm:pl-0 last:sm:pr-0")}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {index === 0 ? "Start" : index === 1 ? "Next" : "Then"}
            </p>
            <p className="mt-1 font-medium text-foreground">
              {step.href ? (
                <a href={step.href} className="underline-offset-4 hover:underline">
                  {step.title}
                </a>
              ) : (
                step.title
              )}
            </p>
            <p className="mt-1 text-sm text-foreground/70">{step.body}</p>
          </li>
        ))}
      </ol>
      {variant === "listings" ? (
        <p className="mt-4 text-xs text-muted-foreground">{RENTER_PATH_FAIR_HOUSING}</p>
      ) : null}
    </section>
  )
}
