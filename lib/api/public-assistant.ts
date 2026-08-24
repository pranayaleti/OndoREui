/**
 * Client for the site-wide public assistant.
 *
 * The public site is a static export on GitHub Pages, so there is no server here to proxy
 * through, the browser talks to the Supabase Edge Function directly. That is why the
 * request carries no credentials and why the endpoint is rate limited per IP on the server:
 * this call is reachable by anyone who views source.
 *
 * `app/api/public-assistant/chat/` exists as an empty directory from an earlier attempt at
 * this. It cannot work: `output: 'export'` in next.config.mjs means Next API routes are
 * never built, so that path would 404 in production while working fine in `next dev`. Delete
 * it rather than filling it in.
 */

import { BACKEND_BASE_URL } from '@/lib/backend'

export interface PublicAssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PublicAssistantReply {
  reply: string | null
  escalated: boolean
  leadCaptured: boolean
}

export type PublicAssistantResult =
  | { ok: true; data: PublicAssistantReply }
  | { ok: false; error: string; rateLimited?: boolean }

/**
 * The public assistant is a sibling Edge Function of `api`, not a route inside it, so the
 * URL is the backend base with its trailing `/api` swapped out.
 *
 * Set NEXT_PUBLIC_PUBLIC_ASSISTANT_URL to override when the two are not deployed together.
 */
export function publicAssistantUrl(): string {
  const explicit = process.env['NEXT_PUBLIC_PUBLIC_ASSISTANT_URL']
  if (explicit) return explicit.replace(/\/$/, '')

  const base = BACKEND_BASE_URL.replace(/\/$/, '')
  if (!base) return '/public-assistant'
  return base.endsWith('/api') ? `${base.slice(0, -4)}/public-assistant` : `${base}/public-assistant`
}

/** Stable id for one visitor conversation. Not a credential, it authorizes nothing. */
export function newConversationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Older Safari. Shape only needs to satisfy the server's uuid validation.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0
    const v = ch === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function sendPublicAssistantMessage(params: {
  messages: PublicAssistantMessage[]
  conversationId: string
  sourcePath?: string
  signal?: AbortSignal
}): Promise<PublicAssistantResult> {
  const { messages, conversationId, sourcePath, signal } = params

  try {
    const res = await fetch(publicAssistantUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        conversation_id: conversationId,
        ...(sourcePath ? { source_path: sourcePath } : {}),
      }),
      signal,
    })

    if (res.status === 429) {
      return {
        ok: false,
        rateLimited: true,
        error: 'That was a lot of messages at once, give it a moment and try again.',
      }
    }

    if (!res.ok) {
      // The server deliberately returns generic messages to anonymous callers, so there is
      // nothing more specific to surface here.
      return { ok: false, error: 'Something went wrong sending that. Please try again.' }
    }

    const json = (await res.json()) as {
      reply?: string | null
      escalated?: boolean
      lead_captured?: boolean
    }

    return {
      ok: true,
      data: {
        reply: json.reply ?? null,
        escalated: Boolean(json.escalated),
        leadCaptured: Boolean(json.lead_captured),
      },
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, error: 'Cancelled.' }
    }
    return { ok: false, error: 'We could not reach the assistant. Please try again.' }
  }
}
