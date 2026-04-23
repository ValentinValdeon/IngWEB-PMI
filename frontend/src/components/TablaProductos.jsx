import styles from './TablaProductos.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function TablaProductos({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          No hay productos cargados aún.
        </p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => {
            const titulo = p.titulo || p.nombre || '—'
            const imagenUrl = p.imagen_path
              ? (p.imagen_path.startsWith('http') ? p.imagen_path : `/storage/${p.imagen_path}`)
              : null
            const precio = new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 0,
            }).format(p.precio)

            return (
              <tr key={p.id}>
                <td>
                  {imagenUrl ? (
                    <img
                      src={imagenUrl}
                      alt={titulo}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  ) : (
                    <div style={{
                      width: '40px', height: '40px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.25">
                        <rect x="2" y="2" width="12" height="12" rx="2"/>
                        <circle cx="5.5" cy="5.5" r="1"/>
                        <path d="M14 10l-3.5-3.5L6 11"/>
                      </svg>
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--text)' }}>{titulo}</div>
                  {p.descripcion && (
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.15rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '220px',
                    }}>
                      {p.descripcion}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {p.rubro && <span className={styles.badge} style={{ width: 'fit-content' }}>{p.rubro.nombre}</span>}
                    {p.subrubro && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {p.subrubro.nombre}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={styles.price}>{precio}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className={btnStyles.btnEditSoft} onClick={() => onEditar(p)}>
                      Editar
                    </button>
                    <button
                      className={btnStyles.btnDangerSoft}
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${titulo}"?`)) onEliminar(p.id)
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
