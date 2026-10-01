"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE_PHONE } from "@/lib/site"
import { buildLeadMessage, submitContactLead } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { splitPhoneForLead } from "@/lib/consultation-lead"
import { CheckCircle, AlertCircle } from "lucide-react"

interface InvestmentInquiryFormProps {
  investmentTitle: string
}

export function InvestmentInquiryForm({ investmentTitle }: InvestmentInquiryFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // POST /api/leads/contact. Investment inquiries have no type of their own
      // yet, so they go in as "other" with the investment named in the message.
      const { phone, note } = splitPhoneForLead(formData.phone)
      const attribution = getAttributionPayloadForApi()
      const result = await submitContactLead({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        ...(phone && { phone }),
        source: "website",
        inquiryType: "other",
        message: buildLeadMessage(
          [
            ["Investment inquiry", investmentTitle],
            ["Phone (as typed)", note],
          ],
          formData.message,
        ),
        ...(attribution && { attribution }),
      }, { formName: "investment_inquiry" })

      if ("error" in result) throw new Error(result.error)

      setSubmitStatus("success")
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" })
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-foreground">Interested in This Investment?</CardTitle>
        <CardDescription>
          Submit your inquiry and our investment team will follow up within one business day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold">
                Inquiry submitted!
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                We&apos;ll be in touch within one business day.
              </p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">
              Something went wrong. Please try again or call us at {SITE_PHONE}.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              type="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              className="min-h-[100px]"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your investment goals or ask a question..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              "Submit Inquiry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
