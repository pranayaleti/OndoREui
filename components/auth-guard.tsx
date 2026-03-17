"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "tenant" | "owner" | "manager" | "admin" | "super_admin" | "maintenance"
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth")
    } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard or home page
      if (user?.role === "tenant") {
        router.push("/tenant")
      } else if (user?.role === "owner") {
        router.push("/owner")
      } else if (user?.role === "manager" || user?.role === "admin" || user?.role === "super_admin") {
        router.push("/dashboard")
      } else if (user?.role === "maintenance") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
