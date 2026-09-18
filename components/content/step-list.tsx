import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type Step = {
  title: string
  body: ReactNode
}

type StepListProps = {
  steps: readonly Step[]
  className?: string
}

/**
 * A numbered walkthrough. Uses a real <ol> with the number in the markup, so
 * the sequence survives when styles do not.
 */
export function StepList({ steps, className }: StepListProps) {
  if (steps.length === 0) return null

  return (
    <ol className={cn("not-prose my-8 space-y-5", className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary"
          >
            {index + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <h3 className="mb-1 text-base font-semibold text-foreground">{step.title}</h3>
            <div className="text-[0.95rem] leading-relaxed text-foreground/75">{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
