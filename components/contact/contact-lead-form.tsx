"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SITE_PHONE } from "@/lib/site"
import { submitContactLead, type ContactLeadSource } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { CheckCircle, AlertCircle } from "lucide-react"

const DEFAULT_SOURCE: ContactLeadSource = "website"

const WEBMCP_TOOL_NAME = "submit_contact_lead"

export function ContactLeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    setErrorMessage(null)

    const attribution = getAttributionPayloadForApi()
    const result = await submitContactLead({
      name: formData.name.trim(),
      email: formData.email.trim(),
      ...(formData.phone.trim() && { phone: formData.phone.trim() }),
      ...(formData.message.trim() && { message: formData.message.trim() }),
      source: DEFAULT_SOURCE,
      ...(attribution && { attribution }),
    })

    if ("error" in result) {
      setSubmitStatus("error")
      setErrorMessage(result.error)
    } else {
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
    }
    setIsSubmitting(false)
  }

  // WebMCP imperative API: register contact lead tool so agents can submit on behalf of user (with confirmation)
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null
    const modelContext = nav && "modelContext" in nav ? (nav as Navigator & { modelContext: { registerTool: (t: unknown) => void; unregisterTool: (name: string) => void } }).modelContext : null
    if (!modelContext) return

    try {
      modelContext.registerTool({
        name: WEBMCP_TOOL_NAME,
        description:
          "Submit a contact or lead inquiry to Ondo Real Estate for property management, investments, or leasing in Utah. Requires name and email; optional phone and message. Use when the user wants to get in touch with Ondo. Always request user confirmation before submitting.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name of the person submitting the inquiry" },
            email: { type: "string", description: "Email address for reply (required)" },
            phone: { type: "string", description: "Phone number (optional)" },
            message: { type: "string", description: "Message or question for the team (optional)" },
          },
          required: ["name", "email"],
        },
        async execute(
          input: { name?: string; email?: string; phone?: string; message?: string },
          client: { requestUserInteraction?: (cb: () => Promise<boolean>) => Promise<boolean> }
        ) {
          const name = String(input?.name ?? "").trim()
          const email = String(input?.email ?? "").trim()
          const phone = input?.phone != null ? String(input.phone).trim() : undefined
          const message = input?.message != null ? String(input.message).trim() : undefined
          if (!name || !email) {
            return { content: [{ type: "text", text: JSON.stringify({ error: "name and email are required" }) }] }
          }
          const confirmed =
            typeof client?.requestUserInteraction === "function"
              ? await client.requestUserInteraction(() =>
                  Promise.resolve(window.confirm(`Send contact request as ${name} (${email})?`))
                )
              : true
          if (!confirmed) {
            return { content: [{ type: "text", text: JSON.stringify({ status: "cancelled" }) }] }
          }
          const attr = getAttributionPayloadForApi()
          const result = await submitContactLead({
            name,
            email,
            ...(phone && { phone }),
            ...(message && { message }),
            source: DEFAULT_SOURCE,
            ...(attr && { attribution: attr }),
          })
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  "error" in result ? { error: result.error } : { success: true, message: result.message, leadId: result.leadId }
                ),
              },
            ],
          }
        },
      })
    } catch {
      // Duplicate tool or unsupported; ignore
    }
    return () => {
      try {
        modelContext.unregisterTool(WEBMCP_TOOL_NAME)
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-foreground">Get in touch</CardTitle>
        <CardDescription>
          Send us a message and we&apos;ll get back to you within one business day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold">
                Message sent!
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
              {errorMessage ?? `Something went wrong. Please try again or call us at ${SITE_PHONE}.`}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
          {...({
            toolname: "submit_contact_lead",
            tooldescription:
              "Submit a contact or lead inquiry to Ondo Real Estate. Use to send a message for property management, investments, or leasing in Utah. Requires name and email; optional phone and message. Do not use for automated bulk submissions.",
          } as Record<string, string>)}
        >
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name *</Label>
            <Input
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
              {...({ toolparamdescription: "Full name of the person submitting the inquiry" } as Record<string, string>)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email *</Label>
            <Input
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              type="email"
              required
              {...({ toolparamdescription: "Email address for reply (required)" } as Record<string, string>)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              type="tel"
              {...({ toolparamdescription: "Phone number (optional)" } as Record<string, string>)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              className="min-h-[120px]"
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can we help?"
              {...({ toolparamdescription: "Message or question for the team (optional)" } as Record<string, string>)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
