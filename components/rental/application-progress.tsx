import { WIZARD_STEPS, type WizardStepId } from "@/lib/rental-application"

export function ApplicationProgress({
  currentStep,
  percent,
}: {
  currentStep: string
  percent: number
}) {
  const index = Math.max(
    0,
    WIZARD_STEPS.findIndex((step) => step.id === currentStep),
  )
  return (
    <div className="space-y-3" aria-label="Application progress">
      <p className="text-sm font-medium">
        Application {Math.max(0, Math.min(100, Math.round(percent)))}% complete
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-800"
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </div>
      <ol className="hidden gap-1 text-[11px] text-muted-foreground sm:flex">
        {WIZARD_STEPS.map((step, i) => (
          <li
            key={step.id}
            className={i <= index ? "font-medium text-foreground" : undefined}
            aria-current={step.id === (currentStep as WizardStepId) ? "step" : undefined}
          >
            {step.number}. {step.title}
          </li>
        ))}
      </ol>
    </div>
  )
}
