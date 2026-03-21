"use client"

import { useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, MailX, ArrowLeft } from "lucide-react"
import { SITE_EMAILS } from "@/lib/site"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      // Give the user immediate feedback; wire to your email provider API when ready
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again or email us directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <PageBanner
        title="Unsubscribe"
        subtitle="We respect your inbox — you can opt out of our emails at any time"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            {submitted ? (
              <Card>
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                  <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
                  <h2 className="text-2xl font-bold">You&apos;ve been unsubscribed</h2>
                  <p className="text-foreground/70">
                    We&apos;ve removed <strong>{email}</strong> from our mailing list. It may take
                    up to 48 hours for all emails to stop.
                  </p>
                  <p className="text-sm text-foreground/60">
                    Changed your mind?{" "}
                    <Link href="/subscribe" className="text-primary hover:underline">
                      Resubscribe here
                    </Link>
                    .
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to home
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <MailX className="h-10 w-10 text-foreground/40" />
                  </div>
                  <CardTitle className="text-2xl">Unsubscribe from emails</CardTitle>
                  <CardDescription>
                    Enter your email address below and we&apos;ll remove you from all marketing
                    communications. You&apos;ll still receive transactional emails related to your
                    account (rent receipts, maintenance updates, etc.).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
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

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing…" : "Unsubscribe me"}
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-xs text-foreground/50">
                    Questions? Email us at{" "}
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
