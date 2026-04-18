import { useState } from 'react'
import { enviarConsulta } from '../api'

export default function ModalConsulta({ producto, onCerrar }) {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await enviarConsulta({ ...form, producto_id: producto.id })
      setEnviado(true)
    } catch {
      setError('Ocurrió un error al enviar la consulta. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">Consulta</h2>
        <p className="text-sm text-gray-500 mb-5">
          Sobre: <span className="font-medium text-gray-700">{producto.titulo}</span>
        </p>

        {enviado ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium">¡Consulta enviada correctamente!</p>
            <button
              onClick={onCerrar}
              className="mt-4 text-sm text-gray-500 underline"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={4}
                defaultValue={`Hola, me interesa obtener más información sobre la pieza de ${producto.rubro?.nombre ?? ''}.`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
