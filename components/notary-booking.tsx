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
        <h3 className="text-2xl font-semibold mb-6 text-primary">Book a session</h3>
        <p className="text-foreground/80 mb-6">
          Tell us what you need notarized and when. We confirm a time by email.
        </p>
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <Calendar className="w-16 h-16 text-primary" />
            
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

