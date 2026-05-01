import { useState, useEffect } from 'react'
import styles from './TablaProductos.module.css'
import btnStyles from '../shared/buttons.module.css'

function ImagenPreview({ imagenUrl, titulo, onClose }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Vista previa de imagen">
      <div className={styles.imgModal} onClick={e => e.stopPropagation()}>
        <button className={styles.imgModalClose} onClick={onClose} aria-label="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div className={styles.imgModalImgWrap}>
          {!loaded && <div className={styles.imgSkeleton} />}
          <img
            src={imagenUrl}
            alt={titulo}
            className={styles.imgModalImg}
            style={{ display: loaded ? 'block' : 'none' }}
            onLoad={() => setLoaded(true)}
          />
        </div>
        {titulo && <p className={styles.imgModalTitulo}>{titulo}</p>}
      </div>
    </div>
  )
}

function ModalConfirmarEliminar({ titulo, onConfirmar, onCancelar }) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className={styles.confirmBox}>
        <div className={styles.confirmIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 8v4M12 16v.5"/>
          </svg>
        </div>
        <h3 id="confirm-title" className={styles.confirmTitle}>¿Eliminar producto?</h3>
        <p className={styles.confirmText}>
          Esta acción no se puede deshacer. Se eliminará permanentemente <strong>"{titulo}"</strong>.
        </p>
        <div className={styles.confirmActions}>
          <button className={btnStyles.btnOutline} onClick={onCancelar}>
            Cancelar
          </button>
          <button className={btnStyles.btnDanger} onClick={onConfirmar}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

const SORT_NONE = null

export default function TablaProductos({ productos, onEditar, onEliminar }) {
  const [confirmar, setConfirmar] = useState(null) // { id, titulo }
  const [sort, setSort] = useState({ columna: SORT_NONE, dir: 'asc' })
  const [imagenPreview, setImagenPreview] = useState(null) // { id, imagenUrl, titulo }

  function toggleSort(columna) {
    setSort(prev =>
      prev.columna === columna
        ? { columna, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { columna, dir: 'asc' }
    )
  }

  function sortedProductos() {
    if (!sort.columna) return productos
    return [...productos].sort((a, b) => {
      let va, vb
      if (sort.columna === 'titulo') {
        va = (a.titulo || a.nombre || '').toLowerCase()
        vb = (b.titulo || b.nombre || '').toLowerCase()
        return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      if (sort.columna === 'precio') {
        va = parseFloat(a.precio) || 0
        vb = parseFloat(b.precio) || 0
        return sort.dir === 'asc' ? va - vb : vb - va
      }
      return 0
    })
  }

  function SortIcon({ columna }) {
    if (sort.columna !== columna) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35">
          <path d="M6 2v8M3 5l3-3 3 3M3 7l3 3 3-3"/>
        </svg>
      )
    }
    return sort.dir === 'asc'
      ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M6 9V3M3 6l3-3 3 3"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M6 3v6M3 6l3 3 3-3"/>
        </svg>
      )
  }

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
    <>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Imagen</th>
              <th>
                <button className={styles.thBtn} onClick={() => toggleSort('titulo')}>
                  Título <SortIcon columna="titulo" />
                </button>
              </th>
              <th>Categoría</th>
              <th>
                <button className={styles.thBtn} onClick={() => toggleSort('precio')}>
                  Precio <SortIcon columna="precio" />
                </button>
              </th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedProductos().map(p => {
              const titulo = p.titulo || p.nombre || '—'
              const imagenRaw = p.ruta_imagen || p.imagen_path
              const imagenUrl = imagenRaw
                ? (imagenRaw.startsWith('http') ? imagenRaw : `/storage/${imagenRaw}`)
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
                      <div className={styles.imgCell}>
                        <button
                          className={styles.eyeBtn}
                          onClick={() => setImagenPreview(
                            imagenPreview?.id === p.id ? null : { id: p.id, imagenUrl, titulo }
                          )}
                          title="Ver imagen"
                          aria-label="Ver imagen"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{
                          width: '44px', height: '44px',
                          background: 'var(--bg)',
                          border: '1.5px dashed #F59E0B',
                          borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#F59E0B" strokeWidth="1.25">
                            <rect x="2" y="2" width="12" height="12" rx="2"/>
                            <circle cx="5.5" cy="5.5" r="1"/>
                            <path d="M14 10l-3.5-3.5L6 11"/>
                          </svg>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: '#F59E0B', fontWeight: 600, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                          Sin imagen
                        </span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {p.rubro && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Rubro</span>
                          <span className={styles.badge}>{p.rubro.nombre}</span>
                        </div>
                      )}
                      {p.subrubro && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Subrubro</span>
                          <span className={styles.badgeSub}>{p.subrubro.nombre}</span>
                        </div>
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
                        onClick={() => setConfirmar({ id: p.id, titulo })}
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

      {confirmar && (
        <ModalConfirmarEliminar
          titulo={confirmar.titulo}
          onConfirmar={() => { onEliminar(confirmar.id); setConfirmar(null) }}
          onCancelar={() => setConfirmar(null)}
        />
      )}

      {imagenPreview && (
        <ImagenPreview
          imagenUrl={imagenPreview.imagenUrl}
          titulo={imagenPreview.titulo}
          onClose={() => setImagenPreview(null)}
        />
      )}
    </>
  )
}
