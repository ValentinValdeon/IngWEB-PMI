import { useState, useEffect } from 'react'
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  createCategoriaOpcion,
  updateCategoriaOpcion,
  deleteCategoriaOpcion,
} from '../api/index'
import styles from './ModalRubros.module.css'
import btnStyles from '../shared/buttons.module.css'

export default function ModalCategorias({ onCerrar, onCategoriasChanged }) {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  const [nuevaCat, setNuevaCat] = useState('')
  const [guardando, setGuardando] = useState(false)

  const [editandoCat, setEditandoCat] = useState({})
  const [agregandoOpcion, setAgregandoOpcion] = useState({})
  const [editandoOpcion, setEditandoOpcion] = useState({})
  const [expandido, setExpandido] = useState({})

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setCargando(true)
    try {
      const res = await getCategorias()
      setCategorias(res.data.data ?? res.data)
    } catch (e) {
      console.error('Error cargando categorías:', e)
      alert('Error al cargar categorías. ¿El backend está corriendo?')
    }
    setCargando(false)
  }

  async function handleCrear(e) {
    e.preventDefault()
    if (!nuevaCat.trim()) return
    setGuardando(true)
    try {
      await createCategoria({ nombre: nuevaCat.trim() })
      setNuevaCat('')
      await cargar()
      onCategoriasChanged?.()
    } catch (err) {
      console.error('Error creando categoría:', err)
      alert('Error al crear categoría. Revisa la consola.')
    }
    setGuardando(false)
  }

  async function handleGuardarNombreCat(cat) {
    const nombre = editandoCat[cat.id]?.trim()
    if (!nombre || nombre === cat.nombre) { setEditandoCat(e => { const n = { ...e }; delete n[cat.id]; return n }); return }
    await updateCategoria(cat.id, nombre)
    setEditandoCat(e => { const n = { ...e }; delete n[cat.id]; return n })
    await cargar()
    onCategoriasChanged?.()
  }

  async function handleEliminarCat(cat) {
    if (!window.confirm(`Eliminar la categoría "${cat.nombre}"?`)) return
    await deleteCategoria(cat.id)
    await cargar()
    onCategoriasChanged?.()
  }

  async function handleCrearOpcion(catId) {
    const nombre = agregandoOpcion[catId]?.trim()
    if (!nombre) return
    await createCategoriaOpcion(catId, nombre)
    setAgregandoOpcion(o => { const n = { ...o }; delete n[catId]; return n })
    await cargar()
    onCategoriasChanged?.()
  }

  async function handleGuardarOpcion(op, catId) {
    const nombre = editandoOpcion[op.id]?.trim()
    if (!nombre || nombre === op.nombre) { setEditandoOpcion(e => { const n = { ...e }; delete n[op.id]; return n }); return }
    await updateCategoriaOpcion(op.id, nombre)
    setEditandoOpcion(e => { const n = { ...e }; delete n[op.id]; return n })
    await cargar()
    onCategoriasChanged?.()
  }

  async function handleEliminarOpcion(op) {
    if (!window.confirm(`Eliminar la opción "${op.nombre}"?`)) return
    await deleteCategoriaOpcion(op.id)
    await cargar()
    onCategoriasChanged?.()
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
              Gestionar categorías
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
          ) : categorias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No hay categorías creadas todavía.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {categorias.map(cat => (
                <div key={cat.id} style={{
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
                      onClick={() => setExpandido(e => ({ ...e, [cat.id]: !e[cat.id] }))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: '2px', flexShrink: 0,
                        transition: 'transform 0.2s',
                        transform: expandido[cat.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 2l4 4-4 4" />
                      </svg>
                    </button>

                    {editandoCat[cat.id] !== undefined ? (
                      <input
                        className={styles.input}
                        style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.875rem', fontWeight: 500 }}
                        value={editandoCat[cat.id]}
                        autoFocus
                        onChange={e => setEditandoCat(ev => ({ ...ev, [cat.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleGuardarNombreCat(cat)
                          if (e.key === 'Escape') setEditandoCat(ev => { const n = { ...ev }; delete n[cat.id]; return n })
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {cat.nombre}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          {cat.opciones?.length || 0} opció{cat.opciones?.length !== 1 ? 'nes' : 'n'}
                        </span>
                      </span>
                    )}

                    {editandoCat[cat.id] !== undefined ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className={btnStyles.btnEditSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleGuardarNombreCat(cat)}>
                          Guardar
                        </button>
                        <button className={btnStyles.btnOutline} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoCat(e => { const n = { ...e }; delete n[cat.id]; return n })}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className={btnStyles.btnEditSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => setEditandoCat(e => ({ ...e, [cat.id]: cat.nombre }))}>
                          Editar
                        </button>
                        <button className={btnStyles.btnDangerSoft} style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                          onClick={() => handleEliminarCat(cat)}>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  {expandido[cat.id] && (
                    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-white)' }}>
                      {(cat.opciones || []).map(op => (
                        <div key={op.id} style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem',
                          padding: '0.45rem 0.9rem 0.45rem 2.5rem',
                          borderBottom: '1px solid var(--border)',
                        }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
                          {editandoOpcion[op.id] !== undefined ? (
                            <input
                              className={styles.input}
                              style={{ flex: 1, padding: '0.3rem 0.55rem', fontSize: '0.825rem' }}
                              value={editandoOpcion[op.id]}
                              autoFocus
                              onChange={e => setEditandoOpcion(ev => ({ ...ev, [op.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleGuardarOpcion(op, cat.id)
                                if (e.key === 'Escape') setEditandoOpcion(ev => { const n = { ...ev }; delete n[op.id]; return n })
                              }}
                            />
                          ) : (
                            <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{op.nombre}</span>
                          )}
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            {editandoOpcion[op.id] !== undefined ? (
                              <>
                                <button className={btnStyles.btnEditSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                  onClick={() => handleGuardarOpcion(op, cat.id)}>Guardar</button>
                                <button className={btnStyles.btnOutline} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                  onClick={() => setEditandoOpcion(e => { const n = { ...e }; delete n[op.id]; return n })}>Cancelar</button>
                              </>
                            ) : (
                              <>
                                <button className={btnStyles.btnEditSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                  onClick={() => setEditandoOpcion(e => ({ ...e, [op.id]: op.nombre }))}>Editar</button>
                                <button className={btnStyles.btnDangerSoft} style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                                  onClick={() => handleEliminarOpcion(op)}>Eliminar</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}

                      <div style={{ padding: '0.5rem 0.9rem 0.5rem 2.5rem' }}>
                        {agregandoOpcion[cat.id] !== undefined ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              className={styles.input}
                              style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.825rem' }}
                              placeholder="Nombre de la opción"
                              value={agregandoOpcion[cat.id]}
                              autoFocus
                              onChange={e => setAgregandoOpcion(s => ({ ...s, [cat.id]: e.target.value }))}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleCrearOpcion(cat.id)
                                if (e.key === 'Escape') setAgregandoOpcion(s => { const n = { ...s }; delete n[cat.id]; return n })
                              }}
                            />
                            <button className={btnStyles.btnPrimary} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                              onClick={() => handleCrearOpcion(cat.id)}>
                              Agregar
                            </button>
                            <button className={btnStyles.btnOutline} style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                              onClick={() => setAgregandoOpcion(s => { const n = { ...s }; delete n[cat.id]; return n })}>
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAgregandoOpcion(s => ({ ...s, [cat.id]: '' }))}
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
                            Agregar opción
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
            Crear nueva categoría
          </p>
          <form onSubmit={handleCrear} style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              className={styles.input}
              placeholder="Nombre de la categoría"
              value={nuevaCat}
              onChange={e => setNuevaCat(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className={btnStyles.btnPrimary}
              disabled={guardando || !nuevaCat.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {guardando ? 'Creando...' : '+ Crear categoría'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}