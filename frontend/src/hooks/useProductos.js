// ─────────────────────────────────────────────────────────────────────────────
// useProductos — Custom Hook
//
// ¿Qué es un custom hook?
//   Es una función que empieza con "use" y adentro puede llamar a otros hooks
//   de React (useState, useEffect, etc.). Sirve para separar la LÓGICA del
//   componente visual. En lugar de tener todo el manejo de estado y llamadas
//   a la API dentro de <Admin /> o <Catalogo />, lo centralizamos acá.
//   Los componentes solo se encargan de renderizar; este hook se encarga de
//   los datos.
// ─────────────────────────────────────────────────────────────────────────────

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
  // ── Estado ──────────────────────────────────────────────────────────────
  // Todos los estados que necesita la app de catálogo viven acá.
  // Los componentes reciben estos valores como props (o via este hook).

  const [rubros, setRubros] = useState([])
  const [productos, setProductos] = useState([])
  const [rubroSeleccionado, setRubroSeleccionado] = useState(null)
  const [subrubroSeleccionado, setSubrubroSeleccionado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // ── useCallback ──────────────────────────────────────────────────────────
  // useCallback(fn, [deps]) devuelve la MISMA referencia de función entre
  // renders, siempre que las dependencias no cambien.
  //
  // ¿Por qué importa la referencia? Porque si pasás una función como
  // dependencia de un useEffect (abajo), React la compara por referencia.
  // Sin useCallback, cada render crearía una función nueva → el useEffect
  // se ejecutaría infinitamente.
  //
  // Regla práctica: usá useCallback cuando una función va a ser dependencia
  // de un useEffect o se pasa como prop a un componente memorizado (React.memo).
  // En funciones que solo se llaman desde eventos (onClick, etc.) no hace falta.

  const recargarRubros = useCallback(() => {
    getRubros()
      // res.data es la respuesta de Axios. Laravel puede devolver dos formatos:
      //   • res.data       → array directo: [{ id, nombre, subrubros }, ...]
      //   • res.data.data  → array dentro de un objeto paginado: { data: [...], total, ... }
      // El operador ?? (nullish coalescing) elige el primero que NO sea null/undefined.
      // Si res.data.data existe (respuesta paginada) lo usa; si no, usa res.data directamente.
      .then((res) => setRubros(res.data.data ?? res.data))
      .catch(() => setError('No se pudieron cargar los rubros.'))
  }, []) // [] → sin dependencias: esta función nunca cambia de referencia

  // Cargar rubros al montar el componente que use este hook
  useEffect(() => {
    recargarRubros()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Nota: React podría advertir que falta recargarRubros en las deps.
  // Es seguro ignorarlo acá porque recargarRubros está envuelto en useCallback
  // con deps vacías, por lo que su referencia nunca cambia.

  // ── Cargar productos ─────────────────────────────────────────────────────
  // Esta función depende de los filtros activos. Cuando rubroSeleccionado o
  // subrubroSeleccionado cambian, useCallback genera una nueva referencia →
  // el useEffect de abajo detecta el cambio y vuelve a ejecutarse → se
  // cargan los productos filtrados. Así se implementa "filtrar = recargar".

  const cargarProductos = useCallback(() => {
    setCargando(true)

    // Construimos los query params solo con los filtros que tienen valor.
    // Axios los serializa automáticamente: GET /api/productos?rubro_id=2
    const params = {}
    if (rubroSeleccionado) params.rubro_id = rubroSeleccionado
    if (subrubroSeleccionado) params.subrubro_id = subrubroSeleccionado

    getProductos(params)
      .then((res) => setProductos(res.data.data ?? res.data)) // mismo patrón que rubros
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false))
  }, [rubroSeleccionado, subrubroSeleccionado])
  // ↑ deps: si cambia cualquiera de los dos filtros, se crea nueva función

  // Este effect se ejecuta cada vez que cargarProductos cambia de referencia,
  // es decir, cada vez que cambia un filtro. Es el "trigger" del filtrado.
  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  // ── Subrubros del rubro activo ───────────────────────────────────────────
  // Derivamos los subrubros a partir del estado: buscamos el rubro seleccionado
  // en la lista ya cargada y extraemos su array de subrubros.
  // Optional chaining (?.) evita error si find() devuelve undefined.
  // ?? [] garantiza un array vacío si no hay subrubros.
  const subrubros = rubroSeleccionado
    ? (rubros.find((r) => r.id === rubroSeleccionado)?.subrubros ?? [])
    : []

  // Al seleccionar un rubro nuevo, reseteamos el subrubro para no quedar
  // con un filtro de subrubro que no pertenece al rubro nuevo.
  const seleccionarRubro = (id) => {
    setRubroSeleccionado(id)
    setSubrubroSeleccionado(null)
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────
  // Cada operación llama a la API y luego recarga los productos para que la
  // UI quede sincronizada con lo que hay en la base de datos.
  // Son async/await para que quien las llame pueda esperar el resultado
  // (por ejemplo, cerrar un modal solo cuando el guardado terminó).

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

  // ── Descargar PDF ────────────────────────────────────────────────────────
  // responseType: 'blob' en la llamada Axios (ver api/index.js) le dice al
  // navegador que la respuesta es binaria, no texto.
  // URL.createObjectURL crea una URL temporal en memoria para ese blob.
  // Simulamos un click en un <a> invisible para disparar la descarga.
  // Después revocamos la URL para liberar memoria.
  const bajarPdf = async () => {
    const res = await descargarPdf()
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'catalogo.pdf'
    link.click()
    URL.revokeObjectURL(url)
  }

  // ── Return ───────────────────────────────────────────────────────────────
  // El hook devuelve un objeto con todo lo que los componentes necesitan:
  // estado (datos + flags) y funciones (acciones). Los componentes desestructuran
  // solo lo que les hace falta: const { productos, cargando } = useProductos()

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
    recargarRubros,
  }
}
