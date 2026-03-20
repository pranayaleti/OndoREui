"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Phone, Home, CheckCircle, MessageSquare } from 'lucide-react';
import { SITE_PHONE, SITE_CALENDLY_URL } from '@/lib/site';
import ConsultationModal from '@/components/ConsultationModal';

interface ConsultationCTAProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'card' | 'minimal';
  className?: string;
}

const ConsultationCTA: React.FC<ConsultationCTAProps> = ({
  title = "Need Expert Real Estate Advice?",
  description = "View available times and book a free 30-minute consultation",
  variant = 'default',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendlyButton = (
    <Button asChild className="flex-1" size="lg">
      <a
        className="inline-flex items-center justify-center"
        href={SITE_CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Calendar className="h-5 w-5 mr-2 shrink-0" />
        Book on Calendly
      </a>
    </Button>
  );

  const callButton = (
    <Button
      variant="outline"
      onClick={() => window.open(`tel:${SITE_PHONE}`, '_self')}
      size="lg"
    >
      <Phone className="h-5 w-5 mr-2" />
      Call Now
    </Button>
  );

  const requestModalButton = (
    <Button
      type="button"
      variant="secondary"
      className="w-full sm:flex-1"
      size="lg"
      onClick={() => setIsModalOpen(true)}
    >
      <MessageSquare className="h-5 w-5 mr-2 shrink-0" />
      Notary &amp; other services
    </Button>
  );

  const actionRows = (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {calendlyButton}
        {callButton}
      </div>
      <div className="flex flex-col gap-2">
        {requestModalButton}
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Send details for notary, loan signing, property questions, or anything that needs a follow-up from our team.
        </p>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {actionRows}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`border-primary/20 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary p-3 rounded-lg w-fit mb-4">
            <Home className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/70">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>30-minute expert consultation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>Market analysis & pricing</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>Property recommendations</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
              <span>Next steps & timeline</span>
            </div>
          </div>
          {actionRows}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`p-6 bg-primary/10 rounded-lg border border-primary/20 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary p-3 rounded-lg">
          <Calendar className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
          <p className="text-foreground/70">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {actionRows}
      </div>
    </div>
  );
};

export default ConsultationCTA;
