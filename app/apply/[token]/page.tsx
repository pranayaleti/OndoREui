"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  validateApplyToken,
  createApplication,
  submitApplication,
  type ApplicationLinkValidation,
  type ScreeningQuestion,
} from "@/lib/api/applications"
import { AffordabilityCalculator } from "@/components/apply/affordability-calculator"

type Step = "loading" | "property" | "personal" | "questions" | "review" | "submitted" | "error"

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [step, setStep] = useState<Step>("loading")
  const [validation, setValidation] = useState<ApplicationLinkValidation | null>(null)
  const [error, setError] = useState<string>("")
  const [applicationId, setApplicationId] = useState<string>("")

  // Personal info form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [currentAddress, setCurrentAddress] = useState("")
  const [employer, setEmployer] = useState("")
  const [annualIncome, setAnnualIncome] = useState("")
  const [desiredMoveIn, setDesiredMoveIn] = useState("")

  // Screening question answers
  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    validateApplyToken(token).then((result) => {
      if (result.valid) {
        setValidation(result)
        setStep("property")
      } else {
        setError(result.error || "Invalid or expired application link")
        setStep("error")
      }
    }).catch(() => {
      setError("Failed to validate application link")
      setStep("error")
    })
  }, [token])

  async function handleCreateApplication() {
    setSubmitting(true)
    try {
      const app = await createApplication({
        token,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        currentAddress: currentAddress || undefined,
        employer: employer || undefined,
        annualIncome: annualIncome ? parseFloat(annualIncome) : undefined,
        desiredMoveIn: desiredMoveIn || undefined,
      })
      setApplicationId(app.id)

      if (validation?.questions && validation.questions.length > 0) {
        setStep("questions")
      } else {
        setStep("review")
      }
    } catch (err: any) {
      setError(err.message || "Failed to create application")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))
      await submitApplication(applicationId, answerArray)
      setStep("submitted")
    } catch (err: any) {
      setError(err.message || "Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  function handleAnswerChange(questionId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Application Link Invalid</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (step === "submitted") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-5xl mb-4">&#10003;</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-4">
            Your application for <strong>{validation?.property?.title}</strong> has been submitted
            successfully. The property owner will review your application and get back to you.
          </p>
          <p className="text-sm text-gray-500">
            You&apos;ll receive an email notification when your application status is updated.
          </p>
        </div>
      </div>
    )
  }

  const property = validation?.property

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress steps */}
        <div className="flex items-center justify-center mb-8 gap-2 text-sm">
          {["Property", "Personal Info", ...(validation?.questions?.length ? ["Questions"] : []), "Review"].map(
            (label, i) => {
              const stepIndex = step === "property" ? 0 : step === "personal" ? 1 : step === "questions" ? 2 : 3
              const isActive = i <= stepIndex
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={isActive ? "text-gray-900" : "text-gray-400"}>{label}</span>
                  {i < 3 && <div className="w-8 h-px bg-gray-300" />}
                </div>
              )
            }
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Property Overview */}
          {step === "property" && property && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 mb-4">{property.address}</p>

              {property.photos.length > 0 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={property.photos[0].url}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-xs text-gray-500">Bedrooms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-xs text-gray-500">Bathrooms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-gray-900">{property.sqft?.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Sq Ft</div>
                </div>
              </div>

              <div className="text-2xl font-bold text-blue-600 mb-4">
                ${property.price?.toLocaleString()}/mo
              </div>

              {property.description && (
                <p className="text-gray-600 mb-6">{property.description}</p>
              )}

              <button
                onClick={() => setStep("personal")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Start Application
              </button>
            </>
          )}

          {/* Step 2: Personal Info */}
          {step === "personal" && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                  <textarea
                    value={currentAddress}
                    onChange={(e) => setCurrentAddress(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                  <input
                    type="text"
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g. 75000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired Move-in Date</label>
                  <input
                    type="date"
                    value={desiredMoveIn}
                    onChange={(e) => setDesiredMoveIn(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {property?.price && (
                  <AffordabilityCalculator
                    monthlyRent={property.price}
                    requiredRatio={3}
                  />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("property")}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateApplication}
                  disabled={!firstName || !lastName || !email || submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Continue"}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Screening Questions */}
          {step === "questions" && validation?.questions && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Screening Questions</h2>
              <p className="text-gray-600 text-sm mb-6">
                Please answer the following questions from the property owner.
              </p>

              <div className="space-y-6">
                {validation.questions.map((q: ScreeningQuestion) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {q.questionText}
                      {q.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {q.questionType === "text" && (
                      <textarea
                        value={(answers[q.id] as string) || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                        rows={3}
                      />
                    )}

                    {q.questionType === "yes_no" && (
                      <div className="flex gap-4">
                        {["Yes", "No"].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === opt.toLowerCase()}
                              onChange={() => handleAnswerChange(q.id, opt.toLowerCase())}
                              className="h-4 w-4 text-blue-600"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.questionType === "number" && (
                      <input
                        type="number"
                        value={(answers[q.id] as string) || ""}
                        onChange={(e) => handleAnswerChange(q.id, parseFloat(e.target.value) || 0)}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    )}

                    {q.questionType === "multiple_choice" && q.options && (
                      <div className="space-y-2">
                        {(q.options as string[]).map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === opt}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              className="h-4 w-4 text-blue-600"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("personal")}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("review")}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Review Application
                </button>
              </div>
            </>
          )}

          {/* Step 4: Review & Submit */}
          {step === "review" && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Application</h2>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> {firstName} {lastName}</div>
                    <div><span className="text-gray-500">Email:</span> {email}</div>
                    {phone && <div><span className="text-gray-500">Phone:</span> {phone}</div>}
                    {employer && <div><span className="text-gray-500">Employer:</span> {employer}</div>}
                    {annualIncome && <div><span className="text-gray-500">Income:</span> ${parseFloat(annualIncome).toLocaleString()}</div>}
                    {desiredMoveIn && <div><span className="text-gray-500">Move-in:</span> {desiredMoveIn}</div>}
                  </div>
                </div>

                {validation?.questions && validation.questions.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Screening Answers</h3>
                    <div className="space-y-2 text-sm">
                      {validation.questions.map((q: ScreeningQuestion) => (
                        <div key={q.id}>
                          <span className="text-gray-500">{q.questionText}:</span>{" "}
                          <span className="text-gray-900">{String(answers[q.id] ?? "—")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  By submitting this application, you consent to the property owner conducting
                  background checks and verification as part of the screening process.
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(validation?.questions?.length ? "questions" : "personal")}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
