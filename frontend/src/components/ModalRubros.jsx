import { useState, useEffect } from 'react'
import {
  getRubros,
  createRubro,
  updateRubro,
  deleteRubro,
  createSubrubro,
  updateSubrubro,
  deleteSubrubro,
  getCategorias,
  getSubrubroCategorias,
  linkCategoriaToSubrubro,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  createCategoriaOpcion,
  updateCategoriaOpcion,
  deleteCategoriaOpcion,
} from '../api/index'
import styles from './ModalRubros.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function ModalRubros({ onCerrar, onRubrosChanged }) {
  const [rubros, setRubros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [categoriasPorSubrubro, setCategoriasPorSubrubro] = useState({})
  const [cargandoCategorias, setCargandoCategorias] = useState({})
  const [todasCategorias, setTodasCategorias] = useState([])

  const [nuevoRubro, setNuevoRubro] = useState('')
  const [guardandoRubro, setGuardandoRubro] = useState(false)

  const [editandoRubro, setEditandoRubro] = useState({})
  const [agregandoSub, setAgregandoSub] = useState({})
  const [expandido, setExpandido] = useState({})
  const [editandoSub, setEditandoSub] = useState({})

  const [expandidoCat, setExpandidoCat] = useState({})
  const [agregandoCat, setAgregandoCat] = useState({})
  const [vinculandocat, setVinculandocat] = useState({})
  const [editandoCat, setEditandoCat] = useState({})
  const [agregandoOpcion, setAgregandoOpcion] = useState({})
  const [editandoOpcion, setEditandoOpcion] = useState({})

  useEffect(() => {
    cargar()
    getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (onRubrosChanged) {
      getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
    }
  }, [onRubrosChanged])

  async function cargar() {
    setCargando(true)
    const res = await getRubros()
    const data = res.data.data ?? res.data
    setRubros(data)
    const exp = {}
    data.forEach(r => { exp[r.id] = true })
    setExpandido(exp)
    setCargando(false)
  }

  async function toggleCategoriasSub(subId) {
    if (!categoriasPorSubrubro[subId]) {
      setCargandoCategorias(c => ({ ...c, [subId]: true }))
      try {
        const res = await getSubrubroCategorias(subId)
        setCategoriasPorSubrubro(c => ({ ...c, [subId]: res.data }))
      } catch (e) {
        console.error(e)
      }
      setCargandoCategorias(c => ({ ...c, [subId]: false }))
    }
    setExpandidoCat(e => ({ ...e, [subId]: !e[subId] }))
  }

  async function handleCrearRubro(e) {
    e.preventDefault()
    if (!nuevoRubro.trim()) return
    setGuardandoRubro(true)
    await createRubro(nuevoRubro.trim())
    setNuevoRubro('')
    setGuardandoRubro(false)
    await cargar()
    onRubrosChanged?.()
  }

  async function handleGuardarNombreRubro(rubro) {
    const nombre = editandoRubro[rubro.id]?.trim()
    if (!nombre || nombre === rubro.nombre) { setEditandoRubro(e => { const n = { ...e }; delete n[rubro.id]; return n }); return }
    await updateRubro(rubro.id, nombre)
    setEditandoRubro(e => { const n = { ...e }; delete n[rubro.id]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleEliminarRubro(rubro) {
    if (!window.confirm(`Eliminar el rubro "${rubro.nombre}"? También se eliminarán sus subrubros y productos.`)) return
    await deleteRubro(rubro.id)
    await cargar()
    onRubrosChanged?.()
  }

  async function handleCrearSubrubro(rubroId) {
    const nombre = agregandoSub[rubroId]?.trim()
    if (!nombre) return
    await createSubrubro(rubroId, nombre)
    setAgregandoSub(s => { const n = { ...s }; delete n[rubroId]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleGuardarNombreSub(sub) {
    const nombre = editandoSub[sub.id]?.trim()
    if (!nombre || nombre === sub.nombre) { setEditandoSub(e => { const n = { ...e }; delete n[sub.id]; return n }); return }
    await updateSubrubro(sub.id, nombre)
    setEditandoSub(e => { const n = { ...e }; delete n[sub.id]; return n })
    await cargar()
    onRubrosChanged?.()
  }

  async function handleEliminarSub(sub) {
    if (!window.confirm(`Eliminar el subrubro "${sub.nombre}"?`)) return
    await deleteSubrubro(sub.id)
    await cargar()
    onRubrosChanged?.()
  }

  async function handleCrearCategoria(subId) {
    const nombre = agregandoCat[subId]?.trim()
    if (!nombre) return
    await createCategoria({ nombre, subrubro_id: subId })
    setAgregandoCat(s => { const n = { ...s }; delete n[subId]; return n })
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
    onRubrosChanged?.()
  }

  async function handleGuardarNombreCat(cat, subId) {
    const nombre = editandoCat[cat.id]?.trim()
    if (!nombre || nombre === cat.nombre) { setEditandoCat(e => { const n = { ...e }; delete n[cat.id]; return n }); return }
    await updateCategoria(cat.id, nombre)
    setEditandoCat(e => { const n = { ...e }; delete n[cat.id]; return n })
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    onRubrosChanged?.()
  }

  async function handleEliminarCat(cat, subId) {
    if (!window.confirm(`Eliminar la categoría "${cat.nombre}"?`)) return
    await deleteCategoria(cat.id)
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
    onRubrosChanged?.()
  }

  async function handleCrearOpcion(catId, subId) {
    const nombre = agregandoOpcion[catId]?.trim()
    if (!nombre) return
    await createCategoriaOpcion(catId, nombre)
    setAgregandoOpcion(o => { const n = { ...o }; delete n[catId]; return n })
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    onRubrosChanged?.()
  }

  async function handleGuardarOpcion(op, catId, subId) {
    const nombre = editandoOpcion[op.id]?.trim()
    if (!nombre || nombre === op.nombre) { setEditandoOpcion(e => { const n = { ...e }; delete n[op.id]; return n }); return }
    await updateCategoriaOpcion(op.id, nombre)
    setEditandoOpcion(e => { const n = { ...e }; delete n[op.id]; return n })
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    onRubrosChanged?.()
  }

  async function handleEliminarOpcion(op, subId) {
    if (!window.confirm(`Eliminar la opción "${op.nombre}"?`)) return
    await deleteCategoriaOpcion(op.id)
    setCategoriasPorSubrubro(c => ({ ...c, [subId]: undefined }))
    onRubrosChanged?.()
  }

  return (
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <div style={{
        background: 'var(--bg-white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '640px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'v-modalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>

        <div style={{ height: '4px', background: 'var(--accent)', flexShrink: 0 }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <p className={styles.eyebrow} style={{ marginBottom: '0.15rem' }}>Catálogo</p>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
              Gestionar rubros
            </h2>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--border)',
              borderRadius: '8px',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.1rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem' }}>

          {cargando ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map(i => <div key={i} className={styles.skeleton} style={{ height: '56px', borderRadius: '10px' }} />)}
            </div>
          ) : rubros.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No hay rubros creados todavía.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {rubros.map(rubro => (
                <div key={rubro.id} style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.7rem 0.9rem',
                    background: 'var(--bg)',
                  }}>
                    <button
                      onClick={() => setExpandido(e => ({ ...e, [rubro.id]: !e[rubro.id] }))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '2px', flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: expandido[rubro.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 2l4 4-4 4" />
                      </svg>
                    </button>

                    {editandoRubro[rubro.id] !== undefined ? (
                      <input
                        className={styles.input}
                        style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.875rem', fontWeight: 500 }}
                        value={editandoRubro[rubro.id]}
                        autoFocus
                        onChange={e => setEditandoRubro(ev => ({ ...ev, [rubro.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleGuardarNombreRubro(rubro)
                          if (e.key === 'Escape') setEditandoRubro(ev => { const n = { ...ev }; delete n[rubro.id]; return n })
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {rubro.nombre}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          {rubro.subrubros.length} subrubro{rubro.subrubros.length !== 1 ? 's' : ''}
                        </span>
                      </span>
                    )}

                    {editandoRubro[rubro.id] !== undefined ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className={btnStyles.btnEditSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleGuardarNombreRubro(rubro)}>
                          Guardar
                        </button>
                        <button className={btnStyles.btnOutline} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoRubro(e => { const n = { ...e }; delete n[rubro.id]; return n })}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className={btnStyles.btnEditSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoRubro(e => ({ ...e, [rubro.id]: rubro.nombre }))}>
                          Editar
                        </button>
                        <button className={btnStyles.btnDangerSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleEliminarRubro(rubro)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {expandido[rubro.id] && (
                    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-white)' }}>
                      {rubro.subrubros.map(sub => (
                        <div key={sub.id}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.55rem 0.9rem 0.55rem 2.5rem',
                            borderBottom: '1px solid var(--border)',
                          }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-mid)', flexShrink: 0 }} />

                            {editandoSub[sub.id] !== undefined ? (
                              <input
                                className={styles.input}
                                style={{ flex: 1, padding: '0.3rem 0.55rem', fontSize: '0.825rem' }}
                                value={editandoSub[sub.id]}
                                autoFocus
                                onChange={e => setEditandoSub(ev => ({ ...ev, [sub.id]: e.target.value }))}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleGuardarNombreSub(sub)
                                  if (e.key === 'Escape') setEditandoSub(ev => { const n = { ...ev }; delete n[sub.id]; return n })
                                }}
                              />
                            ) : (
                              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.nombre}</span>
                            )}

                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              {editandoSub[sub.id] !== undefined ? (
                                <>
                                  <button className={btnStyles.btnEditSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                    onClick={() => handleGuardarNombreSub(sub)}>Guardar</button>
                                  <button className={btnStyles.btnOutline} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                    onClick={() => setEditandoSub(e => { const n = { ...e }; delete n[sub.id]; return n })}>Cancelar</button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className={btnStyles.btnEditSoft}
                                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', ...(expandidoCat[sub.id] ? { background: 'var(--accent)', color: 'var(--bg-white)', borderColor: 'var(--accent)' } : {}) }}
                                    onClick={() => toggleCategoriasSub(sub.id)}
                                  >
                                    Categorías
                                  </button>
                                  <button className={btnStyles.btnEditSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                    onClick={() => setEditandoSub(e => ({ ...e, [sub.id]: sub.nombre }))}>Editar</button>
                                  <button className={btnStyles.btnDangerSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                    onClick={() => handleEliminarSub(sub)}>Eliminar</button>
                                </>
                              )}
                            </div>
                          </div>

                          {expandidoCat[sub.id] && (
                            <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                              {(cargandoCategorias[sub.id] || categoriasPorSubrubro[sub.id] === undefined) ? (
                                <div style={{ padding: '0.5rem 0.9rem 0.5rem 4.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Cargando categorías...
                                </div>
                              ) : (
                                <>
                                  {(categoriasPorSubrubro[sub.id] || []).map(cat => (
                                    <div key={cat.id} style={{
                                      padding: '0.45rem 0.9rem 0.45rem 4.5rem',
                                      borderBottom: '1px solid var(--border)',
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
                                        {editandoCat[cat.id] !== undefined ? (
                                          <input
                                            className={styles.input}
                                            style={{ flex: 1, padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                                            value={editandoCat[cat.id]}
                                            autoFocus
                                            onChange={e => setEditandoCat(ev => ({ ...ev, [cat.id]: e.target.value }))}
                                            onKeyDown={e => {
                                              if (e.key === 'Enter') handleGuardarNombreCat(cat, sub.id)
                                              if (e.key === 'Escape') setEditandoCat(ev => { const n = { ...ev }; delete n[cat.id]; return n })
                                            }}
                                          />
                                        ) : (
                                          <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)' }}>{cat.nombre}</span>
                                        )}
                                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                                          {editandoCat[cat.id] !== undefined ? (
                                            <>
                                              <button className={btnStyles.btnEditSoft} style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem' }}
                                                onClick={() => handleGuardarNombreCat(cat, sub.id)}>Guardar</button>
                                              <button className={btnStyles.btnOutline} style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem' }}
                                                onClick={() => setEditandoCat(ev => { const n = { ...ev }; delete n[cat.id]; return n })}>×</button>
                                            </>
                                          ) : (
                                            <>
                                              <button className={btnStyles.btnEditSoft} style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem' }}
                                                onClick={() => setEditandoCat(e => ({ ...e, [cat.id]: cat.nombre }))}>Editar</button>
                                              <button className={btnStyles.btnDangerSoft} style={{ padding: '0.2rem 0.55rem', fontSize: '0.7rem' }}
                                                onClick={() => handleEliminarCat(cat, sub.id)}>×</button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        {cat.opciones?.map(op => (
                                          <div key={op.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                                            {editandoOpcion[op.id] !== undefined ? (
                                              <input
                                                className={styles.input}
                                                style={{ flex: 1, padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                                                value={editandoOpcion[op.id]}
                                                autoFocus
                                                onChange={e => setEditandoOpcion(ev => ({ ...ev, [op.id]: e.target.value }))}
                                                onKeyDown={e => {
                                                  if (e.key === 'Enter') handleGuardarOpcion(op, cat.id, sub.id)
                                                  if (e.key === 'Escape') setEditandoOpcion(ev => { const n = { ...ev }; delete n[op.id]; return n })
                                                }}
                                              />
                                            ) : (
                                              <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{op.nombre}</span>
                                            )}
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                              {editandoOpcion[op.id] !== undefined ? (
                                                <>
                                                  <button className={btnStyles.btnEditSoft} style={{ padding: '0.18rem 0.5rem', fontSize: '0.68rem' }}
                                                    onClick={() => handleGuardarOpcion(op, cat.id, sub.id)}>✓</button>
                                                  <button className={btnStyles.btnOutline} style={{ padding: '0.18rem 0.4rem', fontSize: '0.68rem' }}
                                                    onClick={() => setEditandoOpcion(ev => { const n = { ...ev }; delete n[op.id]; return n })}>×</button>
                                                </>
                                              ) : (
                                                <>
                                                  <button className={btnStyles.btnEditSoft} style={{ padding: '0.18rem 0.5rem', fontSize: '0.68rem' }}
                                                    onClick={() => setEditandoOpcion(e => ({ ...e, [op.id]: op.nombre }))}>Editar</button>
                                                  <button className={btnStyles.btnDangerSoft} style={{ padding: '0.18rem 0.4rem', fontSize: '0.68rem' }}
                                                    onClick={() => handleEliminarOpcion(op, sub.id)}>×</button>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                        <div style={{ padding: '0.2rem 0' }}>
                                          {agregandoOpcion[cat.id] !== undefined ? (
                                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>—</span>
                                              <input
                                                className={styles.input}
                                                style={{ flex: 1, padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                                                placeholder="Nombre de la opción"
                                                value={agregandoOpcion[cat.id]}
                                                autoFocus
                                                onChange={e => setAgregandoOpcion(o => ({ ...o, [cat.id]: e.target.value }))}
                                                onKeyDown={e => {
                                                  if (e.key === 'Enter') handleCrearOpcion(cat.id, sub.id)
                                                  if (e.key === 'Escape') setAgregandoOpcion(o => { const n = { ...o }; delete n[cat.id]; return n })
                                                }}
                                              />
                                              <button className={btnStyles.btnPrimary} style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                                                onClick={() => handleCrearOpcion(cat.id, sub.id)}>Agregar</button>
                                              <button className={btnStyles.btnOutline} style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem' }}
                                                onClick={() => setAgregandoOpcion(o => { const n = { ...o }; delete n[cat.id]; return n })}>×</button>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={() => setAgregandoOpcion(o => ({ ...o, [cat.id]: '' }))}
                                              style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                fontSize: '0.72rem', color: 'var(--text-muted)',
                                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                padding: '0.1rem 0',
                                              }}
                                              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                            >
                                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M4.5 0.5v8M0.5 4.5h8" />
                                              </svg>
                                              agregar opción
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <div style={{ padding: '0.4rem 0.9rem 0.4rem 4.5rem' }}>
                                    {agregandoCat[sub.id] !== undefined || vinculandocat[sub.id] !== undefined ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.35rem' }}>
                                          <button
                                            onClick={() => {
                                              setAgregandoCat(s => ({ ...s, [sub.id]: '' }))
                                              setVinculandocat(v => { const n = { ...v }; delete n[sub.id]; return n })
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', padding: '0.15rem 0.4rem', borderRadius: '4px', color: agregandoCat[sub.id] !== undefined ? 'var(--accent)' : 'var(--text-muted)', fontWeight: agregandoCat[sub.id] !== undefined ? 600 : 400 }}
                                          >
                                            Crear nueva
                                          </button>
                                          <button
                                            onClick={() => {
                                              setVinculandocat(v => ({ ...v, [sub.id]: '' }))
                                              setAgregandoCat(s => { const n = { ...s }; delete n[sub.id]; return n })
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', padding: '0.15rem 0.4rem', borderRadius: '4px', color: vinculandocat[sub.id] !== undefined ? 'var(--accent)' : 'var(--text-muted)', fontWeight: vinculandocat[sub.id] !== undefined ? 600 : 400 }}
                                          >
                                            Vincular existente
                                          </button>
                                        </div>
                                        {agregandoCat[sub.id] !== undefined && (
                                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                              className={styles.input}
                                              style={{ flex: 1, padding: '0.28rem 0.5rem', fontSize: '0.8rem' }}
                                              placeholder="Nombre de la categoría"
                                              value={agregandoCat[sub.id]}
                                              autoFocus
                                              onChange={e => setAgregandoCat(s => ({ ...s, [sub.id]: e.target.value }))}
                                              onKeyDown={e => {
                                                if (e.key === 'Enter') handleCrearCategoria(sub.id)
                                                if (e.key === 'Escape') setAgregandoCat(s => { const n = { ...s }; delete n[sub.id]; return n })
                                              }}
                                            />
                                            <button className={btnStyles.btnPrimary} style={{ padding: '0.28rem 0.7rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                              onClick={() => handleCrearCategoria(sub.id)}>Crear</button>
                                            <button className={btnStyles.btnOutline} style={{ padding: '0.28rem 0.5rem', fontSize: '0.78rem' }}
                                              onClick={() => setAgregandoCat(s => { const n = { ...s }; delete n[sub.id]; return n })}>×</button>
                                          </div>
                                        )}
                                        {vinculandocat[sub.id] !== undefined && (
                                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <select
                                              className={styles.input}
                                              style={{ flex: 1, padding: '0.28rem 0.5rem', fontSize: '0.8rem' }}
                                              value={vinculandocat[sub.id]}
                                              autoFocus
                                              onChange={e => setVinculandocat(v => ({ ...v, [sub.id]: e.target.value }))}
                                              onKeyDown={e => {
                                                if (e.key === 'Escape') setVinculandocat(v => { const n = { ...v }; delete n[sub.id]; return n })
                                              }}
                                            >
                                              <option value="">Seleccionar categoría...</option>
                                              {todasCategorias.map(c => (
                                                <option key={c.id} value={c.id}>{c.nombre}</option>
                                              ))}
                                            </select>
                                            <button
                                              className={btnStyles.btnPrimary}
                                              style={{ padding: '0.28rem 0.7rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                                              disabled={!vinculandocat[sub.id]}
                                              onClick={() => {
                                                linkCategoriaToSubrubro(vinculandocat[sub.id], sub.id)
                                                  .then(() => {
                                                    setVinculandocat(v => { const n = { ...v }; delete n[sub.id]; return n })
                                                    setCategoriasPorSubrubro(c => ({ ...c, [sub.id]: undefined }))
                                                    getCategorias().then(res => setTodasCategorias(res.data)).catch(console.error)
                                                  })
                                                  .catch(console.error)
                                              }}
                                            >Vincular</button>
                                            <button className={btnStyles.btnOutline} style={{ padding: '0.28rem 0.5rem', fontSize: '0.78rem' }}
                                              onClick={() => setVinculandocat(v => { const n = { ...v }; delete n[sub.id]; return n })}>×</button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setAgregandoCat(s => ({ ...s, [sub.id]: '' }))}
                                        style={{
                                          background: 'none', border: '1.5px dashed var(--border-strong)',
                                          borderRadius: '6px', padding: '0.25rem 0.65rem',
                                          fontSize: '0.72rem', color: 'var(--text-muted)',
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                                          transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                                      >
                                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                          <path d="M4.5 0.5v8M0.5 4.5h8" />
                                        </svg>
                                        agregar categoría
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}

                      <div style={{ padding: '0.6rem 0.9rem 0.6rem 2.5rem' }}>
                        {agregandoSub[rubro.id] !== undefined ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              className={styles.input}
                              style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.825rem' }}
                              placeholder="Nombre del subrubro"
                              value={agregandoSub[rubro.id]}
                              autoFocus
                              onChange={e => setAgregandoSub(s => ({ ...s, [rubro.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleCrearSubrubro(rubro.id)
                                if (e.key === 'Escape') setAgregandoSub(s => { const n = { ...s }; delete n[rubro.id]; return n })
                              }}
                            />
                            <button className={btnStyles.btnPrimary} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                              onClick={() => handleCrearSubrubro(rubro.id)}>
                              Agregar
                            </button>
                            <button className={btnStyles.btnOutline} style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                              onClick={() => setAgregandoSub(s => { const n = { ...s }; delete n[rubro.id]; return n })}>
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAgregandoSub(s => ({ ...s, [rubro.id]: '' }))}
                            style={{
                              background: 'none', border: '1.5px dashed var(--border-strong)',
                              borderRadius: '6px', padding: '0.3rem 0.75rem',
                              fontSize: '0.75rem', color: 'var(--text-muted)',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M5.5 1v9M1 5.5h9" />
                            </svg>
                            Agregar subrubro
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          borderTop: '1.5px solid var(--border)',
          padding: '1rem 1.25rem',
          background: 'var(--bg)',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Crear nuevo rubro
          </p>
          <form onSubmit={handleCrearRubro} style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              className={styles.input}
              placeholder="Nombre del rubro"
              value={nuevoRubro}
              onChange={e => setNuevoRubro(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className={btnStyles.btnPrimary}
              disabled={guardandoRubro || !nuevoRubro.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {guardandoRubro ? 'Creando...' : '+ Crear rubro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}