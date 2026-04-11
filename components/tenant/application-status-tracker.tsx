"use client"

import { type ApplicationStatus } from "@/lib/api/applications"

interface Step {
  key: string
  label: string
  description: string
}

const STEPS: Step[] = [
  { key: "submitted", label: "Submitted", description: "Application received" },
  { key: "screening", label: "Screening", description: "Background checks in progress" },
  { key: "decision", label: "Decision", description: "Owner reviewing results" },
  { key: "lease", label: "Lease", description: "Lease ready for signing" },
]

const terminalStatuses: Record<string, { label: string; color: string }> = {
  rejected: { label: "Not Approved", color: "bg-red-500" },
  withdrawn: { label: "Withdrawn", color: "bg-muted" },
  failed: { label: "Did Not Pass", color: "bg-red-500" },
}

function getActiveStep(status: ApplicationStatus): number {
  switch (status) {
    case "draft":
      return -1
    case "submitted":
      return 0
    case "screening":
      return 1
    case "passed":
    case "failed":
    case "waitlisted":
      return 2
    case "approved":
    case "rejected":
      return 3
    default:
      return -1
  }
}

interface ApplicationStatusTrackerProps {
  status: ApplicationStatus
  recommendationScore?: number | null
  scoreBreakdown?: Record<string, { earned: number; max: number }> | null
}

export function ApplicationStatusTracker({
  status,
  recommendationScore,
  scoreBreakdown,
}: ApplicationStatusTrackerProps) {
  const terminal = terminalStatuses[status]
  const activeStep = getActiveStep(status)
  const isComplete = status === "approved"

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const done = idx < activeStep || isComplete
            const current = idx === activeStep && !terminal
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done
                      ? "bg-green-500 border-green-500 text-white"
                      : current
                        ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                        : terminal && idx === activeStep
                          ? `${terminal.color} border-transparent text-white`
                          : "bg-card dark:bg-card border-slate-300 dark:border-slate-600 text-slate-400"
                  }`}
                >
                  {done ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <p className={`mt-2 text-xs font-medium text-center ${done || current ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 text-center mt-0.5">{step.description}</p>
              </div>
            )
          })}
        </div>
        {/* Connector lines */}
        <div className="absolute top-5 left-0 right-0 flex -z-10 px-[5%]">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`flex-1 h-0.5 ${
                idx < activeStep || isComplete ? "bg-green-500" : "bg-muted dark:bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Terminal status banner */}
      {terminal && (
        <div className={`${terminal.color} text-white px-4 py-3 rounded-lg text-center text-sm font-medium`}>
          {terminal.label}
        </div>
      )}

      {/* Waitlist banner */}
      {status === "waitlisted" && (
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-center text-sm font-medium">
          You are on the waitlist. We will notify you if a spot opens up.
        </div>
      )}

      {/* Score + breakdown */}
      {recommendationScore !== null && recommendationScore !== undefined && (
        <div className="bg-muted dark:bg-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Screening Score</span>
            <span className={`text-2xl font-bold ${
              recommendationScore >= 80 ? "text-green-600" : recommendationScore >= 60 ? "text-amber-600" : "text-red-600"
            }`}>
              {recommendationScore}/100
            </span>
          </div>
          {scoreBreakdown && Object.keys(scoreBreakdown).length > 0 && (
            <div className="mt-3 space-y-1.5">
              {Object.entries(scoreBreakdown).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 capitalize">{key.replace("_", " ")}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-muted dark:bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${val.earned === val.max ? "bg-green-500" : val.earned > 0 ? "bg-amber-500" : "bg-red-400"}`}
                        style={{ width: `${val.max > 0 ? (val.earned / val.max) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 w-10 text-right">
                      {val.earned}/{val.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
