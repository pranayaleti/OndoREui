import type { Metadata } from "next"
import { Clock, Monitor, Lightbulb } from "lucide-react"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { DemoForm } from "./demo-form"

export const metadata: Metadata = {
  title: "Book a Demo | Ondo Real Estate",
  description: "Book a free 15-minute walkthrough of the Ondo platform. No pressure, no commitment.",
}

const valueProps = [
  { icon: Clock, label: "15-minute call" },
  { icon: Monitor, label: "Live platform walkthrough" },
  { icon: Lightbulb, label: "Custom recommendations" },
]

const steps = [
  "Fill out the form",
  "We confirm via email within 1 business day",
  "Join your live walkthrough — no install needed",
]

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Book a Demo | Ondo Real Estate"
        description="Book a free 15-minute walkthrough of the Ondo platform. No pressure, no commitment."
        pathname="/demo"
      />
      <PageBanner
        title="See Ondo in action"
        subtitle="Book a free 15-minute walkthrough. No pressure, no commitment."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Request a demo</h2>
              <DemoForm />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-10">
              {/* Value props */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">What you get</h2>
                <ul className="flex flex-col gap-3">
                  {valueProps.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to expect */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">What to expect</h2>
                <ol className="flex flex-col gap-4">
                  {steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <span className="text-foreground/80 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
