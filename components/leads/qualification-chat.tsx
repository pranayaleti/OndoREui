"use client";

import { useEffect, useRef, useState } from "react";
import { sendQualificationMessage } from "@/lib/api/qualification";
import { backendUrl } from "@/lib/backend";

interface Message { role: "user" | "assistant"; text: string }

interface Props {
  sessionToken: string;
  leadType: "property" | "website";
}

export function QualificationChat({ sessionToken, leadType }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-open on first render and fetch initial greeting
  useEffect(() => {
    if (!greeted && open) {
      setGreeted(true);
      fetchReply("Hello");
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function fetchReply(userMessage: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await sendQualificationMessage(sessionToken, leadType, userMessage);
      if (result.completed) {
        setCompleted(true);
      }
      setMessages((prev) => {
        const updated = [...prev, { role: "assistant" as const, text: result.reply }];
        if (result.completed) {
          // Fire-and-forget: extract lead data from full conversation and sync to HubSpot
          // Use `updated` (committed prev + final assistant reply) to avoid stale-closure bug
          fetch(backendUrl("/api/leads/capture-from-chat"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: updated.map((m) => ({ role: m.role, text: m.text })),
              leadType,
            }),
          }).catch(() => {
            // Intentionally silent — lead capture failure must not affect the user experience
          });
        }
        return updated;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      if (msg.includes("404") || msg.includes("expired")) {
        setCompleted(true); // treat as done
      } else {
        setError("Something went wrong — please try again or reply to our email.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading || completed) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    await fetchReply(text);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-card rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: 460 }}>
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold">Quick Questions</span>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-sm">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] text-sm px-3 py-2 rounded-2xl ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-muted text-gray-800 rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-gray-400 text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  <span className="animate-pulse">•••</span>
                </div>
              </div>
            )}
            {completed && (
              <div className="text-center text-sm text-gray-500 py-4">
                Thanks! We&apos;ll be in touch within 24 hours.
              </div>
            )}
            {error && (
              <div className="text-center text-xs text-red-500 py-2">{error}</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!completed && (
            <div className="border-t px-3 py-2 flex gap-2">
              <input
                className="flex-1 text-sm outline-none"
                placeholder="Type your answer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-indigo-600 text-sm font-medium disabled:opacity-40"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center text-xl hover:bg-indigo-700 transition-colors"
        aria-label="Open qualification chat"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
