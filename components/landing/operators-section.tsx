import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OperatorsSection() {
  return (
    <section
      className="relative w-full bg-muted text-white px-4 py-16"
      aria-labelledby="operators-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* No customer quote here: we only publish named, permissioned references. */}
        <div className="max-w-3xl min-w-0">
          <h2
            id="operators-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            Property management software for Utah landlords and managers
          </h2>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            Purpose-built for Utah landlords and managers running 1–20 rental units and scaling.
          </p>
          <p className="mt-4 text-slate-400">
            Autopay rent collection, tenant screening, and maintenance coordination in one platform.
            Owners see real-time financials and maintenance status; tenants get a single portal to pay
            rent and request repairs.
          </p>
          <Button
            asChild
            className="mt-6 bg-card text-card-foreground hover:bg-muted"
          >
            <Link href="/contact#book-a-call">Get started</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
