export default function ProductoCard({ producto, onConsultar, onVerDetalle, index = 0 }) {
  const titulo = producto.titulo || producto.nombre || 'Sin título'
  const imagenUrl = producto.imagen_path ? `/storage/${producto.imagen_path}` : null

  const precio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(producto.precio)

  return (
    <article
      className="v-card v-fade-up"
      style={{ animationDelay: `${index * 50}ms`, display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '4/3',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {imagenUrl ? (
          <img src={imagenUrl} alt={titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '52px', height: '52px',
              background: 'var(--border)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          {producto.rubro && (
            <span className="v-badge">{producto.rubro.nombre}</span>
          )}
          {producto.subrubro && (
            <span style={{
              display: 'inline-block',
              padding: '0.2rem 0.65rem',
              borderRadius: '99px',
              fontSize: '0.72rem',
              fontWeight: 500,
              background: 'var(--bg)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}>
              {producto.subrubro.nombre}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '0.975rem',
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: '0.4rem',
          lineHeight: 1.35,
        }}>
          {titulo}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {producto.descripcion}
        </p>

        {/* Price + CTAs */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="v-price">{precio}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-outline"
              onClick={() => onVerDetalle(producto)}
              style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="5"/>
                <path d="M6.5 4.5v2l1 1"/>
              </svg>
              Ver detalle
            </button>
            <button
              className="btn-primary"
              onClick={() => onConsultar(producto)}
              style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              Consultar
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
