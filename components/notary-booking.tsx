"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"
import { Calendar } from "lucide-react"
import ConsultationModal from "@/components/ConsultationModal"

export function NotaryBooking() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-primary">Book Your Appointment</h3>
        <p className="text-foreground/80 mb-6">
          Send us a request for your notary session. Tell us what you need notarized and when, and we will confirm a time with you.
        </p>
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <Calendar className="w-16 h-16 text-primary" />
            <div>
              <p className="text-lg font-semibold text-foreground mb-3">
                Ready to schedule your appointment?
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Click the button below to open the request form. We will reply to confirm your appointment time.
              </p>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Request a notary session
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              For urgent remote requests, please call us at <a href={`tel:${SITE_PHONE_TEL}`} className="font-semibold text-primary underline underline-offset-4">{SITE_PHONE}</a>
            </p>
          </div>
        </div>
      </div>
      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        variant="notary"
      />
    </>
  )
}

