"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { emailValidation, phoneValidation } from "@/lib/validations";
import { backendUrl } from "@/lib/backend";
import { QualificationChat } from "@/components/leads/qualification-chat";

interface PropertyLeadFormProps {
  open: boolean;
  onClose: () => void;
  propertyName: string;
  publicId: string; // NEW: pass the property's publicId
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone" | "text";
  moveInDate: string;      // yyyy-mm-dd
  budget: string;          // we’ll parse to number
  occupants: "1" | "2" | "3" | "4" | "5+";
  pets: "Yes" | "No";
  comments: string;
  termsAccepted: boolean;
};

type Errors = Partial<Record<keyof FormData, string>> & { form?: string };

export function PropertyLeadForm({ open, onClose, propertyName, publicId }: PropertyLeadFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [, setLeadId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    moveInDate: "",
    budget: "",
    occupants: "1",
    pets: "No",
    comments: "",
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as FormData[typeof name] }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: !!checked }));
    setErrors((prev) => ({ ...prev, termsAccepted: "" }));
  };

  // --- Validation helpers ---
  const isFutureOrToday = (iso: string) => {
    if (!iso) return false;
    const d = new Date(iso + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  const parseBudget = (v: string) => Number(String(v).replace(/[^\d.]/g, "") || NaN);

  const validateStep1 = (): boolean => {
    const next: Errors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      next.firstName = "First name is required";
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      next.lastName = "Last name is required";
    }
    
    // Email validation using Zod
    if (!formData.email.trim()) {
      next.email = "Email is required";
    } else {
      const emailResult = emailValidation.safeParse(formData.email);
      if (!emailResult.success) {
        next.email = emailResult.error.errors[0]?.message || "Enter a valid email";
      }
    }
    
    // Phone validation using Zod
    if (!formData.phone.trim()) {
      next.phone = "Phone number is required";
    } else {
      const phoneResult = phoneValidation.safeParse(formData.phone);
      if (!phoneResult.success) {
        next.phone = phoneResult.error.errors[0]?.message || "Enter a valid phone number";
      }
    }
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = (): boolean => {
    const next: Errors = {};
    if (!formData.moveInDate) next.moveInDate = "Move-in date is required";
    else if (!isFutureOrToday(formData.moveInDate)) next.moveInDate = "Move-in date cannot be in the past";

    const budgetNum = parseBudget(formData.budget);
    if (!formData.budget.trim()) next.budget = "Monthly budget is required";
    else if (!Number.isFinite(budgetNum) || budgetNum <= 0) next.budget = "Enter a valid positive amount";

    if (!formData.occupants) next.occupants = "Select occupants";

    if (!formData.termsAccepted) next.termsAccepted = "You must accept the terms to submit";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    }
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Build payload for your API
      const budgetNum = parseBudget(formData.budget);
      const occ = formData.occupants === "5+" ? 5 : Number(formData.occupants);
      const payload = {
        publicId,
        tenantName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        tenantEmail: formData.email.trim(),
        tenantPhone: formData.phone.trim(),
        moveInDate: formData.moveInDate, // yyyy-mm-dd
        monthlyBudget: budgetNum,
        occupants: occ,
        hasPets: formData.pets === "Yes",
        message: formData.comments.trim(),
      };

      // Call upstream server directly for static deployment
      const res = await fetch(backendUrl("/api/leads/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error || `Submission failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({})) as { leadId?: string; sessionToken?: string };
      if (data.leadId) {
        setLeadId(data.leadId);
        if (data.sessionToken) {
          setSessionToken(data.sessionToken);
          sessionStorage.setItem(`qualify_token_${data.leadId}`, data.sessionToken);
        }
      }
      setIsSubmitted(true);
    } catch (err: unknown) {
      setErrors({ form: (err instanceof Error ? err.message : null) ?? "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // reset after closing animation
    setTimeout(() => {
      setStep(1);
      setIsSubmitted(false);
      setErrors({});
      setSessionToken(null);
      setLeadId(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        preferredContact: "email",
        moveInDate: "",
        budget: "",
        occupants: "1",
        pets: "No",
        comments: "",
        termsAccepted: false,
      });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0" style={{ zIndex: 9999 }}>
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="p-6">
            <DialogTitle className="sr-only">
              {isSubmitted ? "Thank You!" : `Apply for ${propertyName}`}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {isSubmitted 
                ? "Your application has been submitted successfully. We'll contact you soon." 
                : `Submit your application to apply for ${propertyName}.`}
            </DialogDescription>
            <h2 className="text-xl font-semibold mb-6">
              {isSubmitted ? "Thank You!" : `Apply for ${propertyName}`}
            </h2>

            {!isSubmitted && (
              <div className="flex justify-between mb-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full",
                      step === i
                        ? "bg-background text-foreground dark:bg-muted dark:text-foreground"
                        : "bg-muted text-foreground/70 dark:bg-secondary dark:text-foreground/70"
                    )}
                  >
                    {i}
                  </div>
                ))}
              </div>
            )}

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-3 text-primary dark:bg-card/20 dark:text-primary">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Application Submitted</h3>
                <p className="mb-6 text-foreground/70">
                  Thank you for your interest! A property manager will contact you shortly.
                </p>
                <Button onClick={handleClose}>Close</Button>
                {sessionToken && (
                  <QualificationChat sessionToken={sessionToken} leadType="property" />
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errors.form ? (
                  <p className="mb-3 text-sm text-red-500">{errors.form}</p>
                ) : null}

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-4">Personal Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Contact Method</Label>
                      <RadioGroup
                        defaultValue={formData.preferredContact}
                        onValueChange={(val) => handleSelectChange("preferredContact", val)}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="contact-phone" />
                          <Label htmlFor="contact-phone">Phone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id="contact-text" />
                          <Label htmlFor="contact-text">Text</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-background hover:bg-muted dark:bg-muted dark:text-foreground dark:hover:bg-muted"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-4">Rental Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="moveInDate">
                        Desired Move-in Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="moveInDate"
                        name="moveInDate"
                        type="date"
                        value={formData.moveInDate}
                        onChange={handleChange}
                      />
                      {errors.moveInDate && <p className="text-xs text-red-500">{errors.moveInDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        Monthly Budget <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="budget"
                        name="budget"
                        placeholder="₹"
                        value={formData.budget}
                        onChange={handleChange}
                      />
                      {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupants">Number of Occupants</Label>
                      <select
                        id="occupants"
                        name="occupants"
                        value={formData.occupants}
                        onChange={(e) => handleSelectChange("occupants", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5+</option>
                      </select>
                      {errors.occupants && <p className="text-xs text-red-500">{errors.occupants}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pets">Do you have pets?</Label>
                      <select
                        id="pets"
                        name="pets"
                        value={formData.pets}
                        onChange={(e) => handleSelectChange("pets", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comments">Questions or Comments</Label>
                      <Textarea
                        id="comments"
                        name="comments"
                        placeholder="Any specific questions about the property?"
                        value={formData.comments}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox
                        id="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
                      />
                      <Label htmlFor="termsAccepted" className="text-sm">
                        I agree to the terms and conditions and consent to having my information stored for rental application purposes.
                      </Label>
                    </div>
                    {errors.termsAccepted && <p className="text-xs text-red-500">{errors.termsAccepted}</p>}

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-background hover:bg-muted dark:bg-muted dark:text-foreground dark:hover:bg-muted">
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
