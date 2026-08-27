import Link from "next/link"
import { BUY_PROCESS_STEPS, SELL_PROCESS_STEPS, type BuySellProcessStep } from "@/lib/buy-sell-process"

type BuySellHowItWorksSectionProps = {
  audience: "buyer" | "seller"
}

function stepsFor(audience: BuySellHowItWorksSectionProps["audience"]): readonly BuySellProcessStep[] {
  switch (audience) {
    case "buyer":
      return BUY_PROCESS_STEPS
    case "seller":
      return SELL_PROCESS_STEPS
    default: {
      const _exhaustive: never = audience
      return _exhaustive
    }
  }
}

export function BuySellHowItWorksSection({ audience }: BuySellHowItWorksSectionProps) {
  const steps = stepsFor(audience)
  const headingId = `${audience}-how-it-works-heading`
  const title =
    audience === "buyer" ? "How buying with Ondo works" : "How selling with Ondo works"
  const intro =
    audience === "buyer"
      ? "Four steps from first conversation to close. Financing can start on day one via home loans — this is not an instant pre-qualification letter."
      : "Four steps from a CMA to close. We list, market, and negotiate; we do not promise a sale price or days on market."

  return (
    <section className="border-y border-border bg-card py-16" aria-labelledby={headingId}>
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Transaction timeline
          </p>
          <h2 id={headingId} className="mb-3 text-3xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-foreground/70">{intro}</p>
        </header>
        <ol className="grid grid-cols-1 gap-0 md:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.label}
              className="border-t-2 border-primary bg-background px-5 py-6 md:border-t-2 md:border-r md:border-r-border md:last:border-r-0"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {step.label}
              </p>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{step.desc}</p>
              {step.href && step.hrefLabel ? (
                <p className="mt-4">
                  <Link
                    href={step.href}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {step.hrefLabel}
                  </Link>
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
