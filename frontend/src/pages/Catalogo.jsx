import { useState, useEffect, useRef, useMemo } from 'react'
import Navbar from '../components/Navbar'
import FiltroRubros from '../components/FiltroRubros'
import FiltroSubrubros from '../components/FiltroSubrubros'
import ProductoCard from '../components/ProductoCard'
import ModalConsulta from '../components/ModalConsulta'
import ModalDetalle from '../components/ModalDetalle'
import Paginacion from '../components/Paginacion'
import useProductos from '../hooks/useProductos'
import styles from './Catalogo.module.css'

const ITEMS_POR_PAGINA = 10

const lerp = (a, b, t) => a + (b - a) * t

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('default')
  const [paginaActual, setPaginaActual] = useState(1)

  // Rectángulos medidos del DOM — null hasta que el componente montó
  const [heroRect,  setHeroRect]  = useState(null) // { cx, cy, fontSize }
  const [destRect,  setDestRect]  = useState(null) // { cx, cy, fontSize }

  const heroTitleRef = useRef(null)
  const navbarRef    = useRef(null)

  // Medir ambos elementos después del primer render
  useEffect(() => {
    function measure() {
      // Origen: centro del h1 del hero (en coordenadas de viewport; está a scrollY=0)
      if (heroTitleRef.current) {
        const r = heroTitleRef.current.getBoundingClientRect()
        setHeroRect({
          cx:       r.left + r.width  / 2,
          cy:       r.top  + r.height / 2,
          fontSize: r.height / 1.05, // height ÷ line-height ≈ font-size visual
        })
      }
      // Destino: centro del span de texto del logo en el navbar
      if (navbarRef.current) {
        const lr = navbarRef.current.getLogoRect()
        if (lr) {
          setDestRect({
            cx:       lr.left + lr.width  / 2,
            cy:       lr.top  + lr.height / 2,
            fontSize: lr.height / 1.05,
          })
        }
      }
    }
    // Medimos en el siguiente frame para asegurarnos de que los fonts cargaron
    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  useEffect(() => {
    function onScroll() {
      const p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.85), 0), 1)
      setScrollProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Tope de scroll: no se puede subir más allá del borde del catálogo ─────
  useEffect(() => {
    if ('ontouchstart' in window) return

    const NAVBAR_H = 64
    let lastScrollY = 0

    function getTope() {
      const el = document.getElementById('catalogo')
      return el ? el.offsetTop - NAVBAR_H : window.innerHeight
    }

    function onScroll() {
      const tope = getTope()
      const scrollY = window.scrollY
      const scrollingUp = scrollY < lastScrollY

      // Solo intervenir si viene subiendo y entra en la zona del hero
      if (scrollingUp && scrollY > 0 && scrollY < tope) {
        window.scrollTo({ top: tope, behavior: 'instant' })
      }

      lastScrollY = scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rubroActivo = rubros.find(r => r.id === rubroSeleccionado)

  // Filtrar y ordenar en memoria
  const productosProcesados = useMemo(() => {
    let lista = [...productos]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      lista = lista.filter(p =>
        p.titulo?.toLowerCase().includes(q)
      )
    }

    if (sortOrder === 'az') lista.sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''))
    else if (sortOrder === 'za') lista.sort((a, b) => (b.titulo ?? '').localeCompare(a.titulo ?? ''))
    else if (sortOrder === 'nuevos') lista.sort((a, b) => b.id - a.id)

    return lista
  }, [productos, searchQuery, sortOrder])

  const totalPaginas = Math.ceil(productosProcesados.length / ITEMS_POR_PAGINA)
  const productosPagina = productosProcesados.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

  // Resetear página al cambiar filtros
  useEffect(() => { setPaginaActual(1) }, [searchQuery, sortOrder, rubroSeleccionado, subrubroSeleccionado])

  // Fallbacks mientras no tenemos mediciones reales
  const oX = heroRect?.cx       ?? window.innerWidth  / 2
  const oY = heroRect?.cy       ?? window.innerHeight / 2
  const oF = heroRect?.fontSize ?? Math.min(Math.max(window.innerWidth * 0.0875, 60), 110)
  const dX = destRect?.cx       ?? 116
  const dY = destRect?.cy       ?? 32
  const dF = destRect?.fontSize ?? 22

  const clonX  = lerp(oX, dX, scrollProgress)
  const clonY  = lerp(oY, dY, scrollProgress)
  const clonF  = lerp(oF, dF, scrollProgress)
  const clonLS = lerp(-0.02, 0.02, scrollProgress)
  const clonFW = Math.round(lerp(300, 600, scrollProgress))

  const secOpacity = Math.max(0, 1 - scrollProgress * 2.5)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar ref={navbarRef} onDescargarPdf={bajarPdf} scrollProgress={scrollProgress} />

      {/* ── Clon del título — siempre visible, viaja del hero al navbar ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 210,
          pointerEvents: 'none',
          transform: `translate(${clonX}px, ${clonY}px) translate(-50%, -50%)`,
          fontFamily: 'var(--font-display)',
          fontSize: `${clonF}px`,
          fontWeight: clonFW,
          letterSpacing: `${clonLS}em`,
          color: '#F7F6F4',
          whiteSpace: 'nowrap',
          lineHeight: 1.02,
          willChange: 'transform, font-size',
        }}
      >
        Poli&#8209;Rubro
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Presentación">
        <div className={styles.heroParticles} aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} className={styles.particle} />
          ))}
        </div>
        <div className={styles.heroInner}>
          <span
            className={styles.heroEyebrow}
            style={{ opacity: secOpacity, transition: 'none' }}
          >
            Catálogo Digital
          </span>
          <h1
            ref={heroTitleRef}
            className={styles.heroTitle}
            style={{ visibility: 'hidden' }}
          >
            Poli&#8209;<span className={styles.heroTitleAccent}>Rubro</span>
          </h1>
          <div
            className={styles.heroDivider}
            aria-hidden="true"
            style={{ opacity: secOpacity, transition: 'none' }}
          />
          <p
            className={styles.heroSubtitle}
            style={{ opacity: secOpacity, transition: 'none' }}
          >
            Ferretería · Textil · Electrodomésticos · y más
          </p>
          <button
            className={styles.heroBtn}
            style={{ opacity: secOpacity, transition: secOpacity > 0 ? 'background 0.25s, color 0.25s, border-color 0.25s' : 'none' }}
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
        <div
          className={styles.heroScroll}
          aria-hidden="true"
          style={{ opacity: secOpacity, transition: 'none' }}
        >
          <span className={styles.heroScrollLabel}>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 6l4 4 4-4"/>
          </svg>
        </div>
      </section>

      <div id="catalogo" style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
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
                : `${productosProcesados.length} producto${productosProcesados.length !== 1 ? 's' : ''} disponible${productosProcesados.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {/* Buscador + Ordenamiento */}
          {!cargando && (
            <div className={styles.toolbar}>
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="4.5"/>
                  <path d="M10.5 10.5l3 3"/>
                </svg>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Buscar producto..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Buscar producto"
                />
                {searchQuery && (
                  <button className={styles.searchClear} onClick={() => setSearchQuery('')} aria-label="Limpiar búsqueda">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                      <path d="M1 1l10 10M11 1L1 11"/>
                    </svg>
                  </button>
                )}
              </div>

              <select
                className={styles.sortSelect}
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                aria-label="Ordenar productos"
              >
                <option value="default">Ordenar por...</option>
                <option value="az">Nombre A → Z</option>
                <option value="za">Nombre Z → A</option>
                <option value="nuevos">Más nuevos primero</option>
              </select>
            </div>
          )}

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
          {!cargando && productosProcesados.length === 0 && (
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
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {searchQuery ? `No se encontraron productos para "${searchQuery}"` : 'No hay productos en esta categoría'}
                </p>
              </div>
            </div>
          )}

          {/* Grid */}
          {!cargando && productosProcesados.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}>
              {productosPagina.map((producto, i) => (
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

          {/* Paginación */}
          {!cargando && totalPaginas > 1 && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiar={pagina => {
                setPaginaActual(pagina)
                const el = document.getElementById('catalogo')
                if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' })
              }}
            />
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
