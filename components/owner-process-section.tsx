import { OWNER_ONBOARDING_NOTE, OWNER_PROCESS_STEPS } from "@/lib/owner-process"

type OwnerProcessSectionProps = {
  cityName: string
}

export function OwnerProcessSection({ cityName }: OwnerProcessSectionProps) {
  return (
    <section className="rounded-lg bg-muted p-8">
      <h2 className="mb-3 text-2xl font-bold">How Ondo works for {cityName} property owners</h2>
      <p className="mb-6 text-sm text-foreground/70">{OWNER_ONBOARDING_NOTE}</p>
      <ol className="space-y-6">
        {OWNER_PROCESS_STEPS.map((step) => (
          <li key={step.step} className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {step.step}
            </div>
            <div>
              <h3 className="mb-1 font-semibold">{step.title}</h3>
              <p className="text-foreground/70">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
