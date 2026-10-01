"use client";

/**
 * Site-wide public assistant.
 *
 * The counterpart to LeasingChatWidget, and deliberately not the same component. That one is
 * scoped to a single listing and is the right surface on a property page. This one runs
 * everywhere else, pricing, locations, calculators, blog, academy, where the visitor is
 * usually an owner deciding whether to hire a manager, or someone with a mortgage question.
 *
 * Notes that matter:
 * - The conversation id lives in component state only. It is not a credential and persisting
 *   it would let a shared device resume a stranger's conversation.
 * - The server is stateless for this agent, so the transcript is sent on every turn. That is
 *   why the input is capped and the history is trimmed: every character is billed twice.
 * - Replies arrive with compliance disclosures already appended server-side. Nothing here
 *   adds, edits, or strips compliance text.
 * - Accessibility is not optional on a housing site: the transcript is a live region, focus
 *   moves on open, Escape closes, and every control has an accessible name.
 * - This file is only the launcher. The chat panel (PublicAssistantPanel) is a separate chunk,
 *   fetched on the first click, because most visitors never open the assistant and the transcript,
 *   send logic and API client should not weigh on every page's startup.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useStickyBarVisible } from '@/lib/sticky-cta';
import { MessageSquare } from 'lucide-react';
import { HIDE_WHILE_NAV_OPEN, assistantPlacement } from '@/components/public-assistant-layout';

const PublicAssistantPanel = dynamic(() => import('@/components/PublicAssistantPanel'), {
  ssr: false,
  loading: () => null,
});

/**
 * Routes that already run their own assistant. Two chat launchers in one corner is a bug the
 * visitor experiences as clutter and the team experiences as split conversation history.
 */
const HIDDEN_PATH_PREFIXES = [
  '/chat',
  // Quiz and estimator screens are short, form-first pages: the launcher would sit on top of the
  // answer options and the fields the visitor is there to fill in.
  '/get-matched',
  '/buy/quiz',
  '/whats-my-home-worth',
] as const;

interface PublicAssistantWidgetProps {
  /** Render expanded and inline instead of as a floating launcher. Used on the contact page. */
  inline?: boolean;
}

export default function PublicAssistantWidget({ inline = false }: PublicAssistantWidgetProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(inline);
  // The panel mounts on the first open and then stays mounted (hidden while closed), so the
  // conversation survives closing the panel or visiting a route that hides the widget.
  const [hasOpened, setHasOpened] = useState(inline);
  // True once the panel chunk has loaded and mounted. Until then the launcher stays on screen
  // after the click instead of vanishing for the length of the download.
  const [panelReady, setPanelReady] = useState(false);

  const launcherRef = useRef<HTMLButtonElement>(null);
  /** Set when the visitor closes the panel, so focus goes back to the launcher once it mounts. */
  const restoreFocusRef = useRef(false);

  const { bottomClass, panelMaxHeightClass } = assistantPlacement(useStickyBarVisible());

  const hidden = useMemo(
    () => HIDDEN_PATH_PREFIXES.some((p) => (pathname ?? '').startsWith(p)),
    [pathname],
  );

  const open = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  // Return focus to the control that opened the panel (done in the effect below, once the
  // launcher has mounted), or the close is a dead end for keyboard and screen reader users.
  const close = useCallback(() => {
    restoreFocusRef.current = true;
    setIsOpen(false);
  }, []);

  const handlePanelReady = useCallback(() => setPanelReady(true), []);

  useEffect(() => {
    // The launcher only mounts once the panel is closed, so focus it here rather than in
    // the close handler, or keyboard and screen reader users land on <body>.
    if (!isOpen && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      launcherRef.current?.focus();
    }
  }, [isOpen]);

  const showLauncher = !hidden && !inline && (!isOpen || !panelReady);

  return (
    <>
      {showLauncher && (
        <button
          ref={launcherRef}
          type="button"
          onClick={open}
          className={`fixed ${bottomClass} left-4 z-50 flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-[#0B0B0B]
                   text-sm font-semibold text-white shadow-lg transition hover:bg-[#1a1a1a]
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-[#FF6A13] md:left-6 md:h-auto md:w-auto md:px-5 md:py-3 ${HIDE_WHILE_NAV_OPEN}`}
          aria-label="Open the Ondo assistant to ask about property management, renting, buying, or loans"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only md:not-sr-only">Ask Ondo</span>
        </button>
      )}
      {hasOpened && (
        <PublicAssistantPanel
          open={isOpen && !hidden}
          inline={inline}
          onClose={close}
          onReady={handlePanelReady}
          bottomClass={bottomClass}
          panelMaxHeightClass={panelMaxHeightClass}
        />
      )}
    </>
  );
}
