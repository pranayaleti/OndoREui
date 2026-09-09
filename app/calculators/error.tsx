"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function CalculatorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Calculators] Unhandled error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-6 w-6 text-destructive-emphasis" />
          </div>
          <CardTitle className="text-xl">Calculator Error</CardTitle>
          <CardDescription>
            This calculator ran into an unexpected problem. Try resetting it, or
            explore our other calculators.
          </CardDescription>
        </CardHeader>
        {process.env["NODE_ENV"] === "development" && error.message && (
          <CardContent>
            <details className="rounded-md bg-muted p-3 text-sm">
              <summary className="cursor-pointer font-medium text-foreground/70">
                Error Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-foreground/60">
                {error.message}
                {error.digest ? `\nDigest: ${error.digest}` : ""}
              </pre>
            </details>
          </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/calculators">All Calculators</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
