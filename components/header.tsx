"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Search, ChevronDown, Phone } from "lucide-react"
import { Navigation, allNavigationItems, overflowNavigationItems, primaryNavigationItems } from "@/components/navigation"
import { ScrollProgress } from "@/components/scroll-progress"
import { usePathname } from "next/navigation"
import { APP_PORTAL_LOGIN_URL, SITE_NAME, SITE_PHONE } from "@/lib/site"
import { analyticsAttributes } from "@/lib/analytics"
import { useTranslation } from "react-i18next"

// The dialog pulls in cmdk and the whole search index, and most visitors never open it: load it
// on the first open instead of with every page.
const SearchDialog = dynamic(() => import("@/components/search-dialog").then((m) => m.SearchDialog), {
  ssr: false,
})

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const Header = memo(() => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // Stays true after the first open so closing keeps the dialog mounted (focus return, no reload).
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const menuSearchRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  // Element that should get focus back when the search dialog closes. Null (Cmd/Ctrl+K)
  // leaves Radix's default of returning to whatever was focused before.
  const searchReturnFocusRef = useRef<HTMLElement | null>(null)
  const { t } = useTranslation()
  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const openSearchFromButton = useCallback(() => {
    searchReturnFocusRef.current = searchButtonRef.current
    setIsSearchOpen(true)
  }, [])

  // The menu (and its Search button) unmounts when search opens, so return focus to the toggle.
  const openSearchFromMenu = useCallback(() => {
    searchReturnFocusRef.current = menuToggleRef.current
    setIsSearchOpen(true)
    setIsMenuOpen(false)
  }, [])

  const handleSearchCloseAutoFocus = useCallback((event: Event) => {
    const target = searchReturnFocusRef.current
    searchReturnFocusRef.current = null
    if (!target) return
    event.preventDefault()
    target.focus()
  }, [])

  const isHiddenPage = ["/login", "/auth", "/owner", "/tenant", "/dashboard"].some(
    path => pathname === path || pathname?.startsWith(`${path}/`)
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isSearchOpen) setHasOpenedSearch(true)
  }, [isSearchOpen])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        searchReturnFocusRef.current = null
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current && menuRef.current.contains(target)) return
      // The toggle handles its own click; closing here too would make it reopen the menu.
      if (menuToggleRef.current && menuToggleRef.current.contains(target)) return
      setIsMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuToggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return

      // Keep Tab inside the open menu (toggle + menu controls) so keyboard users do not
      // end up in the page behind it.
      const focusable = [
        menuToggleRef.current,
        ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []),
      ].filter((el): el is HTMLElement => el !== null)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const lost = active === null || active === document.body
      if (event.shiftKey && (active === first || lost)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || lost)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (isMenuOpen && isMounted) menuSearchRef.current?.focus()
  }, [isMenuOpen, isMounted])

  // Lock page scroll while the mobile menu is open, and drop the menu (and the lock) if the
  // viewport grows past the breakpoint where the menu is hidden.
  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const mq = typeof window.matchMedia === "function" ? window.matchMedia("(min-width: 768px)") : null
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }
    mq?.addEventListener?.("change", onChange)

    return () => {
      document.body.style.overflow = previousOverflow
      mq?.removeEventListener?.("change", onChange)
    }
  }, [isMenuOpen])

  if (isHiddenPage) return null

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 bg-background ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""}`}>
      {/*
        Utility strip: mirrors the "conversion CTAs stay on-screen" pattern
        that local PM sites (e.g. Keyrenter) use — free rental analysis,
        available rentals, and both portal logins are one click from every
        page. Desktop-only; the mobile drawer already exposes portal logins
        and the sticky mobile CTA bar covers rental analysis + call.
      */}
      <div className="hidden md:block border-b border-border/50 bg-muted/40 text-xs">
        <div className="container flex items-center justify-end gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
          <Link
            href="/whats-my-home-worth"
            className="font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            {t("utilityBar.freeRentalAnalysis")}
          </Link>
          <span aria-hidden="true" className="text-foreground/30">
            |
          </span>
          <Link
            href="/properties"
            className="font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            {t("utilityBar.availableRentals")}
          </Link>
          <span aria-hidden="true" className="text-foreground/30">
            |
          </span>
          <Link
            href={APP_PORTAL_LOGIN_URL}
            className="font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            {t("utilityBar.ownerLogin")}
          </Link>
          <span aria-hidden="true" className="text-foreground/30">
            |
          </span>
          <Link
            href={APP_PORTAL_LOGIN_URL}
            className="font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            {t("utilityBar.residentLogin")}
          </Link>
        </div>
      </div>
      <div className="container flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo (left) */}
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            {/* Light theme: ink wordmark. Dark theme: white wordmark. Both are ~8KB WebP at 2x of the
                123x48 display size (the 656x256 PNGs were ~77KB each). Dark is the default theme, so only
                it is preloaded; the light variant loads eagerly at low priority so a stored light
                theme never waits on it, without adding a second preload to every page. */}
            <Image
              src="/logo-light-2x.webp"
              alt="Ondo Real Estate"
              width={246}
              height={96}
              className="h-10 w-auto md:h-12 dark:hidden"
              loading="eager"
              fetchPriority="low"
              sizes="(max-width: 768px) 103px, 123px"
            />
            <Image
              src="/logo-dark-2x.webp"
              alt=""
              aria-hidden="true"
              width={246}
              height={96}
              className="hidden h-10 w-auto md:h-12 dark:block"
              priority
              sizes="(max-width: 768px) 103px, 123px"
            />
          </Link>
        </div>

        {/* Centered desktop navigation, flex-1 so it fills space between logo and controls without overlapping */}
        <div className="hidden md:flex flex-1 min-w-0 justify-center items-center">
          {/*
            Stays overflow-x-auto at every width: measured at 768/1024/1280 the
            seven pinned items are wider than the space between the logo and the
            right-hand controls, so visible overflow makes them collide. The
            mega-menu panels escape this scroll container via a portal instead.
            Centering uses mx-auto on the w-max list rather than justify-center:
            auto margins centre when there is room and collapse to start-aligned
            scrolling when there is not, while justify-center clips the first
            items (Buy, Sell) behind the logo.
          */}
          <nav
            className="flex w-full min-w-0 overflow-x-auto scrollbar-hide"
            aria-label="Primary navigation"
          >
            <Navigation
              className="w-max mx-auto flex gap-0.5 flex-shrink-0"
              items={primaryNavigationItems}
            />
          </nav>
        </div>

        {/* Right-side controls */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Phone CTA, icon-only on mobile, full number on desktop */}
          <a
            href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors shrink-0"
            aria-label={`Call ${SITE_PHONE}`}
            {...analyticsAttributes("contact_click", "header", "call")}
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="hidden lg:inline text-foreground/80">{SITE_PHONE}</span>
          </a>
          <Button
            ref={searchButtonRef}
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex shrink-0"
            onClick={openSearchFromButton}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          {/* Desktop overflow menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-0 bg-transparent cursor-pointer shrink-0"
                  aria-label="More navigation"
                  aria-haspopup="menu"
                >
                  <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
                  <Menu className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="hidden lg:inline">{t("nav.more")}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={6} className="w-64 py-2">
                <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("nav.explore")}
                </div>
                {overflowNavigationItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-2 cursor-pointer"
                    >
                      <span className="truncate">{t(item.labelKey)}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ModeToggle />
          {/*
            Login: single dashboard URL, but present it as separate Owner /
            Tenant entry points so visitors instantly see the app is for them.
            Both links resolve to APP_PORTAL_LOGIN_URL; the dashboard
            role-redirects after auth. Do not fabricate distinct portal URLs.
          */}
          <div className="hidden sm:inline-flex shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label={t("nav.login")}>
                  <span className="hidden md:inline">{t("nav.login")}</span>
                  <span className="md:hidden">{t("nav.portalShort")}</span>
                  <ChevronDown className="ml-1 h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={6} className="w-48 py-2">
                <DropdownMenuItem asChild>
                  <Link
                    href={APP_PORTAL_LOGIN_URL}
                    className="flex items-center px-3 py-2 cursor-pointer"
                  >
                    {t("nav.ownerLogin")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={APP_PORTAL_LOGIN_URL}
                    className="flex items-center px-3 py-2 cursor-pointer"
                  >
                    {t("nav.tenantLogin")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Mobile hamburger */}
          <button
            ref={menuToggleRef}
            className="flex md:hidden min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring flex-shrink-0"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {isMenuOpen && isMounted && (
        <nav ref={menuRef} id="mobile-menu" className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-t md:hidden z-50 py-4 pb-6 max-h-[calc(100dvh-4rem)] overflow-y-auto" aria-label="Mobile navigation">
          <div className="container px-4 sm:px-6">
            <Button
              ref={menuSearchRef}
              variant="outline"
              className="w-full mb-4 justify-start"
              onClick={openSearchFromMenu}
            >
              <Search className="mr-2 h-4 w-4" />
              {t("nav.search")}
            </Button>
            <Navigation
              className="flex flex-col gap-2"
              onLinkClick={handleMenuClose}
              items={allNavigationItems.filter(i => i.href !== "/solutions" && i.href !== "/resources" && i.href !== "/notary" && i.href !== "/property-management")}
            />

            {/* Owners + Solutions + Resources + Notary, mobile inline (children sourced from allNavigationItems to stay DRY) */}
            {allNavigationItems
              .filter(i => i.href === "/property-management" || i.href === "/solutions" || i.href === "/resources" || i.href === "/notary")
              .map(item => (
                <div key={item.href} className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 px-3 mb-1">{t(item.labelKey)}</p>
                  {item.children?.map(({ href, labelKey }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex min-h-11 items-center pl-6 pr-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                      onClick={handleMenuClose}
                    >
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              ))}

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                onClick={handleMenuClose}
                {...analyticsAttributes("contact_click", "header_menu", "call")}
              >
                <Phone className="h-4 w-4" />
                {SITE_PHONE}, Free Consultation
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={APP_PORTAL_LOGIN_URL} onClick={handleMenuClose}>
                    {t("nav.ownerLogin")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={APP_PORTAL_LOGIN_URL} onClick={handleMenuClose}>
                    {t("nav.tenantLogin")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}
      {hasOpenedSearch && (
        <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} onCloseAutoFocus={handleSearchCloseAutoFocus} />
      )}
      <ScrollProgress />
    </header>
  )
})

Header.displayName = 'Header'

export default Header
