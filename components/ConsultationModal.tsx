"use client";

import React, { useId, useMemo, useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Home,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SITE_PHONE } from '@/lib/site';
import { analyticsAttributes } from '@/lib/analytics';
import { CalendlyLink } from '@/components/calendly-link';
import { submitContactLead } from '@/lib/leads-api';
import { ContactNotice } from '@/components/contact-notice';
import { getAttributionPayloadForApi } from '@/lib/attribution';
import { buildConsultationLead, consultationFieldErrors, type ConsultationFieldErrors } from '@/lib/consultation-lead';
import { FieldError, focusFirstInvalid, requiredFieldProps } from '@/components/lead-contact-fields';
import { useAntiSpam } from '@/lib/anti-spam';

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
  const { t } = useTranslation();
  const isNotary = variant === 'notary';
  // Unique per modal so the label/field ids never collide with a form on the page behind it.
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

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
  const [fieldErrors, setFieldErrors] = useState<ConsultationFieldErrors>({});
  const { honeypotProps, gate } = useAntiSpam();

  // NOTE(i18n): enum option labels are kept in English for now and tracked as a
  // Phase 1 follow-up. They are sent verbatim to the backend as form values, so
  // translating them here would also need a label-vs-value split. See the
  // production-readiness roadmap.
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
    setFieldErrors(prev => (name in prev ? { ...prev, [name]: undefined } : prev));
  }, []);

  const nameError = fieldErrors.name ? t(`consultationModal.errors.${fieldErrors.name}`) : undefined;
  const emailError = fieldErrors.email ? t(`consultationModal.errors.${fieldErrors.email}`) : undefined;
  const serviceError = fieldErrors.serviceType ? t(`consultationModal.errors.${fieldErrors.serviceType}`) : undefined;
  const messageError = fieldErrors.message ? t(`consultationModal.errors.${fieldErrors.message}`) : undefined;

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFieldErrors(prev => (name in prev ? { ...prev, [name]: undefined } : prev));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot signal: silently render success so the bot can't probe whether
    // the gate fired. Real users can't trip these, honeypot is hidden +
    // non-focusable, and the dwell threshold is well under the time a
    // human takes to fill 4-5 fields.
    if (gate.isLikelyBot()) {
      gate.recordAttempt();
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', propertyType: '', serviceType: '',
        timeline: '', budget: '', message: '', preferredTime: '', timezone: 'MST',
      });
      return;
    }

    // noValidate is on the form, so the browser does not block an empty required field. Show the
    // reason next to each field and put focus on the first one that needs fixing.
    const errors = consultationFieldErrors(formData);
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) {
      setSubmitStatus(null);
      focusFirstInvalid(e.currentTarget as HTMLFormElement);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Same endpoint as the contact form: POST /api/leads/contact. The details
      // that have no field of their own travel in the message.
      const attribution = getAttributionPayloadForApi();
      const result = await submitContactLead({
        ...buildConsultationLead(formData, variant),
        ...(attribution && { attribution }),
      }, { formName: variant === 'notary' ? 'notary_booking' : 'consultation_booking' });

      if ('error' in result) {
        throw new Error(result.error);
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
  }, [formData, variant, gate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* Radix supplies role=dialog, aria-modal, the focus trap, Escape to close and focus return. It sits
          above the Ask Ondo launcher (z-50), which used to be drawn over the form. */}
      <DialogContent
        closeLabel={t('consultationModal.closeAria')}
        className="w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border bg-card p-0 sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center p-6 pr-14 border-b">
          <div className="flex items-center">
            <div className="bg-primary p-3 rounded-lg mr-4">
              {isNotary ? (
                <FileText className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Home className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold leading-normal tracking-normal text-card-foreground">
                {isNotary ? t('consultationModal.titleNotary') : t('consultationModal.titleDefault')}
              </DialogTitle>
              <DialogDescription className="text-base text-foreground/70">
                {isNotary
                  ? t('consultationModal.subtitleNotary')
                  : t('consultationModal.subtitleDefault')}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b bg-muted/40">
          <p className="text-sm text-foreground/80 mb-3">
            {t('consultationModal.calendlyHint')}
          </p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <CalendlyLink
              contentLabel="consultation_modal"
              {...analyticsAttributes('calendly_click', 'consultation_modal', 'book')}
            >
              <Calendar className="h-4 w-4 shrink-0" />
              {t('consultationModal.bookOnCalendly')}
            </CalendlyLink>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6">
          {/* Honeypot: visually hidden, non-focusable. Bots fill it; humans don't. */}
          <input {...honeypotProps} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor={fieldId('name')} className="block text-sm font-medium text-card-foreground mb-2">
                {t('consultationModal.fields.name')}
              </label>
              <Input
                type="text"
                id={fieldId('name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                placeholder={t('consultationModal.placeholders.name')}
                {...requiredFieldProps(`${fieldId('name')}-error`, nameError)}
              />
              <FieldError id={`${fieldId('name')}-error`} message={nameError} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor={fieldId('email')} className="block text-sm font-medium text-card-foreground mb-2">
                {t('consultationModal.fields.email')}
              </label>
              <Input
                type="email"
                id={fieldId('email')}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                placeholder={t('consultationModal.placeholders.email')}
                {...requiredFieldProps(`${fieldId('email')}-error`, emailError)}
              />
              <FieldError id={`${fieldId('email')}-error`} message={emailError} />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor={fieldId('phone')} className="block text-sm font-medium text-card-foreground mb-2">
                {t('consultationModal.fields.phone')}
              </label>
              <Input
                type="tel"
                id={fieldId('phone')}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                autoComplete="tel"
                placeholder={t('consultationModal.placeholders.phone')}
              />
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor={fieldId('serviceType')} className="block text-sm font-medium text-card-foreground mb-2">
                {isNotary ? t('consultationModal.fields.serviceTypeNotary') : t('consultationModal.fields.serviceTypeDefault')}
              </label>
              <Select value={formData.serviceType} onValueChange={(value) => handleSelectChange('serviceType', value)}>
                <SelectTrigger
                  id={fieldId('serviceType')}
                  aria-required="true"
                  aria-invalid={serviceError ? true : undefined}
                  aria-describedby={serviceError ? `${fieldId('serviceType')}-error` : undefined}
                >
                  <SelectValue placeholder={isNotary ? t('consultationModal.placeholders.serviceTypeNotary') : t('consultationModal.placeholders.serviceTypeDefault')} />
                </SelectTrigger>
                <SelectContent>
                  {/* NOTE(i18n): option labels are English; see Phase 1 follow-up. */}
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id={`${fieldId('serviceType')}-error`} message={serviceError} />
            </div>

            {/* Property Type */}
            {!isNotary && (
              <div>
                <label htmlFor={fieldId('propertyType')} className="block text-sm font-medium text-card-foreground mb-2">
                  {t('consultationModal.fields.propertyType')}
                </label>
                <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                  <SelectTrigger id={fieldId('propertyType')}>
                    <SelectValue placeholder={t('consultationModal.placeholders.propertyType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* NOTE(i18n): option labels are English; see Phase 1 follow-up. */}
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Timeline */}
            <div>
              <label htmlFor={fieldId('timeline')} className="block text-sm font-medium text-card-foreground mb-2">
                {isNotary ? t('consultationModal.fields.timelineNotary') : t('consultationModal.fields.timelineDefault')}
              </label>
              <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                <SelectTrigger id={fieldId('timeline')}>
                  <SelectValue placeholder={isNotary ? t('consultationModal.placeholders.timelineNotary') : t('consultationModal.placeholders.timelineDefault')} />
                </SelectTrigger>
                <SelectContent>
                  {/* NOTE(i18n): option labels are English; see Phase 1 follow-up. */}
                  {timelineOptions.map(timeline => (
                    <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            {!isNotary && (
              <div>
                <label htmlFor={fieldId('budget')} className="block text-sm font-medium text-card-foreground mb-2">
                  {t('consultationModal.fields.budget')}
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                  <SelectTrigger id={fieldId('budget')}>
                    <SelectValue placeholder={t('consultationModal.placeholders.budget')} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* NOTE(i18n): option labels are English; see Phase 1 follow-up. */}
                    {budgetRanges.map(budget => (
                      <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Preferred Time */}
            <div>
              <label htmlFor={fieldId('preferredTime')} className="block text-sm font-medium text-card-foreground mb-2">
                {t('consultationModal.fields.preferredTime')}
              </label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
                <SelectTrigger id={fieldId('preferredTime')}>
                  <SelectValue placeholder={t('consultationModal.placeholders.preferredTime')} />
                </SelectTrigger>
                <SelectContent>
                  {/* NOTE(i18n): time slot labels are English; see Phase 1 follow-up. */}
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time} MST</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="mt-6">
            <label htmlFor={fieldId('message')} className="block text-sm font-medium text-card-foreground mb-2">
              {isNotary ? t('consultationModal.fields.messageNotary') : t('consultationModal.fields.messageDefault')}
            </label>
            <Textarea
              id={fieldId('message')}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder={
                isNotary
                  ? t('consultationModal.placeholders.messageNotary')
                  : t('consultationModal.placeholders.messageDefault')
              }
              {...requiredFieldProps(`${fieldId('message')}-error`, messageError)}
            />
            <FieldError id={`${fieldId('message')}-error`} message={messageError} />
          </div>

          {/* Benefits */}
          {/* NOTE(i18n): benefit bullets are kept in English for Phase 1. */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-card-foreground mb-3">
              {isNotary ? 'What you get with ONDO Notary:' : "What you'll get from this consultation:"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-foreground/70">
              {isNotary ? (
                <>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span>Remote online notarization nationwide</span>
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

          <ContactNotice className="mt-6 text-xs text-muted-foreground" />

          {/* Result, right above the submit button so it is never scrolled out of view. Each live region
              stays mounted and only its content changes, which is what makes screen readers announce it. */}
          <div role="status">
            {submitStatus === 'success' && (
              <div className="mt-6 p-4 bg-success-emphasis/10 border border-success-emphasis/30 rounded-lg flex items-center">
                <CheckCircle className="text-success-emphasis mr-3 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-success-emphasis font-semibold">{t('consultationModal.successTitle')}</p>
                  <p className="text-foreground/80 text-sm">{t('consultationModal.successBody')}</p>
                </div>
              </div>
            )}
          </div>
          <div role="alert">
            {submitStatus === 'error' && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center">
                <AlertCircle className="text-destructive-emphasis mr-3 flex-shrink-0" aria-hidden="true" />
                <p className="text-destructive-emphasis">{t('consultationModal.errorMessage', { phone: SITE_PHONE })}</p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('consultationModal.booking')}
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  {isNotary ? t('consultationModal.bookingNotary') : t('consultationModal.bookingDefault')}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="lg"
            >
              {t('consultationModal.cancel')}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center text-sm text-foreground/70">
            <p>
              {isNotary ? t('consultationModal.contactInfoNotary') + ' ' : t('consultationModal.contactInfoDefault') + ' '}
              <a href={`tel:${SITE_PHONE}`} className="text-primary font-semibold">{SITE_PHONE}</a>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

ConsultationModal.displayName = 'ConsultationModal';

export default ConsultationModal;
