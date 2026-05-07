import axios from 'axios'

// ── Axios instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
})

// ── Rubros ────────────────────────────────────────────────

export const getRubros = () => api.get('/rubros')

export const createRubro = (nombre) => api.post('/rubros', { nombre }) 

export const updateRubro = (id, nombre) => api.put(`/rubros/${id}`, { nombre })

export const deleteRubro = (id) => api.delete(`/rubros/${id}`)

// ── Subrubros ─────────────────────────────────────────────

export const createSubrubro = (rubroId, nombre) =>
  api.post('/subrubros', { rubro_id: rubroId, nombre })

export const updateSubrubro = (id, nombre) => api.put(`/subrubros/${id}`, { nombre })


export const deleteSubrubro = (id) => api.delete(`/subrubros/${id}`)

// ── Categorías ────────────────────────────────────────────

export const getCategorias = () => api.get('/categorias')

export const getSubrubroCategorias = (subrubroId) =>
  api.get(`/subrubros/${subrubroId}/categorias`)

export const linkCategoriaToSubrubro = (categoriaId, subrubroId) =>
  api.post('/categorias/link', { categoria_id: categoriaId, subrubro_id: subrubroId })

export const createCategoria = (data) => api.post('/categorias', data)

export const updateCategoria = (id, nombre) => api.put(`/categorias/${id}`, { nombre })

export const deleteCategoria = (id) => api.delete(`/categorias/${id}`)

export const createCategoriaOpcion = (categoriaId, nombre) =>
  api.post(`/categorias/${categoriaId}/opciones`, { nombre })

export const updateCategoriaOpcion = (id, nombre) => api.put(`/opciones/${id}`, { nombre })

export const deleteCategoriaOpcion = (id) => api.delete(`/opciones/${id}`)

// ── Productos ─────────────────────────────────────────────

export const getProductos = (params = {}) => api.get('/productos', { params }) 

export const createProducto = (formData) =>
  api.post('/productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })                                                       

export const updateProducto = (id, formData) =>
  api.post(`/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteProducto = (id) => api.delete(`/productos/${id}`)

// ── Consulta por mail ─────────────────────────────────────

export const enviarConsulta = (data) => api.post('/consulta', data)

// ── PDF ───────────────────────────────────────────────────
export const descargarPdf = () =>
  Promise.resolve({ data: new Blob([], { type: 'application/pdf' }) })

export default api
