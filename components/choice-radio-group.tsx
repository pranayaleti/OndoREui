"use client"

import { ArrowRight } from "lucide-react"
import { useRadioGroup } from "@/lib/use-radio-group"

/**
 * The big answer buttons of the homebuyer quiz and the get-matched wizard. Picking one moves
 * to the next question, so the arrow keys only move focus; Space or Enter picks.
 */
export function ChoiceRadioGroup<T extends string | boolean>({
  labelledBy,
  options,
  selected,
  onChoose,
}: {
  labelledBy: string
  options: readonly { value: T; label: string }[]
  selected: T | undefined
  onChoose: (value: T) => void
}) {
  const { groupProps, itemProps } = useRadioGroup(
    options.map((option) => option.value),
    selected,
  )

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="mt-6 grid gap-3" {...groupProps}>
      {options.map((option) => {
        const isSelected = selected === option.value
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChoose(option.value)}
            {...itemProps(option.value)}
            className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
            }`}
          >
            {option.label}
            <ArrowRight className="h-4 w-4 opacity-50" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
