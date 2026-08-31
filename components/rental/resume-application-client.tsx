"use client"

import { useParams } from "next/navigation"
import { RentalApplicationWizard } from "@/components/rental/rental-application-wizard"
import { storedApplication } from "@/lib/rental-application"

export function ResumeApplicationClient({ applicationId }: { applicationId?: string }) {
  const params = useParams()
  const id = applicationId || String(params?.applicationId ?? "")
  const stored = storedApplication(id)
  if (!id || id === "_") {
    return <main className="px-4 py-12">Application not found.</main>
  }
  return <RentalApplicationWizard applicationId={id} resumeToken={stored?.resumeToken} />
}
