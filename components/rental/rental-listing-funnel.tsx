"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackRentalFunnel } from "@/lib/rental-analytics"
import { isClientOnlyRentalPath } from "@/lib/rental-static-paths"
import { useListingUnavailable } from "@/components/properties/listing-availability"

export function RentalPropertyViewTracker({ propertyRef }: { propertyRef: string }) {
  useEffect(() => {
    trackRentalFunnel("property_view", propertyRef)
  }, [propertyRef])
  return null
}

export function RentalApplyNowLink({
  href,
  propertyRef,
  className,
  children,
}: {
  href: string
  propertyRef: string
  className?: string
  children: React.ReactNode
}) {
  const track = () => trackRentalFunnel("apply_click", propertyRef)
  // A token link (/apply/<token>), or /apply/start/<id> for a listing newer than the build, has
  // no exported page; see isClientOnlyRentalPath.
  if (isClientOnlyRentalPath(href)) {
    return (
      <a href={href} className={className} onClick={track}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={track}>
      {children}
    </Link>
  )
}

export function RentalApplyHashLink({
  propertyRef,
  className,
  children,
}: {
  propertyRef: string
  className?: string
  children: React.ReactNode
}) {
  // Rented or withdrawn since the page was built: no apply link.
  if (useListingUnavailable()) return null
  return (
    <a href="#listing-apply" className={className} onClick={() => trackRentalFunnel("apply_click", propertyRef)}>
      {children}
    </a>
  )
}
