"use client";

import { useState } from "react";
import {
  bookSchedule,
  cancelSchedule,
  rescheduleSchedule,
  type SchedulePayload,
} from "@/lib/api/site-visits";

interface Props {
  schedule: SchedulePayload;
  token: string;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
}

export function VisitScheduleClient({ schedule, token }: Props) {
  const [windows, setWindows] = useState(schedule.windows);
  const [existing, setExisting] = useState(schedule.existingVisit);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (schedule.occupancy === "occupied") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">A manager will email times to confirm</h1>
          <p className="text-gray-500">
            This home is currently occupied. You will receive an email with proposed visit times.
          </p>
        </div>
      </div>
    );
  }

  const book = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      if (existing?.status === "confirmed") {
        const result = await rescheduleSchedule(token, selected);
        setExisting({ id: result.id, status: "confirmed", scheduledAt: result.scheduledAt });
      } else {
        const result = await bookSchedule(token, selected);
        setExisting({ id: result.id, status: "confirmed", scheduledAt: result.scheduledAt });
      }
      setWindows((prev) => prev.filter((w) => w.id !== selected));
      setSelected(null);
    } catch {
      setError("That time is no longer available. Please pick another window.");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setLoading(true);
    setError(null);
    try {
      await cancelSchedule(token);
      setExisting(null);
    } catch {
      setError("Could not cancel this showing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Schedule a showing</h1>
        <p className="text-gray-500 mb-6">
          {schedule.propertyTitle}
          {schedule.propertyCity ? `, ${schedule.propertyCity}` : ""}
        </p>
        {existing?.status === "confirmed" && existing.scheduledAt ? (
          <div className="mb-6 p-3 rounded-xl border bg-green-50 text-sm">
            <p>Your showing is confirmed for {formatWhen(existing.scheduledAt)}.</p>
            <button
              type="button"
              onClick={() => void cancel()}
              disabled={loading}
              className="mt-2 text-red-700 underline"
            >
              Cancel showing
            </button>
          </div>
        ) : null}
        <div className="space-y-3 mb-6">
          {windows.length === 0 ? (
            <p className="text-gray-500 text-sm">No open windows right now. Please check back later.</p>
          ) : (
            windows.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelected(slot.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                  selected === slot.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{formatWhen(slot.startsAt)}</span>
              </button>
            ))
          )}
        </div>
        {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
        <button
          type="button"
          onClick={() => void book()}
          disabled={!selected || loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40"
        >
          {loading
            ? "Saving..."
            : existing?.status === "confirmed"
              ? "Reschedule"
              : "Book showing"}
        </button>
      </div>
    </div>
  );
}
