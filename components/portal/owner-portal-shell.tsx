"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OwnerSidebarNav, OwnerMobileNav } from "@/components/owner/owner-navigation"
import { useAuth } from "@/hooks/use-auth"
import { PortalLoadingShell } from "@/components/portal/portal-loading-shell"

export default function OwnerPortalShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth?type=owner")
      return
    }

    if (!isLoading && user?.role !== "owner") {
      router.replace(user?.role === "tenant" ? "/tenant" : "/dashboard")
    }
  }, [isLoading, router, user])

  if (isLoading || !user || user.role !== "owner") {
    return (
      <PortalLoadingShell
        title="Preparing your owner portal"
        description="Sign in is required before we load portfolio data and owner tools."
      />
    )
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col bg-muted/40 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Owner Portal</h2>
        </div>
        <OwnerSidebarNav />
      </div>
      <OwnerMobileNav />
      <div className="flex-1 flex flex-col pb-16 md:pb-0">{children}</div>
    </div>
  )
}
