import { Link } from 'react-router-dom'

export default function Navbar({ onDescargarPdf }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900">
          Multi-Rubro
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={onDescargarPdf}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:bg-gray-50"
          >
            Descargar catálogo PDF
          </button>
          <Link
            to="/admin"
            className="text-sm bg-gray-900 text-white rounded-md px-3 py-1.5 hover:bg-gray-700 transition-colors"
          >
            Administración
          </Link>
        </div>
      </div>
    </header>
  )
}
