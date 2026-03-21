"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, memo } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export interface NavigationItemChild {
  href: string
  label: string
  external?: boolean
}

export interface NavigationItem {
  href: string
  label: string
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
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/properties", label: "Properties" },
  { href: "/loans", label: "Loans" },
  { href: "/notary", label: "Notary" },

  // Discovery & tools
  { href: "/investments", label: "Investments" },
  { href: "/calculators", label: "Calculators" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },

  // Utah positioning
  { href: "/why-utah", label: "Why Utah" },
  { href: "/founders-letter", label: "Founder's Letter" },

  // Solutions
  {
    href: "/solutions",
    label: "Solutions",
    children: [
      { href: "/solutions/investors", label: "For Investors" },
      { href: "/solutions/landlords", label: "For Landlords" },
      { href: "/solutions/property-managers", label: "For Property Managers" },
      { href: "/solutions/tenants", label: "For Tenants" },
    ],
  },
  // Learn
  {
    href: "/tour",
    label: "Learn",
    children: [
      { href: "/tour", label: "Platform Tour" },
      { href: "/video-library", label: "Video Library" },
      { href: "/academy", label: "Academy" },
      { href: "/insights", label: "Insights" },
      { href: "/partners", label: "Partners" },
    ],
  },

  // Company & about
  { href: "/about", label: "About" },

  // Help & education
  { href: "/faq", label: "FAQ" },

  // Loan / refinance journeys
  { href: "/refinance/process", label: "Refinance Process" },

  // Marketing / campaigns
  { href: "/sweepstakes", label: "🎁 Win Prizes", special: true },
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
              {item.label}
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
                      {child.label}
                    </a>
                  ) : (
                    <Link href={child.href} prefetch onClick={onLinkClick}>
                      {child.label}
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
            {item.label}
          </Link>
        )
      )}
    </nav>
  )
})

Navigation.displayName = 'Navigation'