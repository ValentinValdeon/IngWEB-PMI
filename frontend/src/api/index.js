import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Rubros ────────────────────────────────────────────────
export const getRubros = () => api.get('/rubros')

// ── Productos ─────────────────────────────────────────────
export const getProductos = (params = {}) => api.get('/productos', { params })

export const createProducto = (formData) =>
  api.post('/productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const updateProducto = (id, formData) =>
  api.post(`/productos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { _method: 'PUT' },
  })

export const deleteProducto = (id) => api.delete(`/productos/${id}`)

// ── Consulta por mail ─────────────────────────────────────
export const enviarConsulta = (data) => api.post('/consulta', data)

// ── PDF ───────────────────────────────────────────────────
export const descargarPdf = () =>
  api.get('/catalogo/pdf', { responseType: 'blob' })

export default api
