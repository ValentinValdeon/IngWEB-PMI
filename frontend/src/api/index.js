import axios from 'axios'

// ── Axios instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
})

// ── Rubros ────────────────────────────────────────────────

export const getRubros = () => api.get('/rubros')           // ✅ disponible

export const createRubro = (nombre) => api.post('/rubros', { nombre }) // ✅ disponible

// TODO: reemplazar cuando el backend implemente PUT /rubros/:id
// export const updateRubro = (id, nombre) => api.put(`/rubros/${id}`, { nombre })
export const updateRubro = (id, nombre) => api.put(`/rubros/${id}`, { nombre })

// TODO: reemplazar cuando el backend implemente DELETE /rubros/:id
// export const deleteRubro = (id) => api.delete(`/rubros/${id}`)
export const deleteRubro = (id) => api.delete(`/rubros/${id}`)

// ── Subrubros ─────────────────────────────────────────────

export const createSubrubro = (rubroId, nombre) =>
  api.post('/subrubros', { rubro_id: rubroId, nombre })     // ✅ disponible

// TODO: reemplazar cuando el backend implemente PUT /subrubros/:id
// export const updateSubrubro = (id, nombre) => api.put(`/subrubros/${id}`, { nombre })
export const updateSubrubro = (id, nombre) => api.put(`/subrubros/${id}`, { nombre })

// TODO: reemplazar cuando el backend implemente DELETE /subrubros/:id
// export const deleteSubrubro = (id) => api.delete(`/subrubros/${id}`)
export const deleteSubrubro = (id) => api.delete(`/subrubros/${id}`)

// ── Productos ─────────────────────────────────────────────

export const getProductos = (params = {}) => api.get('/productos', { params }) // ✅ disponible

export const createProducto = (formData) =>
  api.post('/productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })                                                        // ✅ disponible

// TODO: reemplazar cuando el backend implemente PUT /productos/:id
// export const updateProducto = (id, formData) =>
//   api.post(`/productos/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//     params: { _method: 'PUT' },
//   })
export const updateProducto = (id, formData) =>
  api.post(`/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteProducto = (id) => api.delete(`/productos/${id}`) // ✅ disponible

// ── Consulta por mail ─────────────────────────────────────

// TODO: reemplazar cuando el backend implemente POST /consulta
// export const enviarConsulta = (data) => api.post('/consulta', data)
export const enviarConsulta = (data) => api.post('/consulta', data)

// ── PDF ───────────────────────────────────────────────────

// TODO: reemplazar cuando el backend implemente GET /catalogo/pdf
// export const descargarPdf = () => api.get('/catalogo/pdf', { responseType: 'blob' })
export const descargarPdf = () =>
  Promise.resolve({ data: new Blob([], { type: 'application/pdf' }) })

export default api
