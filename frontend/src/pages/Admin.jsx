import { useState } from 'react'
import useProductos from '../hooks/useProductos'
import TablaProductos from '../components/TablaProductos'
import ModalFormProducto from '../components/ModalFormProducto'
import ModalRubros from '../components/ModalRubros'
import ModalCategorias from '../components/ModalCategorias'
import { getCategorias } from '../api'
import styles from './Admin.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function Admin() {
  const { rubros, productos, cargando, crear, actualizar, eliminar, recargarRubros } = useProductos()

  const [modalProducto, setModalProducto] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [modalRubros, setModalRubros] = useState(false)
  const [modalCategorias, setModalCategorias] = useState(false)

  // Filters
  const [busqueda, setBusqueda] = useState('')
  const [rubroFiltro, setRubroFiltro] = useState('')
  const [subrubroFiltro, setSubrubroFiltro] = useState('')

  const subrubrosDisponibles = rubroFiltro
    ? (rubros.find(r => String(r.id) === rubroFiltro)?.subrubros || [])
    : []

  function handleRubroFiltro(val) {
    setRubroFiltro(val)
    setSubrubroFiltro('')
  }

  const productosFiltrados = productos.filter(p => {
    const texto = busqueda.toLowerCase()
    const coincideTexto = !busqueda ||
      (p.titulo || p.nombre || '').toLowerCase().includes(texto) ||
      (p.descripcion || '').toLowerCase().includes(texto)
    const coincideRubro = !rubroFiltro || String(p.rubro?.id) === rubroFiltro
    const coincideSubrubro = !subrubroFiltro || String(p.subrubro?.id) === subrubroFiltro
    return coincideTexto && coincideRubro && coincideSubrubro
  })

  function abrirNuevo() {
    setProductoEditar(null)
    setModalProducto(true)
  }

  function abrirEditar(producto) {
    setProductoEditar(producto)
    setModalProducto(true)
  }

  async function handleGuardar(formData, id) {
    if (id) {
      await actualizar(id, formData)
    } else {
      await crear(formData)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--bg-white)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Left: brand + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px', height: '28px',
                background: 'var(--accent)',
                borderRadius: '7px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Poli-Rubro
              </span>
            </a>
            <span style={{ color: 'var(--border-strong)', fontSize: '1rem' }}>/</span>
            <span className={styles.eyebrow}>Administración</span>
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              className={btnStyles.btnOutline}
              onClick={() => setModalRubros(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <rect x="1" y="1" width="5" height="5" rx="1"/>
                <rect x="8" y="1" width="5" height="5" rx="1"/>
                <rect x="1" y="8" width="5" height="5" rx="1"/>
                <path d="M10.5 8v5M8 10.5h5"/>
              </svg>
              Gestionar rubros
            </button>

            <button
              className={btnStyles.btnOutline}
              onClick={() => setModalCategorias(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="7" cy="7" r="5"/>
                <path d="M7 4v3l2 1"/>
              </svg>
              Gestionar categorías
            </button>

            <button
              className={btnStyles.btnPrimary}
              onClick={abrirNuevo}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 1v12M1 7h12"/>
              </svg>
              Nuevo producto
            </button>

            <div style={{ width: '1px', height: '28px', background: 'var(--border)', margin: '0 0.2rem' }} />

            <a
              href="/"
              className={btnStyles.btnOutline}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.9rem', fontSize: '0.825rem' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M8 2L4 6.5 8 11"/>
              </svg>
              Catálogo
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* Stats sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0, width: '160px' }}>
          {[
            {
              label: 'Productos',
              value: productos.length,
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="6" height="6" rx="1.2"/>
                  <rect x="10" y="2" width="6" height="6" rx="1.2"/>
                  <rect x="2" y="10" width="6" height="6" rx="1.2"/>
                  <rect x="10" y="10" width="6" height="6" rx="1.2"/>
                </svg>
              ),
            },
            {
              label: 'Rubros',
              value: rubros.length,
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5h14M2 9h10M2 13h7"/>
                </svg>
              ),
            },
            {
              label: 'Subrubros',
              value: rubros.reduce((acc, r) => acc + (r.subrubros?.length || 0), 0),
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h10M4 9h7M4 14h5"/>
                  <circle cx="14" cy="9" r="2.5"/>
                </svg>
              ),
            },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-white)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{ color: 'var(--accent)' }}>{stat.icon}</div>
              <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Table header */}
          <div style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
              Inventario de productos
            </h2>
          </div>

          {/* Filter bar */}
          <div className={styles.filterBar}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="6" cy="6" r="4.5"/>
                <path d="M9.5 9.5l3 3"/>
              </svg>
              <input
                type="search"
                placeholder="Buscar por nombre o descripción…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Rubro select */}
            <select
              value={rubroFiltro}
              onChange={e => handleRubroFiltro(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todos los rubros</option>
              {rubros.map(r => (
                <option key={r.id} value={String(r.id)}>{r.nombre}</option>
              ))}
            </select>

            {/* Subrubro select — only when a rubro is selected */}
            {rubroFiltro && (
              <select
                value={subrubroFiltro}
                onChange={e => setSubrubroFiltro(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Todos los subrubros</option>
                {subrubrosDisponibles.map(s => (
                  <option key={s.id} value={String(s.id)}>{s.nombre}</option>
                ))}
              </select>
            )}

            {/* Clear filters */}
            {(busqueda || rubroFiltro) && (
              <button
                className={styles.clearBtn}
                onClick={() => { setBusqueda(''); setRubroFiltro(''); setSubrubroFiltro('') }}
              >
                Limpiar
              </button>
            )}

            {/* Result count */}
            <span className={styles.resultCount}>
              {productosFiltrados.length} de {productos.length}
            </span>
          </div>

          {/* Table */}
          <div className={styles.panel}>
            {cargando ? (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={styles.skeleton} style={{ height: '56px', borderRadius: '8px' }} />
                ))}
              </div>
            ) : (
              <TablaProductos
                productos={productosFiltrados}
                onEditar={abrirEditar}
                onEliminar={eliminar}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal Producto */}
      {modalProducto && (
        <ModalFormProducto
          rubros={rubros}
          onGuardar={handleGuardar}
          productoEditar={productoEditar}
          onCerrar={() => { setModalProducto(false); setProductoEditar(null) }}
        />
      )}

      {/* Modal Rubros */}
      {modalRubros && (
        <ModalRubros
          onCerrar={() => setModalRubros(false)}
          onRubrosChanged={recargarRubros}
        />
      )}

      {/* Modal Categorías */}
      {modalCategorias && (
        <ModalCategorias
          onCerrar={() => setModalCategorias(false)}
          onCategoriasChanged={() => {
            getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
          }}
        />
      )}
    </div>
  )
}
