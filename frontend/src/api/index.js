import axios from 'axios'
import mockRubrosData from '../mock/rubros.json'
import mockProductosData from '../mock/productos.json'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ── Mock helpers ───────────────────────────────────────────
const mockResponse = (data) => Promise.resolve({ data })

// Copia mutable de los datos mock
let mockRubros = JSON.parse(JSON.stringify(mockRubrosData))
let mockProductos = JSON.parse(JSON.stringify(mockProductosData))
let nextRubroId = mockRubros.reduce((max, r) => Math.max(max, r.id), 0) + 1
let nextSubrubroId = mockRubros.flatMap(r => r.subrubros).reduce((max, s) => Math.max(max, s.id), 0) + 1

// ── Axios instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Rubros ────────────────────────────────────────────────
export const getRubros = () => {
  if (USE_MOCK) return mockResponse(mockRubros)
  return api.get('/rubros')
}

export const createRubro = (nombre) => {
  if (USE_MOCK) {
    const nuevo = { id: nextRubroId++, nombre, subrubros: [] }
    mockRubros.push(nuevo)
    return mockResponse(nuevo)
  }
  return api.post('/rubros', { nombre })
}

export const updateRubro = (id, nombre) => {
  if (USE_MOCK) {
    const rubro = mockRubros.find(r => r.id === Number(id))
    if (rubro) rubro.nombre = nombre
    return mockResponse(rubro)
  }
  return api.put(`/rubros/${id}`, { nombre })
}

export const deleteRubro = (id) => {
  if (USE_MOCK) {
    const idx = mockRubros.findIndex(r => r.id === Number(id))
    if (idx !== -1) mockRubros.splice(idx, 1)
    // También eliminar productos de ese rubro
    mockProductos = mockProductos.filter(p => p.rubro_id !== Number(id))
    return mockResponse({ message: 'Eliminado' })
  }
  return api.delete(`/rubros/${id}`)
}

// ── Subrubros ─────────────────────────────────────────────
export const createSubrubro = (rubroId, nombre) => {
  if (USE_MOCK) {
    const rubro = mockRubros.find(r => r.id === Number(rubroId))
    if (!rubro) return mockResponse(null)
    const nuevo = { id: nextSubrubroId++, nombre, rubro_id: Number(rubroId) }
    rubro.subrubros.push(nuevo)
    return mockResponse(nuevo)
  }
  return api.post('/subrubros', { rubro_id: rubroId, nombre })
}

export const updateSubrubro = (id, nombre) => {
  if (USE_MOCK) {
    for (const rubro of mockRubros) {
      const sub = rubro.subrubros.find(s => s.id === Number(id))
      if (sub) { sub.nombre = nombre; return mockResponse(sub) }
    }
    return mockResponse(null)
  }
  return api.put(`/subrubros/${id}`, { nombre })
}

export const deleteSubrubro = (id) => {
  if (USE_MOCK) {
    for (const rubro of mockRubros) {
      const idx = rubro.subrubros.findIndex(s => s.id === Number(id))
      if (idx !== -1) { rubro.subrubros.splice(idx, 1); break }
    }
    mockProductos = mockProductos.filter(p => p.subrubro_id !== Number(id))
    return mockResponse({ message: 'Eliminado' })
  }
  return api.delete(`/subrubros/${id}`)
}

// ── Productos ─────────────────────────────────────────────
export const getProductos = (params = {}) => {
  if (USE_MOCK) {
    let result = [...mockProductos]
    if (params.rubro_id) {
      result = result.filter((p) => p.rubro_id === Number(params.rubro_id))
    }
    if (params.subrubro_id) {
      result = result.filter((p) => p.subrubro_id === Number(params.subrubro_id))
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter(
        (p) =>
          (p.nombre || '').toLowerCase().includes(q) ||
          (p.descripcion || '').toLowerCase().includes(q)
      )
    }
    return mockResponse(result)
  }
  return api.get('/productos', { params })
}

export const createProducto = (formData) => {
  if (USE_MOCK) {
    const rubroId = Number(formData.get('rubro_id'))
    const subrubroId = Number(formData.get('subrubro_id'))
    const rubro = mockRubros.find(r => r.id === rubroId)
    const subrubro = rubro?.subrubros.find(s => s.id === subrubroId)
    const titulo = formData.get('titulo') || 'Nuevo producto'
    const nuevo = {
      id: Date.now(),
      nombre: titulo,
      titulo,
      descripcion: formData.get('descripcion') || '',
      precio: parseFloat(formData.get('precio')) || 0,
      imagen: null,
      imagen_path: null,
      rubro_id: rubroId,
      subrubro_id: subrubroId,
      rubro: rubro ? { id: rubro.id, nombre: rubro.nombre } : null,
      subrubro: subrubro ? { id: subrubro.id, nombre: subrubro.nombre } : null,
    }
    mockProductos.push(nuevo)
    return mockResponse(nuevo)
  }
  return api.post('/productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateProducto = (id, formData) => {
  if (USE_MOCK) {
    const idx = mockProductos.findIndex((p) => p.id === Number(id))
    if (idx !== -1) {
      const rubroId = Number(formData.get('rubro_id')) || mockProductos[idx].rubro_id
      const subrubroId = Number(formData.get('subrubro_id')) || mockProductos[idx].subrubro_id
      const rubro = mockRubros.find(r => r.id === rubroId)
      const subrubro = rubro?.subrubros.find(s => s.id === subrubroId)
      const titulo = formData.get('titulo') || mockProductos[idx].titulo
      mockProductos[idx] = {
        ...mockProductos[idx],
        nombre: titulo,
        titulo,
        descripcion: formData.get('descripcion') || mockProductos[idx].descripcion,
        precio: parseFloat(formData.get('precio')) || mockProductos[idx].precio,
        rubro_id: rubroId,
        subrubro_id: subrubroId,
        rubro: rubro ? { id: rubro.id, nombre: rubro.nombre } : mockProductos[idx].rubro,
        subrubro: subrubro ? { id: subrubro.id, nombre: subrubro.nombre } : mockProductos[idx].subrubro,
      }
      return mockResponse(mockProductos[idx])
    }
    return mockResponse(null)
  }
  return api.post(`/productos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { _method: 'PUT' },
  })
}

export const deleteProducto = (id) => {
  if (USE_MOCK) {
    const idx = mockProductos.findIndex((p) => p.id === Number(id))
    if (idx !== -1) mockProductos.splice(idx, 1)
    return mockResponse({ message: 'Eliminado' })
  }
  return api.delete(`/productos/${id}`)
}

// ── Consulta por mail ─────────────────────────────────────
export const enviarConsulta = (data) => {
  if (USE_MOCK) return mockResponse({ message: 'Consulta enviada (mock)' })
  return api.post('/consulta', data)
}

// ── PDF ───────────────────────────────────────────────────
export const descargarPdf = () => {
  if (USE_MOCK) {
    alert('Descarga de PDF no disponible en modo mock.')
    return Promise.resolve()
  }
  return api.get('/catalogo/pdf', { responseType: 'blob' })
}

export default api
