import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OperatorsSection() {
  return (
    <section
      className="relative w-full bg-muted text-foreground px-4 py-16"
      aria-labelledby="operators-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* No customer quote here: we only publish named, permissioned references. The H2
            describes the portal, not "property management software": the homepage targets
            full-service management, and the /vs/ pages set Ondo against DIY software. */}
        <div className="max-w-3xl min-w-0">
          <h2
            id="operators-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            One portal for owners, tenants and maintenance
          </h2>
          <p className="mt-4 text-lg text-foreground/80 sm:text-xl">
            Purpose-built for Utah landlords and managers running 1–20 rental units and scaling.
          </p>
          <p className="mt-4 text-foreground/70">
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
