"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { captureException } from "@/lib/sentry"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: true,
      })
    }
    // No-op when NEXT_PUBLIC_SENTRY_DSN is unset.
    captureException(error, { digest: error.digest ?? null })
  }, [error])

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background dark:bg-transparent">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive-emphasis" />
            </div>
          </div>
          <CardTitle className="text-xl">Something went wrong!</CardTitle>
          <CardDescription>We apologize for the inconvenience. An unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent className="text-foreground/70 text-center">
          {error.digest && <p>Error code: {error.digest}</p>}
          <p className={error.digest ? "mt-2" : undefined}>Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
