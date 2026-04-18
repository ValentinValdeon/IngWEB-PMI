export default function FiltroRubros({ rubros, rubroSeleccionado, onSeleccionar }) {
  return (
    <aside className="w-52 shrink-0">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Rubros
      </h2>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSeleccionar(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              rubroSeleccionado === null
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
        </li>
        {rubros.map((rubro) => (
          <li key={rubro.id}>
            <button
              onClick={() => onSeleccionar(rubro.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                rubroSeleccionado === rubro.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {rubro.nombre}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
