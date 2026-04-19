import FormularioProducto from './FormularioProducto'

export default function ModalFormProducto({ rubros, onGuardar, productoEditar, onCerrar }) {
  return (
    <div
      className="v-overlay"
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '520px',
        overflow: 'hidden',
        animation: 'v-modalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ height: '4px', background: 'var(--emerald)' }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.25rem 0.75rem',
          borderBottom: '1px solid var(--border)',
          background: productoEditar ? 'var(--emerald-light)' : 'var(--bg-white)',
        }}>
          <div>
            <p className="v-eyebrow" style={{ marginBottom: '0.15rem' }}>
              {productoEditar ? 'Editar producto' : 'Nuevo producto'}
            </p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              {productoEditar
                ? (productoEditar.titulo || productoEditar.nombre || 'Producto')
                : 'Agregar al catálogo'}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'rgba(0,0,0,0.07)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              transition: 'background 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.13)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.07)'}
          >
            ×
          </button>
        </div>

        {/* Form — reutiliza el componente existente pero sin su propio panel/header */}
        <FormularioProducto
          rubros={rubros}
          onGuardar={async (fd, id) => {
            await onGuardar(fd, id)
            onCerrar()
          }}
          productoEditar={productoEditar}
          onCancelarEdicion={onCerrar}
          inModal
        />
      </div>
    </div>
  )
}
