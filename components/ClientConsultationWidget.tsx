"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle, Phone, Calendar, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConsultationForm {
  name: string
  email: string
  phone: string
  service: string
  message: string
  preferredTime: string
}

const initialForm: ConsultationForm = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  preferredTime: "",
}

export default function ClientConsultationWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ConsultationForm>(initialForm)
  const { toast } = useToast()

  // Show widget on exit-intent (mouse leaves viewport) or deep scroll (70%+)
  // instead of aggressive auto-popup after 30s
  useEffect(() => {
    // Only trigger in production; never auto-open in local/dev
    if (process.env['NEXT_PUBLIC_APP_ENV'] !== "production" && process.env['NODE_ENV'] !== "production") {
      return
    }

    const dismissed = localStorage.getItem('consultation-widget-dismissed')
    if (dismissed) return

    let triggered = false
    const trigger = () => {
      if (triggered) return
      triggered = true
      setIsOpen(true)
    }

    // Exit-intent: user moves mouse above viewport (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger()
    }

    // Deep scroll: user has scrolled past 70% of the page
    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (scrollPercent > 0.7) trigger()
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Basic validation
      // Validate required fields
      if (!form.name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your name.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!form.email.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your email address.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!form.phone.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your phone number.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!form.service) {
        toast({
          title: "Missing Information",
          description: "Please select a service you're interested in.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email.trim())) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Phone validation (basic)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(form.phone.replace(/[\s\-\(\)\.]/g, ''))) {
        toast({
          title: "Invalid Phone",
          description: "Please enter a valid phone number.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Consultation Requested",
        description: "We'll contact you within 24 hours to schedule your consultation.",
      })

      // Reset form and close modal
      setForm(initialForm)
      setIsOpen(false)

      // Mark as submitted to prevent auto-show
      localStorage.setItem('consultation-widget-dismissed', 'true')

    } catch {
      toast({
        title: "Error",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [form, toast])

  const handleDismiss = useCallback(() => {
    setIsOpen(false)
    // Remember dismissal for 24 hours
    localStorage.setItem('consultation-widget-dismissed', 'true')
    setTimeout(() => {
      localStorage.removeItem('consultation-widget-dismissed')
    }, 24 * 60 * 60 * 1000)
  }, [])

  const updateForm = useCallback((field: keyof ConsultationForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  return (
    <div className="fixed bottom-20 right-6 z-40 md:bottom-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Schedule a free consultation with Ondo Real Estate"
          aria-haspopup="dialog"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              <DialogTitle>
                Schedule a Free Consultation
              </DialogTitle>
            </div>
            <DialogDescription>
              Get expert advice on buying, selling, or property management in Utah. We'll contact you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consultation-name">Name *</Label>
                <Input
                  id="consultation-name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Your full name"
                  required
                  disabled={isSubmitting}
                  aria-describedby="name-error"
                />
              </div>
              <div>
                <Label htmlFor="consultation-phone">Phone *</Label>
                <Input
                  id="consultation-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="(801) 555-0123"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="consultation-email">Email *</Label>
              <Input
                id="consultation-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="consultation-service">Service Interested In *</Label>
              <Select value={form.service} onValueChange={(value) => updateForm('service', value)} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buying">Buying a Home</SelectItem>
                  <SelectItem value="selling">Selling a Home</SelectItem>
                  <SelectItem value="property-management">Property Management</SelectItem>
                  <SelectItem value="loans">Mortgage/Loans</SelectItem>
                  <SelectItem value="notary">Notary Services</SelectItem>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultation-time">Preferred Time</Label>
              <Select value={form.preferredTime} onValueChange={(value) => updateForm('preferredTime', value)} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="When would you like to talk?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                  <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consultation-message">Message (Optional)</Label>
              <Textarea
                id="consultation-message"
                value={form.message}
                onChange={(e) => updateForm('message', e.target.value)}
                placeholder="Tell us about your specific needs..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
              </Button>
              <Button type="button" variant="outline" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-foreground/70 pt-4 border-t">
            <p>Or call us directly:</p>
            <a
              href="tel:+1-408-538-0420"
              className="text-primary hover:underline font-medium flex items-center justify-center gap-1 mt-1"
            >
              <Phone className="h-4 w-4" />
              +1 (408) 538-0420
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}