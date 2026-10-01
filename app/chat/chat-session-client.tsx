"use client";

/**
 * Reads the session id from the query string and mounts the leasing chat in resume mode.
 *
 * Split from page.tsx because useSearchParams forces a client boundary, and this site is a
 * static export, keeping the boundary narrow means the page shell still prerenders.
 */

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LeasingChatWidget from '@/components/LeasingChatWidget';
import { SITE_PHONE, SITE_PHONE_TEL } from '@/lib/site';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function ChatSessionClient() {
  const params = useSearchParams();
  const session = params?.get('session') ?? null;

  // Validate before use. The value goes straight into an API path, and a malformed id
  // should produce a helpful message rather than a failed request.
  if (!session || !UUID.test(session)) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          We could not find that conversation
        </h2>
        <p className="text-sm leading-relaxed text-foreground/70">
          The link may have expired or been copied incompletely. Browse our listings and
          start a new conversation from any home you are interested in, or contact the team
          directly and we will pick it up from there.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <li>
            <Link
              href="/properties/"
              prefetch={false}
              className="text-primary underline underline-offset-4"
            >
              Browse listings
            </Link>
          </li>
          <li>
            <Link
              href="/contact/"
              prefetch={false}
              className="text-primary underline underline-offset-4"
            >
              Contact the team
            </Link>
          </li>
          <li>
            <a href={`tel:${SITE_PHONE_TEL}`} className="text-primary underline underline-offset-4">
              Call {SITE_PHONE}
            </a>
          </li>
        </ul>
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
