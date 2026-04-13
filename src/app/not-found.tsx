import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#fafafa',
        color: '#171717',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
        <p style={{ fontSize: '4rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>
          404
        </p>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Page not found
        </h1>
        <p style={{ color: '#525252', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
