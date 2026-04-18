import { Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalogo />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
