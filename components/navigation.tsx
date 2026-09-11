"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, memo } from "react"
import { useTranslation } from "react-i18next"
import {
  BookOpen,
  Building2,
  Calculator,
  Clock,
  Compass,
  GitCompare,
  GraduationCap,
  HelpCircle,
  MapPin,
  Mountain,
  Newspaper,
  PlayCircle,
  Scale,
  Share2,
  Stamp,
  Star,
  Tag,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import { NavMegaMenu } from "@/components/nav-mega-menu"

export interface NavigationItemChild {
  href: string
  labelKey: string
  external?: boolean
  /** Rendered in the tinted chip at the start of the mega-menu row. */
  icon?: LucideIcon
  /** One-line "what is this" under the title. "Free rental analysis" tells a
   *  visitor nothing; "See what your home rents for today" tells them why to click. */
  descriptionKey?: string
}

export interface NavigationItem {
  href: string
  labelKey: string
  special?: boolean
  icon?: LucideIcon
  /** When set, this item is rendered as a hover mega-menu of these links. */
  children?: NavigationItemChild[]
}

// Central list of all nav items so we can re-use them
// in both the main navbar and the desktop "hamburger" / "More" menu.
// Primary items are pinned in the header; everything else will
// automatically roll into the "More" section for easier visibility.
export const allNavigationItems: NavigationItem[] = [
  // Core journeys (pinned in primary nav)
  { href: "/buy", labelKey: "nav.buy" },
  { href: "/explore", labelKey: "nav.explore" },
  { href: "/sell", labelKey: "nav.sell" },
  { href: "/properties", labelKey: "nav.properties" },
  { href: "/loans", labelKey: "nav.loans" },
  {
    href: "/notary",
    labelKey: "nav.notary",
    icon: Stamp,
    children: [
      { href: "/notary", labelKey: "nav.notaryServices", icon: Stamp, descriptionKey: "nav.notaryServicesDesc" },
      { href: "/notary/on-demand", labelKey: "nav.onDemandNotary", icon: Clock, descriptionKey: "nav.onDemandNotaryDesc" },
      { href: "/notary/locations/", labelKey: "nav.notaryLocations", icon: MapPin, descriptionKey: "nav.notaryLocationsDesc" },
    ],
  },

  // Owners hub — the highest-intent segment for us (self-managing landlords,
  // investors shopping a manager). Keep this above the generic Solutions menu
  // so PM shoppers can find services / pricing / analysis in one click.
  {
    href: "/property-management",
    labelKey: "nav.owners",
    icon: Building2,
    children: [
      { href: "/property-management", labelKey: "nav.propertyManagement", icon: Building2, descriptionKey: "nav.propertyManagementDesc" },
      { href: "/pricing", labelKey: "nav.pricing", icon: Tag, descriptionKey: "nav.pricingDesc" },
      { href: "/whats-my-home-worth", labelKey: "nav.freeRentalAnalysis", icon: TrendingUp, descriptionKey: "nav.freeRentalAnalysisDesc" },
      { href: "/faq/owner-faqs", labelKey: "nav.ownerFaqs", icon: HelpCircle, descriptionKey: "nav.ownerFaqsDesc" },
      { href: "/compare-utah-property-managers", labelKey: "nav.compareUtahPms", icon: Scale, descriptionKey: "nav.compareUtahPmsDesc" },
    ],
  },

  // Solutions, who are you + how to choose
  {
    href: "/solutions",
    labelKey: "nav.solutions",
    icon: Compass,
    children: [
      { href: "/solutions/investors", labelKey: "nav.forInvestors", icon: TrendingUp, descriptionKey: "nav.forInvestorsDesc" },
      { href: "/solutions/landlords", labelKey: "nav.forLandlords", icon: Building2, descriptionKey: "nav.forLandlordsDesc" },
      { href: "/solutions/property-managers", labelKey: "nav.forPropertyManagers", icon: Scale, descriptionKey: "nav.forPropertyManagersDesc" },
      { href: "/solutions/tenants", labelKey: "nav.forTenants", icon: HelpCircle, descriptionKey: "nav.forTenantsDesc" },
      { href: "/pricing", labelKey: "nav.pricing", icon: Tag, descriptionKey: "nav.pricingDesc" },
    ],
  },

  // Resources, learn, research & tools
  {
    href: "/resources",
    labelKey: "nav.resources",
    icon: BookOpen,
    children: [
      { href: "/tour", labelKey: "nav.platformTour", icon: PlayCircle, descriptionKey: "nav.platformTourDesc" },
      { href: "/academy", labelKey: "nav.academy", icon: GraduationCap, descriptionKey: "nav.academyDesc" },
      { href: "/about/testimonials", labelKey: "nav.reviews", icon: Star, descriptionKey: "nav.reviewsDesc" },
      { href: "/blog", labelKey: "nav.blogAndGuides", icon: BookOpen, descriptionKey: "nav.blogAndGuidesDesc" },
      { href: "/news", labelKey: "nav.news", icon: Newspaper, descriptionKey: "nav.newsDesc" },
      { href: "/socials", labelKey: "nav.socials", icon: Share2, descriptionKey: "nav.socialsDesc" },
      { href: "/calculators", labelKey: "nav.calculators", icon: Calculator, descriptionKey: "nav.calculatorsDesc" },
      { href: "/compare", labelKey: "nav.compare", icon: GitCompare, descriptionKey: "nav.compareDesc" },
      { href: "/faq", labelKey: "nav.faq", icon: HelpCircle, descriptionKey: "nav.faqDesc" },
      { href: "/why-utah", labelKey: "nav.whyUtah", icon: Mountain, descriptionKey: "nav.whyUtahDesc" },
      { href: "/moving-to-utah", labelKey: "nav.movingToUtah", icon: MapPin, descriptionKey: "nav.movingToUtahDesc" },
    ],
  },

  // Company & misc (More overflow)
  { href: "/about", labelKey: "nav.about" },
  { href: "/investments", labelKey: "nav.investments" },
  { href: "/founders-letter", labelKey: "nav.foundersLetter" },
  { href: "/refinance/process", labelKey: "nav.refinanceProcess" },
  { href: "/affiliate", labelKey: "nav.becomeAffiliate" },
  { href: "/sweepstakes", labelKey: "nav.winPrizes", special: true },
]

// These are the items that stay visible in the main
// desktop navbar. The rest live in the "More" overflow menu.
// Owners is pinned first because it's Ondo's highest-intent PM shopper path;
// /solutions moves to overflow since the Owners menu already covers
// landlord/investor/PM/pricing links that would otherwise duplicate it.
export const primaryNavigationItems: NavigationItem[] = allNavigationItems.filter(item =>
  ["/property-management", "/buy", "/sell", "/properties", "/loans", "/notary", "/resources"].includes(item.href)
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
          <NavMegaMenu
            key={item.href}
            item={item}
            onLinkClick={onLinkClick}
            triggerClassName={`${linkClass(item)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            // Six-plus children in one column runs past 600px tall; split those
            // into two columns instead of a scrolling ribbon of links.
            wide={item.children.length > 6}
          />
        ) : (
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
        )
      )}
    </nav>
  )
})

Navigation.displayName = 'Navigation'
