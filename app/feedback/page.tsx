"use client"

import React, { useState, useRef, useEffect } from "react"
import SEO from "@/components/seo"
import { SITE_URL } from "@/lib/site"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { Gift, MessageCircle, Sparkles } from "lucide-react"
import { backendUrl } from "@/lib/backend"

export default function FeedbackPage() {
  const [suggestion, setSuggestion] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submittedCount, setSubmittedCount] = useState(0)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => { if (successTimerRef.current) clearTimeout(successTimerRef.current) }
  }, [])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!suggestion.trim()) {
      setErrorMessage("Please enter a suggestion before submitting.")
      setStatus("error")
      return
    }

    setErrorMessage(null)
    setStatus("submitting")

    try {
      const res = await fetch(backendUrl("/api/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestion: suggestion.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data?.message ?? "Something went wrong. Please try again.")
        setStatus("error")
        return
      }

      setSubmittedCount((prev) => prev + 1)
      setSuggestion("")
      setEmail("")
      setPhone("")
      setStatus("success")
      successTimerRef.current = setTimeout(() => setStatus("idle"), 3000)
    } catch {
      setErrorMessage("Failed to submit. Please check your connection and try again.")
      setStatus("error")
    }
  }

  return (
    <main className="min-h-screen bg-background dark:bg-transparent">
      <SEO
        title="Suggest Improvements | Ondo Real Estate"
        description="Share ideas to improve Ondo Real Estate. Our suggestion tracker highlights the best ideas, and top contributors can receive gift cards as a thank-you."
        pathname="/feedback"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Share Feedback", url: `${SITE_URL}/feedback` },
        ])}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--gradient-from)] via-[var(--color-gradient-via)] to-[var(--color-gradient-to)]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 text-xs font-medium text-primary shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Suggestion Tracker</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Share feedback. Shape the future of Ondo.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
            We&apos;re building Ondo in the open and your ideas directly influence what we build next.{" "}
            <span className="font-semibold text-primary">
              The best suggestions will be highlighted in our suggestion tracker, and top contributors may receive
              gift cards as a thank-you.
            </span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <section className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm" aria-labelledby="feedback-form-heading">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 id="feedback-form-heading" className="text-xl font-semibold text-foreground">
                Send us your suggestion
              </h2>
            </div>
            <p className="text-base text-foreground/70">
              Share anything—from product ideas and UX improvements to new services you&apos;d love to see. Short,
              direct, and honest feedback is perfect.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-describedby="feedback-status"
            >
              <div className="space-y-2">
                <label htmlFor="suggestion" className="block text-sm font-medium text-foreground">
                  Your suggestion
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  rows={5}
                  value={suggestion}
                  onChange={(event) => setSuggestion(event.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  placeholder="Tell us what would make Ondo even better for you..."
                  required
                  aria-describedby={errorMessage ? "suggestion-error" : undefined}
                />
                {errorMessage && (
                  <p id="suggestion-error" className="text-sm text-red-500">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email (optional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  placeholder="Add your email if you&apos;d like us to follow up"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  pattern="^[0-9+()\-\\s]*$"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/[^0-9+()\-\\s]/g, ""))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  placeholder="Add your phone number if you prefer a call or text"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || !suggestion.trim()}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Submitting..." : "Submit suggestion"}
              </button>

              <p
                id="feedback-status"
                role="status"
                aria-live="polite"
                className="text-sm"
              >
                {status === "success" && (
                  <span className="font-medium text-emerald-500">
                    Thank you for sharing your idea — it&apos;s been added to our suggestion tracker.
                  </span>
                )}
                {status === "submitting" && (
                  <span className="text-foreground/70">Submitting your suggestion…</span>
                )}
                {status === "error" && errorMessage && (
                  <span className="text-red-500">{errorMessage}</span>
                )}
              </p>
            </form>
          </div>

          <aside className="space-y-4 rounded-xl border border-border bg-card/60 p-8">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">How the suggestion tracker works</h2>
            </div>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li>
                <span className="font-semibold text-foreground">1. You submit an idea.</span> We review suggestions on
                a rolling basis and group them into themes.
              </li>
              <li>
                <span className="font-semibold text-foreground">2. We highlight the best ones.</span> The most impactful
                and actionable ideas are added to our internal roadmap and public suggestion tracker.
              </li>
              <li>
                <span className="font-semibold text-foreground">3. Gift card thank-yous.</span> From time to time, we
                reach out to selected contributors with gift cards to say thanks for helping us improve.
              </li>
            </ul>

            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-foreground/80">
              <p className="mb-1 font-semibold text-foreground">Suggestions from this browser</p>
              <p className="text-foreground/70">
                You&apos;ve submitted{" "}
                <span className="font-semibold text-primary">
                  {submittedCount} {submittedCount === 1 ? "suggestion" : "suggestions"}
                </span>
                . We&apos;ll share overall community stats once the tracker launches publicly.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

