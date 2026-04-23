import styles from './FiltroSubrubros.module.css'

export default function FiltroSubrubros({ subrubros, seleccionado, onSeleccionar }) {
  if (!subrubros || subrubros.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        className={`${styles.pill} ${seleccionado === null ? styles.active : ''}`}
        onClick={() => onSeleccionar(null)}
      >
        Todos
      </button>
      {subrubros.map(s => (
        <button
          key={s.id}
          className={`${styles.pill} ${seleccionado === s.id ? styles.active : ''}`}
          onClick={() => onSeleccionar(s.id)}
        >
          {s.nombre}
        </button>
      ))}
    </div>
  )
}
