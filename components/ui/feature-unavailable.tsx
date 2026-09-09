"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface FeatureUnavailableProps {
  title?: string
  description?: string
  showHomeButton?: boolean
  showBackButton?: boolean
  actionText?: string
  actionHref?: string
}

export function FeatureUnavailable({
  title = "Feature Not Available",
  description = "This feature is not available yet. We're working on it and will release it soon.",
  showHomeButton = true,
  showBackButton = true,
  actionText,
  actionHref,
}: FeatureUnavailableProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive-emphasis" />
            </div>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-foreground/70 text-center">
          Please check back later or contact support if you need immediate assistance.
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          {showBackButton && (
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          )}
          {actionText && actionHref && (
            <Link href={actionHref}>
              <Button variant="default">{actionText}</Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
