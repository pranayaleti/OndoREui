import { backendUrl } from "@/lib/backend"

export interface Thread {
  id: string
  subject: string
  propertyId?: string
  status: string
  priority: string
  category: string
  lastMessageAt?: string
  unreadCount: number
  participants: { userId: string; role: string; lastReadAt?: string }[]
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  body: string
  mentions: string[]
  sentAt: string
}

export interface MessageTemplate {
  id: string
  title: string
  body: string
  quickReplies: string[]
}

export interface ListThreadsFilters {
  propertyId?: string
  priority?: string
  status?: string
  category?: string
  from?: string
  to?: string
  sort?: string
  order?: "asc" | "desc"
}

export interface CreateThreadPayload {
  subject: string
  propertyId?: string
  priority?: string
  category?: string
  participantIds?: string[]
}

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }
  return fetch(backendUrl(path), { ...init, headers, credentials: "include" })
}

export async function listThreads(filters?: ListThreadsFilters): Promise<Thread[]> {
  const query = filters
    ? "?" + new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]).toString()
    : ""
  const res = await authFetch(`/api/communication/threads${query}`)
  if (!res.ok) throw new Error("Failed to fetch threads")
  const data = await res.json()
  return data.data ?? data.threads ?? data
}

export async function getThread(threadId: string): Promise<Thread> {
  const res = await authFetch(`/api/communication/threads/${threadId}`)
  if (!res.ok) throw new Error("Failed to fetch thread")
  const data = await res.json()
  return data.data ?? data.thread ?? data
}

export async function createThread(payload: CreateThreadPayload): Promise<Thread> {
  const res = await authFetch("/api/communication/threads", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? "Failed to create thread")
  }
  const data = await res.json()
  return data.data ?? data.thread ?? data
}

export async function listMessages(threadId: string, page?: number): Promise<Message[]> {
  const query = page != null ? `?page=${page}` : ""
  const res = await authFetch(`/api/communication/threads/${threadId}/messages${query}`)
  if (!res.ok) throw new Error("Failed to fetch messages")
  const data = await res.json()
  return data.data ?? data.messages ?? data
}

export async function sendMessage(
  threadId: string,
  body: string,
  templateId?: string
): Promise<Message> {
  const res = await authFetch(`/api/communication/threads/${threadId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, ...(templateId ? { templateId } : {}) }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? "Failed to send message")
  }
  const data = await res.json()
  return data.data ?? data.message ?? data
}

export async function markRead(threadId: string): Promise<void> {
  const res = await authFetch(`/api/communication/threads/${threadId}/read`, {
    method: "PATCH",
  })
  if (!res.ok) throw new Error("Failed to mark thread as read")
}

export async function listTemplates(): Promise<MessageTemplate[]> {
  const res = await authFetch("/api/communication/templates")
  if (!res.ok) throw new Error("Failed to fetch message templates")
  const data = await res.json()
  return data.data ?? data.templates ?? data
}
