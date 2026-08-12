"use client";

/**
 * Reads the session id from the query string and mounts the leasing chat in resume mode.
 *
 * Split from page.tsx because useSearchParams forces a client boundary, and this site is a
 * static export — keeping the boundary narrow means the page shell still prerenders.
 */

import { useSearchParams } from 'next/navigation';
import LeasingChatWidget from '@/components/LeasingChatWidget';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ChatSessionClient() {
  const params = useSearchParams();
  const session = params?.get('session') ?? null;

  // Validate before use. The value goes straight into an API path, and a malformed id
  // should produce a helpful message rather than a failed request.
  if (!session || !UUID.test(session)) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-2 text-base font-semibold text-neutral-900">
          We could not find that conversation
        </h2>
        <p className="text-sm leading-relaxed text-neutral-600">
          The link may have expired or been copied incompletely. Browse our listings and
          start a new conversation from any home you are interested in, or contact the team
          directly and we will pick it up from there.
        </p>
      </div>
    );
  }

  return (
    <LeasingChatWidget
      propertyId=""
      initialSessionId={session}
      inline
      propertyTitle="your enquiry"
    />
  );
}
