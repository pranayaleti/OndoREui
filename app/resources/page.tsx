import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real Estate Resources | Guides, Formulas, Calculators & Glossary | Ondo Real Estate",
  description: "Central hub for Ondo Real Estate resources: buyer & seller guides, property management playbooks, loan education, notary help, key investment formulas, and glossary.",
  alternates: { canonical: `${SITE_URL}/resources/` },
  openGraph: {
    title: "Real Estate Resources | Guides, Formulas, Calculators & Glossary | Ondo Real Estate",
    description: "Central hub for Ondo Real Estate resources: buyer & seller guides, property management playbooks, loan education, notary help, key investment formulas, and glossary.",
  },
}


const formulaSections = [
  {
    id: "cre-formulas",
    title: "Key Real Estate & Investment Formulas",
    description:
      "These are the core metrics investors, owners, and lenders use to evaluate rentals, small multifamily, and commercial properties.",
    items: [
      {
        name: "Net Operating Income (NOI)",
        description:
          "Represents the income a property generates after subtracting operating expenses but before debt service and taxes.",
        formula: "NOI = Gross Rental Income − Operating Expenses",
      },
      {
        name: "Capitalization Rate (Cap Rate)",
        description:
          "Measures the unlevered return of a property by comparing NOI to the property value or purchase price.",
        formula: "Cap Rate = NOI ÷ Property Value",
      },
      {
        name: "Gross Rent Multiplier (GRM)",
        description:
          "A quick valuation shortcut that compares a property’s price to its gross rental income.",
        formula: "GRM = Property Price ÷ Gross Rental Income",
      },
      {
        name: "Cash-on-Cash Return",
        description:
          "Measures the annual pre-tax cash flow relative to the actual cash you invested.",
        formula: "Cash-on-Cash Return = (Annual Pre‑Tax Cash Flow ÷ Total Cash Invested) × 100",
      },
      {
        name: "Debt Service Coverage Ratio (DSCR)",
        description:
          "Shows how comfortably a property’s NOI covers its annual principal and interest payments.",
        formula: "DSCR = NOI ÷ Total Debt Service",
      },
      {
        name: "Loan-to-Value Ratio (LTV)",
        description:
          "Measures leverage by comparing the loan amount to the property’s value.",
        formula: "LTV = Loan Amount ÷ Property Value",
      },
      {
        name: "Break-Even Ratio (BER)",
        description:
          "Indicates what percentage of gross income is required to cover operating expenses and debt service.",
        formula: "BER = (Operating Expenses + Debt Service) ÷ Gross Rental Income",
      },
      {
        name: "Return on Investment (ROI)",
        description:
          "High-level profitability metric comparing net profit to the total amount invested.",
        formula: "ROI = (Net Profit ÷ Total Investment) × 100",
      },
    ],
  },
]

const glossaryHighlights = [
  {
    term: "Net Operating Income (NOI)",
    definition:
      "Total income after operating expenses (repairs, management, taxes, insurance, utilities where applicable), before debt service and income taxes.",
  },
  {
    term: "Cap Rate (Capitalization Rate)",
    definition:
      "NOI divided by purchase price or value, used to compare potential returns across similar properties.",
  },
  {
    term: "Debt Service",
    definition: "Total annual principal and interest payments owed on a property’s loans.",
  },
  {
    term: "Debt Service Coverage Ratio (DSCR)",
    definition:
      "A key lending metric indicating how many times NOI covers annual debt service; most lenders want DSCR above 1.20×.",
  },
  {
    term: "Gross Operating Income (GOI)",
    definition:
      "Gross rent plus other income (parking, storage, pet fees) minus vacancy and credit loss.",
  },
  {
    term: "Operating Expense Ratio (OER)",
    definition:
      "Operating expenses divided by effective gross income; helps compare cost efficiency across properties.",
  },
  {
    term: "Vacancy Rate",
    definition:
      "Percentage of rentable units or square footage that is not leased and not generating income.",
  },
  {
    term: "Investment Property",
    definition:
      "Real estate purchased primarily for income and/or appreciation rather than owner occupancy.",
  },
]

const loanFAQs = [
  {
    question: "What is the difference between pre-qualification and pre-approval?",
    answer:
      "A pre-qualification is a quick estimate based on self‑reported info. A true pre‑approval means a loan team has pulled credit, reviewed documents, and issued a letter that sellers can trust. We recommend going straight to pre‑approval before you seriously shop so you know your numbers are solid.",
  },
  {
    question: "Should I fix my credit before I buy a home?",
    answer:
      "Small improvements to credit can sometimes save you tens of thousands over the life of a loan. Before you wait a full year, have us or your lender model your current score vs. a slightly higher score. In some cases buying now with a refinance later makes more sense than waiting; in other cases, a short credit tune‑up is worth it.",
  },
  {
    question: "What monthly payment should I target?",
    answer:
      "Instead of just shopping by price, we encourage you to shop by comfortable monthly payment. Start from your budget, plug it into our calculators, then walk that back to a price range. This keeps you from getting emotionally attached to homes that would feel too tight month‑to‑month.",
  },
]

const notaryFAQs = [
  {
    question: "What do I need to bring to a notary appointment?",
    answer:
      "Bring a valid government‑issued photo ID, your unsigned documents, and any required witnesses. For Remote Online Notary (RON), you’ll also need a phone or computer with camera, microphone, and stable internet. We’ll guide you on exactly what each document type needs before your session.",
  },
  {
    question: "Can you notarize documents for out‑of‑state transactions?",
    answer:
      "Yes. Remote Online Notarization lets us notarize for clients located anywhere in the U.S., as long as the receiving party accepts RON documents (most modern lenders and employers do). We regularly support out‑of‑state real estate closings, employment forms, and business agreements.",
  },
  {
    question: "What’s the difference between mobile, in‑office, and online notarization?",
    answer:
      "In‑office means you come to our Lehi office. Mobile means we travel to you in Utah County. Remote Online Notarization (RON) happens completely online via secure video. All three are performed by the same commissioned notary; we’ll recommend the best option based on urgency, location, and document type.",
  },
]

const buySellRentFAQs = [
  {
    question: "Is it better to rent or buy right now in Utah?",
    answer:
      "It depends on how long you plan to stay, how stable your income is, and whether you’re comfortable with maintenance and market swings. Our rent‑vs‑own calculators and Utah‑specific blog posts help you see the real, long‑term costs. If you’re within a 3–7 year horizon, we’ll walk through both paths with actual numbers, not just rules of thumb.",
  },
  {
    question: "How do I know what my home is worth before I sell?",
    answer:
      "You can start with online estimates, but serious pricing should look at recent local sales, condition, upgrades, and competition. We combine data (comps, days on market) with on‑the‑ground Utah experience to recommend a pricing strategy, then keep adjusting based on showings and feedback.",
  },
  {
    question: "What should I do before listing my home for sale?",
    answer:
      "Most homes benefit from a deep clean, small cosmetic fixes, decluttering, and addressing obvious repairs. You don’t have to fully remodel to get a strong result. We’ll walk the home with you and prioritize only the projects that move the needle for your specific price point and neighborhood.",
  },
  {
    question: "What should I look for in a rental as a tenant?",
    answer:
      "Beyond price and location, look at responsiveness of management, clarity of the lease, condition of the unit, parking, and how maintenance is handled. With Ondo‑managed rentals, you’ll get clear expectations up front, documented move‑in condition, and easy ways to pay rent and submit maintenance requests.",
  },
]

export default function ResourcesPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Resources", url: `${SITE_URL}/resources` },
  ])

  return (
    <main className="min-h-screen">
      <SEO
        title="Real Estate Resources | Guides, Formulas, Calculators & Glossary"
        description="Central hub for Ondo Real Estate resources: buyer & seller guides, property management playbooks, loan education, notary help, key investment formulas, and glossary."
        pathname="/resources"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[breadcrumbJsonLd]}
      />

      <PageBanner
        title="Real Estate Resources"
        subtitle="Everything you need to understand Utah real estate, financing, property management, and notary workflows—without the jargon."
      />

      <PageBanner
        title="Real Estate Resources"
        subtitle="Everything you need to understand Utah real estate, financing, property management, and notary workflows—without the jargon."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 space-y-12">
          {/* Audience paths */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Start with the Path That Fits You</h2>
            <p className="text-foreground/70 mb-8">
              Whether you are buying, selling, investing, managing rentals, or just learning, this page connects you to
              the most useful tools and deep-dive content across the site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Home Buyers</CardTitle>
                  <CardDescription>
                    Plan your purchase, understand payments, and avoid common first-time mistakes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use mortgage & affordability tools to size your budget.</li>
                    <li>Learn about fixed, adjustable, FHA, VA, and USDA options.</li>
                    <li>Get Utah-specific insights on rent vs. own and long-term costs.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/buy">Explore buying</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/calculators">Open calculators</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/blog">Read buyer articles</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Sellers</CardTitle>
                  <CardDescription>
                    Understand pricing, timing, and strategy to maximize your Utah sale.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>See how Ondo handles marketing, negotiation, and contract management.</li>
                    <li>Estimate net proceeds and compare selling vs. holding.</li>
                    <li>Learn how your sale interacts with loans, payoff, and closing costs.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/sell">See selling options</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/calculators/home-sale">Estimate sale</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/blog">Seller & pricing tips</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Rental Property Owners</CardTitle>
                  <CardDescription>
                    Turn your rentals into a system: screening, maintenance, and reporting handled for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Understand our full-service Utah property management offering.</li>
                    <li>Explore owner dashboards, statements, and communication cadence.</li>
                    <li>Use formulas like NOI, cap rate, and cash-on-cash to track performance.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link
                        href={APP_PORTAL_URL}
                      >
                        Property management portal
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={APP_PORTAL_URL}>Owner sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/blog/property-management-automation-checklist">Owner playbook</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Tenants & Renters</CardTitle>
                  <CardDescription>
                    Learn how to apply, pay rent, and request maintenance the right way.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Step-by-step application expectations and documentation.</li>
                    <li>How maintenance requests, emergencies, and communication work.</li>
                    <li>Links to tenant portal, FAQs, and support resources.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={APP_PORTAL_URL}>Property management portal</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/faq/tenant-faqs">Tenant FAQs</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/faq/payments-faqs">Payment help</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Financing & Loans</CardTitle>
                  <CardDescription>
                    Deep dive into Utah mortgage options, refinance paths, and investor financing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Compare conventional, FHA, VA, USDA, and jumbo programs.</li>
                    <li>Model payments, buy-downs, and refinance scenarios in real time.</li>
                    <li>Understand DSCR, LTV, and other terms your lender cares about.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/loans">Loan overview</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/refinance/process">Refinance guide</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/calculators">Loan calculators</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Notary & Closings</CardTitle>
                  <CardDescription>
                    Remote online notarization (RON), mobile notary in Utah County, and loan signing support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Understand what to bring, how RON works, and typical fees.</li>
                    <li>See how Ondo Notary supports real estate, POA, estate, and business docs.</li>
                    <li>Book online and get ready for your signing in minutes.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/notary">Explore notary services</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/notary#contact">Contact notary</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/blog/remote-online-notary-real-estate-closings">RON overview</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Calculators & tools */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Interactive Tools & Calculators</h2>
            <p className="text-foreground/70 mb-6">
              Use these calculators to sanity-check deals, payments, and investment performance before you sign anything.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mortgage & Payment</CardTitle>
                  <CardDescription>Size your monthly payment and compare loan scenarios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Principal & interest breakdown</li>
                    <li>Taxes, insurance, and HOA assumptions</li>
                    <li>Impact of points and temporary buydowns</li>
                  </ul>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/calculators/mortgage-payment">Open payment calculator</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Affordability & Rent vs. Own</CardTitle>
                  <CardDescription>See what you can realistically afford and when owning beats renting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Income, debts, and down payment inputs</li>
                    <li>Closing costs and cash-to-close estimates</li>
                    <li>Long-term cost comparison</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/calculators/affordability">Affordability</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/blog/rent-vs-owning-hidden-math">Rent vs. own guide</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investor Metrics</CardTitle>
                  <CardDescription>Analyze cap rate, cash-on-cash, DSCR, and more.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cap rate & GRM shortcuts</li>
                    <li>Cash-on-cash return and ROI</li>
                    <li>Break-even occupancy and DSCR</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href="/calculators">All calculators</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/calculators/cap-rate">Cap rate tool</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Cards linking to dedicated FAQ pages */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-foreground/70 mb-6">
              Find detailed answers to common questions about loans, notary services, buying, selling, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Loans & Financing — Plain English</CardTitle>
                <CardDescription>
                  Simple explanations for the questions people actually type into Google about mortgages and refinance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/80">
                <ul className="space-y-3">
                  {loanFAQs.map((faq) => (
                    <li key={faq.question}>
                      <p className="font-semibold">{faq.question}</p>
                      <p className="text-foreground/70">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/loans">Go to Loans page</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/calculators">Try loan calculators</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Notary & Closings — What to Expect</CardTitle>
                <CardDescription>
                  Good‑to‑know details so your notarization or closing doesn’t get delayed at the last minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/80">
                <ul className="space-y-3">
                  {notaryFAQs.map((faq) => (
                    <li key={faq.question}>
                      <p className="font-semibold">{faq.question}</p>
                      <p className="text-foreground/70">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/notary">See full notary services</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/faq/escrow-faqs">Closing & escrow help</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Buy • Sell • Rent — Big Picture</CardTitle>
                <CardDescription>
                  High‑level guidance for common “Should I buy, sell, or keep renting?” questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/80">
                <ul className="space-y-3">
                  {buySellRentFAQs.map((faq) => (
                    <li key={faq.question}>
                      <p className="font-semibold">{faq.question}</p>
                      <p className="text-foreground/70">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/buy-sell">Explore buy/sell paths</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/search">Browse Utah listings</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/faq/buying-selling-faqs">See more FAQs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

          {/* Education: formulas & glossary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
              {formulaSections.map((section) => (
                <div key={section.id}>
                  <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-foreground/70 mb-4">{section.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item) => (
                      <Card key={item.name} className="h-full">
                        <CardHeader>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-foreground/80">
                          <p>{item.description}</p>
                          <p className="font-mono text-xs bg-muted/60 rounded px-2 py-1">
                            {item.formula}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-foreground/60">
                    Formulas adapted from institutional commercial real estate underwriting best practices, including
                    resources like Crux Commercial Partners.
                  </p>
                </div>
              ))}
            </div>

            <aside className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Glossary Highlights</CardTitle>
                  <CardDescription>
                    Fast definitions for the terms you will see in loan quotes, property management reports, and
                    investment decks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-foreground/80 max-h-[460px] overflow-y-auto pr-2">
                  {glossaryHighlights.map((entry) => (
                    <div key={entry.term}>
                      <p className="font-semibold">{entry.term}</p>
                      <p className="text-foreground/70">{entry.definition}</p>
                    </div>
                  ))}
                  <p className="text-xs text-foreground/60">
                    Glossary concepts based on common commercial and residential real estate language so you can speak the
                    same language as lenders, brokers, and investors.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deep-Dive Articles</CardTitle>
                  <CardDescription>Hand-picked guides to go deeper on strategy.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <ul className="space-y-2">
                    <li>
                      <Link href="/blog/engineering-real-estate-investment-calculators" className="underline underline-offset-2">
                        How we built our investment calculators
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/property-management-automation-checklist" className="underline underline-offset-2">
                        Automation checklist for landlords
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/utah-rent-vs-buy-wasatch-front" className="underline underline-offset-2">
                        Rent vs. buy on the Wasatch Front
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/technical-seo-for-real-estate" className="underline underline-offset-2">
                        Technical SEO for real estate investors
                      </Link>
                    </li>
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                    <Link href="/blog">Browse all articles</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>

          {/* Support & contact */}
          <div className="max-w-4xl mx-auto mt-4 mb-4">
            <Card className="border-primary/40 bg-muted/40">
              <CardHeader>
                <CardTitle>Need help choosing the right path?</CardTitle>
                <CardDescription>
                  If you are unsure whether to buy, sell, refinance, or simply optimize your rentals, we will walk through
                  the numbers with you.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm text-foreground/80">
                <p>
                  Share your goals (timeline, budget, and properties you own or want to own), and we will map them to a
                  clear plan using the same tools and formulas listed on this page.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/contact">Talk to our team</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/founders-letter">Read the founder&apos;s letter</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
