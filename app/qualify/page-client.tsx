"use client"

import { useSearchParams } from "next/navigation"
import { QualificationChat } from "@/components/leads/qualification-chat"

function leadTypeFromParam(value: string | null): "property" | "website" {
  if (value === "website") return "website"
  return "property"
}

export default function QualifyTokenChat() {
  const params = useSearchParams()
  const token = params?.get("token") ?? null
  if (!token) return null

  const leadType = leadTypeFromParam(params?.get("type") ?? null)

  return (
    <section className="border-b border-border bg-muted py-10" aria-labelledby="qualify-token-heading">
      <div className="container mx-auto flex max-w-md flex-col items-center px-4 text-center">
        <h2 id="qualify-token-heading" className="text-2xl font-bold text-foreground">
          Continue this qualification link
        </h2>
        <p className="mb-8 mt-2 text-foreground/70">
          This chat is tied to a specific lead link. It is not a mortgage approval or a rate lock.
        </p>
        <QualificationChat sessionToken={token} leadType={leadType} />
      </div>
    </section>
  )
}
