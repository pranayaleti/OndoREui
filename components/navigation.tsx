"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, memo } from "react"
import { useTranslation } from "react-i18next"

import type { LucideIcon } from "lucide-react"

export interface NavigationItemChild {
  href: string
  labelKey: string
  external?: boolean
  icon?: LucideIcon
  descriptionKey?: string
}

export interface NavigationItem {
  href: string
  labelKey: string
  special?: boolean
  icon?: LucideIcon
  /** Only read by components/nav-mega-menu.tsx, which the header no longer renders. */
  children?: NavigationItemChild[]
}

/**
 * The header shows exactly the five services and rentals, in the order a visitor
 * thinks about them. Everything else lives in the footer and the mobile drawer.
 */
export const allNavigationItems: NavigationItem[] = [
  { href: "/properties", labelKey: "nav.rent" },
  { href: "/buy", labelKey: "nav.buy" },
  { href: "/sell", labelKey: "nav.sell" },
  { href: "/property-management", labelKey: "nav.manage" },
  { href: "/loans", labelKey: "nav.loans" },
  { href: "/notary", labelKey: "nav.notary" },
]

export const primaryNavigationItems: NavigationItem[] = allNavigationItems

/** Shown only in the mobile drawer under the six primary links. */
export const secondaryNavigationItems: NavigationItem[] = [
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/calculators", labelKey: "nav.calculators" },
  { href: "/faq", labelKey: "nav.faq" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/contact", labelKey: "nav.contact" },
]

/** Kept for callers that still import it; the desktop header has no overflow menu. */
export const overflowNavigationItems: NavigationItem[] = secondaryNavigationItems

/**
 * Active on an exact match or when the current path sits under `href` on a segment
 * boundary, so "/buy" does not light up for "/buying-guide" and "/property-management"
 * does not light up for "/property-management-software". Trailing slashes are ignored
 * on both sides (the site uses trailingSlash: true).
 */
export function isNavItemActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false
  const strip = (value: string) => (value.length > 1 ? value.replace(/\/+$/, "") : value)
  const path = strip(pathname)
  const target = strip(href)
  if (target === "/") return path === "/"
  return path === target || path.startsWith(`${target}/`)
}

interface NavigationProps {
  className?: string
  onLinkClick?: () => void
  items?: NavigationItem[]
}

export const Navigation = memo(function Navigation({
  className,
  onLinkClick,
  items = allNavigationItems,
}: NavigationProps) {
  const { t } = useTranslation()
  const pathname = usePathname()

  const isActive = useCallback((href: string) => {
    return isNavItemActive(pathname, href)
  }, [pathname])

  const linkClass = (item: NavigationItem) =>
    `text-xs md:text-sm font-medium px-2 md:px-3 py-2 rounded-md transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
      item.special
        ? "bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground font-bold"
        : isActive(item.href)
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-primary hover:text-primary-foreground"
    }`

  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          className={linkClass(item)}
          onClick={onLinkClick}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )
})

Navigation.displayName = 'Navigation'
