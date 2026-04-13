import Link from 'next/link';

export default function LocaleNotFound() {
  return (
    <main
      className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <p
        className="mb-2 text-6xl font-bold"
        style={{ color: 'var(--accent)' }}
      >
        404
      </p>
      <h1 className="mb-3 text-2xl font-semibold">Page not found</h1>
      <p
        className="mb-6 max-w-md"
        style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg px-5 py-2.5 text-sm text-white no-underline"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        Go back home
      </Link>
    </main>
  );
}
