import Link from 'next/link';

/** One-line notice shown at the foot of both chat assistants. */
export function AssistantDisclosure() {
  return (
    <p className="mt-2 text-[11px] leading-snug text-neutral-600">
      AI assistant. Not legal, tax or lending advice, or a rate quote. Chats are stored; see the{' '}
      <Link href="/privacy-policy/" prefetch={false} className="underline underline-offset-2">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
