"use client"

import { useAuth } from "@/hooks/use-auth"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { backendUrl } from "@/lib/backend"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Server, Globe, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

type BackendHealth = {
  ok?: boolean
  timestamp?: string
}

export default function HealthPage() {
  const { user, isLoading } = useAuth()
  const [backend, setBackend] = useState<{ status: "ok" | "error"; data?: BackendHealth; error?: string } | null>(null)

  if (!isLoading && (!user || user.role !== "admin")) {
    notFound()
  }

  useEffect(() => {
    if (!user || user.role !== "admin") return
    const url = backendUrl("/health")
    fetch(url, { cache: "no-store" })
      .then(async (res) => {
        const text = await res.text()
        let data: BackendHealth = {}
        try {
          data = JSON.parse(text) as BackendHealth
        } catch {
          setBackend({ status: "error", error: `Invalid JSON: ${text.slice(0, 100)}` })
          return
        }
        if (res.ok) {
          setBackend({ status: "ok", data })
        } else {
          setBackend({ status: "error", data, error: `HTTP ${res.status}` })
        }
      })
      .catch((err) => {
        setBackend({ status: "error", error: err instanceof Error ? err.message : String(err) })
      })
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Health</h1>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Frontend (this app)
            </CardTitle>
            <CardDescription>Next.js app runtime and env</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                NODE_ENV: {process.env.NODE_ENV ?? "unknown"}
              </Badge>
              <Badge variant="outline">
                Checked at: {new Date().toISOString()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              BACKEND_BASE_URL (origin only): {typeof window !== "undefined" ? new URL(backendUrl("/")).origin : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Backend API
            </CardTitle>
            <CardDescription>
              {backendUrl("/health")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backend === null ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking…
              </div>
            ) : backend.status === "ok" ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>OK</span>
                {backend.data?.timestamp && (
                  <span className="text-muted-foreground text-sm">
                    {backend.data.timestamp}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span>{backend.error ?? "Request failed"}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
