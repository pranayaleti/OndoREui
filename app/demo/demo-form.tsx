"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SITE_EMAILS } from "@/lib/site"

type FormState = "idle" | "loading" | "success" | "error"

export function DemoForm() {
  const [state, setState] = useState<FormState>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("loading")
    const fd = new FormData(e.currentTarget)
    const firstName = fd.get("firstName") as string
    const lastName = fd.get("lastName") as string
    const email = fd.get("email") as string
    const phone = (fd.get("phone") as string) || undefined
    const role = fd.get("role") as string
    const units = fd.get("units") as string
    const time = fd.get("time") as string

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email,
            phone,
            source: "website",
            message: `Demo request — Role: ${role}, Units: ${units || "not specified"}, Preferred time: ${time || "not specified"}`,
          }),
        }
      )
      setState(res.ok ? "success" : "error")
    } catch {
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg bg-muted border border-border p-6 text-center">
        <p className="text-foreground font-medium">Thanks! We&apos;ll be in touch within 1 business day to confirm your demo time.</p>
      </div>
    )
  }

  const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name *</label>
          <input id="firstName" name="firstName" required className={inputClass} placeholder="Jane" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name *</label>
          <input id="lastName" name="lastName" required className={inputClass} placeholder="Smith" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">Email *</label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="jane@example.com" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label>
        <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+1 (801) 555-0100" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium text-foreground">I am a...</label>
        <select id="role" name="role" className={inputClass}>
          <option value="Owner">Owner</option>
          <option value="Investor">Investor</option>
          <option value="Property Manager">Property Manager</option>
          <option value="Tenant">Tenant</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="units" className="text-sm font-medium text-foreground">Number of units</label>
        <input id="units" name="units" className={inputClass} placeholder="e.g. 5" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="time" className="text-sm font-medium text-foreground">Preferred time</label>
        <input id="time" name="time" className={inputClass} placeholder="e.g. Weekday mornings" />
      </div>

      {state === "error" && (
        <p className="text-sm text-destructive">
          Something went wrong. Please email us at{" "}
          <a href={`mailto:${SITE_EMAILS.primary}`} className="underline">{SITE_EMAILS.primary}</a>{" "}
          or try again.
        </p>
      )}

      <Button type="submit" size="lg" disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Book my demo"}
      </Button>
    </form>
  )
}
