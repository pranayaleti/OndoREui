"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Download, Loader2 } from "lucide-react"
import { submitContactLead } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { isValidEmail } from "@/lib/security"

export function BrochureRequestForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.")
      return
    }
    setLoading(true)
    setError("")
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || "Brochure request"
    const result = await submitContactLead({
      name,
      email: trimmedEmail,
      phone: phone.trim() || undefined,
      source: "website",
      message: "Requested investor brochure / overview from /brochure.",
      attribution: getAttributionPayloadForApi(),
    })
    setLoading(false)
    if ("error" in result) {
      setError(result.error || "Something went wrong. Please try again.")
      return
    }
    setSubmitted(true)
  }

  return (
    <Card>
      <CardContent className="pt-8 pb-8">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="text-xl font-bold">Request received</h3>
            <p className="text-sm text-foreground/70">
              Thanks — we&apos;ll email the investor overview to <strong>{email}</strong> and follow
              up if you have questions.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact the team</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Download className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Request the overview</h3>
            <p className="text-center text-sm text-foreground/60 mb-6">
              Enter your details and we&apos;ll email you the investor overview.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first">First name</Label>
                  <Input
                    id="first"
                    name="first_name"
                    required
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last">Last name</Label>
                  <Input
                    id="last"
                    name="last_name"
                    required
                    placeholder="Smith"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Email me the overview
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-foreground/50">
                By submitting you agree to our{" "}
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
                . No spam.{" "}
                <Link href="/unsubscribe" className="hover:underline">
                  Unsubscribe
                </Link>{" "}
                anytime.
              </p>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}
