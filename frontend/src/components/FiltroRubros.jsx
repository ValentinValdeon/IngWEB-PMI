export default function FiltroRubros({ rubros, rubroSeleccionado, onSeleccionar }) {
  return (
    <aside className="v-sidebar" style={{ height: '100%' }}>
      <div style={{ padding: '1.25rem 0.75rem' }}>
        <p className="v-eyebrow" style={{ padding: '0 0.25rem', marginBottom: '0.75rem' }}>
          Categorías
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button
            className={`v-filter-item ${rubroSeleccionado === null ? 'active' : ''}`}
            onClick={() => onSeleccionar(null)}
          >
            <span>Todos los productos</span>
            <span className="v-filter-dot" />
          </button>

          {rubros.map(rubro => (
            <button
              key={rubro.id}
              className={`v-filter-item ${rubroSeleccionado === rubro.id ? 'active' : ''}`}
              onClick={() => onSeleccionar(rubro.id)}
            >
              <span>{rubro.nombre}</span>
              <span className="v-filter-dot" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
