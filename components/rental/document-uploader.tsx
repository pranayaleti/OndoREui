"use client"

import { useState } from "react"
import { uploadRentalDocument } from "@/lib/api/rental"

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
])

const STATUS_LABELS: Record<string, string> = {
  required: "Required",
  uploaded: "Uploaded",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
}

export function DocumentUploader({
  applicationId,
  resumeToken,
  documentType,
  label,
  required,
  current,
  onUploaded,
}: {
  applicationId: string
  resumeToken?: string
  documentType: string
  label: string
  required?: boolean
  current?: {
    status?: string
    fileName?: string
    uploadedAt?: string
    expiresAt?: string | null
    uploadedBy?: string | null
    url?: string
  }
  onUploaded: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const status = current?.status ?? (required ? "required" : "uploaded")
  const needsReplace = status === "rejected" || status === "expired"

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium" htmlFor={`upload-${documentType}`}>
          {label}
        </label>
        <span className="text-xs text-muted-foreground">
          {current?.status ? STATUS_LABELS[status] ?? status.replace(/_/g, " ") : required ? "Required" : "Optional"}
        </span>
      </div>
      {current?.fileName ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {current.fileName}
          {current.uploadedAt ? ` · Uploaded ${current.uploadedAt.slice(0, 10)}` : ""}
          {current.expiresAt ? ` · Expires ${current.expiresAt.slice(0, 10)}` : ""}
        </p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">{required ? "Required" : "Optional"}</p>
      )}
      {current?.url ? (
        <a className="mt-1 inline-block text-xs underline" href={current.url} target="_blank" rel="noreferrer">
          Preview / download
        </a>
      ) : null}
      {needsReplace ? (
        <p className="mt-2 text-xs text-destructive">Please upload a replacement. The previous file was not accepted or has expired.</p>
      ) : null}
      <input
        id={`upload-${documentType}`}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
        capture="environment"
        className="mt-2 block w-full text-sm"
        disabled={busy}
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return
          if (file.size > MAX_BYTES) {
            setError("Each file must be 10 MB or smaller.")
            event.target.value = ""
            return
          }
          if (file.type && !ALLOWED_TYPES.has(file.type) && !file.type.startsWith("image/")) {
            setError("Use a PDF or photo (JPEG, PNG, WebP, HEIC) up to 10 MB.")
            event.target.value = ""
            return
          }
          setBusy(true)
          setError("")
          try {
            await uploadRentalDocument(applicationId, file, documentType, resumeToken)
            onUploaded()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed")
          } finally {
            setBusy(false)
            event.target.value = ""
          }
        }}
      />
      {busy ? <p className="mt-2 text-xs text-muted-foreground">Uploading…</p> : null}
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
      <p className="mt-2 text-xs text-muted-foreground">PDF or photo, 10 MB max. On a phone you can use the camera.</p>
    </div>
  )
}
