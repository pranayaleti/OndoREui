"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { getMaintenanceMessages, sendMaintenanceMessage, unwrapData } from "../../lib/api/tenant-services"

interface Message {
  id: string
  senderId: string
  message: string
  createdAt: string
  attachmentUrl?: string
}

interface MaintenanceChatProps {
  requestId: string
  requestTitle: string
}

export function MaintenanceChat({ requestId, requestTitle }: MaintenanceChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadMessages = useCallback(async () => {
    try {
      const res = await getMaintenanceMessages(requestId)
      const list = unwrapData<Message[]>(res) ?? (res as Message[] | null) ?? []
      setMessages(Array.isArray(list) ? list : [])
    } catch {
      // silently ignore load errors
    } finally {
      setLoading(false)
    }
  }, [requestId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    setError("")
    try {
      await sendMaintenanceMessage(requestId, { message: trimmed })
      setText("")
      await loadMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const shortId = (id: string) => id.slice(0, 8)

  return (
    <div className="bg-card border rounded-lg flex flex-col h-96">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-900">{requestTitle}</h3>
        <p className="text-xs text-gray-500">Maintenance Chat</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <p className="text-center text-gray-400 text-sm py-4">Loading messages...</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">No messages yet. Start the conversation.</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700">{shortId(msg.senderId)}</span>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="bg-muted rounded-lg px-3 py-2 text-sm text-gray-800">
              {msg.message}
            </div>
            {msg.attachmentUrl && (
              <a
                href={msg.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View attachment
              </a>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Send box */}
      <div className="border-t p-3 space-y-2">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition self-end"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
