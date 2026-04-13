'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logError } from '@/lib/logger';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { boundary: 'locale', digest: error.digest });
  }, [error]);

  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <h1 className="mb-3 text-2xl font-semibold">Something went wrong</h1>
      <p className="mb-6 max-w-md" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="cursor-pointer rounded-lg px-5 py-2.5 text-sm text-white"
          style={{ backgroundColor: 'var(--accent)', border: 'none' }}
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg px-5 py-2.5 text-sm no-underline"
          style={{
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
          }}
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
