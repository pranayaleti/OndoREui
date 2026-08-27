import Link from "next/link"

type NextStep = {
  href: string
  label: string
  hint: string
}

const BUY_NEXT_STEPS: readonly NextStep[] = [
  { href: "/loans", label: "Home loans", hint: "Conventional, FHA, VA, USDA — not a credit decision on this page." },
  { href: "/calculators", label: "Calculators", hint: "Payment, affordability, buying power, and more." },
  { href: "/calculators/rent-vs-own", label: "Rent vs own", hint: "Compare long-term cost and equity with your numbers." },
  { href: "/get-matched", label: "Work with an agent", hint: "A short quiz so we can route you to the right person." },
  { href: "/contact?audience=buyer", label: "Contact (buying)", hint: "Send a buyer inquiry. Portals stay invite-only." },
  { href: "/properties", label: "Browse rentals", hint: "Live inventory on this site is rentals we manage, not homes for sale." },
]

const SELL_NEXT_STEPS: readonly NextStep[] = [
  { href: "/whats-my-home-worth", label: "What’s my home worth?", hint: "City-median estimate first. A CMA is a conversation, not the widget." },
  { href: "/get-matched", label: "Get matched", hint: "Tell us you’re selling and we’ll route a listing conversation." },
  { href: "/faq/buying-selling-faqs", label: "Buying & selling FAQs", hint: "Compensation, agreements, and Utah process questions." },
  { href: "/contact?audience=seller#book-a-call", label: "Contact (selling)", hint: "Seller inquiry plus Calendly on the same page." },
  { href: "/calculators/home-sale", label: "Sale proceeds calculator", hint: "Estimate net proceeds. Not a quote." },
  { href: "/resources/templates", label: "Listing-prep checklist", hint: "Request the showing-prep file — we email it, it is not an instant download." },
]

type BuySellNextStepsProps = {
  audience: "buyer" | "seller"
}

export function BuySellNextSteps({ audience }: BuySellNextStepsProps) {
  const steps = audience === "buyer" ? BUY_NEXT_STEPS : SELL_NEXT_STEPS
  const headingId = `${audience}-next-steps-heading`
  const title = audience === "buyer" ? "Next steps for buyers" : "Next steps for sellers"

  return (
    <nav aria-labelledby={headingId} className="py-16">
      <div className="container mx-auto px-4">
        <h2 id={headingId} className="mb-8 text-center text-3xl font-bold text-foreground">
          {title}
        </h2>
        <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="font-semibold text-primary">{step.label}</span>
                <span className="mt-2 text-sm text-foreground/70">{step.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
