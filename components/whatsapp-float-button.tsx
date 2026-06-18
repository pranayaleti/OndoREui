"use client"

/**
 * Floating WhatsApp contact button.
 *
 * - Renders only when `NEXT_PUBLIC_WHATSAPP_NUMBER` is set (E.164 digits only,
 *   e.g. "14085380420"). When unset the component is a no-op so safe to mount
 *   in every layout/page.
 * - Hidden on auth/dashboard routes (handled by the consumer layout via
 *   pathname checks, mirroring footer behavior). The button itself does NOT
 *   inspect pathname so it can be reused anywhere.
 * - Persistently dismissible per browser via localStorage.
 * - Opens wa.me link in a new tab with a prefilled message — works on mobile
 *   (deep-links to WhatsApp app) and desktop (web.whatsapp.com).
 *
 * NOTE(i18n): user-facing copy uses react-i18next when available; falls back
 * to English when the `t` namespace isn't loaded so the button never renders
 * an i18n key.
 */

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { analytics } from "@/lib/analytics"

const DISMISS_KEY = "ondo:whatsapp-float:dismissed:v1"

function WhatsAppGlyph({ className }: { className?: string }) {
  // Official WhatsApp brand glyph (phone-in-speech-bubble). Path data is the
  // brand mark — render at currentColor on a green circle.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="28"
      height="28"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.345 0 2.15-.515 2.15-1.49 0-.515-.345-.515-.515-.745-.215-.214-.717-1.02-1.062-1.13l-.56-.345zM27.474 4.36C24.342 1.222 20.32-.482 16.012 0c-7.32 0-13.34 5.998-13.34 13.327 0 2.4.715 4.83 1.892 6.892L0 32l11.91-3.137c1.99 1.09 4.25 1.62 6.41 1.62 7.32 0 13.342-5.997 13.342-13.326-.001-3.523-1.404-6.842-3.93-9.378l-.258.581zM16.012 28.072c-1.992 0-3.954-.516-5.69-1.518l-.402-.244-7.075 1.85 1.892-6.892-.272-.43c-1.118-1.762-1.69-3.81-1.69-5.91 0-6.092 4.984-11.07 11.122-11.07 2.965 0 5.755 1.146 7.847 3.252 2.105 2.107 3.252 4.898 3.252 7.847 0 6.094-4.985 11.107-11.121 11.107l.137.008z"
      />
    </svg>
  )
}

interface Props {
  /** Pre-filled message body; URL-encoded internally. */
  prefilledMessage?: string
}

export function WhatsAppFloatButton({ prefilledMessage }: Props = {}) {
  const { t } = useTranslation("common", { useSuspense: false })
  const number = process.env["NEXT_PUBLIC_WHATSAPP_NUMBER"]?.replace(/\D/g, "") ?? ""
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(DISMISS_KEY) === "1") {
        setDismissed(true)
      }
    } catch {
      // localStorage blocked (private mode / quota) — keep button visible.
    }
  }, [])

  if (!number || dismissed || !mounted) return null

  const label = t("whatsapp.cta", { defaultValue: "Chat on WhatsApp" })
  const dismissLabel = t("whatsapp.dismiss", { defaultValue: "Hide chat button" })
  const message =
    prefilledMessage ?? t("whatsapp.prefilled", { defaultValue: "Hi Ondo RE — I'd like to chat about " })
  const href = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`

  const handleClick = () => {
    analytics.trackEvent("whatsapp_click", "engagement", "float_button")
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      window.localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // ignore storage errors
    }
    setDismissed(true)
    analytics.trackEvent("whatsapp_dismiss", "engagement", "float_button")
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group print:hidden"
      style={{
        // Stay clear of mobile browser bottom UI; safe-area-aware.
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={dismissLabel}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full bg-foreground/80 text-background hover:bg-foreground p-1.5 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={label}
        className="inline-flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/20 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-emerald-300/40 transition-colors h-14 w-14"
      >
        <WhatsAppGlyph className="text-white" />
      </a>
    </div>
  )
}

export default WhatsAppFloatButton
