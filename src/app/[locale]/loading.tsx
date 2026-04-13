export default function LocaleLoading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="h-8 w-8 rounded-full"
        style={{
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
