import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import styles from './Navbar.module.css'

const Navbar = forwardRef(function Navbar({ onDescargarPdf, scrollProgress = 0 }, ref) {
  const [descargando, setDescargando] = useState(false)
  const logoTextRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getLogoRect: () => logoTextRef.current?.getBoundingClientRect() ?? null,
  }))

  async function handlePdf() {
    setDescargando(true)
    try {
      await onDescargarPdf()
    } finally {
      setDescargando(false)
    }
  }

  const bgOpacity      = Math.min(Math.max((scrollProgress - 0.05) / 0.3, 0), 1)
  const contentOpacity = Math.min(Math.max((scrollProgress - 0.55) / 0.35, 0), 1)
  const iconOpacity    = Math.min(Math.max((scrollProgress - 0.5) / 0.3, 0), 1)

  return (
    <nav
      className={styles.navbar}
      style={{
        backgroundColor: `rgba(15,15,15,${bgOpacity})`,
        borderBottomColor: `rgba(247,246,244,${bgOpacity * 0.08})`,
        boxShadow: bgOpacity > 0.1 ? `0 2px 16px rgba(0,0,0,${bgOpacity * 0.25})` : 'none',
        backdropFilter: bgOpacity > 0.5 ? 'blur(8px)' : 'none',
        opacity: scrollProgress > 0 ? 1 : 0,
        pointerEvents: scrollProgress > 0.5 ? 'auto' : 'none',
      }}
    >
      <div className={styles.inner}>
        <div className={styles.row}>

          <a href="/" className={styles.logoLink}>
            <div className={styles.logoIcon} style={{ opacity: iconOpacity }}>
              <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span ref={logoTextRef} aria-hidden="true" className={styles.logoText}>
              Poli-Rubro
            </span>
          </a>

          {/* Actions */}
          <div className={styles.actions} style={{ opacity: contentOpacity }}>
            <button
              className={styles.btnPdf}
              onClick={handlePdf}
              disabled={descargando}
              aria-label="Descargar catálogo en PDF"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10"/>
              </svg>
              {descargando ? 'Descargando...' : 'PDF'}
            </button>
            <a href="/admin" className={styles.btnAdmin}>
              Administrar
            </a>
          </div>

        </div>
      </div>
    </nav>
  )
})

export default Navbar
