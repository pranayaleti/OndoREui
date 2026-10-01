import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
  }
>(({ className, value, max, indicatorClassName, ...props }, ref) => {
  // Clamp so out-of-range values never push the indicator outside the track.
  const percent = Math.min(100, Math.max(0, ((value ?? 0) / (max ?? 100)) * 100))
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      max={max}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
