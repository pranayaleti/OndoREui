"use client";

import React, { useMemo, useState, useCallback, memo } from 'react';
import {
  X,
  Calendar,
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SITE_PHONE, SITE_CALENDLY_URL } from '@/lib/site';
import { backendUrl } from '@/lib/backend';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'default' | 'notary';
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  serviceType: string;
  timeline: string;
  budget: string;
  message: string;
  preferredTime: string;
  timezone: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = memo(({ isOpen, onClose, variant = 'default' }) => {
  const isNotary = variant === 'notary';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    serviceType: '',
    timeline: '',
    budget: '',
    message: '',
    preferredTime: '',
    timezone: 'MST'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const propertyTypes = useMemo(
    () => [
      'Single Family Home',
      'Townhouse/Condo',
      'Multi-Family Property',
      'Commercial Property',
      'Land/Lot',
      'Investment Property',
      'Other',
    ],
    []
  );

  const serviceTypes = useMemo(
    () =>
      isNotary
        ? [
            'Remote Online Notarization (RON)',
            'Mobile Notary (Utah County)',
            'In-Office Notary (Lehi)',
            'Loan Signing (Real Estate)',
            'Apostille Assistance (Utah docs)',
            'Witness Services',
            'I-9 Verification',
            'General Notary',
            'Other',
          ]
        : [
            'Property Management',
            'Buying a Home',
            'Selling a Home',
            'Home Loans/Mortgage',
            'Refinancing',
            'Investment Consulting',
            'Market Analysis',
            'Other',
          ],
    [isNotary]
  );

  const timelineOptions = useMemo(
    () =>
      isNotary
        ? ['Within 2 hours', 'Today', 'Tomorrow', 'Within 3 days', 'Within a week', 'Flexible']
        : ['ASAP (Urgent)', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Just exploring options', 'Flexible timeline'],
    [isNotary]
  );

  const budgetRanges = useMemo(
    () => [
      'Under $300,000',
      '$300,000 - $500,000',
      '$500,000 - $750,000',
      '$750,000 - $1,000,000',
      '$1,000,000+',
      "Let's discuss",
    ],
    []
  );

  const timeSlots = useMemo(
    () => [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM',
    ],
    []
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const nowIso = new Date().toISOString();
      const fallbackPublicId = '5b3aba39-51f2-48b5-b3a0-db948cfde010';
      const payload = {
        ...formData,
        type: 'consultation',
        source: 'consultation_modal',
        context: variant,
        leadType: 'consultation',
        timestamp: nowIso,
        utm_source: 'consultation_modal',
        utm_medium: 'website',
        utm_campaign: variant === 'notary' ? 'notary_booking' : 'consultation_booking',
        publicId: fallbackPublicId,
        tenantName: formData.name ?? '',
        tenantEmail: formData.email ?? '',
        tenantPhone: formData.phone ?? '',
        moveInDate: nowIso,
        monthlyBudget: 1,
        occupants: 1,
        hasPets: false,
      };

      const response = await fetch(backendUrl('/api/leads/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit consultation request');
      }
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        serviceType: '',
        timeline: '',
        budget: '',
        message: '',
        preferredTime: '',
        timezone: 'MST'
      });
    } catch (error) {
      console.error('Consultation submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, variant]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="bg-primary p-3 rounded-lg mr-4">
              {isNotary ? (
                <FileText className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Home className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">
                {isNotary ? 'Book ONDO Notary' : 'View Available Times & Book Now'}
              </h2>
              <p className="text-foreground/70">
                {isNotary
                  ? 'Remote online or Utah County mobile/in-office notarization'
                  : '30-minute expert consultation'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={onClose}
            className="text-foreground/70 hover:text-foreground"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>

        <div className="px-6 py-4 border-b bg-muted/40">
          <p className="text-sm text-foreground/80 mb-3">
            Prefer to pick a time yourself? Same calendar for general consultations, notary, loans, and other services.
          </p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={SITE_CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              <Calendar className="h-4 w-4 shrink-0" />
              Book on Calendly (30 min)
            </a>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
              <CheckCircle className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
              <div>
                <p className="text-green-700 dark:text-green-300 font-semibold">Consultation Booked Successfully!</p>
                <p className="text-green-600 dark:text-green-400 text-sm">We'll send you a calendar invite and confirmation email shortly.</p>
              </div>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300">Something went wrong. Please try again or contact us directly.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-card-foreground mb-2">
                {isNotary ? 'Notary Service Needed *' : 'Service Needed *'}
              </label>
              <Select value={formData.serviceType} onValueChange={(value) => handleSelectChange('serviceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isNotary ? 'Select notary service' : 'Select service type'} />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            {!isNotary && (
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-card-foreground mb-2">
                  Property Type
                </label>
                <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-card-foreground mb-2">
                {isNotary ? 'Appointment Timing' : 'Timeline'}
              </label>
              <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isNotary ? 'When do you need this?' : 'Select timeline'} />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map(timeline => (
                    <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            {!isNotary && (
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-card-foreground mb-2">
                  Budget Range
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map(budget => (
                      <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Preferred Time */}
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-card-foreground mb-2">
                Preferred Time Slot
              </label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time} MST</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6">
            <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
              {isNotary ? 'Tell us about your notarization *' : 'Tell us about your real estate needs *'}
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder={
                isNotary
                  ? 'Documents, state, online vs. mobile, number of signers, preferred time...'
                  : 'Tell us about your real estate goals, property preferences, timeline, and any specific questions you have...'
              }
            />
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-card-foreground mb-3">
              {isNotary ? 'What you get with ONDO Notary:' : "What you'll get from this consultation:"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/70">
              {isNotary ? (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Remote online or Utah County mobile/in-office options</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Document + ID requirements confirmed before booking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Secure video session with digital seal and audit trail</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Same-day and lender/title-ready execution</span>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  {isNotary ? 'Book ONDO Notary' : 'View Available Times & Book Now'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="lg"
            >
              Cancel
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center text-sm text-foreground/70">
            <p>
              {isNotary ? 'For urgent notarization, call or text: ' : 'Or call us directly: '}
              <a href={`tel:${SITE_PHONE}`} className="text-primary font-semibold">{SITE_PHONE}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
});

ConsultationModal.displayName = 'ConsultationModal';

export default ConsultationModal;
