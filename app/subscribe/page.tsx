"use client"

import { useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Mail, TrendingUp, Home, Wrench } from "lucide-react"
import { SITE_EMAILS } from "@/lib/site"

const topics = [
  {
    id: "market-updates",
    label: "Market Updates",
    description: "Utah real estate trends, rent rates, and investment outlook",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "new-listings",
    label: "New Property Listings",
    description: "Be first to see new rental and investment opportunities",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "maintenance-tips",
    label: "Property & Maintenance Tips",
    description: "Seasonal guides, landlord best practices, and maintenance checklists",
    icon: <Wrench className="h-4 w-4" />,
  },
]

export default function SubscribePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selected, setSelected] = useState<string[]>(["market-updates"])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <PageBanner
        title="Stay in the Loop"
        subtitle="Get Utah real estate insights, new listings, and property tips delivered to your inbox"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <Card>
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                  <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
                  <h2 className="text-2xl font-bold">You&apos;re subscribed!</h2>
                  <p className="text-foreground/70">
                    Thanks, <strong>{name || email}</strong>. You&apos;re now subscribed to Ondo
                    Real Estate updates. Check your inbox for a confirmation email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button asChild>
                      <Link href="/investments">Browse Investments</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <Mail className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Subscribe to updates</CardTitle>
                  <CardDescription>
                    Join thousands of investors and property owners getting Ondo&apos;s monthly
                    insights. No spam — unsubscribe anytime.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">First name (optional)</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your first name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Topics I&apos;m interested in</Label>
                      {topics.map((topic) => (
                        <label
                          key={topic.id}
                          htmlFor={topic.id}
                          className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            id={topic.id}
                            checked={selected.includes(topic.id)}
                            onCheckedChange={() => toggle(topic.id)}
                            className="mt-0.5"
                          />
                          <div>
                            <p className="font-medium text-sm flex items-center gap-1.5">
                              {topic.icon}
                              {topic.label}
                            </p>
                            <p className="text-xs text-foreground/60 mt-0.5">{topic.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Subscribing…" : "Subscribe"}
                    </Button>

                    <p className="text-center text-xs text-foreground/50">
                      By subscribing you agree to our{" "}
                      <Link href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                      </Link>
                      . You can{" "}
                      <Link href="/unsubscribe" className="hover:underline">
                        unsubscribe
                      </Link>{" "}
                      at any time.
                    </p>
                  </form>

                  <p className="mt-6 text-center text-xs text-foreground/50">
                    Questions?{" "}
                    <a href={`mailto:${SITE_EMAILS.primary}`} className="hover:underline">
                      {SITE_EMAILS.primary}
                    </a>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
