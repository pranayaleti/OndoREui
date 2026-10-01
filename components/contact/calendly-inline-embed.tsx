"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendlyLink } from "@/components/calendly-link";
import { analyticsAttributes } from "@/lib/analytics";
import { calendlyUrlWithAttribution } from "@/lib/calendly-attribution";
import { SITE_CALENDLY_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function getFullscreenElement(): Element | null {
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestContainerFullscreen(el: HTMLElement): Promise<void> {
  const anyEl = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };
  if (typeof anyEl.requestFullscreen === "function") {
    await anyEl.requestFullscreen();
  } else if (typeof anyEl.webkitRequestFullscreen === "function") {
    await Promise.resolve(anyEl.webkitRequestFullscreen());
  }
}

async function exitContainerFullscreen(): Promise<void> {
  const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> | void };
  if (typeof document.exitFullscreen === "function") {
    await document.exitFullscreen();
  } else if (typeof doc.webkitExitFullscreen === "function") {
    await Promise.resolve(doc.webkitExitFullscreen());
  }
}

export type CalendlyInlineVariant = "default" | "compact";

export function calendlyIframeSrc(base: string): string {
  try {
    const u = new URL(base);
    u.searchParams.set("embed_type", "Inline");
    return u.toString();
  } catch {
    return base;
  }
}

const IFRAME_SRC = calendlyIframeSrc(SITE_CALENDLY_URL);

/**
 * Plain URL for the server render; after mount, the same URL with the visitor's campaign so
 * Calendly credits the booking. A visitor with no campaign keeps the plain URL, so their
 * iframe never reloads.
 */
function useAttributedIframeSrc(): string {
  const [src, setSrc] = useState(IFRAME_SRC);
  useEffect(() => {
    setSrc(calendlyIframeSrc(calendlyUrlWithAttribution("calendly_embed")));
  }, []);
  return src;
}

/** Hashes that mean the visitor came here to book, so the scheduler loads without a click. */
const AUTO_LOAD_HASHES = new Set(["#book-a-call", "#book"]);

/**
 * The Calendly iframe pulls about 3MB of scripts (Calendly plus Stripe fraud checks), so it
 * loads only when the visitor asks for it: a click, or arriving on a booking anchor such as
 * the footer's "Book a free call" link to /contact/#book-a-call.
 */
function useSchedulerRequested(): [boolean, () => void] {
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    const checkHash = () => {
      if (AUTO_LOAD_HASHES.has(window.location.hash)) setRequested(true);
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);
  return [requested, () => setRequested(true)];
}

type CalendlyInlineEmbedProps = {
  variant?: CalendlyInlineVariant;
  className?: string;
  /** Pass `null` to hide the line above the iframe */
  heading?: string | null;
  showFallbackLink?: boolean;
  /** Show expand / exit fullscreen control on the embed frame */
  showFullscreenToggle?: boolean;
};

/**
 * Inline Calendly via iframe (reliable with Next.js). Uses `SITE_CALENDLY_URL`.
 */
export function CalendlyInlineEmbed({
  variant = "default",
  className,
  heading = "Book a 30-minute call",
  showFallbackLink = true,
  showFullscreenToggle = true,
}: CalendlyInlineEmbedProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const pointerInShellRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeSrc = useAttributedIframeSrc();
  const [schedulerRequested, requestScheduler] = useSchedulerRequested();

  useEffect(() => {
    const sync = () => {
      const node = shellRef.current;
      setIsFullscreen(node != null && getFullscreenElement() === node);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (getFullscreenElement() === shell) {
        await exitContainerFullscreen();
      } else {
        await requestContainerFullscreen(shell);
      }
    } catch {
      // Unsupported, denied, or transient failure, inline size remains usable
    }
  }, []);

  useEffect(() => {
    if (!showFullscreenToggle || !schedulerRequested) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const shell = shellRef.current;
      if (!shell) return;
      const inThisShell = getFullscreenElement() === shell;

      if (e.key === "Escape" && inThisShell) {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }

      // Ctrl+F / ⌘F only while pointer is over this embed so browser Find still works elsewhere.
      // There is no page-wide shortcut: the footer renders this embed on most routes.
      const isFsShortcutPlainF =
        (e.key === "f" || e.key === "F") &&
        !e.shiftKey &&
        (e.ctrlKey || e.metaKey) &&
        pointerInShellRef.current;
      if (!isFsShortcutPlainF) return;

      const target = e.target;
      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable=true]")
      ) {
        return;
      }

      e.preventDefault();
      void toggleFullscreen();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFullscreenToggle, schedulerRequested, toggleFullscreen]);

  const iframeSizeWhenInline =
    variant === "compact"
      ? "h-[480px] min-h-[420px] sm:h-[520px]"
      : "h-[700px] min-h-[650px]";

  const wrapMin = variant === "compact" ? "min-h-[420px]" : "min-h-[650px]";

  const iframeClass = cn(
    "w-full border-0 block",
    isFullscreen ? "min-h-0 flex-1 h-full" : iframeSizeWhenInline
  );

  return (
    <div className={cn(variant === "default" && "mt-8", "w-full", className)}>
      {heading != null && heading !== "" && (
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {heading}
        </h3>
      )}
      <div
        ref={shellRef}
        onPointerEnter={() => {
          pointerInShellRef.current = true;
        }}
        onPointerLeave={() => {
          pointerInShellRef.current = false;
        }}
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-border bg-card",
          isFullscreen
            ? "flex h-dvh max-h-dvh w-full flex-col rounded-none border-0"
            : wrapMin
        )}
      >
        {showFullscreenToggle && schedulerRequested && (
          <div className="absolute right-2 top-2 z-10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 gap-1.5 border border-border/80 bg-background/95 shadow-sm backdrop-blur-sm sm:px-3"
              onClick={() => void toggleFullscreen()}
              aria-pressed={isFullscreen}
              title={
                isFullscreen
                  ? "Exit fullscreen (Escape, or Ctrl+F over calendar)"
                  : "Fullscreen, or Ctrl+F (⌘F) while cursor is over the calendar"
              }
              aria-label={
                isFullscreen
                  ? "Exit fullscreen scheduling calendar"
                  : "Open scheduling calendar in fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="size-4 shrink-0" aria-hidden />
              ) : (
                <Maximize2 className="size-4 shrink-0" aria-hidden />
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              </span>
            </Button>
          </div>
        )}
        {schedulerRequested ? (
          <iframe
            title="Schedule a 30-minute call with Ondo Real Estate"
            src={iframeSrc}
            className={iframeClass}
            allow="fullscreen; payment"
          />
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",
              iframeSizeWhenInline
            )}
          >
            <Calendar className="h-8 w-8 text-primary" aria-hidden />
            <p className="max-w-xs text-sm text-muted-foreground">
              Choose a time that works for you. The calendar loads when you ask for it.
            </p>
            <Button
              type="button"
              onClick={requestScheduler}
              {...analyticsAttributes("book_call_click", "calendly_embed", "load_scheduler")}
            >
              Pick a time
            </Button>
          </div>
        )}
      </div>
      {showFallbackLink && (
        <p className="mt-2 text-xs text-muted-foreground">
          <CalendlyLink contentLabel="calendly_embed" className="underline hover:text-foreground">
            Open scheduling in a new tab
          </CalendlyLink>{" "}
          if the calendar does not load.
        </p>
      )}
    </div>
  );
}

type CalendlyBookSectionProps = {
  variant?: CalendlyInlineVariant;
  className?: string;
  id?: string;
};

/** Prominent section with heading, use on landing and key service pages */
export function CalendlyBookSection({
  variant = "default",
  className,
  id = "book-a-call",
}: CalendlyBookSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 md:py-16 bg-muted/40 border-y border-border scroll-mt-24",
        className
      )}
      aria-labelledby="calendly-book-section-title"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          id="calendly-book-section-title"
          className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2"
        >
          Schedule a call
        </h2>
        <p className="text-center text-muted-foreground text-sm md:text-base mb-8 max-w-xl mx-auto">
          Pick a time that works for you, property management, buying, selling, loans, notary, and
          general questions.
        </p>
        <CalendlyInlineEmbed
          variant={variant}
          heading={null}
          showFallbackLink
          className="mt-0"
        />
      </div>
    </section>
  );
}
