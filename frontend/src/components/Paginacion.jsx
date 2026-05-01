import styles from './Paginacion.module.css'

export default function Paginacion({ paginaActual, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null

  const paginas = []
  for (let i = 1; i <= totalPaginas; i++) paginas.push(i)

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      <button
        className={styles.btn}
        onClick={() => onCambiar(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          <path d="M9 2L4 7l5 5"/>
        </svg>
      </button>

      {paginas.map(p => (
        <button
          key={p}
          className={`${styles.btn} ${p === paginaActual ? styles.activo : ''}`}
          onClick={() => onCambiar(p)}
          aria-current={p === paginaActual ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onCambiar(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          <path d="M5 2l5 5-5 5"/>
        </svg>
      </button>
    </nav>
  )
}
