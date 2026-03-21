"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

type Status = "verifying" | "success" | "error" | "missing"

export default function VerifyPage() {
  const params = useSearchParams()
  const token = params?.get("token") ?? null
  const [status, setStatus] = useState<Status>(token ? "verifying" : "missing")

  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function verify() {
      try {
        // TODO: replace with your actual verification API call
        // e.g. await fetch(`/api/verify?token=${token}`)
        await new Promise((r) => setTimeout(r, 1200))
        if (!cancelled) setStatus("success")
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    verify()
    return () => { cancelled = true }
  }, [token])

  return (
    <main className="min-h-screen">
      <PageBanner
        title="Email Verification"
        subtitle="Confirming your email address"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card>
              <CardContent className="pt-10 pb-10 text-center space-y-5">
                {status === "verifying" && (
                  <>
                    <Loader2 className="mx-auto h-14 w-14 text-primary animate-spin" />
                    <h2 className="text-2xl font-bold">Verifying your email…</h2>
                    <p className="text-foreground/70">This will only take a moment.</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <CheckCircle className="mx-auto h-14 w-14 text-green-500" />
                    <h2 className="text-2xl font-bold">Email verified!</h2>
                    <p className="text-foreground/70">
                      Your email address has been successfully confirmed. You now have full access
                      to your Ondo Real Estate account.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Button asChild>
                        <Link href="/login">Sign in to your account</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/">Back to Home</Link>
                      </Button>
                    </div>
                  </>
                )}

                {status === "error" && (
                  <>
                    <XCircle className="mx-auto h-14 w-14 text-red-500" />
                    <h2 className="text-2xl font-bold">Verification failed</h2>
                    <p className="text-foreground/70">
                      This link may have expired or already been used. Verification links are valid
                      for 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <Button asChild>
                        <Link href="/contact">Contact support</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/login">Back to sign in</Link>
                      </Button>
                    </div>
                  </>
                )}

                {status === "missing" && (
                  <>
                    <XCircle className="mx-auto h-14 w-14 text-foreground/30" />
                    <h2 className="text-2xl font-bold">No verification token</h2>
                    <p className="text-foreground/70">
                      It looks like you arrived here without a verification link. Check your email
                      for a message from Ondo Real Estate and click the link inside.
                    </p>
                    <Button asChild variant="outline">
                      <Link href="/contact">Need help? Contact us</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
