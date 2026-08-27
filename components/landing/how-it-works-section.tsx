import Link from "next/link"
import { Upload, BarChart3, Wrench, Wallet } from "lucide-react"
import { OWNER_PROCESS_STEPS } from "@/lib/owner-process"

const stepIcons = [Upload, Wallet, Wrench, BarChart3] as const

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-background dark:bg-[var(--gradient-overlay)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-foreground">How Ondo RE works for property owners</h2>
        <p className="text-center text-foreground/70 mb-4 max-w-2xl mx-auto">
          Hand off the day-to-day and keep full visibility. Most owners are set up within a week.
        </p>
        <p className="text-center text-sm text-foreground/70 mb-12 max-w-2xl mx-auto">
          Already working with another manager? Typical onboarding is 48–72 hours, with no setup fee
          and 30 days&apos; written notice to cancel.{" "}
          <Link href="/contact/" className="font-medium text-primary underline-offset-4 hover:underline">
            Talk with the team
          </Link>
          .
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {OWNER_PROCESS_STEPS.map((step, index) => {
            const Icon = stepIcons[index] ?? Upload
            return (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
                  <Icon className="h-8 w-8 text-foreground dark:text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-foreground">{step.step}. {step.title}</h3>
                <p className="text-foreground/70 dark:text-foreground/70">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            See pricing
          </Link>
          <Link href="/properties" className="font-medium text-primary underline-offset-4 hover:underline px-6 py-3">
            Browse rentals
          </Link>
        </div>
      </div>
    </section>
  )
}