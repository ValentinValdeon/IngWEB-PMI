import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-sm text-gray-500 mb-6">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        to="/"
        className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-700 transition-colors"
      >
        Volver al catálogo
      </Link>
    </div>
  )
}
