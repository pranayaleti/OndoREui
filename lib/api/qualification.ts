// lib/api/qualification.ts
import { edgeFunctionUrl } from "@/lib/backend"

export interface QualifyResponse {
  reply: string;
  completed: boolean;
  temperature?: "HOT" | "WARM" | "COLD";
}

/** A non-2xx answer from lead-qualify, with the HTTP status and the server's message. */
export class QualifyError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "QualifyError"
    this.status = status
  }
}

/**
 * What an error from sendQualificationMessage means for the visitor.
 * Only the explicit answers from lead-qualify count: "Session already completed"
 * and "Session not found or expired" / "Session expired". Anything else (a 404
 * from the static host, a network failure, a 500) is a failed request, not a
 * finished chat.
 */
export function qualifyErrorKind(error: unknown): "completed" | "expired" | "failed" {
  if (!(error instanceof QualifyError)) return "failed"
  if (error.status === 400 && /already completed/i.test(error.message)) return "completed"
  if (error.status === 404 && /expired|session not found/i.test(error.message)) return "expired"
  return "failed"
}

export async function sendQualificationMessage(
  sessionToken: string,
  leadType: "property" | "website",
  message: string,
): Promise<QualifyResponse> {
  const res = await fetch(edgeFunctionUrl("lead-qualify"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_token: sessionToken, lead_type: leadType, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new QualifyError(err.error ?? `HTTP ${res.status}`, res.status);
  }
  return res.json();
}
