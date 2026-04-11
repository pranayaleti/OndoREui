"use client"
import Link from "next/link"
import Image from "next/image"
import { memo, useEffect, useRef, useState } from "react"
import {
  SITE_SOCIALS,
  SITE_ADDRESS,
  SITE_PHONE,
  SITE_EMAILS,
  SITE_HOURS_LABEL,
  SITE_ADDRESS_STREET,
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_REGION,
  SITE_ADDRESS_POSTAL_CODE,
} from "@/lib/site"
import { usePwaInstall } from "@/lib/pwa/install-context"
import { usePathname } from "next/navigation"
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calculator,
  Home,
  Building,
  Users,
  HelpCircle,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { CalendlyInlineEmbed } from "@/components/contact/calendly-inline-embed"

function EqualHousingIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="20"
      height="20"
      aria-hidden="true"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="31" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      {/* House */}
      <path d="M16 32 L32 20 L48 32" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="32" width="24" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Equal sign */}
      <rect x="24" y="36" width="16" height="2.5" fill="currentColor" opacity="0.85" />
      <rect x="24" y="41" width="16" height="2.5" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M10.7 2.1c-.7-.3-1.4.2-1.5.9l-.7 6.2c-.1.8.7 1.4 1.4 1.1l3.7-1.6c.7-.3.9-1.2.3-1.7l-3.2-4.9c-.1-.1-.2-.1-.3-.2zM21.5 10.3l-5.9-.9c-.8-.1-1.4.7-1.1 1.4l1.7 3.7c.3.7 1.2.9 1.7.3l4.7-3.3c.6-.4.4-1.3-.1-1.6zM7 11.9l-4.9 3.2c-.6.4-.6 1.3 0 1.7l5.1 3.6c.6.4 1.4 0 1.4-.7l-.2-6.1c0-.8-.9-1.2-1.4-.7zM12.8 14.6l-3.7 1.6c-.7.3-.9 1.2-.3 1.7l3.3 2.3c.6.4 1.4.1 1.6-.6l.6-3.9c.1-.8-.7-1.4-1.5-1.1z"/>
    </svg>
  )
}

function GoogleBusinessIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3h-3l-.8-2h-2.4l-.8 2h-2.4l-.8-2H7.2L6.4 10H4V7zm0 5h16v5a2 2 0 0 1-2 2h-5v-3h3.2a3.6 3.6 0 1 0 0-3.2H13v-1.8H4V12zM8 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
    </svg>
  )
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M14.5 3c.5 1.7 1.8 3.2 3.5 3.9.6.3 1.2.4 1.8.5V9c-1.6-.1-3.1-.7-4.3-1.6v6.1c0 3-2.4 5.5-5.5 5.5S4.5 16.5 4.5 13.5 6.9 8 10 8c.5 0 1 .1 1.5.2v2.5c-.5-.2-1-.3-1.5-.3-1.8 0-3.2 1.5-3.2 3.2s1.5 3.2 3.2 3.2 3.2-1.5 3.2-3.2V3h1.3z"/>
    </svg>
  )
}

function LinktreeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      <path fill="currentColor" d="M12 6c-3.314 0-6 2.686-6 6 0 2.25 1.5 4.25 3.5 5.25.25.125.5.25.75.25.5 0 1-.25 1.25-.75.25-.5.25-1 .25-1.5 0-1.25-.5-2.5-1.5-3.5-.5-.5-.75-1.25-.75-2 0-1.5 1-2.5 2.5-2.5.75 0 1.5.25 2 .75.5.5.75 1.25.75 2 0 .75-.25 1.5-.75 2-.5.5-1.25.75-2 .75-.5 0-1-.25-1.25-.75-.25-.5-.25-1-.25-1.5 0-1.25.5-2.5 1.5-3.5.5-.5.75-1.25.75-2 0-1.5-1-2.5-2.5-2.5z"/>
    </svg>
  )
}

/** Lazy-mount wrapper: children only render once the sentinel scrolls into view. */
function LazySection({ children, fallbackHeight = "200px" }: { children: React.ReactNode; fallbackHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {visible ? children : <div style={{ minHeight: fallbackHeight }} />}
    </div>
  )
}

/** Collapsible footer nav section for mobile — expands on tap, always open on md+. */
function FooterNavSection({ label, icon, href, children }: { label: string; icon: React.ReactNode; href: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label={label} className="space-y-4">
      {/* Desktop: always-visible heading link */}
      <h3 className="text-lg font-semibold mb-4 hidden md:block">
        <Link href={href} className="flex items-center gap-2 hover:text-primary transition-colors">
          {icon}
          <span>{label}</span>
        </Link>
      </h3>
      {/* Mobile: tappable toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between text-lg font-semibold mb-2 md:hidden"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">{icon}<span>{label}</span></span>
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {/* Content: visible on md+, toggled on mobile */}
      <ul className={`space-y-2 text-sm ${open ? "block" : "hidden"} md:block`}>
        {children}
      </ul>
    </nav>
  )
}

const Footer = memo(() => {
  const pwaInstall = usePwaInstall()
  const pathname = usePathname()

  const isHiddenPage = ["/login", "/auth", "/owner", "/tenant", "/dashboard"].some(
    path => pathname === path || pathname?.startsWith(`${path}/`)
  )

  if (isHiddenPage) return null

  const path = pathname ?? ""
  const isNotaryRoute = path === "/notary" || path.startsWith("/notary/")
  const isContactRoute = path === "/contact" || path === "/contact/"
  const isFeedbackRoute = path === "/feedback" || path === "/feedback/" || path.startsWith("/feedback/")
  /** Pages that already include a full or dedicated inline Calendly */
  const showFooterCalendly = path !== "/" && !isContactRoute && !isNotaryRoute

  // Define social media mapping in a deterministic order to prevent hydration issues
  const socialMediaMap = [
    { pattern: "facebook.com", name: "Facebook", Component: Facebook, hover: "hover:text-primary" },
    { pattern: "youtube.com", name: "YouTube", Component: Youtube, hover: "hover:text-destructive" },
    { pattern: "youtu.be", name: "YouTube", Component: Youtube, hover: "hover:text-destructive" },
    { pattern: "instagram.com", name: "Instagram", Component: Instagram, hover: "hover:text-pink-500" },
    { pattern: "tiktok.com", name: "TikTok", Component: TiktokIcon, hover: "hover:text-fuchsia-500" },
    { pattern: "linkedin.com", name: "LinkedIn", Component: Linkedin, hover: "hover:text-primary" },
    { pattern: "x.com", name: "Twitter", Component: Twitter, hover: "hover:text-sky-500" },
    { pattern: "twitter.com", name: "Twitter", Component: Twitter, hover: "hover:text-sky-500" },
    { pattern: "pinterest.com", name: "Pinterest", Component: PinterestIcon, hover: "hover:text-red-500" },
    { pattern: "yelp.com", name: "Yelp", Component: YelpIcon, hover: "hover:text-red-500" },
    { pattern: "linktr.ee", name: "Linktree", Component: LinktreeIcon, hover: "hover:text-green-500" },
    // TODO: Implement WhatsApp group integration - temporarily commented out
    // { pattern: "chat.whatsapp.com", name: "WhatsApp", Component: WhatsAppIcon, hover: "hover:text-green-500" },
    { pattern: "google.com/maps", name: "Google Business", Component: GoogleBusinessIcon, hover: "hover:text-green-500" },
    { pattern: "google.com/business", name: "Google Business", Component: GoogleBusinessIcon, hover: "hover:text-green-500" },
    { pattern: "g.page", name: "Google Business", Component: GoogleBusinessIcon, hover: "hover:text-green-500" },
  ]

  const socials = SITE_SOCIALS
    .map((href) => {
      const lower = href.toLowerCase()
      const match = socialMediaMap.find(item => lower.includes(item.pattern))
      if (match) {
        return { 
          name: match.name, 
          Component: match.Component, 
          href, 
          hover: match.hover,
          key: `${match.name}-${href}` // Add stable key for consistent rendering
        }
      }
      return null
    })
    .filter(Boolean) as Array<{ name: string; Component: React.ComponentType<{ className?: string }>; href: string; hover: string; key: string }>

  return (
    <footer className="w-full bg-card text-foreground">
      {!isFeedbackRoute && (
        <div className="border-b border-border bg-primary/5">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Got ideas?</p>
                <p className="text-sm text-foreground/70 leading-tight">We&apos;re listening! Share feedback.</p>
              </div>
            </div>
            <Link
              href="/feedback"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Share feedback
            </Link>
          </div>
        </div>
      )}

      {showFooterCalendly && (
        <LazySection fallbackHeight="520px">
          <div className="border-b border-border bg-muted/20">
            <div className="container mx-auto max-w-3xl px-4 py-10">
              <div className="mb-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
                <Calendar className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold text-foreground">Book a 30-minute call</h2>
              </div>
              <CalendlyInlineEmbed
                variant="compact"
                heading={null}
                showFallbackLink
                className="mt-0"
              />
            </div>
          </div>
        </LazySection>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12" aria-label="Ondo Real Estate footer navigation">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Buying a Home */}
          <FooterNavSection label="Buying a Home" icon={<Home className="h-5 w-5" />} href="/buy">
            <li><Link href="/buy/first-time" className="text-foreground/70 hover:text-foreground">First-time homebuyer</Link></li>
            <li><Link href="/buy/second-home" className="text-foreground/70 hover:text-foreground">Buying a second home</Link></li>
            <li><Link href="/buy/fixed-rate" className="text-foreground/70 hover:text-foreground">Fixed-rate mortgage</Link></li>
            <li><Link href="/buy/adjustable-rate" className="text-foreground/70 hover:text-foreground">Adjustable-rate mortgage</Link></li>
            <li><Link href="/buy/30-year" className="text-foreground/70 hover:text-foreground">30 year mortgage</Link></li>
            <li><Link href="/buy/15-year" className="text-foreground/70 hover:text-foreground">15 year mortgage</Link></li>
            <li><Link href="/buy/rates" className="text-foreground/70 hover:text-foreground">Mortgage rates explained</Link></li>
          </FooterNavSection>

          {/* Refinance */}
          <FooterNavSection label="Refinance" icon={<TrendingUp className="h-5 w-5" />} href="/refinance/process">
            <li><Link href="/refinance/process" className="text-foreground/70 hover:text-foreground">Mortgage refinance process</Link></li>
            <li><Link href="/refinance/rate-term" className="text-foreground/70 hover:text-foreground">Rate-and-term refinance</Link></li>
            <li><Link href="/refinance/cash-out" className="text-foreground/70 hover:text-foreground">Cash-out refinance</Link></li>
            <li><Link href="/refinance/blog" className="text-foreground/70 hover:text-foreground">Mortgage blog – Refinance</Link></li>
          </FooterNavSection>

          {/* Mortgage Loans */}
          <FooterNavSection label="Mortgage Loans" icon={<Building className="h-5 w-5" />} href="/loans">
            <li><Link href="/loans/conventional" className="text-foreground/70 hover:text-foreground">Conventional</Link></li>
            <li><Link href="/loans/fha" className="text-foreground/70 hover:text-foreground">FHA</Link></li>
            <li><Link href="/loans/usda" className="text-foreground/70 hover:text-foreground">USDA</Link></li>
            <li><Link href="/loans/va" className="text-foreground/70 hover:text-foreground">VA</Link></li>
            <li><Link href="/loans/heloc" className="text-foreground/70 hover:text-foreground">HELOC / HELOAN</Link></li>
            <li><Link href="/loans/reverse" className="text-foreground/70 hover:text-foreground">Reverse Mortgage</Link></li>
            <li><Link href="/loans/jumbo" className="text-foreground/70 hover:text-foreground">Jumbo Loans</Link></li>
          </FooterNavSection>

          {/* Mortgage Calculators */}
          <FooterNavSection label="Calculators" icon={<Calculator className="h-5 w-5" />} href="/calculators">
            <li><Link href="/calculators/mortgage-payment" className="text-foreground/70 hover:text-foreground">Mortgage payment calculator</Link></li>
            <li><Link href="/calculators/affordability" className="text-foreground/70 hover:text-foreground">Affordability calculator</Link></li>
            <li><Link href="/calculators/income" className="text-foreground/70 hover:text-foreground">Income calculator</Link></li>
            <li><Link href="/calculators/closing-cost" className="text-foreground/70 hover:text-foreground">Closing cost calculator</Link></li>
            <li><Link href="/calculators/refinance" className="text-foreground/70 hover:text-foreground">Refinance calculator</Link></li>
            <li><Link href="/calculators/home-sale" className="text-foreground/70 hover:text-foreground">Home sale calculator</Link></li>
            <li><Link href="/calculators/buying-power" className="text-foreground/70 hover:text-foreground">Buying power calculator</Link></li>
          </FooterNavSection>

          {/* About Us */}
          <FooterNavSection label="About Us" icon={<Users className="h-5 w-5" />} href="/about">
            <li><Link href="/about/history" className="text-foreground/70 hover:text-foreground">History</Link></li>
            <li><Link href="/about/giving-back" className="text-foreground/70 hover:text-foreground">Giving back</Link></li>
            <li><Link href="/about/careers" className="text-foreground/70 hover:text-foreground">Careers</Link></li>
            <li><Link href="/about/news" className="text-foreground/70 hover:text-foreground">News</Link></li>
            <li><Link href="/about/investor-relations" className="text-foreground/70 hover:text-foreground">Investor relations</Link></li>
            <li><Link href="/affiliate" className="text-foreground/70 hover:text-foreground">Affiliate Program</Link></li>
          </FooterNavSection>

          {/* Help Center */}
          <FooterNavSection label="Help Center" icon={<HelpCircle className="h-5 w-5" />} href="/faq">
            <li><Link href="/faq/payments-faqs" className="text-foreground/70 hover:text-foreground">Payment questions</Link></li>
            <li><Link href="/faq/hardship-faqs" className="text-foreground/70 hover:text-foreground">Hardship assistance</Link></li>
            <li><Link href="/faq/loan-payoffs-faqs" className="text-foreground/70 hover:text-foreground">Loan payoffs</Link></li>
            <li><Link href="/faq/general-faqs" className="text-foreground/70 hover:text-foreground">Mortgage FAQs</Link></li>
            <li><Link href="/faq/escrow-faqs" className="text-foreground/70 hover:text-foreground">Escrow</Link></li>
            <li><Link href="/faq/disaster-faqs" className="text-foreground/70 hover:text-foreground">Natural Disaster Resources</Link></li>
          </FooterNavSection>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Loan Servicing Help Center</p>
                <a
                  href={`tel:${SITE_PHONE.replace(/[^+\d]/g, "")}`}
                  className="text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label={`Call ${SITE_PHONE}`}
                >
                  {SITE_PHONE}
                </a>
                <p className="text-xs text-foreground/70">{SITE_HOURS_LABEL}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Email Us</p>
                <a
                  href={`mailto:${SITE_EMAILS.primary}`}
                  className="text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label={`Email ${SITE_EMAILS.primary}`}
                >
                  {SITE_EMAILS.primary}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Our Location</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_ADDRESS)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  aria-label="Open address in Google Maps"
                >
                  <span className="block">{SITE_ADDRESS_STREET}</span>
                  <span className="block">{`${SITE_ADDRESS_CITY}, ${SITE_ADDRESS_REGION} ${SITE_ADDRESS_POSTAL_CODE}`}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media and Legal */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-foreground/70">Follow us:</span>
              {socials.map(({ name, Component, href, hover, key }) => (
                <Link
                  key={key}
                  href={href}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-foreground/70 transition-colors ${hover}`}
                >
                  <Component className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border">
                <a
                  href="https://linktr.ee/ondorealestate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                  aria-label="Scan QR code to access all social media links"
                >
                  <Image
                    src="/Linktree.png"
                    alt="Linktree QR Code - Scan to access all social media"
                    width={52}
                    height={52}
                    className="h-8 w-8 rounded border bg-white p-0.5"
                    quality={85}
                    sizes="32px"
                  />
                </a>
                <span className="text-xs text-foreground/70 hidden sm:block">
                  Click or Scan for all links
                </span>
              </div>
            </div>

            {/* Legal Information */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-foreground/70">
              <div className="flex items-center gap-2">
                <EqualHousingIcon className="text-foreground/70" />
                <span>Equal Housing Opportunity</span>
              </div>
              <span className="h-4 w-px bg-gray-600" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm border border-gray-500 flex items-center justify-center text-[8px] font-semibold">R</div>
                <span>REALTOR</span>
              </div>
              <span className="h-4 w-px bg-gray-600" />
              <div className="flex items-center gap-2">
                <div className="rounded border border-gray-500 px-1 py-0.5 text-[8px] font-semibold tracking-wide">MLS</div>
                <span>Multiple Listing Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/70">
            <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
              <p>© {new Date().getFullYear()} Ondo Real Estate. All rights reserved.</p>
              <p className="flex flex-wrap items-center justify-center gap-x-1 md:justify-start">
                <span>Designed. Developed. Deployed by</span>
                <Link
                  href="https://www.ondosoft.com/?utm_source=ondorealestate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:text-primary transition-colors duration-200 hover:underline decoration-primary underline-offset-2"
                >
                  OndoSoft
                </Link>
                <span>The digital engine behind <Link href="/" className="text-primary hover:text-primary/80 hover:underline">Ondo Real Estate</Link>.</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <span className="hidden sm:inline h-4 w-px bg-foreground/20" aria-hidden />
              {pwaInstall?.isInstallable && (
                <button
                  type="button"
                  onClick={() => void pwaInstall.triggerInstall()}
                  className="hover:text-foreground"
                >
                  Install app
                </button>
              )}
              <Link href="/licensing" className="hover:text-foreground">Licensing</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Use</Link>
              <Link href="/accessibility" className="hover:text-foreground">Accessibility</Link>
              <Link href="/sitemap" className="hover:text-foreground">Site Map</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export { Footer }
export default Footer
