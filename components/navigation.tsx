"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, memo } from "react"
import { useTranslation } from "react-i18next"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export interface NavigationItemChild {
  href: string
  labelKey: string
  external?: boolean
}

export interface NavigationItem {
  href: string
  labelKey: string
  special?: boolean
  /** When set, this item is rendered as a dropdown with these links (e.g. Property Management → Login to Portal). */
  children?: NavigationItemChild[]
}

// Central list of all nav items so we can re-use them
// in both the main navbar and the desktop "hamburger" / "More" menu.
// Primary items are pinned in the header; everything else will
// automatically roll into the "More" section for easier visibility.
export const allNavigationItems: NavigationItem[] = [
  // Core journeys (pinned in primary nav)
  { href: "/buy", labelKey: "nav.buy" },
  { href: "/sell", labelKey: "nav.sell" },
  { href: "/properties", labelKey: "nav.properties" },
  { href: "/loans", labelKey: "nav.loans" },
  { href: "/notary", labelKey: "nav.notary" },

  // Discovery & tools
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/investments", labelKey: "nav.investments" },
  { href: "/calculators", labelKey: "nav.calculators" },
  { href: "/news", labelKey: "nav.news" },
  { href: "/blog", labelKey: "nav.blog" },

  // Utah positioning
  { href: "/why-utah", labelKey: "nav.whyUtah" },
  { href: "/founders-letter", labelKey: "nav.foundersLetter" },

  // Solutions
  {
    href: "/solutions",
    labelKey: "nav.solutions",
    children: [
      { href: "/solutions/investors", labelKey: "nav.forInvestors" },
      { href: "/solutions/landlords", labelKey: "nav.forLandlords" },
      { href: "/solutions/property-managers", labelKey: "nav.forPropertyManagers" },
      { href: "/solutions/tenants", labelKey: "nav.forTenants" },
    ],
  },
  // Resources
  {
    href: "/tour",
    labelKey: "nav.resources",
    children: [
      { href: "/tour", labelKey: "nav.platformTour" },
      { href: "/blog", labelKey: "nav.blogAndGuides" },
      { href: "/calculators", labelKey: "nav.calculators" },
      { href: "/faq", labelKey: "nav.faq" },
      { href: "/why-utah", labelKey: "nav.whyUtah" },
    ],
  },

  // Company & about
  { href: "/about", labelKey: "nav.about" },

  // Help & education
  { href: "/faq", labelKey: "nav.faq" },

  // Loan / refinance journeys
  { href: "/refinance/process", labelKey: "nav.refinanceProcess" },

  // Marketing / campaigns
  { href: "/sweepstakes", labelKey: "nav.winPrizes", special: true },
  { href: "/affiliate", labelKey: "nav.becomeAffiliate" },
]

// These are the items that stay visible in the main
// desktop navbar. The rest will live in the hamburger menu.
export const primaryNavigationItems: NavigationItem[] = allNavigationItems.filter(item =>
  ["/buy", "/sell", "/properties", "/loans", "/notary", "/solutions", "/tour"].includes(item.href)
)

// Everything that is not part of the primary desktop nav.
export const overflowNavigationItems: NavigationItem[] = allNavigationItems.filter(
  item => !primaryNavigationItems.some(primary => primary.href === item.href)
)

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
    if (!pathname) return false
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
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
      {items.map((item) =>
        item.children?.length ? (
          <DropdownMenu key={item.href}>
            <DropdownMenuTrigger
              className={`inline-flex items-center gap-0.5 ${linkClass(item)} border-0 bg-transparent cursor-pointer`}
              aria-haspopup="menu"
              aria-expanded={undefined}
            >
              {t(item.labelKey)}
              <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px]">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.href} asChild>
                  {child.external ? (
                    <a
                      href={child.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onLinkClick}
                    >
                      {t(child.labelKey)}
                    </a>
                  ) : (
                    <Link href={child.href} prefetch onClick={onLinkClick}>
                      {t(child.labelKey)}
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={linkClass(item)}
            onClick={onLinkClick}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {t(item.labelKey)}
          </Link>
        )
      )}
    </nav>
  )
})

Navigation.displayName = 'Navigation'