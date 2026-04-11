"use client";

import React, { useState, useCallback, memo } from 'react';
import { X, CheckCircle, AlertCircle, Send, Home, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SITE_PHONE, SITE_CALENDLY_URL } from '@/lib/site';
import { backendUrl } from '@/lib/backend';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceType: string;
  timeline: string;
  budget: string;
  message: string;
}

const ConsultationWidget: React.FC = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: '',
    timeline: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

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
      // Static export (GitHub Pages) can't run Next.js Route Handlers.
      // Send directly to the backend used in production.
      const nowIso = new Date().toISOString();
      const fallbackPublicId = '5b3aba39-51f2-48b5-b3a0-db948cfde010';
      const payload = {
        ...formData,
        type: 'consultation',
        source: 'consultation_widget',
        leadType: 'consultation',
        timestamp: nowIso,
        utm_source: 'consultation_widget',
        utm_medium: 'website',
        utm_campaign: 'consultation_booking',
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
        company: '',
        phone: '',
        serviceType: '',
        timeline: '',
        budget: '',
        message: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-20 right-6 z-30 md:bottom-6 group">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-16 w-16"
          aria-label="Book a consultation or send a request"
        >
          <Home className="h-6 w-6" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Free
          </div>
        </Button>
        
        {/* Enhanced Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 bg-card text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>View Available Times & Book Now</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">Book Your Free Real Estate Consultation</h2>
                <p className="text-foreground/70 mt-1">Get expert advice on your real estate needs in 30 minutes</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="text-foreground/70 hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
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
                  <p className="text-green-700 dark:text-green-300">Thank you! We'll contact you within 24 hours to schedule your consultation.</p>
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

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-card-foreground mb-2">
                    Company/Business
                  </label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
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
                    Service Needed *
                  </label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleSelectChange('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property-management">Property Management</SelectItem>
                      <SelectItem value="buying">Buying a Home</SelectItem>
                      <SelectItem value="selling">Selling a Home</SelectItem>
                      <SelectItem value="loans">Home Loans/Mortgage</SelectItem>
                      <SelectItem value="refinancing">Refinancing</SelectItem>
                      <SelectItem value="investment">Investment Consulting</SelectItem>
                      <SelectItem value="market-analysis">Market Analysis</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-card-foreground mb-2">
                    Timeline
                  </label>
                  <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (Urgent)</SelectItem>
                      <SelectItem value="1month">Within 1 month</SelectItem>
                      <SelectItem value="3months">Within 3 months</SelectItem>
                      <SelectItem value="6months">Within 6 months</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div className="md:col-span-2">
                  <label htmlFor="budget" className="block text-sm font-medium text-card-foreground mb-2">
                    Budget Range
                  </label>
                  <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-300k">Under $300,000</SelectItem>
                      <SelectItem value="300k-500k">$300,000 - $500,000</SelectItem>
                      <SelectItem value="500k-750k">$500,000 - $750,000</SelectItem>
                      <SelectItem value="750k-1m">$750,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m-plus">$1,000,000+</SelectItem>
                      <SelectItem value="discuss">Let's discuss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Tell us about your real estate needs *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Tell us about your real estate goals, property preferences, timeline, and any specific questions you have..."
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-card-foreground mb-3">What you'll get:</h3>
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
              </div>

              {/* Submit Button */}
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
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      View Available Times & Book Now
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-6 text-center text-sm text-foreground/70 space-y-2">
                <p>
                  Book online:{' '}
                  <a
                    href={SITE_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Calendly (30 min)
                  </a>
                </p>
                <p>Or call: <a href={`tel:${SITE_PHONE}`} className="text-primary font-semibold">{SITE_PHONE}</a></p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

ConsultationWidget.displayName = 'ConsultationWidget';

export default ConsultationWidget;
