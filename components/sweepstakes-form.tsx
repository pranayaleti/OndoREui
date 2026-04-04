"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Gift, Loader2, Copy, Check, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { backendUrl } from "@/lib/backend"

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.ondorealestate.com"

interface SweepstakesFormProps {
  initialReferralCode?: string
}

export function SweepstakesForm({ initialReferralCode }: SweepstakesFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    referralCode: initialReferralCode || "",
    services: [] as string[],
    serviceDescription: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if at least one service is selected
    if (formData.services.length === 0) {
      toast({
        title: "Service Selection Required",
        description: "Please select at least one service you're interested in.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      // Include referralCode if it exists from URL parameter
      const submissionData = {
        ...formData,
        referralCode: formData.referralCode || undefined,
      }
      
      // Call upstream server directly for static deployment
      const response = await fetch(backendUrl("/api/sweepstakes"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedCode(data.referralCode)
        setIsSubmitted(true)
        toast({
          title: "Success!",
          description: "You've been entered into the sweepstakes!",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sweepstakes submission error:", error)
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(
        `${window.location.origin}/sweepstakes?ref=${generatedCode}`
      )
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  if (isSubmitted && generatedCode) {
    return (
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <CardTitle>You're In!</CardTitle>
          </div>
          <CardDescription>Your entry was successful. Share your referral code for bonus entries!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-primary" />
              <Label className="text-sm font-semibold">Your Referral Code</Label>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-bold text-primary flex-1 bg-background px-4 py-2 rounded border">
                {generatedCode}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
                className="hover:bg-primary hover:text-background"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold mb-2">Share Your Link:</h4>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/sweepstakes?ref=${generatedCode}`}
                className="text-sm"
              />
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <p className="text-sm text-foreground/70">
              <strong className="text-primary">Referral Benefits:</strong> For each person you refer who enters the sweepstakes, you get an extra entry!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          Enter the Sweepstakes
        </CardTitle>
        <CardDescription>
          Fill out the form below to enter and get your unique referral code
        </CardDescription>
      </CardHeader>

      {/* Cross-promotion banner */}
      <div className="mx-6 mb-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/40">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {t("referral.sweepstakesBannerText")}
            </p>
            <Link
              href={`${DASHBOARD_URL}/referrals`}
              className="mt-1 inline-block text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
            >
              {t("referral.sweepstakesGoToDashboard")}
            </Link>
          </div>
        </div>
      </div>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              required
            />
            <p className="text-xs text-foreground/70">
              We'll use this to contact you if you win!
            </p>
          </div>

          {initialReferralCode && (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-sm text-primary font-semibold">
                You were referred by someone! (Code: {initialReferralCode})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Which services are you interested in? *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "buying", label: "Buying & Selling" },
                { id: "property-management", label: "Property Management" },
                { id: "loans", label: "Loans & Financing" },
                { id: "notary", label: "Notary Services" },
              ].map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={service.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceDescription">Tell us more about what you need (Optional)</Label>
            <textarea
              id="serviceDescription"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              placeholder="Describe the specific services or assistance you're looking for..."
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Enter Sweepstakes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

