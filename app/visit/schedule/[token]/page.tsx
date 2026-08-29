import type { Metadata } from "next"
import { getSchedule } from "@/lib/api/site-visits"
import { VisitScheduleClient } from "./visit-schedule-client"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props { params: Promise<{ token: string }> }

export function generateStaticParams(): { token: string }[] {
  return [{ token: "__ondo_schedule_export_shell__" }]
}

export default async function VisitSchedulePage({ params }: Props) {
  const { token } = await params;

  let schedule;
  try {
    schedule = await getSchedule(token);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-gray-500">This schedule link is invalid or is no longer available.</p>
          <p className="text-gray-400 text-sm mt-4">Contact us at <a href="mailto:hello@ondorealestate.com" className="underline">hello@ondorealestate.com</a></p>
        </div>
      </div>
    );
  }

  return <VisitScheduleClient schedule={schedule} token={token} />;
}
