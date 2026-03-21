import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  ArrowRight,
  BookOpen,
  Phone,
} from "lucide-react"

export const metadata: Metadata = {
  title: "New Investors | Get Started with Ondo Real Estate",
  description:
    "New to real estate investing? Ondo Real Estate guides first-time investors through passive income, multifamily properties, and long-term wealth-building in Utah.",
  alternates: { canonical: `${SITE_URL}/new-investors/` },
  openGraph: {
    title: "New Investors | Get Started with Ondo Real Estate",
    description:
      "New to real estate investing? Learn how Ondo Real Estate can help you build passive income through professionally managed properties in Utah.",
    url: `${SITE_URL}/new-investors`,
  },
}

const steps = [
  {
    step: "01",
    title: "Learn the basics",
    description:
      "Explore our free resources on rental income, property classes, and how passive investing works.",
    icon: <BookOpen className="h-6 w-6" />,
    cta: { label: "Browse resources", href: "/resources" },
  },
  {
    step: "02",
    title: "Schedule a consultation",
    description:
      "Talk with our investor relations team to discuss your goals, timeline, and risk tolerance.",
    icon: <Phone className="h-6 w-6" />,
    cta: { label: "Contact us", href: "/contact" },
  },
  {
    step: "03",
    title: "Review opportunities",
    description:
      "Get access to curated investment properties and our current portfolio performance data.",
    icon: <TrendingUp className="h-6 w-6" />,
    cta: { label: "See investments", href: "/investments" },
  },
  {
    step: "04",
    title: "Start earning",
    description:
      "Once you invest, our team handles everything — tenant placement, maintenance, and monthly reporting.",
    icon: <DollarSign className="h-6 w-6" />,
    cta: { label: "Owner portal", href: "/owner" },
  },
]

const benefits = [
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Professionally managed",
    description:
      "Our in-house team handles leasing, maintenance, and tenant relations so you never get a 2 a.m. call.",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Consistent cash flow",
    description:
      "Monthly rent distributions are deposited directly to your account with detailed owner statements.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Vetted tenant network",
    description:
      "Rigorous credit, income, and background checks protect your investment from day one.",
  },
  {
    icon: <DollarSign className="h-7 w-7" />,
    title: "Tax advantages",
    description:
      "Real estate offers powerful tax benefits including depreciation, 1031 exchanges, and mortgage interest deductions.",
  },
]

const faqs = [
  {
    q: "How much do I need to get started?",
    a: "Minimums vary by opportunity. Speak with our team to find options that fit your budget.",
  },
  {
    q: "Do I need to be an accredited investor?",
    a: "Some offerings require accreditation. Contact us and we'll walk you through the requirements for each opportunity.",
  },
  {
    q: "How passive is passive investing?",
    a: "Once you invest, our property management team handles day-to-day operations. You review monthly statements and that's it.",
  },
  {
    q: "What markets do you invest in?",
    a: "We focus primarily on Utah multifamily and single-family properties, with deep local market expertise.",
  },
]

export default function NewInvestorsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="New Investors | Get Started with Ondo Real Estate"
        description="New to real estate investing? Ondo Real Estate guides first-time investors through passive income, multifamily properties, and wealth-building in Utah."
        pathname="/new-investors"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "New Investors", url: `${SITE_URL}/new-investors` },
        ])}
      />

      <PageBanner
        title="New to investing?"
        subtitle="We'll guide you from your first question to your first distribution check"
      />

      {/* Why real estate */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why real estate?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Real estate has created more millionaires than any other asset class. With Ondo, you
              get the upside of property ownership without the landlord headaches.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <Card key={b.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-primary">{b.icon}</span>
                    {b.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 text-sm">{b.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting started steps */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to get started</h2>
            <p className="text-foreground/70">Four simple steps from curious to cash-flowing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((s) => (
              <Card key={s.step} className="relative overflow-hidden">
                <CardContent className="pt-6 pb-6">
                  <span className="absolute top-4 right-4 text-5xl font-black text-foreground/5 select-none">
                    {s.step}
                  </span>
                  <div className="text-primary mb-3">{s.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-foreground/70 text-sm mb-4">{s.description}</p>
                  <Button asChild variant="link" className="p-0 h-auto text-sm">
                    <Link href={s.cta.href}>
                      {s.cta.label} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">Common questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">{faq.q}</p>
                      <p className="text-foreground/70 text-sm">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-foreground/60">
            More questions?{" "}
            <Link href="/faq" className="text-primary hover:underline">
              Browse our full FAQ
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start building wealth?</h2>
          <p className="mb-8 opacity-90">
            Schedule a free, no-obligation call with our investor relations team. We&apos;ll answer
            your questions and help you find the right opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Schedule a call</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-primary">
              <Link href="/investments">Browse investments</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-70">
            Prefer email?{" "}
            <a href={`mailto:${SITE_EMAILS.primary}`} className="underline">
              {SITE_EMAILS.primary}
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
