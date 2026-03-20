"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Mail, MapPin, Phone, Calendar, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS, SITE_ADDRESS_STREET, SITE_ADDRESS_CITY, SITE_ADDRESS_REGION, SITE_ADDRESS_POSTAL_CODE, SITE_HOURS_LABEL, SITE_CALENDLY_URL } from "@/lib/site"
import { backendUrl } from "@/lib/backend"
import ConsultationModal from "@/components/ConsultationModal"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const inquiryTypes = [
    'Property Management',
    'Buying a Home',
    'Selling a Home',
    'Home Loans/Mortgage',
    'Refinancing',
    'Investment Consulting',
    'General Question',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const nowIso = new Date().toISOString();
      const fallbackPublicId = '5b3aba39-51f2-48b5-b3a0-db948cfde010';
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        type: 'contact_form',
        source: 'contact_page',
        leadType: 'general_inquiry',
        timestamp: nowIso,
        publicId: fallbackPublicId,
        tenantName: `${formData.firstName} ${formData.lastName}`,
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
        throw new Error('Failed to submit contact form');
      }
      
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: ''
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" aria-labelledby="contact-page-heading">
      <SEO
        title="Contact Ondo Real Estate"
        description="Get in touch with Ondo Real Estate for property management, rentals, or real estate services across Utah."
        pathname="/contact"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Contact", url: `${SITE_URL}/contact` },
          ]),
          generateServiceJsonLd({
            name: "Contact Ondo Real Estate",
            description: "Get help with Utah property management, buying, selling, and rentals.",
            serviceType: "Customer Service",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with our property management experts to find your perfect rental or to help you manage your property"
      />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h2
                    id="contact-page-heading"
                    className="text-3xl font-bold tracking-tighter"
                  >
                    Get in Touch
                  </h2>
                  <p className="text-foreground/70 mt-2">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>
                </div>
                  <div className="grid gap-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold">Our Office</h3>
                      <p className="text-sm text-foreground/70">
                        {SITE_ADDRESS_STREET}
                        <br />
                        {`${SITE_ADDRESS_CITY}, ${SITE_ADDRESS_REGION} ${SITE_ADDRESS_POSTAL_CODE}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-foreground/70">{SITE_EMAILS.primary}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-sm text-foreground/70">{SITE_PHONE}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Building className="h-6 w-6 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-sm text-foreground/70">{SITE_HOURS_LABEL}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-6 w-6 text-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Follow Us</h3>
                      <p className="text-sm text-foreground/70 mb-2">
                        Connect with us on social media for updates and insights
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href="https://linktr.ee/ondorealestate"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <Image
                            src="/Linktree.png"
                            alt="Linktree QR Code"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded border bg-white p-1"
                            quality={85}
                            sizes="64px"
                          />
                        </a>
                        <div className="text-xs text-foreground/70">
                          <p>Scan QR code or visit</p>
                          <a 
                            href="https://linktr.ee/ondorealestate" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            linktr.ee/ondorealestate
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Consultation CTA */}
                <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-card-foreground">Need Expert Advice?</h3>
                      <p className="text-foreground/70">View available times and book a free 30-minute consultation</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
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
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(`tel:${SITE_PHONE}`, '_self')}
                        size="lg"
                      >
                        <Phone className="h-5 w-5 mr-2" />
                        Call Now
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsConsultationModalOpen(true)}
                    >
                      <MessageSquare className="h-5 w-5 mr-2 shrink-0" />
                      Notary &amp; other services
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Send a detailed request for notary, loan signing, or anything that needs follow-up from our team — or use Calendly to grab a time.
                    </p>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll respond to your inquiry as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Success/Error Messages */}
                  <div
                    id="contact-form-status"
                    role="status"
                    aria-live="polite"
                    className="mb-6"
                  >
                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center">
                        <CheckCircle className="text-green-500 dark:text-green-400 mr-3 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-green-700 dark:text-green-300 font-semibold">Message sent successfully!</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                        <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0" aria-hidden="true" />
                        <p className="text-red-700 dark:text-red-300">Something went wrong. Please try again or call us directly.</p>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="grid gap-4"
                    aria-describedby="contact-form-status"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com" 
                        type="email" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567" 
                        type="tel" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Type of Inquiry</Label>
                      <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        className="min-h-[120px]"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide details about your inquiry..."
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      {/* Footer rendered globally in RootLayout */}
    </div>
  )
}
