import { useState, useEffect, useCallback } from 'react'
import {
  getRubros,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  descargarPdf,
} from '../api'

export default function useProductos() {
  const [rubros, setRubros] = useState([])
  const [productos, setProductos] = useState([])
  const [rubroSeleccionado, setRubroSeleccionado] = useState(null)
  const [subrubroSeleccionado, setSubrubroSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // Cargar rubros al montar
  useEffect(() => {
    getRubros()
      .then((res) => setRubros(res.data.data ?? res.data))
      .catch(() => setError('No se pudieron cargar los rubros.'))
  }, [])

  // Cargar productos cuando cambian los filtros
  const cargarProductos = useCallback(() => {
    setCargando(true)
    const params = {}
    if (rubroSeleccionado) params.rubro_id = rubroSeleccionado
    if (subrubroSeleccionado) params.subrubro_id = subrubroSeleccionado

    getProductos(params)
      .then((res) => setProductos(res.data.data ?? res.data))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false))
  }, [rubroSeleccionado, subrubroSeleccionado])

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  // Subrubros del rubro activo
  const subrubros = rubroSeleccionado
    ? (rubros.find((r) => r.id === rubroSeleccionado)?.subrubros ?? [])
    : []

  const seleccionarRubro = (id) => {
    setRubroSeleccionado(id)
    setSubrubroSeleccionado(null)
  }

  // CRUD
  const crear = async (formData) => {
    await createProducto(formData)
    cargarProductos()
  }

  const actualizar = async (id, formData) => {
    await updateProducto(id, formData)
    cargarProductos()
  }

  const eliminar = async (id) => {
    await deleteProducto(id)
    cargarProductos()
  }

  const bajarPdf = async () => {
    const res = await descargarPdf()
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'catalogo.pdf'
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    rubros,
    productos,
    subrubros,
    rubroSeleccionado,
    subrubroSeleccionado,
    cargando,
    error,
    seleccionarRubro,
    setSubrubroSeleccionado,
    crear,
    actualizar,
    eliminar,
    bajarPdf,
  }
}
