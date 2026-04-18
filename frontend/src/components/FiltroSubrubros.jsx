export default function FiltroSubrubros({ subrubros, seleccionado, onSeleccionar }) {
  if (!subrubros.length) return null

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => onSeleccionar(null)}
        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
          seleccionado === null
            ? 'bg-gray-900 text-white border-gray-900'
            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        Todos
      </button>
      {subrubros.map((s) => (
        <button
          key={s.id}
          onClick={() => onSeleccionar(s.id)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            seleccionado === s.id
              ? 'bg-gray-900 text-white border-gray-900'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {s.nombre}
        </button>
      ))}
    </div>
  )
}
