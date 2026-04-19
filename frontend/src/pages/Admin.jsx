import { useState } from 'react'
import useProductos from '../hooks/useProductos'
import TablaProductos from '../components/TablaProductos'
import ModalFormProducto from '../components/ModalFormProducto'
import ModalRubros from '../components/ModalRubros'

export default function Admin() {
  const { rubros, productos, cargando, crear, actualizar, eliminar, recargarRubros } = useProductos()

  const [modalProducto, setModalProducto] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)
  const [modalRubros, setModalRubros] = useState(false)

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
                background: 'var(--emerald)',
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
            <span className="v-eyebrow">Administración</span>
          </div>

          {/* Right: action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              className="btn-outline"
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
              className="btn-primary"
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
              className="btn-outline"
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
              <div style={{ color: 'var(--emerald)' }}>{stat.icon}</div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
              Inventario de productos
            </h2>
            <button
              className="btn-primary"
              onClick={abrirNuevo}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 1v10M1 6h10"/>
              </svg>
              Agregar
            </button>
          </div>

          {/* Table */}
          <div className="v-panel">
            {cargando ? (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="v-skeleton" style={{ height: '56px', borderRadius: '8px' }} />
                ))}
              </div>
            ) : (
              <TablaProductos
                productos={productos}
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
    </div>
  )
}
