"use client"

import Link from "next/link"
import Image from "next/image"
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
import { SearchDialog } from "@/components/search-dialog"
import { usePathname } from "next/navigation"
import { APP_PORTAL_LOGIN_URL, SITE_NAME, SITE_PHONE } from "@/lib/site"
import { useTranslation } from "react-i18next"

const Header = memo(() => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const isHiddenPage = ["/login", "/auth", "/owner", "/tenant", "/dashboard"].some(
    path => pathname === path || pathname?.startsWith(`${path}/`)
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current && menuRef.current.contains(target)) return
      setIsMenuOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
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
            {/* Light theme: ink wordmark. Dark theme: white wordmark. */}
            <Image
              src="/logo-light.png"
              alt="Ondo Real Estate"
              width={656}
              height={256}
              className="h-10 w-auto md:h-12 dark:hidden"
              priority
              quality={90}
              sizes="(max-width: 768px) 103px, 123px"
            />
            <Image
              src="/logo-dark.png"
              alt=""
              aria-hidden="true"
              width={656}
              height={256}
              className="hidden h-10 w-auto md:h-12 dark:block"
              priority
              quality={90}
              sizes="(max-width: 768px) 103px, 123px"
            />
          </Link>
        </div>

        {/* Centered desktop navigation, flex-1 so it fills space between logo and controls without overlapping */}
        <div className="hidden md:flex flex-1 min-w-0 justify-center items-center">
          <nav
            className="flex justify-center w-full min-w-0 overflow-x-auto scrollbar-hide"
            aria-label="Primary navigation"
          >
            <Navigation
              className="w-max flex gap-0.5 justify-center flex-shrink-0"
              items={primaryNavigationItems}
            />
          </nav>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          {/* Phone CTA, icon-only on mobile, full number on desktop */}
          <a
            href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors shrink-0"
            aria-label={`Call ${SITE_PHONE}`}
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="hidden lg:inline text-foreground/80">{SITE_PHONE}</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex shrink-0"
            onClick={() => setIsSearchOpen(true)}
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
              <DropdownMenuContent align="end" sideOffset={6} className="w-64 py-2 z-[100]">
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
              <DropdownMenuContent align="end" sideOffset={6} className="w-48 py-2 z-[100]">
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
            className="flex md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring flex-shrink-0"
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
        <div ref={menuRef} id="mobile-menu" className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-t md:hidden z-50 py-4 pb-6 max-h-[calc(100vh-4rem)] overflow-y-auto" role="navigation" aria-label="Mobile navigation">
          <div className="container px-4 sm:px-6">
            <Button
              variant="outline"
              className="w-full mb-4 justify-start"
              onClick={() => {
                setIsSearchOpen(true)
                handleMenuClose()
              }}
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
              >
                <Phone className="h-4 w-4" />
                {SITE_PHONE}, Free Consultation
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={APP_PORTAL_LOGIN_URL}
                  onClick={handleMenuClose}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    {t("nav.ownerLogin")}
                  </Button>
                </Link>
                <Link
                  href={APP_PORTAL_LOGIN_URL}
                  onClick={handleMenuClose}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    {t("nav.tenantLogin")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
})

Header.displayName = 'Header'

export default Header
