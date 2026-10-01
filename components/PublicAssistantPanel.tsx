"use client";

/**
 * The chat panel of the site-wide public assistant. Loaded on demand by PublicAssistantWidget
 * (the launcher), so the transcript, send logic and API client stay out of every page's startup
 * JS. The product notes in PublicAssistantWidget.tsx apply to both.
 *
 * The launcher mounts this on the first open and keeps it mounted afterwards, so closing the panel
 * does not lose the conversation. It renders nothing while `open` is false.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AssistantDisclosure } from '@/components/assistant-disclosure';
import { Send, X, Loader2, UserRound } from 'lucide-react';
import { HIDE_WHILE_NAV_OPEN } from '@/components/public-assistant-layout';
import {
  newConversationId,
  sendPublicAssistantMessage,
  type PublicAssistantMessage,
} from '@/lib/api/public-assistant';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const GREETING =
  "Hi, I can help with property management, renting, buying, loans, or notary questions. What brings you here?";

const SUGGESTIONS = [
  'What do you charge to manage a rental?',
  'What do you have available in Provo?',
  'What would my payment be on a $450k home?',
] as const;

/** Server caps the transcript at 20; stay under it so a long session degrades rather than 400s. */
const MAX_TURNS_SENT = 18;

interface PublicAssistantPanelProps {
  open: boolean;
  /** Render expanded and inline instead of as a floating panel. */
  inline?: boolean;
  /** Visitor closed the panel (close button or Escape). */
  onClose: () => void;
  /** Must be stable. Called when the panel has mounted, so the launcher can stop standing in for it. */
  onReady: () => void;
  bottomClass: string;
  panelMaxHeightClass: string;
}

export default function PublicAssistantPanel({
  open,
  inline = false,
  onClose,
  onReady,
  bottomClass,
  panelMaxHeightClass,
}: PublicAssistantPanelProps) {
  const pathname = usePathname();
  const [conversationId] = useState<string>(() => newConversationId());
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, turns, isSending]);

  useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, inline, onClose]);

  const send = useCallback(
    async (text?: string) => {
      const message = (text ?? draft).trim();
      if (!message || isSending || escalated) return;

      setError(null);
      setDraft('');
      setIsSending(true);

      const next: Turn[] = [...turns, { id: `u-${Date.now()}`, role: 'user', content: message }];
      setTurns(next);

      // Send only the tail. The agent is a front door, not a case file, older turns stop
      // earning their token cost quickly.
      const payload: PublicAssistantMessage[] = next
        .slice(-MAX_TURNS_SENT)
        .map((t) => ({ role: t.role, content: t.content }));

      const result = await sendPublicAssistantMessage({
        messages: payload,
        conversationId,
        sourcePath: pathname ?? undefined,
      });

      setIsSending(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data.leadCaptured) setLeadCaptured(true);
      if (result.data.escalated) setEscalated(true);

      if (result.data.reply) {
        setTurns((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, role: 'assistant', content: result.data.reply as string },
        ]);
      } else if (!result.data.escalated) {
        setError('The assistant did not have an answer for that. Try rephrasing, or ask for a person.');
      }
    },
    [conversationId, draft, escalated, isSending, pathname, turns],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (!open) return null;

  return (
    <section
      className={
        inline
          ? 'flex h-[560px] w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white'
          : `fixed ${bottomClass} left-4 z-50 flex h-[560px] ${panelMaxHeightClass} w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl md:left-6 ${HIDE_WHILE_NAV_OPEN}`
      }
      aria-label="Ondo assistant"
    >
      <header className="flex items-center justify-between border-b border-neutral-200 bg-[#0B0B0B] px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">Ask Ondo</h2>
          <p className="text-xs text-neutral-400">Automated assistant. The team follows up during office hours</p>
        </div>
        {!inline && (
          <button
            type="button"
            onClick={onClose}
            className="ml-3 rounded p-1 text-neutral-400 transition hover:text-white
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-[#FF6A13]"
            aria-label="Close the Ondo assistant"
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

        {turns.length === 0 && (
          <ul className="space-y-2" aria-label="Suggested questions">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => void send(s)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-left text-sm
                             text-neutral-700 transition hover:border-[#FF6A13] hover:text-neutral-900
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1
                             focus-visible:outline-[#FF6A13]"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {turns.map((turn) => (
          <div key={turn.id} className={turn.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <p
              className={
                turn.role === 'user'
                  ? 'max-w-[85%] whitespace-pre-wrap rounded-lg bg-[#FF6A13] px-3 py-2 text-sm leading-relaxed text-white'
                  : 'max-w-[85%] whitespace-pre-wrap rounded-lg bg-neutral-100 px-3 py-2 text-sm leading-relaxed text-neutral-800'
              }
            >
              <span className="sr-only">{turn.role === 'user' ? 'You said: ' : 'Assistant said: '}</span>
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

        {leadCaptured && !escalated && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Thanks, your details are with the team and someone will be in touch.
          </p>
        )}

        {escalated && (
          <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            A member of the Ondo team is picking this up and will be in touch.
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
          <label htmlFor="public-assistant-input" className="sr-only">
            Your message to the Ondo assistant
          </label>
          <input
            id="public-assistant-input"
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isSending || escalated}
            maxLength={2000}
            placeholder={escalated ? 'The team will be in touch' : 'Ask about management, rent, or loans…'}
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
        <AssistantDisclosure />
      </div>
    </section>
  );
}
