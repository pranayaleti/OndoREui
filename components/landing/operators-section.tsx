import Link from "next/link"
import { Button } from "@/components/ui/button"

export function OperatorsSection() {
  return (
    <section
      className="relative w-full bg-slate-950 text-white px-4 py-16"
      aria-labelledby="operators-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:items-start">
          {/* Left: value proposition */}
          <div className="min-w-0">
            <h2
              id="operators-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            >
              Why operators switch to Ondo Real Estate
            </h2>
            <p className="mt-4 text-lg text-slate-300 sm:text-xl">
              Purpose-built for lean teams running 1–20 units (and scaling).
            </p>
            <p className="mt-4 text-slate-400">
              Get autopay, screening, and maintenance in one place. Owners see real-time rent and
              maintenance; tenants get a single place to pay and request repairs.
            </p>
            <Button
              asChild
              className="mt-6 bg-white text-slate-900 hover:bg-slate-100"
            >
              <Link href="/contact#book-a-call">Get started</Link>
            </Button>
          </div>

          {/* Right: social proof / quote */}
          <div className="min-w-0">
            <blockquote className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8">
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                &ldquo;We launched autopay + screening in a weekend. Owners finally see real-time rent
                + maintenance, and we stopped chasing spreadsheets.&rdquo;
              </p>
              <footer className="mt-4 text-sm text-slate-400">
                — Property manager, Utah
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
