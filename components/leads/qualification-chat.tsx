"use client";

import { useEffect, useRef, useState } from "react";
import { qualifyErrorKind, sendQualificationMessage } from "@/lib/api/qualification";
import { SITE_PHONE } from "@/lib/site";
import { validateChatInput, sanitizeReply } from "@/lib/aiGuardrails";

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
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-open on first render and fetch initial greeting
  useEffect(() => {
    if (!greeted && open) {
      setGreeted(true);
      fetchReply("Hello");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentional single-fire on open; greeted/fetchReply are guards/stable refs.
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function fetchReply(userMessage: string) {
    setLoading(true);
    setError(null);

    // Validate user input before sending to the LLM
    const guardrail = validateChatInput([{ role: "user", content: userMessage }]);
    if (!guardrail.ok) {
      setError(guardrail.error);
      setLoading(false);
      return;
    }

    try {
      const result = await sendQualificationMessage(sessionToken, leadType, userMessage);
      if (result.completed) {
        setCompleted(true);
      }
      const safeReply = sanitizeReply(result.reply);
      setMessages((prev) => [...prev, { role: "assistant" as const, text: safeReply }]);
    } catch (e: unknown) {
      // Only an explicit "already completed" or "expired" answer from the API ends
      // the chat. Any other failure (network, wrong host, 5xx) shows an error so
      // nobody is told "we'll be in touch" when nothing was recorded.
      const kind = qualifyErrorKind(e);
      if (kind === "completed") {
        setCompleted(true);
      } else if (kind === "expired") {
        setExpired(true);
      } else {
        setError(`Something went wrong. Please try again, reply to our email or call ${SITE_PHONE}.`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading || completed || expired) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    await fetchReply(text);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden" style={{ height: 460 }}>
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
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground text-sm px-3 py-2 rounded-2xl rounded-bl-sm">
                  <span className="animate-pulse">•••</span>
                </div>
              </div>
            )}
            {completed && (
              <div role="status" className="text-center text-sm text-muted-foreground py-4">
                Thanks! We&apos;ll be in touch within 24 hours.
              </div>
            )}
            {expired && (
              <div role="status" className="text-center text-sm text-muted-foreground py-4">
                This link has expired. Reply to our email or call {SITE_PHONE} and we&apos;ll pick it up from there.
              </div>
            )}
            {error && (
              <div role="alert" className="text-center text-xs text-destructive-emphasis py-2">{error}</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {!completed && !expired && (
            <div className="border-t px-3 py-2 flex gap-2">
              <input
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
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
