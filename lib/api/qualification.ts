// lib/api/qualification.ts
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const EDGE_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : "";

export interface QualifyResponse {
  reply: string;
  completed: boolean;
  temperature?: "HOT" | "WARM" | "COLD";
}

export async function sendQualificationMessage(
  sessionToken: string,
  leadType: "property" | "website",
  message: string,
): Promise<QualifyResponse> {
  const res = await fetch(`${EDGE_URL}/lead-qualify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_token: sessionToken, lead_type: leadType, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}
