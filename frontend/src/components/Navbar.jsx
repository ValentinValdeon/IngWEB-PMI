export default function Navbar({ onDescargarPdf }) {
  return (
    <nav className="v-navbar">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--emerald)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              Poli-Rubro
            </span>
          </a>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onDescargarPdf}
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10"/>
              </svg>
              PDF
            </button>
            <a
              href="/admin"
              className="btn-primary"
              style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
            >
              Administrar
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
