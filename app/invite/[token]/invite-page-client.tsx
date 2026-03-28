"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-states"
import { validateInviteToken, type InvitationDetails } from "@/lib/api/invitations"
import { SITE_BRAND_SHORT } from "@/lib/site"
import Link from "next/link"

type State = "loading" | "valid" | "expired" | "error"

const tenantFeatures = [
  "Pay rent online",
  "Submit maintenance requests",
  "Message your property manager",
  "Access lease & documents",
  "Build credit through on-time payments",
]

const ownerFeatures = [
  "View your property portfolio",
  "Track rent payments",
  "Manage maintenance requests",
  "Access documents & leases",
]

export default function InvitePageClient({ token }: { token: string }) {
  const [state, setState] = useState<State>("loading")
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)

  useEffect(() => {
    if (token === "_") {
      setState("error")
      return
    }

    validateInviteToken(token)
      .then((result) => {
        if (result !== null) {
          setInvitation(result)
          setState("valid")
        } else {
          setState("expired")
        }
      })
      .catch(() => {
        setState("error")
      })
  }, [token])

  if (state === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-muted-foreground text-sm">Validating your invitation...</p>
      </div>
    )
  }

  if (state === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Invitation Expired</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This invitation link has expired. Please reach out to your property manager to request a
              new invite.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to {SITE_BRAND_SHORT}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This invitation link is invalid or has already been used. Please contact your property
              manager for assistance.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to {SITE_BRAND_SHORT}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // valid state
  const { role, email, propertyTitle, unitNumber } = invitation!
  const isOwner = role === "owner"
  const features = isOwner ? ownerFeatures : tenantFeatures

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {/* House icon */}
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6h-6v6H3.75A.75.75 0 013 21V9.75z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">You&apos;re Invited!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <p className="text-center text-muted-foreground">
            You&apos;ve been invited to join {SITE_BRAND_SHORT} as a{" "}
            <span className="font-medium text-foreground capitalize">{role}</span>.
          </p>

          {propertyTitle && (
            <p className="text-center text-sm text-muted-foreground">
              Property:{" "}
              <span className="font-medium text-foreground">
                {propertyTitle}
                {unitNumber ? `, Unit ${unitNumber}` : ""}
              </span>
            </p>
          )}

          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">
              {isOwner ? "With your account you can:" : "As a tenant you can:"}
            </p>
            <ul className="space-y-1">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg
                    className="h-4 w-4 shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button asChild className="w-full">
            <Link href={`/auth?invite=${token}&email=${encodeURIComponent(email)}`}>
              Create your account
            </Link>
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href={`/auth?invite=${token}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
