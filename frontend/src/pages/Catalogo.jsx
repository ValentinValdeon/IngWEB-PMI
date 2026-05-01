import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import FiltroRubros from '../components/FiltroRubros'
import FiltroSubrubros from '../components/FiltroSubrubros'
import ProductoCard from '../components/ProductoCard'
import ModalConsulta from '../components/ModalConsulta'
import ModalDetalle from '../components/ModalDetalle'
import useProductos from '../hooks/useProductos'
import styles from './Catalogo.module.css'

export default function Catalogo() {
  const {
    rubros,
    productos,
    subrubros,
    rubroSeleccionado,
    subrubroSeleccionado,
    cargando,
    error,
    seleccionarRubro,
    seleccionarSubrubro,
    bajarPdf,
  } = useProductos()

  const [productoConsulta, setProductoConsulta] = useState(null)
  const [productoDetalle, setProductoDetalle] = useState(null)
  const [navVisible, setNavVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      // show navbar after scrolling past 80% of the viewport height
      setNavVisible(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rubroActivo = rubros.find(r => r.id === rubroSeleccionado)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar onDescargarPdf={bajarPdf} visible={navVisible} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Presentación">
        <div className={styles.heroParticles} aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} className={styles.particle} />
          ))}
        </div>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>Catálogo Digital</span>
          <h1 className={styles.heroTitle}>
            Poli&#8209;<span className={styles.heroTitleAccent}>Rubro</span>
          </h1>
          <div className={styles.heroDivider} aria-hidden="true" />
          <p className={styles.heroSubtitle}>
            Ferretería · Textil · Electrodomésticos · y más
          </p>
          <button
            className={styles.heroBtn}
            onClick={() => {
              const el = document.getElementById('catalogo')
              if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' })
            }}
          >
            Ver catálogo
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="M6.5 2v9M2 7.5l4.5 4.5 4.5-4.5"/>
            </svg>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className={styles.heroScroll} aria-hidden="true">
          <span className={styles.heroScrollLabel}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 6l4 4 4-4"/>
          </svg>
        </div>
      </section>

      <div id="catalogo" style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar — pegado al borde izquierdo, debajo del header */}
        <div style={{
          width: '220px',
          flexShrink: 0,
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          alignSelf: 'flex-start',
        }}>
          <FiltroRubros
            rubros={rubros}
            rubroSeleccionado={rubroSeleccionado}
            onSeleccionar={seleccionarRubro}
          />
        </div>

        {/* Main */}
        <main style={{ flex: 1, padding: '1.75rem 1.75rem 4rem', minWidth: 0 }}>

          {/* Page header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className={styles.sectionTitle} style={{ marginBottom: '0.25rem' }}>
              {rubroActivo ? rubroActivo.nombre : 'Catálogo completo'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {cargando
                ? 'Cargando productos...'
                : `${productos.length} producto${productos.length !== 1 ? 's' : ''} disponible${productos.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Subrubro filters */}
          {subrubros.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <FiltroSubrubros
                subrubros={subrubros}
                seleccionado={subrubroSeleccionado}
                onSeleccionar={seleccionarSubrubro}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1.1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#DC2626',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="9" cy="9" r="7"/>
                <path d="M9 6v3.5M9 12.5v.5"/>
              </svg>
              {error}
            </div>
          )}

          {/* Skeletons */}
          {cargando && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} style={{ aspectRatio: '3/4', borderRadius: '16px' }} />
              ))}
            </div>
          )}

          {/* Empty */}
          {!cargando && productos.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 2rem',
              gap: '1rem',
              background: 'var(--bg-white)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px dashed var(--border)',
            }}>
              <div style={{
                width: '56px', height: '56px',
                background: 'var(--accent-light)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                  <path d="M12 12h.01"/>
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>Sin resultados</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No hay productos en esta categoría</p>
              </div>
            </div>
          )}

          {/* Grid */}
          {!cargando && productos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              {productos.map((producto, i) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  index={i}
                  onConsultar={setProductoConsulta}
                  onVerDetalle={setProductoDetalle}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {productoConsulta && (
        <ModalConsulta
          producto={productoConsulta}
          onCerrar={() => setProductoConsulta(null)}
        />
      )}

      {productoDetalle && (
        <ModalDetalle
          producto={productoDetalle}
          onCerrar={() => setProductoDetalle(null)}
          onConsultar={(p) => { setProductoDetalle(null); setProductoConsulta(p) }}
        />
      )}
    </div>
  )
}
