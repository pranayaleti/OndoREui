"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Trans, useTranslation } from "react-i18next"
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { analytics } from "@/lib/analytics"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { submitContactLead } from "@/lib/leads-api"
import { SecureStorage, isValidEmail } from "@/lib/security"

const POPUP_STATE_KEY = "ondo:first-visit-lead-popup:v1"
const POPUP_TIMER_MS = 25_000
const POPUP_SCROLL_RATIO = 0.6

const EXCLUDED_EXACT_PATHS = new Set([
  "/contact",
  "/qualify",
  "/demo",
  "/apply",
  "/invite",
  "/verify",
  "/unsubscribe",
  "/privacy-policy",
])

const EXCLUDED_PREFIXES = [
  "/apply",
  "/invite",
  "/verify",
  "/owner",
  "/tenant",
  "/platform",
  "/auth",
  "/login",
]

type PopupStatus = "idle" | "submitting" | "success" | "error"
type StoredPopupStatus = "dismissed" | "submitted"

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "")
}

function isEligiblePath(pathname: string): boolean {
  const normalized = normalizePathname(pathname)

  if (EXCLUDED_EXACT_PATHS.has(normalized)) return false

  return !EXCLUDED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  )
}

function hasStoredDecision(): boolean {
  return SecureStorage.getItem(POPUP_STATE_KEY) !== null
}

function rememberDecision(status: StoredPopupStatus) {
  SecureStorage.setItem(
    POPUP_STATE_KEY,
    JSON.stringify({ status, recordedAt: new Date().toISOString() })
  )
}

function supportsDesktopExitIntent(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export function FirstVisitLeadPopup() {
  const pathname = usePathname() ?? "/"
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [open, setOpen] = useState(false)
  const [hasDecision, setHasDecision] = useState(true)
  const [keepOpenOnSuccess, setKeepOpenOnSuccess] = useState(false)
  const [status, setStatus] = useState<PopupStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const eligiblePath = useMemo(() => isEligiblePath(pathname), [pathname])

  useEffect(() => {
    setHasDecision(hasStoredDecision())
  }, [])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!eligiblePath || hasDecision) {
      if (!keepOpenOnSuccess) {
        setOpen(false)
      }
      return
    }

    let cleanedUp = false
    let timerId: ReturnType<typeof setTimeout> | null = null

    const cleanup = () => {
      if (cleanedUp) return
      cleanedUp = true

      if (timerId) {
        clearTimeout(timerId)
      }

      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }

    const trigger = () => {
      if (cleanedUp || hasStoredDecision()) {
        cleanup()
        return
      }

      cleanup()
      setStatus("idle")
      setErrorMessage(null)
      setOpen(true)
    }

    const handleScroll = () => {
      const doc = document.documentElement
      if (!doc?.scrollHeight) return

      const progress = (window.scrollY + window.innerHeight) / doc.scrollHeight
      if (progress >= POPUP_SCROLL_RATIO) {
        trigger()
      }
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        trigger()
      }
    }

    timerId = setTimeout(trigger, POPUP_TIMER_MS)
    window.addEventListener("scroll", handleScroll, { passive: true })

    if (supportsDesktopExitIntent()) {
      document.addEventListener("mouseleave", handleMouseLeave)
    }

    handleScroll()

    return cleanup
  }, [eligiblePath, hasDecision, keepOpenOnSuccess])

  const updateFormField = (field: "name" | "email", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const dismissPopup = () => {
    rememberDecision("dismissed")
    analytics.trackEngagement("dismiss_popup", "first_visit_lead_popup")
    setKeepOpenOnSuccess(false)
    setHasDecision(true)
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true)
      return
    }

    if (status === "success") {
      setKeepOpenOnSuccess(false)
      setOpen(false)
      return
    }

    dismissPopup()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = formData.name.trim()
    const email = formData.email.trim()

    if (!name) {
      setStatus("error")
      setErrorMessage(t("leadPopup.validation.nameRequired"))
      return
    }

    if (!email) {
      setStatus("error")
      setErrorMessage(t("leadPopup.validation.emailRequired"))
      return
    }

    if (!isValidEmail(email)) {
      setStatus("error")
      setErrorMessage(t("leadPopup.validation.emailInvalid"))
      return
    }

    setStatus("submitting")
    setErrorMessage(null)

    const attribution = getAttributionPayloadForApi()
    const result = await submitContactLead({
      name,
      email,
      source: "popup",
      message: `First-visit popup lead from ${normalizePathname(pathname)}`,
      ...(attribution && { attribution }),
    })

    if ("error" in result) {
      analytics.trackFormSubmission("first_visit_lead_popup", false)
      setStatus("error")
      setErrorMessage(t("leadPopup.submitError"))
      return
    }

    rememberDecision("submitted")
    analytics.trackFormSubmission("first_visit_lead_popup", true)
    analytics.trackLeadGeneration("popup")
    setHasDecision(true)
    setKeepOpenOnSuccess(true)
    setStatus("success")
    setFormData({ name: "", email: "" })

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }

    successTimeoutRef.current = setTimeout(() => {
      setKeepOpenOnSuccess(false)
      setOpen(false)
    }, 1800)
  }

  if (!eligiblePath) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md overflow-hidden border-primary/20 p-0"
        closeLabel={t("actions.close")}
      >
        <div className="bg-gradient-to-br from-primary/10 via-background to-muted/70 px-6 pb-4 pt-6">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle>{t("leadPopup.title")}</DialogTitle>
            <DialogDescription>{t("leadPopup.body")}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="font-semibold">{t("leadPopup.successTitle")}</p>
                  <p className="text-sm text-emerald-800">{t("leadPopup.successBody")}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && errorMessage ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="first-visit-popup-name">{t("leadPopup.nameLabel")}</Label>
                <Input
                  id="first-visit-popup-name"
                  autoComplete="name"
                  placeholder={t("leadPopup.namePlaceholder")}
                  value={formData.name}
                  onChange={(event) => updateFormField("name", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-visit-popup-email">{t("leadPopup.emailLabel")}</Label>
                <Input
                  id="first-visit-popup-email"
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  placeholder={t("leadPopup.emailPlaceholder")}
                  value={formData.email}
                  onChange={(event) => updateFormField("email", event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={dismissPopup}>
                  {t("leadPopup.dismissCta")}
                </Button>
                <Button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("leadPopup.submitting")}
                    </>
                  ) : (
                    t("leadPopup.submitCta")
                  )}
                </Button>
              </div>

              <p className="text-xs leading-relaxed text-foreground/60">
                <Trans
                  i18nKey="leadPopup.privacyNotice"
                  components={{
                    privacyLink: (
                      <Link
                        href="/privacy-policy"
                        className="font-medium text-foreground/80 underline underline-offset-4"
                      />
                    ),
                  }}
                />
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
