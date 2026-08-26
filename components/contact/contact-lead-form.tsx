"use client"

import { useState, useEffect, useId } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SITE_PHONE } from "@/lib/site"
import {
  submitContactLead,
  type ContactInquiryType,
  type ContactLeadSource,
} from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { useAntiSpam } from "@/lib/anti-spam"
import {
  isAgentInvokedSubmit,
  respondToAgent,
  toolEventMatches,
  webmcpFormAttrs,
  webmcpParamAttrs,
} from "@/lib/webmcp-attrs"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

const CONTACT_TOOL_DESCRIPTION =
  "Submit a contact or lead inquiry to Ondo Real Estate for property management, investments, or leasing in Utah. Requires name and email; optional phone and message."

const DEFAULT_SOURCE: ContactLeadSource = "website"

const WEBMCP_TOOL_NAME = "submit_contact_lead"

// Audience list is intentionally short: it maps 1:1 to how sales routes leads
// downstream (owner + agent → PM ops, renter → leasing, current_client →
// support, vendor → operations, other → catch-all).
export const CONTACT_INQUIRY_OPTIONS: ReadonlyArray<{
  value: ContactInquiryType
  labelKey: string
}> = [
  { value: "owner", labelKey: "contactForm.audience.owner" },
  { value: "renter", labelKey: "contactForm.audience.renter" },
  { value: "agent", labelKey: "contactForm.audience.agent" },
  { value: "current_client", labelKey: "contactForm.audience.currentClient" },
  { value: "vendor", labelKey: "contactForm.audience.vendor" },
  { value: "other", labelKey: "contactForm.audience.other" },
]

/**
 * After a successful submit we send the visitor somewhere useful for their
 * audience. Renters go to browse rentals; owners stay on /contact so the
 * Calendly embed on the same page is one scroll away. Anything else stays
 * put — no jarring redirect for support or general questions.
 */
function postSubmitPathFor(inquiryType: ContactInquiryType | ""): string | null {
  switch (inquiryType) {
    case "renter":
      return "/properties"
    case "agent":
      return "/affiliate"
    case "owner":
      return "/contact#book-a-call"
    case "current_client":
    case "vendor":
    case "other":
    case "":
      return null
  }
}

type ContactLeadFormProps = {
  source?: ContactLeadSource
  prefillMessage?: string
  /**
   * If set, the audience question is hidden and every submit is tagged with
   * this inquiry type. Use for lead-magnet or persona-specific pages where
   * the audience is already known.
   */
  defaultInquiryType?: ContactInquiryType
  /**
   * When true (default on the standalone /contact page), a successful submit
   * routes the visitor per {@link postSubmitPathFor}. Turn off for embeds
   * where a redirect would surprise users mid-scroll.
   */
  routeAfterSubmit?: boolean
}

export function ContactLeadForm({
  source = DEFAULT_SOURCE,
  prefillMessage = "",
  defaultInquiryType,
  routeAfterSubmit = false,
}: ContactLeadFormProps = {}) {
  const { t } = useTranslation()
  const router = useRouter()
  const instanceId = useId().replace(/:/g, "")
  const fieldId = (name: string) => `contact-${name}-${instanceId}`
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: prefillMessage,
  })
  const [inquiryType, setInquiryType] = useState<ContactInquiryType | "">(
    defaultInquiryType ?? "",
  )
  const [inquiryError, setInquiryError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [agentFormActive, setAgentFormActive] = useState(false)
  const { honeypotProps, gate } = useAntiSpam()

  useEffect(() => {
    const onActivated = (event: Event) => {
      if (toolEventMatches(event, WEBMCP_TOOL_NAME)) setAgentFormActive(true)
    }
    const onCancel = (event: Event) => {
      if (toolEventMatches(event, WEBMCP_TOOL_NAME)) setAgentFormActive(false)
    }
    window.addEventListener("toolactivated", onActivated)
    window.addEventListener("toolcancel", onCancel)
    return () => {
      window.removeEventListener("toolactivated", onActivated)
      window.removeEventListener("toolcancel", onCancel)
    }
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nativeEvent = e.nativeEvent
    const agentInvoked = isAgentInvokedSubmit(nativeEvent)
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? formData.name).trim()
    const email = String(data.get("email") ?? formData.email).trim()
    const phone = String(data.get("phone") ?? formData.phone).trim()
    const message = String(data.get("message") ?? formData.message).trim()
    const honeypotFilled = String(data.get(honeypotProps.name) ?? "").trim() !== ""

    // Audience is only required when the form actually shows the radios.
    // Persona-scoped embeds pass `defaultInquiryType` and don't render them.
    const effectiveInquiry: ContactInquiryType | "" =
      defaultInquiryType ?? inquiryType
    if (!defaultInquiryType && !effectiveInquiry) {
      setInquiryError(t("contactForm.audience.required"))
      return
    }
    setInquiryError(null)

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage(null)

    const work = (async () => {
      // Bot signal: honeypot filled, or a non-agent submit that arrives
      // faster than minDwell. Render success so bots can't probe the gate.
      // Agent fills can be instant, so skip the dwell check when Chrome
      // marks the submit as agentInvoked.
      if (honeypotFilled || (!agentInvoked && gate.isLikelyBot())) {
        gate.recordAttempt()
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", message: "" })
        return { status: "accepted" as const }
      }

      const attribution = getAttributionPayloadForApi()
      const result = await submitContactLead({
        name,
        email,
        ...(phone && { phone }),
        ...(message && { message }),
        source,
        ...(effectiveInquiry && { inquiryType: effectiveInquiry }),
        ...(attribution && { attribution }),
      })

      if ("error" in result) {
        setSubmitStatus("error")
        setErrorMessage(result.error)
        return result
      }
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
      if (!defaultInquiryType) setInquiryType("")
      setAgentFormActive(false)

      if (routeAfterSubmit) {
        const next = postSubmitPathFor(effectiveInquiry)
        if (next) {
          // Small delay so the success banner is visible before we navigate.
          window.setTimeout(() => router.push(next), 800)
        }
      }
      return result
    })()

    respondToAgent(nativeEvent, work)
    await work
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
        title: "Contact Ondo",
        description: CONTACT_TOOL_DESCRIPTION,
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name of the person submitting the inquiry" },
            email: { type: "string", description: "Email address for reply (required)" },
            phone: { type: "string", description: "Phone number (optional)" },
            message: { type: "string", description: "Message or question for the team (optional)" },
            inquiryType: {
              type: "string",
              enum: CONTACT_INQUIRY_OPTIONS.map((o) => o.value),
              description:
                "Which audience the visitor identifies with (owner, renter, agent, current_client, vendor, other). Helps sales route the lead.",
            },
          },
          required: ["name", "email"],
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(
          input: {
            name?: string
            email?: string
            phone?: string
            message?: string
            inquiryType?: string
          },
          client: { requestUserInteraction?: (cb: () => Promise<boolean>) => Promise<boolean> }
        ) {
          const name = String(input?.name ?? "").trim()
          const email = String(input?.email ?? "").trim()
          const phone = input?.phone != null ? String(input.phone).trim() : undefined
          const message = input?.message != null ? String(input.message).trim() : undefined
          const rawInquiry = input?.inquiryType != null ? String(input.inquiryType).trim() : ""
          const inquiryValue = CONTACT_INQUIRY_OPTIONS.find((o) => o.value === rawInquiry)?.value
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
            ...(inquiryValue && { inquiryType: inquiryValue }),
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
        <CardTitle className="dark:text-foreground">{t('contactForm.title')}</CardTitle>
        <CardDescription>
          {t('contactForm.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-700 dark:text-green-300 font-semibold">
                {t('contactForm.successTitle')}
              </p>
              <p className="text-green-600 dark:text-green-400 text-sm">
                {t('contactForm.successBody')}
              </p>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">
              {errorMessage ?? t('contactForm.errorFallback', { phone: SITE_PHONE })}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`grid gap-4${agentFormActive ? " tool-form-active" : ""}`}
          {...webmcpFormAttrs(WEBMCP_TOOL_NAME, CONTACT_TOOL_DESCRIPTION)}
        >
          {/* Honeypot: visually hidden, not focusable. Bots fill it; humans don't. */}
          <input {...honeypotProps} />
          {!defaultInquiryType && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                {t("contactForm.audience.legend")}{" "}
                <span aria-hidden="true" className="text-primary">*</span>
              </legend>
              <RadioGroup
                value={inquiryType}
                onValueChange={(value) => {
                  setInquiryType(value as ContactInquiryType)
                  setInquiryError(null)
                }}
                aria-required="true"
                aria-invalid={inquiryError ? "true" : undefined}
                aria-describedby={inquiryError ? fieldId("inquiry-error") : undefined}
                className="grid gap-2 sm:grid-cols-2"
              >
                {CONTACT_INQUIRY_OPTIONS.map((option) => {
                  const inputId = fieldId(`inquiry-${option.value}`)
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={inputId} />
                      <Label htmlFor={inputId} className="cursor-pointer font-normal">
                        {t(option.labelKey)}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
              {inquiryError && (
                <p
                  id={fieldId("inquiry-error")}
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {inquiryError}
                </p>
              )}
            </fieldset>
          )}
          <div className="space-y-2">
            <Label htmlFor={fieldId("name")}>{t('contactForm.nameLabel')}</Label>
            <Input
              id={fieldId("name")}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('contactForm.namePlaceholder')}
              required
              {...webmcpParamAttrs("Full name of the person submitting the inquiry")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldId("email")}>{t('contactForm.emailLabel')}</Label>
            <Input
              id={fieldId("email")}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('contactForm.emailPlaceholder')}
              type="email"
              required
              {...webmcpParamAttrs("Email address for reply (required)")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldId("phone")}>{t('contactForm.phoneLabel')}</Label>
            <Input
              id={fieldId("phone")}
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('contactForm.phonePlaceholder')}
              type="tel"
              {...webmcpParamAttrs("Phone number (optional)")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldId("message")}>{t('contactForm.messageLabel')}</Label>
            <Textarea
              className="min-h-[120px]"
              id={fieldId("message")}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('contactForm.messagePlaceholder')}
              {...webmcpParamAttrs("Message or question for the team (optional)")}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block" />
                {t('contactForm.sending')}
              </>
            ) : (
              t('contactForm.sendMessage')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
