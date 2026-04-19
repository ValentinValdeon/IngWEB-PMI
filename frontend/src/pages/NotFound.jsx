export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        padding: '3rem 2.5rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Icono */}
        <div style={{
          width: '64px', height: '64px',
          background: 'var(--emerald-light)',
          borderRadius: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--emerald)" strokeWidth="1.75" strokeLinecap="round">
            <circle cx="14" cy="14" r="11"/>
            <path d="M14 9v5M14 18h.01"/>
          </svg>
        </div>

        <p className="v-eyebrow" style={{ marginBottom: '0.5rem' }}>Error 404</p>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
          Página no encontrada
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          El contenido que buscás no existe o fue movido a otra dirección.
        </p>

        <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center' }}>
          Volver al catálogo
        </a>
      </div>
    </div>
  )
}
