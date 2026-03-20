// app/visit/confirm/[token]/visit-confirm-client.tsx
"use client";

import { useState } from "react";
import { confirmVisit, type SiteVisitPublic } from "@/lib/api/site-visits";

interface Props { visit: SiteVisitPublic; token: string }

export function VisitConfirmClient({ visit, token }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (visit.status !== "proposed" && !confirmedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Visit already confirmed</h1>
          {visit.scheduledAt && (
            <p className="text-gray-500">Your visit is scheduled for {new Date(visit.scheduledAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (selected === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await confirmVisit(visit.id, token, selected);
      setConfirmedAt(result.scheduledAt);
      setPropertyTitle(result.propertyTitle);
    } catch {
      setError("Something went wrong. Please try again or contact us.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmedAt) {
    const calUrl = `https://calendar.google.com/calendar/r/eventedit?text=Property+Viewing&dates=${
      confirmedAt.replace(/[-:]/g, "").replace(".000Z", "Z")
    }/${confirmedAt.replace(/[-:]/g, "").replace(".000Z", "Z")}&details=Property+viewing+with+OnDo`;

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Visit Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Your visit is booked for {new Date(confirmedAt).toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short" })}
          </p>
          {(propertyTitle || visit.properties) && (
            <p className="text-gray-400 text-sm mb-6">
              {propertyTitle || visit.properties?.title}
              {visit.properties && ` — ${visit.properties.addressLine1}, ${visit.properties.city}`}
            </p>
          )}
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700"
          >
            Add to Google Calendar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Choose a time</h1>
        {visit.properties && (
          <p className="text-gray-500 mb-6">{visit.properties.title} — {visit.properties.addressLine1}</p>
        )}
        <div className="space-y-3 mb-6">
          {visit.proposedSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                selected === i ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="font-medium">{new Date(slot).toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short" })}</span>
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button
          onClick={handleConfirm}
          disabled={selected === null || loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40"
        >
          {loading ? "Confirming..." : "Confirm Visit"}
        </button>
      </div>
    </div>
  );
}
