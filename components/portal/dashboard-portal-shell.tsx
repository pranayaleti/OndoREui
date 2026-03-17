"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { PortalLoadingShell } from "@/components/portal/portal-loading-shell"

export default function DashboardPortalShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth")
      return
    }

    if (!isLoading && user?.role === "tenant") {
      router.replace("/tenant")
      return
    }

    if (!isLoading && user?.role === "owner") {
      router.replace("/owner")
    }
  }, [isLoading, router, user])

  if (isLoading || !user || user.role === "tenant" || user.role === "owner") {
    return (
      <PortalLoadingShell
        title="Preparing your staff portal"
        description="We’re checking your session and routing you to the right workspace."
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <DashboardSidebar />
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
