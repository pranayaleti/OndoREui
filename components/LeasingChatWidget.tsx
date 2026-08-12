"use client";

/**
 * Prospect-facing leasing chat.
 *
 * Talks to the AI leasing agent on the Edge API. The agent can answer questions from real
 * property data and book a tour on the calendar, so this widget is a conversion surface,
 * not a support box — the goal of every session is a booked viewing.
 *
 * Notes that matter:
 * - The session id lives in component state only. It is not a credential, and persisting
 *   it would let a shared device resume someone else's conversation.
 * - Replies already carry the brokerage disclosure, appended server-side by the agent.
 *   Nothing here adds or strips compliance text.
 * - Accessibility is not optional on a housing site: the transcript is a live region,
 *   focus is managed on open, and Escape closes.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X, Loader2, CalendarCheck } from 'lucide-react';
import { backendUrl } from '@/lib/backend';

interface ChatTurn {
  id: string;
  role: 'prospect' | 'ai';
  content: string;
}

interface LeasingChatWidgetProps {
  /** Property being discussed. The agent is scoped to it server-side. */
  propertyId: string;
  /** Shown in the header so the prospect knows what they are asking about. */
  propertyTitle?: string;
  /** Render inline instead of as a floating launcher. */
  inline?: boolean;
  /**
   * Resume an existing conversation. Used by /chat?session=… — the link in the reply the
   * agent emails to an inbound lead, so the prospect picks up where they left off rather
   * than starting over.
   */
  initialSessionId?: string;
}

const GREETING =
  "Hi — ask me anything about this home, or tell me when you'd like to see it and I can get a tour on the calendar.";

export default function LeasingChatWidget({
  propertyId,
  propertyTitle,
  inline = false,
  initialSessionId,
}: LeasingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(inline || !!initialSessionId);
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scrollToLatest = useCallback(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      scrollToLatest();
    }
  }, [isOpen, turns, scrollToLatest]);

  useEffect(() => {
    if (!isOpen || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, inline]);

  /** Load prior turns when resuming from an emailed link. */
  useEffect(() => {
    if (!initialSessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(backendUrl(`/leasing-agent/sessions/${initialSessionId}`));
        if (!res.ok) {
          if (!cancelled) setError('We could not find that conversation. Start a new one below.');
          return;
        }
        const json = (await res.json()) as {
          data?: {
            status?: string;
            messages?: Array<{ role: string; content: string; sentAt: string }>;
          };
        };
        if (cancelled) return;
        const prior = (json.data?.messages ?? []).map((m, i) => ({
          id: `h-${i}`,
          role: m.role === 'prospect' ? ('prospect' as const) : ('ai' as const),
          content: m.content,
        }));
        setTurns(prior);
        if (json.data?.status === 'needs_human') setEscalated(true);
      } catch {
        if (!cancelled) setError('We could not load that conversation.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialSessionId]);

  /** Open a conversation on first send, so idle widget views cost nothing. */
  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (sessionId) return sessionId;
    const res = await fetch(backendUrl('/leasing-agent/start'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, source: 'web' }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { id?: string } };
    const id = json?.data?.id ?? null;
    if (id) setSessionId(id);
    return id;
  }, [propertyId, sessionId]);

  const send = useCallback(async () => {
    const message = draft.trim();
    if (!message || isSending) return;

    setError(null);
    setDraft('');
    setIsSending(true);
    setTurns((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, role: 'prospect', content: message },
    ]);

    try {
      const id = await ensureSession();
      if (!id) {
        setError('We could not start the chat just now. Please try again shortly.');
        return;
      }

      const res = await fetch(backendUrl('/leasing-agent/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id, message }),
      });

      if (res.status === 429) {
        setError('That was a lot of messages at once — give it a moment and try again.');
        return;
      }
      if (!res.ok) {
        setError('Something went wrong sending that. Please try again.');
        return;
      }

      const json = (await res.json()) as {
        data?: { reply?: string | null; escalated?: boolean; message?: string };
      };

      if (json?.data?.escalated) {
        setEscalated(true);
        setTurns((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'ai',
            content:
              json.data?.message ??
              'A member of the leasing team will follow up with you shortly.',
          },
        ]);
        return;
      }

      if (json?.data?.reply) {
        setTurns((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'ai', content: json.data!.reply as string },
        ]);
      }
    } catch {
      setError('We could not reach the leasing assistant. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [draft, ensureSession, isSending]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#0B0B0B] px-5 py-3
                   text-sm font-semibold text-white shadow-lg transition hover:bg-[#1a1a1a]
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-[#FF6A13]"
        aria-label="Open the leasing assistant to ask about this property or book a tour"
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        Ask about this home
      </button>
    );
  }

  return (
    <section
      className={
        inline
          ? 'flex h-[560px] w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white'
          : 'fixed bottom-6 right-6 z-50 flex h-[560px] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl'
      }
      aria-label="Leasing assistant"
    >
      <header className="flex items-center justify-between border-b border-neutral-200 bg-[#0B0B0B] px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {propertyTitle ? `About ${propertyTitle}` : 'Leasing assistant'}
          </h2>
          <p className="text-xs text-neutral-400">Automated assistant — a person can take over anytime</p>
        </div>
        {!inline && (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="ml-3 rounded p-1 text-neutral-400 transition hover:text-white
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[#FF6A13]"
            aria-label="Close the leasing assistant"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </header>

      <div
        ref={transcriptRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation transcript"
      >
        <p className="rounded-lg bg-neutral-100 px-3 py-2 text-sm leading-relaxed text-neutral-800">
          {GREETING}
        </p>

        {turns.map((turn) => (
          <div
            key={turn.id}
            className={turn.role === 'prospect' ? 'flex justify-end' : 'flex justify-start'}
          >
            <p
              className={
                turn.role === 'prospect'
                  ? 'max-w-[85%] whitespace-pre-wrap rounded-lg bg-[#FF6A13] px-3 py-2 text-sm leading-relaxed text-white'
                  : 'max-w-[85%] whitespace-pre-wrap rounded-lg bg-neutral-100 px-3 py-2 text-sm leading-relaxed text-neutral-800'
              }
            >
              <span className="sr-only">{turn.role === 'prospect' ? 'You said: ' : 'Assistant said: '}</span>
              {turn.content}
            </p>
          </div>
        ))}

        {isSending && (
          <p className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Thinking…
          </p>
        )}

        {escalated && (
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            A member of the leasing team is picking this up and will be in touch.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-neutral-200 p-3">
        <div className="flex items-center gap-2">
          <label htmlFor="leasing-chat-input" className="sr-only">
            Your message to the leasing assistant
          </label>
          <input
            id="leasing-chat-input"
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isSending || escalated}
            maxLength={2000}
            placeholder={escalated ? 'The team will be in touch' : 'Ask a question or suggest a time…'}
            className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm
                       placeholder:text-neutral-400 focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-1 focus-visible:outline-[#FF6A13]
                       disabled:bg-neutral-100"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={isSending || escalated || !draft.trim()}
            className="rounded-lg bg-[#0B0B0B] p-2 text-white transition hover:bg-[#1a1a1a]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[#FF6A13] disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
