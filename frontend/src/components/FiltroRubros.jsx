import styles from './FiltroRubros.module.css'

export default function FiltroRubros({ rubros, rubroSeleccionado, onSeleccionar }) {
  return (
    <aside className={styles.sidebar} style={{ height: '100%' }}>
      <div style={{ padding: '1.25rem 0.75rem' }}>
        <p className={styles.eyebrow} style={{ padding: '0 0.25rem', marginBottom: '0.75rem' }}>
          Categorías
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button
            className={`${styles.filterItem} ${rubroSeleccionado === null ? styles.active : ''}`}
            onClick={() => onSeleccionar(null)}
          >
            <span>Todos los productos</span>
            <span className={styles.filterDot} />
          </button>

          {rubros.map(rubro => (
            <button
              key={rubro.id}
              className={`${styles.filterItem} ${rubroSeleccionado === rubro.id ? styles.active : ''}`}
              onClick={() => onSeleccionar(rubro.id)}
            >
              <span>{rubro.nombre}</span>
              <span className={styles.filterDot} />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
