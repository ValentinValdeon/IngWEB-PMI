import { useState, useEffect } from 'react'

const FORM_VACIO = {
  titulo: '',
  rubro_id: '',
  subrubro_id: '',
  descripcion: '',
  precio: '',
  imagen: null,
}

export default function FormularioProducto({ rubros, onGuardar, productoEditar, onCancelarEdicion }) {
  const [form, setForm] = useState(FORM_VACIO)
  const [subrubros, setSubrubros] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  // Cargar datos si estamos editando
  useEffect(() => {
    if (productoEditar) {
      setForm({
        titulo: productoEditar.titulo ?? '',
        rubro_id: productoEditar.rubro_id ?? '',
        subrubro_id: productoEditar.subrubro_id ?? '',
        descripcion: productoEditar.descripcion ?? '',
        precio: productoEditar.precio ?? '',
        imagen: null,
      })
    } else {
      setForm(FORM_VACIO)
    }
  }, [productoEditar])

  // Actualizar subrubros al cambiar rubro
  useEffect(() => {
    const rubro = rubros.find((r) => r.id === Number(form.rubro_id))
    setSubrubros(rubro?.subrubros ?? [])
    if (!productoEditar) setForm((f) => ({ ...f, subrubro_id: '' }))
  }, [form.rubro_id, rubros])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== '') data.append(k, v)
    })

    try {
      await onGuardar(data, productoEditar?.id)
      setForm(FORM_VACIO)
    } catch {
      setError('Error al guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900">
        {productoEditar ? 'Editar producto' : 'Nuevo producto'}
      </h2>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
          required={!productoEditar}
          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Rubro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
        <select
          name="rubro_id"
          value={form.rubro_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
        >
          <option value="">Seleccioná un rubro</option>
          {rubros.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
      </div>

      {/* Subrubro */}
      {subrubros.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subrubro</label>
          <select
            name="subrubro_id"
            value={form.subrubro_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          >
            <option value="">Sin subrubro</option>
            {subrubros.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
        />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
        <input
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : productoEditar ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {productoEditar && (
          <button
            type="button"
            onClick={onCancelarEdicion}
            className="px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
