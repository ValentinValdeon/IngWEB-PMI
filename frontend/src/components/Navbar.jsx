import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar({ onDescargarPdf, visible = true }) {
  const [descargando, setDescargando] = useState(false)

  async function handlePdf() {
    setDescargando(true)
    try {
      await onDescargarPdf()
    } finally {
      setDescargando(false)
    }
  }

  return (
    <nav className={`${styles.navbar}${visible ? ` ${styles.visible}` : ''}`}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--accent)',
              borderRadius: '4px',
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
              fontFamily: "var(--font-display)",
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#F5EDD8',
              letterSpacing: '0.02em',
            }}>
              Poli-Rubro
            </span>
          </a>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handlePdf}
              disabled={descargando}
              aria-label="Descargar catálogo en PDF"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 1rem',
                background: 'transparent',
                border: '1.5px solid rgba(200,152,42,0.4)',
                borderRadius: 'var(--radius-sm)',
                color: '#D4C4A8',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 400,
                cursor: descargando ? 'not-allowed' : 'pointer',
                opacity: descargando ? 0.5 : 1,
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!descargando) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = '#F5EDD8' } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,152,42,0.4)'; e.currentTarget.style.color = '#D4C4A8' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10"/>
              </svg>
              {descargando ? 'Descargando...' : 'PDF'}
            </button>
            <a
              href="/admin"
              style={{
                textDecoration: 'none',
                padding: '0.45rem 1rem',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              Administrar
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
