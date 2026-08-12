import type { Metadata } from 'next';
import { Suspense } from 'react';
import ChatSessionClient from './chat-session-client';

/**
 * Conversation resume page.
 *
 * The AI leasing agent emails its first reply to every inbound lead with a link back here
 * (/chat?session=…). Without this page that call to action 404s, which would make the
 * fastest touchpoint in the funnel the most broken one.
 */
export const metadata: Metadata = {
  title: 'Your conversation | Ondo Real Estate',
  description: 'Pick up your conversation with the Ondo leasing team.',
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-neutral-900">
        Your conversation
      </h1>
      <p className="mb-6 text-sm text-neutral-600">
        Pick up where you left off. Ask anything about the home, or suggest a time to see it.
      </p>

      <Suspense
        fallback={
          <div className="h-[560px] w-full animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 motion-reduce:animate-none" />
        }
      >
        <ChatSessionClient />
      </Suspense>
    </main>
  );
}
