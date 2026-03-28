"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { hasLeadBeenCaptured, markLeadCaptured, submitLead } from "@/lib/api/leads"

interface LeadCaptureModalProps {
  calculatorSlug: string
  calculatorName: string
  hasCalculated: boolean
}

export function LeadCaptureModal({
  calculatorSlug,
  calculatorName,
  hasCalculated,
}: LeadCaptureModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [alreadyCaptured, setAlreadyCaptured] = useState(false)

  useEffect(() => {
    if (hasLeadBeenCaptured()) {
      setAlreadyCaptured(true)
    }
  }, [])

  useEffect(() => {
    if (!hasCalculated || alreadyCaptured) return

    const timer = setTimeout(() => {
      if (!hasLeadBeenCaptured()) {
        setOpen(true)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [hasCalculated, alreadyCaptured])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    markLeadCaptured(email)
    await submitLead({
      email,
      source: calculatorName,
      calculatorSlug,
    })

    setSubmitted(true)

    setTimeout(() => {
      setOpen(false)
    }, 1500)
  }

  const handleSkip = () => {
    setOpen(false)
  }

  if (alreadyCaptured) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Save your results
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your email to save and revisit your {calculatorName} results anytime.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-4 text-center text-primary font-medium">
            Results saved! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                No thanks
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save results
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
