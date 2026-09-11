"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import type { NavigationItem, NavigationItemChild } from "@/components/navigation"

/**
 * Grace period before a hover-opened panel closes.
 *
 * Pairs with the invisible bridge on the trigger: the bridge covers the
 * vertical gap between trigger and panel, the delay covers diagonal cursor
 * paths that clip a neighbouring trigger on the way down.
 */
const CLOSE_DELAY_MS = 120

/** Gap between the bottom of the trigger and the top of the panel. */
const PANEL_OFFSET_PX = 14

/** Minimum breathing room between the panel and the viewport edge. */
const VIEWPORT_MARGIN_PX = 16

const WIDE_PANEL_PX = 600
// 320 wrapped most one-line descriptions onto two rows; 360 leaves ~286px of
// text column, which fits them.
const NARROW_PANEL_PX = 360

interface PanelPosition {
  top: number
  left: number
  width: number
  /** Caret offset from the panel's left edge, so it points at the trigger. */
  caretLeft: number
}

interface NavMegaMenuProps {
  item: NavigationItem
  /** Styling for the trigger, so it matches the plain nav links beside it. */
  triggerClassName?: string
  onLinkClick?: () => void
  /** Two-column panel for menus with many children (Resources). */
  wide?: boolean
}

export function NavMegaMenu({ item, triggerClassName, onLinkClick, wide = false }: NavMegaMenuProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState<PanelPosition | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const slug = useMemo(() => item.href.replace(/\W+/g, "-").replace(/^-|-$/g, ""), [item.href])
  const panelId = `nav-panel-${slug}`
  const triggerId = `nav-trigger-${slug}`

  const children = item.children ?? []

  useEffect(() => setIsMounted(true), [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  /**
   * The panel is portalled to <body> because its natural parent — the primary
   * <nav> — is an overflow-x-auto scroll container at every breakpoint, which
   * would clip it. Fixed positioning off the trigger's rect, clamped to the
   * viewport, is what keeps the 600px Resources panel on screen at 768px where
   * an anchored panel measured out at x=-185.
   */
  const measure = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const viewport = document.documentElement.clientWidth
    const width = Math.min(wide ? WIDE_PANEL_PX : NARROW_PANEL_PX, viewport - VIEWPORT_MARGIN_PX * 2)
    const centred = rect.left + rect.width / 2 - width / 2
    const left = Math.min(
      Math.max(centred, VIEWPORT_MARGIN_PX),
      viewport - width - VIEWPORT_MARGIN_PX,
    )
    setPosition({
      top: rect.bottom + PANEL_OFFSET_PX,
      left,
      width,
      caretLeft: rect.left + rect.width / 2 - left,
    })
  }, [wide])

  const open = useCallback(() => {
    cancelClose()
    measure()
    setIsOpen(true)
  }, [cancelClose, measure])

  const close = useCallback(
    ({ restoreFocus = false }: { restoreFocus?: boolean } = {}) => {
      cancelClose()
      setIsOpen(false)
      if (restoreFocus) triggerRef.current?.focus()
    },
    [cancelClose],
  )

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS)
  }, [cancelClose])

  useEffect(() => cancelClose, [cancelClose])

  // The header is sticky, so the trigger can move under the panel while open.
  useEffect(() => {
    if (!isOpen) return
    let frame = 0
    const reposition = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    window.addEventListener("scroll", reposition, { passive: true })
    window.addEventListener("resize", reposition)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", reposition)
      window.removeEventListener("resize", reposition)
    }
  }, [isOpen, measure])

  // Any click outside the trigger or the portalled panel dismisses it.
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      close()
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [isOpen, close])

  const focusItem = useCallback((index: number) => {
    const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitem']")
    if (!items?.length) return
    const wrapped = (index + items.length) % items.length
    items[wrapped].focus()
  }, [])

  // Hover only opens for a real mouse. Touch fires a synthetic pointerenter
  // immediately before click, which would otherwise open then instantly toggle
  // closed; guarding on pointerType leaves taps to the click handler.
  const handlePointerEnter = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") open()
    },
    [open],
  )

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") scheduleClose()
    },
    [scheduleClose],
  )

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault()
        close()
        return
      }
      if (event.key === "ArrowDown" || (event.key === "ArrowUp" && isOpen)) {
        event.preventDefault()
        if (!isOpen) open()
        requestAnimationFrame(() => focusItem(event.key === "ArrowUp" ? -1 : 0))
      }
    },
    [isOpen, open, close, focusItem],
  )

  /**
   * Menu-button keyboard model, matching the Radix dropdown this replaced:
   * arrows roam the items, Escape returns to the trigger, and Tab dismisses so
   * focus continues along the header rather than through the portalled panel
   * (which sits at the end of <body>, far from its trigger in DOM order).
   */
  const handlePanelKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const items = Array.from(
        panelRef.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitem']") ?? [],
      )
      const current = items.indexOf(document.activeElement as HTMLAnchorElement)

      switch (event.key) {
        case "Escape":
          event.preventDefault()
          close({ restoreFocus: true })
          break
        case "Tab":
          close()
          break
        case "ArrowDown":
          event.preventDefault()
          focusItem(current + 1)
          break
        case "ArrowUp":
          event.preventDefault()
          focusItem(current - 1)
          break
        case "Home":
          event.preventDefault()
          focusItem(0)
          break
        case "End":
          event.preventDefault()
          focusItem(items.length - 1)
          break
      }
    },
    [close, focusItem],
  )

  const handleLinkClick = useCallback(() => {
    close()
    onLinkClick?.()
  }, [close, onLinkClick])

  const panel =
    isMounted && position
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="menu"
            // Programmatically focusable only: required for role="menu", but a
            // -1 tabindex keeps it out of the natural tab sequence.
            tabIndex={-1}
            aria-labelledby={triggerId}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handlePanelKeyDown}
            style={{ top: position.top, left: position.left, width: position.width }}
            className={cn(
              "fixed z-[60] rounded-[20px] border border-border/60 bg-background/95 p-3 backdrop-blur-xl",
              "shadow-[0_20px_48px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.02)]",
              "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none",
              wide ? "grid grid-cols-2 gap-x-1" : "block",
              // `invisible` rather than unmounting: the links stay crawlable,
              // while visibility:hidden keeps them out of the tab order and the
              // accessibility tree when closed.
              isOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0 pointer-events-none",
            )}
          >
            <span
              aria-hidden
              style={{ left: position.caretLeft - 7 }}
              className="absolute -top-[7px] h-3.5 w-3.5 rotate-45 rounded-tl-[3px] border-l border-t border-border/60 bg-background"
            />
            {children.map((child) => (
              <MegaMenuRow key={child.href} child={child} onClick={handleLinkClick} />
            ))}
          </div>,
          document.body,
        )
      : null

  return (
    <div
      className={cn(
        "relative inline-flex h-full items-center",
        // Invisible bridge: keeps the pointer "inside" the menu while it crosses
        // the gap to the panel. Without it the panel closes mid-travel, the
        // classic hover-dropdown failure.
        "after:pointer-events-none after:absolute after:inset-x-[-20px] after:top-full after:h-6 after:content-['']",
        isOpen && "after:pointer-events-auto",
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className={cn("inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent", triggerClassName)}
      >
        {item.icon ? (
          // 2xl+ only. The three trigger icons cost about 54px, which is what
          // pushed the bar 24px past its box at 1280 and made it scroll; without
          // them 1280 and 1440 both fit exactly. 1536+ has room to spare.
          <item.icon className="hidden h-3.5 w-3.5 shrink-0 opacity-80 2xl:inline-block" aria-hidden />
        ) : null}
        {t(item.labelKey)}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {panel}
    </div>
  )
}

function MegaMenuRow({ child, onClick }: { child: NavigationItemChild; onClick: () => void }) {
  const { t } = useTranslation()
  const Icon = child.icon

  const content = (
    <>
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
      </span>
      <span className="flex min-w-0 flex-col text-left">
        <span className="text-[13px] font-bold leading-tight text-foreground">{t(child.labelKey)}</span>
        {child.descriptionKey ? (
          <span className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{t(child.descriptionKey)}</span>
        ) : null}
      </span>
      <ArrowRight
        className="ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 self-center text-primary opacity-0 transition-all duration-200 group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100 motion-reduce:transition-none"
        aria-hidden
      />
    </>
  )

  const className =
    "group/row flex items-start gap-3 rounded-xl px-3.5 py-2.5 transition-[background-color,transform] duration-200 hover:translate-x-1 hover:bg-muted/60 focus-visible:translate-x-1 focus-visible:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:focus-visible:translate-x-0"

  // Roving tabindex: the open panel puts focus on an item directly, and arrow
  // keys move it, so the items must not be individual tab stops.
  const shared = { role: "menuitem" as const, tabIndex: -1, onClick, className }

  if (child.external) {
    return (
      <a href={child.href} target="_blank" rel="noopener noreferrer" {...shared}>
        {content}
      </a>
    )
  }

  return (
    <Link href={child.href} prefetch={false} {...shared}>
      {content}
    </Link>
  )
}
