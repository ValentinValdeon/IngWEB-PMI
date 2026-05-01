import { useState } from 'react'
import styles from './ProductoCard.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function ProductoCard({ producto, onConsultar, onVerDetalle, index = 0 }) {
  const titulo = producto.titulo || producto.nombre || 'Sin título'
  const imagenRaw = producto.ruta_imagen || producto.imagen_path
  const imagenUrl = imagenRaw
    ? (imagenRaw.startsWith('http') ? imagenRaw : `/storage/${imagenRaw}`)
    : null

  const [imgLoaded, setImgLoaded] = useState(false)

  const precio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(producto.precio)

  return (
    <article
      className={`${styles.card} ${styles.fadeUp}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {imagenUrl ? (
          <>
            {!imgLoaded && <div className={styles.imgSkeleton} />}
            <img
              src={imagenUrl}
              alt={titulo}
              className={styles.image}
              loading="lazy"
              style={{ opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className={styles.noImagePlaceholder}>
            <div className={styles.noImageIcon} role="img" aria-label="Sin imagen disponible">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            <span className={styles.noImageLabel}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Badges */}
        <div className={styles.badges}>
          {producto.rubro   && <span className={styles.badge}>{producto.rubro.nombre}</span>}
          {producto.subrubro && <span className={styles.badgeSecondary}>{producto.subrubro.nombre}</span>}
        </div>

        {/* Title */}
        <h3 className={styles.title}>{titulo}</h3>

        {/* Description */}
        <p className={styles.description}>{producto.descripcion}</p>

        {/* Price + CTAs */}
        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{precio}</span>
          </div>
          <div className={styles.ctaRow}>
            <button
              className={`${btnStyles.btnOutline} ${styles.ctaBtn}`}
              onClick={() => onVerDetalle(producto)}
              aria-label={`Ver detalle de ${titulo}`}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1.5 6.5C1.5 6.5 3.5 2.5 6.5 2.5s5 4 5 4-2 4-5 4-5-4-5-4z"/>
                <circle cx="6.5" cy="6.5" r="1.5"/>
              </svg>
              Ver detalle
            </button>
            <button
              className={`${btnStyles.btnPrimary} ${styles.ctaBtn}`}
              onClick={() => onConsultar(producto)}
              aria-label={`Consultar sobre ${titulo}`}
            >
              Consultar
            </button>
          </div>
        </div>

      </div>
    </article>
  )
}
