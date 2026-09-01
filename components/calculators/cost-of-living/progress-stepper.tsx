"use client"

import { Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export type StepDefinition = {
  id: string
  label: string
}

type ProgressStepperProps = {
  steps: StepDefinition[]
  currentId: string
  onSelect: (id: string) => void
}

export function ProgressStepper({ steps, currentId, onSelect }: ProgressStepperProps) {
  const index = Math.max(0, steps.findIndex((step) => step.id === currentId))
  const percent = steps.length <= 1 ? 100 : Math.round((index / (steps.length - 1)) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Step {index + 1} of {steps.length}
        </p>
        <p className="text-sm font-medium text-foreground">{steps[index]?.label}</p>
      </div>
      <Progress value={percent} className="h-2" aria-label="Calculator progress" />
      <ol className="hidden gap-1 overflow-x-auto pb-1 md:flex" aria-label="Calculator sections">
        {steps.map((step, stepIndex) => {
          const current = step.id === currentId
          const complete = stepIndex < index
          return (
            <li key={step.id} className="min-w-0 shrink-0">
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  current
                    ? "bg-primary text-primary-foreground"
                    : complete
                      ? "bg-muted text-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted",
                )}
                aria-current={current ? "step" : undefined}
              >
                {complete ? <Check className="h-3 w-3" aria-hidden /> : null}
                {step.label}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
