import OddsList from '@/components/OddsList';

export default function HomePage() {
  const pageStyle = {
    minHeight: '100vh',
    background: '#020617',
    color: '#e2e8f0',
    padding: '2.5rem 1.5rem',
  } as const;

  const panelStyle = {
    width: '100%',
    maxWidth: '72rem',
    margin: '0 auto',
    borderRadius: '1.5rem',
    border: '1px solid rgba(52, 211, 153, 0.35)',
    background: 'rgba(15, 23, 42, 0.86)',
    boxShadow: '0 0 60px rgba(16, 185, 129, 0.12)',
    backdropFilter: 'blur(2px)',
  } as const;

  const headerStyle = {
    borderBottom: '1px solid rgba(52, 211, 153, 0.35)',
    padding: '1.25rem 1.5rem',
  } as const;

  const edgeWieldStyle = {
    marginTop: '0.5rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 'clamp(1.875rem, 3vw, 2.25rem)',
    fontWeight: 900,
    letterSpacing: '0.04em',
    color: '#4ade80',
    textShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
  } as const;

  return (
    <main style={pageStyle}>
      <section style={panelStyle}>
        <header style={headerStyle}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(110, 231, 183, 0.85)' }}>
            Terminal
          </p>
          <h1 style={edgeWieldStyle}>EdgeWield</h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Live market console for precise, disciplined betting decisions.
          </p>
        </header>

        <div style={{ padding: '1.5rem' }}>
          <OddsList />
        </div>
      </section>
    </main>
  );
}
