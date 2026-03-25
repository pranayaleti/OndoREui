import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, AlertTriangle, Calculator, Building2, Bot, TrendingUp, Bell, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "For Investors | Ondo Real Estate",
  description: "AI-powered portfolio analytics, cashflow modeling, and deal access for Utah real estate investors.",
}

const features = [
  { icon: BarChart3, title: "Portfolio analytics & risk scoring", body: "Track performance across every property with real-time risk scores and occupancy trends." },
  { icon: AlertTriangle, title: "At-risk tenant detection", body: "AI identifies payment risk before it becomes a problem — so you can intervene early." },
  { icon: Calculator, title: "Cashflow modeling", body: "Model returns, NOI, and cap rates across your portfolio with live financial data." },
  { icon: Building2, title: "Deal access", body: "Browse fractional and commercial investment opportunities in Utah." },
  { icon: Bot, title: "AI portfolio assistant", body: "Ask questions in plain English — get summaries, risk analysis, and vendor suggestions powered by Claude AI." },
  { icon: TrendingUp, title: "Predictive maintenance", body: "AI analyzes maintenance history to forecast upcoming costs and prevent expensive surprises." },
  { icon: Bell, title: "Real-time alerts", body: "Push notifications for late payments, maintenance emergencies, and lease expirations." },
  { icon: Wrench, title: "Vendor management", body: "Track preferred vendors, assign work orders, and compare costs across your portfolio." },
]

const steps = [
  "Connect your properties",
  "Get AI insights",
  "Act on recommendations",
]

export default function InvestorsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="For Investors | Ondo Real Estate"
        description="AI-powered portfolio analytics, cashflow modeling, and deal access for Utah real estate investors."
        pathname="/solutions/investors"
      />
      <PageBanner
        title="Grow your portfolio. Maximize returns."
        subtitle="AI-powered insights, cashflow modeling, and deal access — all in one platform."
      />

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-3">
                  <Icon className="h-7 w-7 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  <p className="text-foreground/70 text-sm">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">How it works</h2>
          <ol className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{i + 1}</span>
                <span className="text-foreground text-base">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/investments">Browse Opportunities</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Talk to an Expert</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
