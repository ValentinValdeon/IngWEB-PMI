import { useState } from 'react'
import { Link } from 'react-router-dom'
import useProductos from '../hooks/useProductos'
import FormularioProducto from '../components/FormularioProducto'
import TablaProductos from '../components/TablaProductos'

export default function Admin() {
  const { rubros, productos, cargando, crear, actualizar, eliminar } = useProductos()
  const [productoEditar, setProductoEditar] = useState(null)

  const handleGuardar = async (formData, id) => {
    if (id) {
      await actualizar(id, formData)
    } else {
      await crear(formData)
    }
    setProductoEditar(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Administración</h1>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:bg-gray-50"
          >
            ← Ver catálogo
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 items-start">
        {/* Formulario lateral */}
        <div className="w-80 shrink-0">
          <FormularioProducto
            rubros={rubros}
            onGuardar={handleGuardar}
            productoEditar={productoEditar}
            onCancelarEdicion={() => setProductoEditar(null)}
          />
        </div>

        {/* Tabla */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              Productos cargados
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({productos.length})
              </span>
            </h2>
          </div>

          {cargando ? (
            <div className="text-sm text-gray-400 py-8 text-center">Cargando...</div>
          ) : (
            <TablaProductos
              productos={productos}
              onEditar={setProductoEditar}
              onEliminar={eliminar}
            />
          )}
        </div>
      </div>
    </div>
  )
}
