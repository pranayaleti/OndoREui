"use client"

import { useEffect } from "react"
import Link from "next/link"
import { trackRentalFunnel } from "@/lib/rental-analytics"

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
  return (
    <Link href={href} className={className} onClick={() => trackRentalFunnel("apply_click", propertyRef)}>
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
  return (
    <a href="#listing-apply" className={className} onClick={() => trackRentalFunnel("apply_click", propertyRef)}>
      {children}
    </a>
  )
}
