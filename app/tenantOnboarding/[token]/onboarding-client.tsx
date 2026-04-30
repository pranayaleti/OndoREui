"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import {
  validateOnboardingToken,
  completeStep,
  uploadIdDocument,
  triggerBackgroundCheck,
  saveEmergencyContacts,
  type TenantOnboarding,
  type EmergencyContact,
  type OnboardingStep,
} from "@/lib/api/tenantOnboarding"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ViewStep =
  | "loading"
  | "welcome"
  | "id_verification"
  | "background_check"
  | "emergency_contacts"
  | "property_access"
  | "confirmation"
  | "completed"
  | "expired"
  | "error"

export function OnboardingClient() {
  const params = useParams<{ token: string }>()
  const token = params?.token ?? ""

  const [onboarding, setOnboarding] = useState<TenantOnboarding | null>(null)
  const [step, setStep] = useState<ViewStep>("loading")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // ID verification state
  const [idFile, setIdFile] = useState<File | null>(null)

  // Background check state
  const [bgCheckConsent, setBgCheckConsent] = useState(false)

  // Emergency contacts state
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { name: "", phone: "", relationship: "" },
  ])

  const loadOnboarding = useCallback(async () => {
    if (!token || token === "_") return

    const result = await validateOnboardingToken(token)

    if ("error" in result) {
      setError(result.error)
      setStep("error")
      return
    }

    const data = result.data
    setOnboarding(data)

    if (data.status === "expired") {
      setStep("expired")
      return
    }

    if (data.status === "completed") {
      setStep("completed")
      return
    }

    // Go to the current step
    const steps = data.steps as OnboardingStep[]
    const currentIdx = data.currentStep
    if (currentIdx >= steps.length) {
      setStep("completed")
    } else {
      setStep(steps[currentIdx].name as ViewStep)
    }
  }, [token])

  useEffect(() => {
    loadOnboarding()
  }, [loadOnboarding])

  const handleCompleteStep = async (stepName: string, data: Record<string, unknown> = {}) => {
    if (!onboarding) return
    setSubmitting(true)
    setError("")
    try {
      const result = await completeStep(onboarding.id, stepName, data)
      setOnboarding(result.data)
      const steps = result.data.steps as OnboardingStep[]
      const nextIdx = result.data.currentStep
      if (nextIdx >= steps.length || result.data.status === "completed") {
        setStep("completed")
      } else {
        setStep(steps[nextIdx].name as ViewStep)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = onboarding?.steps as OnboardingStep[] | undefined
  const currentStepIndex = steps?.findIndex((s) => s.name === step) ?? 0
  const totalSteps = steps?.length ?? 6

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-foreground/60">Loading your onboarding...</p>
        </div>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Something Went Wrong</CardTitle>
            <CardDescription>{error || "Invalid or expired onboarding link."}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/60">
              Please contact your property manager for a new onboarding link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Link Expired</CardTitle>
            <CardDescription>
              This onboarding link has expired. Please contact your property manager for a new link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4">
        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground/60">Tenant Onboarding</span>
            <span className="text-foreground/50">
              Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}
            </span>
          </div>
          <div className="flex gap-1.5">
            {steps?.map((s, i) => (
              <div
                key={s.name}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex
                    ? "bg-primary"
                    : "bg-foreground/10"
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Step 1: Welcome */}
        {step === "welcome" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Your New Home</CardTitle>
              <CardDescription>
                Let&apos;s get you set up. This onboarding process will walk you through a few quick steps
                before your move-in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
                <h3 className="font-semibold">What to expect:</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex gap-2">
                    <Badge variant="outline" className="rounded-full text-xs shrink-0">1</Badge>
                    <span>Upload your government-issued ID for verification</span>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline" className="rounded-full text-xs shrink-0">2</Badge>
                    <span>Authorize a background check</span>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline" className="rounded-full text-xs shrink-0">3</Badge>
                    <span>Provide emergency contact information</span>
                  </li>
                  <li className="flex gap-2">
                    <Badge variant="outline" className="rounded-full text-xs shrink-0">4</Badge>
                    <span>Review property access information (keys, codes, etc.)</span>
                  </li>
                </ul>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={submitting}
                onClick={() => handleCompleteStep("welcome")}
              >
                {submitting ? "Starting..." : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: ID Verification */}
        {step === "id_verification" && (
          <Card>
            <CardHeader>
              <CardTitle>ID Verification</CardTitle>
              <CardDescription>
                Upload a clear photo or scan of your government-issued ID (driver&apos;s license, passport, or state ID).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="id-upload">Upload ID Document</Label>
                <div className="rounded-xl border-2 border-dashed p-8 text-center">
                  {idFile ? (
                    <div className="space-y-2">
                      <p className="font-medium">{idFile.name}</p>
                      <p className="text-sm text-foreground/60">
                        {(idFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setIdFile(null)}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-foreground/60">
                        Drag and drop or click to select your ID document
                      </p>
                      <p className="text-xs text-foreground/40">
                        Accepted formats: JPG, PNG, PDF (max 10 MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="id-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className={idFile ? "hidden" : "mt-3 text-sm"}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setIdFile(file)
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/20 p-4 text-sm text-blue-800 dark:text-blue-200">
                <strong>Photo guidelines:</strong> Ensure the entire ID is visible, text is readable,
                and the photo is not blurry or cut off.
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevStep = steps?.[currentStepIndex - 1]
                    if (prevStep) setStep(prevStep.name as ViewStep)
                  }}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!idFile || submitting}
                  onClick={async () => {
                    if (!onboarding || !idFile) return
                    setSubmitting(true)
                    setError("")
                    try {
                      await uploadIdDocument(onboarding.id, idFile, "government_id")
                      // uploadIdDocument auto-completes the id_verification step on backend
                      await loadOnboarding()
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Upload failed")
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                >
                  {submitting ? "Uploading..." : "Upload & Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Background Check */}
        {step === "background_check" && (
          <Card>
            <CardHeader>
              <CardTitle>Background Check Authorization</CardTitle>
              <CardDescription>
                We need your consent to run a background check as part of the tenant screening process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
                <h3 className="font-semibold text-sm">What will be checked:</h3>
                <ul className="space-y-1.5 text-sm text-foreground/70">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Credit history and score
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Criminal background
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Eviction history
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    Identity verification
                  </li>
                </ul>
                <p className="text-xs text-foreground/50">
                  Results are typically available within 3-5 business days.
                </p>
              </div>

              <label htmlFor="bg-check-consent" className="flex items-start gap-3 text-sm leading-6 text-foreground/80 cursor-pointer">
                <Checkbox
                  id="bg-check-consent"
                  checked={bgCheckConsent}
                  onCheckedChange={(checked) => setBgCheckConsent(checked === true)}
                  className="mt-1"
                />
                <span>
                  I authorize Ondo Real Estate and the property owner to conduct the background checks
                  described above. I understand that the results may affect my application approval.
                </span>
              </label>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevStep = steps?.[currentStepIndex - 1]
                    if (prevStep) setStep(prevStep.name as ViewStep)
                  }}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!bgCheckConsent || submitting}
                  onClick={async () => {
                    if (!onboarding) return
                    setSubmitting(true)
                    setError("")
                    try {
                      await triggerBackgroundCheck(onboarding.id)
                      await loadOnboarding()
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to authorize")
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                >
                  {submitting ? "Authorizing..." : "Authorize & Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Emergency Contacts */}
        {step === "emergency_contacts" && (
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Provide at least one emergency contact who can be reached in case of an emergency at the property.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contacts.map((contact, index) => (
                <div key={index} className="space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Contact {index + 1}</h4>
                    {contacts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setContacts(contacts.filter((_, i) => i !== index))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => {
                          const updated = [...contacts]
                          updated[index] = { ...contact, name: e.target.value }
                          setContacts(updated)
                        }}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => {
                          const updated = [...contacts]
                          updated[index] = { ...contact, phone: e.target.value }
                          setContacts(updated)
                        }}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={contact.relationship}
                        onChange={(e) => {
                          const updated = [...contacts]
                          updated[index] = { ...contact, relationship: e.target.value }
                          setContacts(updated)
                        }}
                        placeholder="Parent, Spouse, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}

              {contacts.length < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContacts([...contacts, { name: "", phone: "", relationship: "" }])
                  }
                >
                  + Add Another Contact
                </Button>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevStep = steps?.[currentStepIndex - 1]
                    if (prevStep) setStep(prevStep.name as ViewStep)
                  }}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={
                    submitting ||
                    contacts.some((c) => !c.name.trim() || !c.phone.trim() || !c.relationship.trim())
                  }
                  onClick={async () => {
                    if (!onboarding) return
                    setSubmitting(true)
                    setError("")
                    try {
                      await saveEmergencyContacts(onboarding.id, contacts)
                      await loadOnboarding()
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to save")
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                >
                  {submitting ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Property Access */}
        {step === "property_access" && (
          <Card>
            <CardHeader>
              <CardTitle>Property Access Information</CardTitle>
              <CardDescription>
                Review the access details for your new property. Save this information for reference.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {onboarding?.propertyAccess ? (
                <>
                  {/* Keys */}
                  {(onboarding.propertyAccess as Record<string, unknown>).access &&
                    ((onboarding.propertyAccess as Record<string, Record<string, unknown>>).access as Record<string, unknown>).keys && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Keys</h3>
                      <div className="space-y-2">
                        {(((onboarding.propertyAccess as Record<string, Record<string, unknown>>).access as Record<string, unknown>).keys as Array<{ label: string; location?: string }>).map(
                          (key, i) => (
                            <div key={i} className="rounded-lg border p-3 text-sm">
                              <span className="font-medium">{key.label}</span>
                              {key.location && (
                                <span className="text-foreground/60 ml-2">— {key.location}</span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Access Codes */}
                  {(onboarding.propertyAccess as Record<string, unknown>).access &&
                    ((onboarding.propertyAccess as Record<string, Record<string, unknown>>).access as Record<string, unknown>).codes && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Access Codes</h3>
                      <div className="space-y-2">
                        {(((onboarding.propertyAccess as Record<string, Record<string, unknown>>).access as Record<string, unknown>).codes as Array<{ type: string; code: string; location?: string }>).map(
                          (code, i) => (
                            <div key={i} className="rounded-lg border p-3 text-sm">
                              <span className="font-medium">{code.type}:</span>
                              <span className="font-mono ml-2">{code.code}</span>
                              {code.location && (
                                <span className="text-foreground/60 ml-2">— {code.location}</span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Emergency contacts from handoff */}
                  {(onboarding.propertyAccess as Record<string, unknown>).emergencyContacts && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">Property Emergency Contacts</h3>
                      <div className="space-y-2">
                        {((onboarding.propertyAccess as Record<string, unknown>).emergencyContacts as Array<{ name: string; phone: string }>).map(
                          (c, i) => (
                            <div key={i} className="rounded-lg border p-3 text-sm">
                              <span className="font-medium">{c.name}</span>
                              <span className="text-foreground/60 ml-2">{c.phone}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border bg-muted/30 p-5 text-sm text-foreground/60">
                  Property access information will be provided by your property manager closer to your
                  move-in date.
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevStep = steps?.[currentStepIndex - 1]
                    if (prevStep) setStep(prevStep.name as ViewStep)
                  }}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={submitting}
                  onClick={() => handleCompleteStep("property_access", { acknowledged: true })}
                >
                  {submitting ? "Continuing..." : "I've Reviewed — Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirmation */}
        {step === "confirmation" && (
          <Card>
            <CardHeader>
              <CardTitle>Almost Done!</CardTitle>
              <CardDescription>
                Review your onboarding progress and complete the process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {steps?.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        s.status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-foreground/10 text-foreground/40"
                      }`}
                    >
                      {s.status === "completed" ? "✓" : "·"}
                    </div>
                    <span className={s.status === "completed" ? "text-foreground" : "text-foreground/50"}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={submitting}
                onClick={() => handleCompleteStep("confirmation", { confirmed: true })}
              >
                {submitting ? "Completing..." : "Complete Onboarding"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed */}
        {step === "completed" && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <span className="text-3xl">✓</span>
              </div>
              <CardTitle className="text-2xl">Onboarding Complete!</CardTitle>
              <CardDescription>
                You&apos;re all set. Your property manager has been notified and will be in touch with
                any additional information before your move-in date.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-foreground/60">
                Keep an eye on your email for updates about your move-in checklist, key pickup details,
                and other important information.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
