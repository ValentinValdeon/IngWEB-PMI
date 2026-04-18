export default function TablaProductos({ productos, onEditar, onEliminar }) {
  if (!productos.length) {
    return (
      <p className="text-sm text-gray-400 py-8 text-center">
        No hay productos cargados aún.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Imagen</th>
            <th className="px-4 py-3 text-left">Título</th>
            <th className="px-4 py-3 text-left">Rubro</th>
            <th className="px-4 py-3 text-left">Subrubro</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {productos.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                {p.imagen_path ? (
                  <img
                    src={`/storage/${p.imagen_path}`}
                    alt={p.titulo}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                    📦
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{p.titulo}</td>
              <td className="px-4 py-3 text-gray-600">{p.rubro?.nombre ?? '-'}</td>
              <td className="px-4 py-3 text-gray-600">{p.subrubro?.nombre ?? '-'}</td>
              <td className="px-4 py-3 text-right text-gray-900 font-medium">
                ${Number(p.precio).toLocaleString('es-AR')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEditar(p)}
                    className="text-xs px-2.5 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar "${p.titulo}"?`)) onEliminar(p.id)
                    }}
                    className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
