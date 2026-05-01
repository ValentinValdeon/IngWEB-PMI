import { useState } from 'react'
import styles from './ModalDetalle.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function ModalDetalle({ producto, onCerrar, onConsultar }) {
  const titulo = producto.titulo || producto.nombre || 'Sin título'
  // El backend devuelve el campo como "ruta_imagen". Se lee también "imagen_path"
  // por si la otra parte del equipo cambia el nombre del campo en el futuro.
  const imagenRaw = producto.ruta_imagen || producto.imagen_path
  const imagenUrl = imagenRaw
    ? (imagenRaw.startsWith('http') ? imagenRaw : `/storage/${imagenRaw}`)
    : null
  const [imgError, setImgError] = useState(false)

  const precio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(producto.precio)

  return (
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '780px',
        overflow: 'hidden',
        animation: 'v-modalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}>

        {/* Emerald top bar */}
        <div style={{ height: '4px', background: 'var(--accent)', flexShrink: 0 }} />

        {/* Close button row */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0.75rem 1rem 0',
          flexShrink: 0,
        }}>
          <button
            onClick={onCerrar}
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              lineHeight: 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ×
          </button>
        </div>

        {/* Content — 2 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          overflow: 'auto',
          flex: 1,
        }}>

          {/* Left — Image */}
          <div style={{
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            borderRight: '1px solid var(--border)',
            padding: '1.5rem',
          }}>
            {imagenUrl && !imgError ? (
              <img
                src={imagenUrl}
                alt={titulo}
                onError={() => setImgError(true)}
                style={{
                  maxWidth: '100%',
                  maxHeight: '380px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--border)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="4" y="4" width="28" height="28" rx="5"/>
                    <circle cx="12" cy="12" r="2.5"/>
                    <path d="M32 24L24 16 8 32"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Sin imagen disponible
                </span>
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {producto.rubro && (
                <span className={styles.badge}>{producto.rubro.nombre}</span>
              )}
              {producto.subrubro && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '2px',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}>
                  {producto.subrubro.nombre}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 600,
              fontFamily: 'var(--font-card)',
              color: 'var(--text)',
              lineHeight: 1.2,
              letterSpacing: '0.01em',
              margin: 0,
            }}>
              {titulo}
            </h2>

            {/* Price */}
            <div style={{
              background: 'var(--accent-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Precio
              </span>
              <span className={styles.price} style={{ fontSize: '1.6rem', marginLeft: 'auto' }}>
                {precio}
              </span>
            </div>

            {/* Description */}
            {producto.descripcion && (
              <div>
                <p style={{
                  fontSize: '0.72rem',
              fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.4rem',
                }}>
                  Descripción
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Extra info row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              paddingTop: '0.25rem',
            }}>
              {producto.rubro && (
                <div style={{
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                    Rubro
                  </p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
                    {producto.rubro.nombre}
                  </p>
                </div>
              )}
              {producto.subrubro && (
                <div style={{
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border)',
                }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                    Subrubro
                  </p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
                    {producto.subrubro.nombre}
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
              <button
                className={btnStyles.btnPrimary}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => { onCerrar(); onConsultar(producto) }}
              >
                Consultar precio
              </button>
              <button
                className={btnStyles.btnOutline}
                onClick={onCerrar}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
