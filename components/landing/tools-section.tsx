import Link from "next/link"
import { Calculator, Home } from "lucide-react"
import { ESTIMATE_DATA_DISCLOSURE } from "@/lib/home-value-estimate"

const CALCULATORS = [
  { href: "/calculators/rent-vs-own", label: "Rent vs own" },
  { href: "/calculators/mortgage-payment", label: "Mortgage payment" },
  { href: "/calculators/owner-vs-self", label: "Self-manage vs Ondo" },
  { href: "/calculators/home-sale", label: "Home sale proceeds" },
] as const

export function ToolsSection() {
  return (
    <section className="bg-background py-16" aria-labelledby="tools-heading">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 id="tools-heading" className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          Run your own numbers
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/whats-my-home-worth"
            className="flex flex-col rounded-xl border border-primary/40 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Home className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-foreground">Free home estimate</span>
            <span className="mt-1 text-sm text-foreground/70">
              A rent and sale range for your home in any Wasatch Front city. No signup.
            </span>
          </Link>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-lg font-semibold text-foreground">Calculators</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {CALCULATORS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-primary underline underline-offset-4">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/calculators" className="text-foreground/70 underline underline-offset-4">
                  All calculators
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-foreground/50">{ESTIMATE_DATA_DISCLOSURE}</p>
      </div>
    </section>
  )
}
