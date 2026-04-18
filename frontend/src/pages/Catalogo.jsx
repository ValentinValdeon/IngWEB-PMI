import { useState } from 'react'
import useProductos from '../hooks/useProductos'
import Navbar from '../components/Navbar'
import FiltroRubros from '../components/FiltroRubros'
import FiltroSubrubros from '../components/FiltroSubrubros'
import ProductoCard from '../components/ProductoCard'
import ModalConsulta from '../components/ModalConsulta'

export default function Catalogo() {
  const {
    rubros,
    productos,
    subrubros,
    rubroSeleccionado,
    subrubroSeleccionado,
    cargando,
    error,
    seleccionarRubro,
    setSubrubroSeleccionado,
    bajarPdf,
  } = useProductos()

  const [productoConsulta, setProductoConsulta] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onDescargarPdf={bajarPdf} />

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <FiltroRubros
          rubros={rubros}
          rubroSeleccionado={rubroSeleccionado}
          onSeleccionar={seleccionarRubro}
        />

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          <FiltroSubrubros
            subrubros={subrubros}
            seleccionado={subrubroSeleccionado}
            onSeleccionar={setSubrubroSeleccionado}
          />

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 aspect-square animate-pulse"
                />
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🗂️</p>
              <p className="text-sm">No hay productos para esta selección.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productos.map((p) => (
                <ProductoCard
                  key={p.id}
                  producto={p}
                  onConsultar={setProductoConsulta}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal consulta */}
      {productoConsulta && (
        <ModalConsulta
          producto={productoConsulta}
          onCerrar={() => setProductoConsulta(null)}
        />
      )}
    </div>
  )
}
