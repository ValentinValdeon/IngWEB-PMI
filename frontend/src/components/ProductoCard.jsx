export default function ProductoCard({ producto, onConsultar }) {
  const imagenUrl = producto.imagen_path
    ? `/storage/${producto.imagen_path}`
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Imagen */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={producto.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 leading-snug">{producto.titulo}</h3>
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            ${Number(producto.precio).toLocaleString('es-AR')}
          </span>
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {producto.rubro?.nombre}
          {producto.subrubro ? ` · ${producto.subrubro.nombre}` : ''}
        </p>

        {producto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">{producto.descripcion}</p>
        )}

        <button
          onClick={() => onConsultar(producto)}
          className="mt-auto w-full text-sm bg-gray-900 text-white rounded-lg py-2 hover:bg-gray-700 transition-colors"
        >
          Consultar por este producto
        </button>
      </div>
    </div>
  )
}
