// app/visit/confirm/[token]/page.tsx
import { getVisitByToken } from "@/lib/api/site-visits";
import { VisitConfirmClient } from "./visit-confirm-client";

interface Props { params: Promise<{ token: string }> }

/** Static export requires at least one path; real tokens use the same client bundle (invalid token shows “not found”). */
export function generateStaticParams(): { token: string }[] {
  return [{ token: "__ondo_visit_export_shell__" }]
}

export default async function VisitConfirmPage({ params }: Props) {
  const { token } = await params;

  let visit;
  try {
    visit = await getVisitByToken(token);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Link not found</h1>
          <p className="text-gray-500">This confirmation link is invalid or has already been used.</p>
          <p className="text-gray-400 text-sm mt-4">Contact us at <a href="mailto:hello@ondorealestate.com" className="underline">hello@ondorealestate.com</a></p>
        </div>
      </div>
    );
  }

  return <VisitConfirmClient visit={visit} token={token} />;
}
